import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import BackgroundBeams from '../ui/BackgroundBeams';

const Hero = ({ searchQuery, setSearchQuery, categories, activeFilter, setActiveFilter }) => {
  return (
    <section className="relative pt-24 pb-2 flex flex-col items-center justify-center overflow-hidden">
      <BackgroundBeams />
      <div className="max-w-4xl mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
        </motion.div>

        {/* Search Bar - Center Focused */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative w-full max-w-2xl mx-auto mb-6"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white rounded-[3rem] p-2 shadow-2xl border border-slate-100">
              <div className="flex-1 flex items-center pl-6">
                <MapPin className="text-emerald-600 w-6 h-6 mr-4" />
                <input
                  type="text"
                  placeholder="Search by location, neighborhood, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-4 text-base font-bold text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
              <button className="bg-slate-900 text-white p-5 rounded-full hover:bg-emerald-600 transition-all shadow-xl active:scale-95 group-hover:scale-105">
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border-2 ${activeFilter === cat
                ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
                : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200 hover:text-emerald-600"
                }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
