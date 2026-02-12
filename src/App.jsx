import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Home,
  ArrowRight,
  CheckCircle2,
  Instagram,
  Facebook,
  Twitter,
  Menu,
  X,
  Star,
  BedDouble,
  Bath,
  Maximize,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Premium Components (Manual Implementation) ---

const BackgroundBeams = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute h-[500px] w-[1px] bg-gradient-to-b from-transparent via-emerald-500 to-transparent animate-beam"
        style={{ left: `${20 * i}%`, animationDelay: `${i * 1.5}s` }}
      />
    ))}
  </div>
);

const Spotlight = () => (
  <div className="absolute -top-[30%] -left-[10%] w-[1000px] h-[1000px] bg-emerald-500/10 blur-[150px] animate-spotlight opacity-0 rounded-full pointer-events-none" />
);

const BentoCard = ({ title, description, icon: Icon, className = "" }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group ${className}`}
  >
    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
      <Icon className="w-6 h-6" />
    </div>
    <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
    <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
  </motion.div>
);

const PropertyCard = ({ prop, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: idx * 0.1 }}
    className="group"
  >
    <div className="relative rounded-[2rem] overflow-hidden mb-6 aspect-[4/5] shadow-lg group-hover:shadow-2xl transition-all duration-500">
      <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-3 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
            {prop.tag}
          </div>
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 pointer-events-auto hover:bg-white hover:text-emerald-600 transition-all">
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl">
          <p className="text-2xl font-black text-white mb-1">{prop.price}</p>
          <div className="flex items-center gap-1.5 text-white/80">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs font-bold truncate">{prop.location}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="px-2">
      <h3 className="text-xl font-bold text-slate-900 mb-4 truncate group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{prop.title}</h3>
      <div className="flex items-center gap-6 border-t border-slate-100 pt-5">
        <div className="flex items-center gap-2 group/icon">
          <BedDouble className="w-4 h-4 text-emerald-600 group-hover/icon:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-600">{prop.beds} Beds</span>
        </div>
        <div className="flex items-center gap-2 group/icon">
          <Bath className="w-4 h-4 text-emerald-600 group-hover/icon:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-600">{prop.baths} Baths</span>
        </div>
        <div className="flex items-center gap-2 group/icon">
          <Maximize className="w-4 h-4 text-emerald-600 group-hover/icon:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-600">{prop.sqft} ft²</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Main App ---

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const properties = useMemo(() => [
    {
      id: 1,
      title: "The Emerald Sky Villa",
      location: "Lusaka, Leopard's Hill",
      price: "$850,000",
      beds: 5,
      baths: 4,
      sqft: "4,200",
      tag: "Premium",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Crystal Vista Manor",
      location: "Copperbelt, Ndola",
      price: "$520,000",
      beds: 4,
      baths: 3,
      sqft: "3,100",
      tag: "Trending",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "Modern Sanctuary Estate",
      location: "Lusaka, Rhodespark",
      price: "$450,000",
      beds: 3,
      baths: 3,
      sqft: "2,500",
      tag: "New Arrival",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=800"
    }
  ], []);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900 font-sans antialiased text-slate-900">
      <Spotlight />

      {/* Navigation */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 transition-all duration-500 rounded-full border border-white/20 px-8 py-4 ${scrolled ? 'bg-white/70 backdrop-blur-2xl shadow-2xl shadow-emerald-900/10' : 'bg-white/10 backdrop-blur-md'
        }`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3">
              <Home className="text-white w-5 h-5 -rotate-3" />
            </div>
            <span className="text-xl font-black tracking-tighter">
              KWATHU<span className="text-emerald-600">HOMES</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Home', 'Estates', 'Concierge', 'About'].map((item) => (
              <a key={item} href="#" className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-xs font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition-colors">Sign In</button>
            <button className="bg-emerald-600 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/30 active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-48 pb-20 flex items-center overflow-hidden">
        <BackgroundBeams />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 items-center gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <div className="inline-flex items-center gap-2 py-2 px-4 bg-emerald-100/50 backdrop-blur-lg border border-emerald-200 rounded-full text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-10">
              <Zap className="w-3 h-3 fill-emerald-500 animate-pulse" />
              Revolutionizing Real Estate in Zambia
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] mb-10 tracking-tighter">
              YOUR FUTURE <span className="text-emerald-600">HOME</span> <br />
              STARTS <span className="underline decoration-emerald-500/30 underline-offset-8 italic">HERE.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-xl font-medium">
              We provide the most exclusive listings across Lusaka and the Copperbelt. High-performance houses for high-performance people.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-[400px]">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Where do you want to live?"
                  className="w-full bg-white border-2 border-slate-100 px-16 py-6 rounded-full text-sm font-bold shadow-2xl shadow-slate-200/50 focus:border-emerald-500 transition-all outline-none"
                />
              </div>
              <button className="w-full sm:w-auto bg-slate-900 text-white p-6 rounded-full hover:scale-110 transition-all shadow-2xl active:scale-95">
                <Search className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="relative"
          >
            <div className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[12px] border-white ring-1 ring-slate-100">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000" alt="Hero" className="w-full h-[650px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 to-transparent"></div>

              <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                <div className="p-6 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl">
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Current Value</p>
                  <p className="text-white text-3xl font-black">$1.2M+</p>
                </div>
                <div className="flex -space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-xl">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Features Grid */}
      <section className="py-48 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 p-12 bg-emerald-600 rounded-[3rem] text-white overflow-hidden relative group">
              <TrendingUp className="absolute -right-20 -bottom-20 w-80 h-80 opacity-10 group-hover:scale-125 transition-transform duration-1000" />
              <h2 className="text-5xl font-black leading-none mb-8 tracking-tighter uppercase italic">200% Annual <br /> Growth Rate</h2>
              <p className="text-emerald-100 text-lg font-medium leading-relaxed mb-10">
                The Zambian real estate market is booming. We ensure your investment grows while you live in luxury.
              </p>
              <button className="bg-white text-emerald-600 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
                Learn More
              </button>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-10">
              <BentoCard
                icon={ShieldCheck}
                title="SECURE ASSETS"
                description="Every property is verified by our legal experts to ensure 100% peace of mind."
              />
              <BentoCard
                icon={Zap}
                title="FAST CLOSING"
                description="We've optimized the Zambian purchase process to get you into your home faster."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-48 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24">
            <div>
              <div className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">The Collection</div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">FEATURED <br /> ESTATES</h2>
            </div>
            <div className="flex gap-4 mt-10 md:mt-0">
              <button className="w-16 h-16 rounded-full border-2 border-slate-200 flex items-center justify-center hover:bg-white hover:border-white hover:shadow-xl transition-all">
                <ArrowRight className="rotate-180" />
              </button>
              <button className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:scale-110 shadow-xl shadow-emerald-500/20 transition-all">
                <ArrowRight />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {properties.map((prop, idx) => (
              <PropertyCard key={prop.id} prop={prop} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20">
          <div className="col-span-2">
            <h3 className="text-4xl font-black mb-10 tracking-tighter">KWATHU<span className="text-emerald-600">HOMES</span></h3>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-md mb-12">
              Building the future of Zambian living. Join our exclusive community of elite home owners.
            </p>
            <div className="flex gap-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <div key={i} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer group">
                  <Icon className="w-6 h-6 text-slate-400 group-hover:text-white" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-10 text-emerald-500">Navigation</h4>
            <ul className="space-y-6 text-slate-400 font-bold">
              <li><a href="#" className="hover:text-white transition-colors">ESTATES</a></li>
              <li><a href="#" className="hover:text-white transition-colors">INVESTORS</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CAREERS</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CONTACT</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-10 text-emerald-500">Newsletter</h4>
            <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10">
              <input type="email" placeholder="ENTER YOUR EMAIL" className="w-full bg-transparent p-4 text-xs font-black uppercase tracking-widest outline-none" />
              <button className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-4">JOIN NOW</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest flex flex-col md:flex-row justify-between gap-6">
          <p>© 2026 KWATHUHOMES - ALL RIGHTS RESERVED - ZAMBIA OFFICE</p>
          <div className="flex gap-10">
            <p className="hover:text-white cursor-pointer transition-colors">PRIVACY POLICY</p>
            <p className="hover:text-white cursor-pointer transition-colors">TERMS OF SERVICE</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;