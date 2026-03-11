/*
Purpose
- Orchestrates the entire frontend flow: home, auth, dashboards, and detail pages.
- Fetches properties, handles filtering/search, and manages navigation state.

How It Works
- Loads properties from the backend with simple retry/timeout handling.
- Persists buyer’s saved properties in localStorage keyed by user identity.
- Switches views (home, auth, buyer/seller dashboards, about, contact, admin).
- Passes handlers into components for saving, viewing, and contacting owners.

Where It Fits
- Root application component rendered from main.jsx.
*/
import React, { useState, useEffect, useMemo } from 'react';
import {
  Home,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// UI Components
import Spotlight from './components/ui/Spotlight';
import PropertyCardSkeleton from './components/ui/PropertyCardSkeleton';

// Feature Components
import Hero from './components/features/Hero';
import PropertyCard from './components/features/PropertyCard';
import PropertyDetail from './components/features/PropertyDetail';
import SellerDashboard from './components/features/SellerDashboard';
import BuyerDashboard from './components/features/BuyerDashboard';
import Auth from './components/features/Auth';
import About from './components/features/About';
import Contact from './components/features/Contact';
import AdminDashboard from './components/features/AdminDashboard';
import { useAuth } from './context/AuthContext';
import { withBuyerPhone } from './utils/engagement';
import { apiUrl } from './utils/api';

const getBuyerStorageKey = (user) => {
  if (!user) return null;
  if (user._id) return `savedProperties:${user._id}`;
  if (user.id) return `savedProperties:${user.id}`;
  if (user.email) return `savedProperties:${String(user.email).toLowerCase()}`;
  return null;
};

const App = () => {
  const { user, logout: authLogout } = useAuth();
  const enrichedUser = useMemo(() => withBuyerPhone(user), [user]);
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [view, setView] = useState('home'); // 'home', 'auth', 'dashboard'
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);

  useEffect(() => {
    let mounted = true;
    let controller = null;
    let timeoutId = null;

    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      const attempts = [
        apiUrl('/properties'),
        '/api/properties',
        apiUrl('/properties'),
      ];
      for (let i = 0; i < attempts.length; i++) {
        try {
          controller = new AbortController();
          timeoutId = setTimeout(() => controller.abort('timeout'), 12000);
          const response = await fetch(attempts[i], { signal: controller.signal });
          clearTimeout(timeoutId);
          timeoutId = null;
          if (!mounted) return;
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          if (!mounted) return;
          if (Array.isArray(data)) {
            setProperties(data);
            setError(null);
            break;
          } else {
            setProperties([]);
            setError('Received invalid data format from server.');
            break;
          }
        } catch (err) {
          if (!mounted) return;
          if (err.name === 'AbortError' && err.reason === 'timeout') {
            if (i === attempts.length - 1) {
              setError('Request timed out. Please ensure the server is running and try again.');
            } else {
              await new Promise(r => setTimeout(r, 800 * (i + 1)));
            }
          } else {
            if (i === attempts.length - 1) {
              setError(err.message || 'Could not connect to the server.');
            } else {
              await new Promise(r => setTimeout(r, 800 * (i + 1)));
            }
          }
        } finally {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          if (controller) controller.abort();
        }
      }
      if (mounted) setLoading(false);
    };

    fetchProperties();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (controller) controller.abort();
    };
  }, []);

  // Load saved properties for the logged-in buyer from localStorage
  useEffect(() => {
    if (!enrichedUser || enrichedUser.role !== 'Buyer') {
      setSavedProperties([]);
      return;
    }
    const key = getBuyerStorageKey(enrichedUser);
    if (!key || typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        setSavedProperties([]);
        return;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setSavedProperties(parsed);
      } else {
        setSavedProperties([]);
      }
    } catch {
      setSavedProperties([]);
    }
  }, [enrichedUser]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Properties are now fetched from the backend API

  const filteredProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];

    return properties.filter(p => {
      const matchesFilter = activeFilter === 'All' || p.type === activeFilter;
      const matchesSearch = p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery, properties]);

  // ── Auth Handling ──────────────────────────────────────────────────────────
  const handleAuthSuccess = (userData) => {
    if (userData.role === 'Seller') {
      setView('dashboard');
    } else {
      setView('buyer-dashboard');
    }
  };

  const handleGetStarted = () => {
    if (enrichedUser) {
      handleAuthSuccess(enrichedUser);
    } else {
      setView('auth');
    }
  };

  const handleSaveProperty = (prop) => {
    if (!enrichedUser) {
      setView('auth');
      return;
    }

    if (enrichedUser.role === 'Buyer' && prop) {
      const key = getBuyerStorageKey(enrichedUser);
      setSavedProperties((prev) => {
        if (prev.some((p) => p._id === prop._id)) {
          return prev;
        }
        const next = [...prev, prop];
        if (key && typeof window !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(next));
        }
        return next;
      });
      setView('buyer-dashboard');
    }
  };

  const handleRemoveSavedProperty = (propertyId) => {
    if (!enrichedUser || enrichedUser.role !== 'Buyer') return;
    const key = getBuyerStorageKey(enrichedUser);
    setSavedProperties((prev) => {
      const next = prev.filter((p) => p?._id !== propertyId);
      if (key && typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(next));
      }
      return next;
    });
  };

  // ── View Redirection ───────────────────────────────────────────────────────
  const handleLogout = () => {
    setSavedProperties([]);
    authLogout();
  };

  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  if (isAdminRoute) {
    return (
      <AnimatePresence mode="wait">
        <AdminDashboard onExit={() => { window.location.href = '/'; }} />
      </AnimatePresence>
    );
  }

  if (view === 'auth') {
    return <Auth onBack={() => setView('home')} onAuthSuccess={handleAuthSuccess} />;
  }

  // ── Detail page ────────────────────────────────────────────────────────────
  if (selectedProperty) {
    return (
      <AnimatePresence mode="wait">
        <PropertyDetail
          key={selectedProperty._id}
          property={selectedProperty}
          properties={properties}
          user={enrichedUser}
          onRequireAuth={() => setView('auth')}
          onBack={() => setSelectedProperty(null)}
          onSelectProperty={(p) => setSelectedProperty(p)}
          onSave={() => handleSaveProperty(selectedProperty)}
        />
      </AnimatePresence>
    );
  }

  if (view === 'dashboard' || (enrichedUser && enrichedUser.role === 'Seller' && view === 'dashboard')) {
    return (
      <AnimatePresence mode="wait">
        <SellerDashboard
          onLogout={handleLogout}
          onViewListing={(property) => setSelectedProperty(property)}
        />
      </AnimatePresence>
    );
  }

  if (view === 'buyer-dashboard' || (enrichedUser && enrichedUser.role === 'Buyer' && view === 'buyer-dashboard')) {
    return (
      <AnimatePresence mode="wait">
        <BuyerDashboard
          user={enrichedUser}
          onLogout={handleLogout}
          savedProperties={savedProperties}
          onViewSavedProperty={(property) => setSelectedProperty(property)}
          onRemoveSavedProperty={(propertyId) => handleRemoveSavedProperty(propertyId)}
          onBackToBrowse={() => setView('home')}
        />
      </AnimatePresence>
    );
  }

  if (view === 'about') {
    return (
      <AnimatePresence mode="wait">
        <About onBack={() => setView('home')} />
      </AnimatePresence>
    );
  }

  if (view === 'contact') {
    return (
      <AnimatePresence mode="wait">
        <Contact onBack={() => setView('home')} />
      </AnimatePresence>
    );
  }

  // ── Home / listing page ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans antialiased text-slate-900 dark:text-slate-100">
      <Spotlight />

      <Navbar
        scrolled={scrolled}
        onGetStarted={handleGetStarted}
        onAbout={() => setView('about')}
        onContact={() => setView('contact')}
      />

      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={["All", "House", "Flats", "Apartment", "Shared House"]}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* Featured Properties */}
      <section className="py-10 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                <div>
                  <div className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">The Collection</div>
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">&nbsp;</h2>
                </div>
              </div>
              <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[...Array(6)].map((_, idx) => (
                  <PropertyCardSkeleton key={idx} idx={idx} />
                ))}
              </motion.div>
            </>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Uh oh! Something went wrong</h3>
              <p className="text-slate-500 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-emerald-600 transition-all uppercase tracking-widest text-xs"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                <div>
                  <div className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                    {activeFilter === 'All' ? 'The Collection' : `${activeFilter} Collection`}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">
                    {searchQuery ? 'Search Results' : ''}
                  </h2>
                </div>
                {filteredProperties.length > 0 && (
                  <div className="hidden md:flex gap-4 mt-10 md:mt-0">
                    <button className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center hover:bg-white hover:border-white hover:shadow-xl transition-all">
                      <ArrowRight className="rotate-180 w-5 h-5" />
                    </button>
                    <button className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:scale-110 shadow-xl shadow-emerald-500/20 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <motion.div
                layout
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-12"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProperties.map((prop, idx) => (
                    <PropertyCard
                      key={prop._id}
                      prop={prop}
                      idx={idx}
                      onClick={() => setSelectedProperty(prop)}
                      onSave={() => handleSaveProperty(prop)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredProperties.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center"
                >
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Home className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">No properties found</h3>
                  <p className="text-slate-500 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                  <button
                    onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
                    className="mt-8 text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default App;
