import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Maximize, ArrowUpRight, Heart } from 'lucide-react';

const PropertyCard = ({ prop, idx, onClick, onSave }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: idx * 0.1 }}
    className="group cursor-pointer"
    onClick={onClick}
  >
    <div className="relative rounded-[2rem] overflow-hidden mb-6 aspect-[4/5] shadow-lg group-hover:shadow-2xl transition-all duration-500">
      <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-3 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
            {prop.tag}
          </div>
          <div className="flex gap-2">
            <button
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 pointer-events-auto hover:bg-white hover:text-emerald-600 transition-all"
              onClick={(e) => { e.stopPropagation(); onSave && onSave(); }}
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 pointer-events-auto hover:bg-white hover:text-emerald-600 transition-all"
              onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
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
      <h3 className="text-xl font-bold text-slate-900 mb-1 truncate group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{prop.title}</h3>
      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Owner: {prop.ownerName || 'KwathuHomes'}</p>
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

export default PropertyCard;
