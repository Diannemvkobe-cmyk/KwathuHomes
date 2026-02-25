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

// Feature Components
import Hero from './components/features/Hero';
import PropertyCard from './components/features/PropertyCard';
import PropertyDetail from './components/features/PropertyDetail';
import SellerDashboard from './components/features/SellerDashboard';
import BuyerDashboard from './components/features/BuyerDashboard';
import Auth from './components/features/Auth';
import About from './components/features/About';
import Contact from './components/features/Contact';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [view, setView] = useState('home'); // 'home', 'auth', 'dashboard'
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Properties are now fetched from the backend API

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesFilter = activeFilter === 'All' || p.type === activeFilter;
      const matchesSearch = p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase());
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
    if (user) {
      handleAuthSuccess(user);
    } else {
      setView('auth');
    }
  };

  const handleSaveProperty = (prop) => {
    if (!user) {
      setView('auth');
    } else if (user.role === 'Buyer') {
      setView('buyer-dashboard');
    }
  };

  // ── View Redirection ───────────────────────────────────────────────────────
  if (view === 'auth') {
    return <Auth onBack={() => setView('home')} onAuthSuccess={handleAuthSuccess} />;
  }

  if (view === 'dashboard' || (user && user.role === 'Seller' && view === 'dashboard')) {
    return (
      <AnimatePresence mode="wait">
        <SellerDashboard
          onLogout={logout}
          onViewListing={(property) => setSelectedProperty(property)}
        />
      </AnimatePresence>
    );
  }

  if (view === 'buyer-dashboard' || (user && user.role === 'Buyer' && view === 'buyer-dashboard')) {
    return (
      <AnimatePresence mode="wait">
        <BuyerDashboard user={user} onLogout={logout} />
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

  // ── Detail page ────────────────────────────────────────────────────────────
  if (selectedProperty) {
    return (
      <AnimatePresence mode="wait">
        <PropertyDetail
          key={selectedProperty._id}
          property={selectedProperty}
          properties={properties}
          onBack={() => setSelectedProperty(null)}
          onSelectProperty={(p) => setSelectedProperty(p)}
          onSave={() => handleSaveProperty(selectedProperty)}
        />
      </AnimatePresence>
    );
  }

  // ── Home / listing page ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900 font-sans antialiased text-slate-900">
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
      <section className="py-10 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <p className="text-sm font-black uppercase tracking-widest text-slate-400">Curating the collection...</p>
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
