import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  User,
  Phone,
  CalendarCheck,
  Heart,
} from 'lucide-react';
import PropertyCard from './PropertyCard';

// ─── Interior image pools by property type ───────────────────────────────────
const INTERIOR_IMAGES = {
  House: [
    '/house-interior.jfif',
    '/house-interior (2).jfif',
    '/house-interior-3.jfif',
    '/house-interior-4.jfif',
    '/house-interior-8.jfif',
  ],
  Apartments: [
    '/apartment-interior.jfif',
    '/apartment-interior (2).jfif',
    '/apartment-interior-3.jfif',
  ],
  Flats: [
    '/flat-interior.jfif',
    '/flat-interior (2).jfif',
    '/flat-interior-0.jfif',
    '/flat-interior-3.jfif',
    '/flat-interior-5.jfif',
  ],
  'Shared House': [
    '/shared-house-interior.jfif',
    '/shared-house-interior-5.jfif',
  ],
};

// Descriptions and owner info are now provided by the property object from the backend.

// ─── Image Slider ─────────────────────────────────────────────────────────────
const ImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (delta) => {
    setDirection(delta);
    setCurrent((prev) => (prev + delta + images.length) % images.length);
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-slate-900 select-none">
      {/* Slides */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.img
          key={current}
          src={images[current]}
          alt={`slide-${current}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

      {/* Arrows */}
      <button
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all shadow-lg z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all shadow-lg z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`rounded-full transition-all duration-300 ${i === current
              ? 'w-6 h-2.5 bg-white'
              : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
              }`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full z-10">
        {current + 1} / {images.length}
      </div>
    </div>
  );
};

// ─── Main PropertyDetail component ────────────────────────────────────────────
const PropertyDetail = ({ property, properties, onBack, onSelectProperty, onSave }) => {
  const interiors = INTERIOR_IMAGES[property.type] || [];
  const images = property.image ? [property.image, ...interiors] : [...interiors];
  const description = property.description || 'A wonderful property in a prime location.';
  const ownerName = property.ownerName || 'KwathuHomes Agent';
  const phone = '+260 97 000 0000'; // Default agent phone

  const suggested = properties.filter(
    (p) => p.type === property.type && p._id !== property._id
  );

  // Scroll to top when property changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [property._id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900"
    >
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-bold text-sm"
        >
          <span className="w-9 h-9 rounded-full border-2 border-slate-200 group-hover:border-emerald-500 group-hover:bg-emerald-50 flex items-center justify-center transition-all">
            <ArrowLeft className="w-4 h-4" />
          </span>
          Back to listings
        </button>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={onSave}
            className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all shadow-sm"
          >
            <Heart className="w-5 h-5" />
          </button>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium border-l border-slate-200 pl-4 h-10">
            <span className="bg-emerald-50 text-emerald-700 font-black px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">
              {property.tag}
            </span>
            <span>{property.type}</span>
          </div>
        </div>
      </div>

      {/* ── Main split layout ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 lg:items-start">

          {/* ── Left: Image Slider (bigger) ─────────────────────────────── */}
          <div className="lg:w-[60%] lg:sticky lg:top-24 h-[55vh] lg:h-[80vh]">
            <ImageSlider images={images} />
          </div>

          {/* ── Right: Info box ─────────────────────────────────────────── */}
          <div className="lg:w-[40%]">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-8 flex flex-col gap-6"
            >
              {/* Tag + Title */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-emerald-50 text-emerald-700 font-black px-3 py-1 rounded-full uppercase tracking-widest text-[10px] inline-block mb-3">
                    {property.tag}
                  </span>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-tight">
                    {property.title}
                  </h1>
                </div>
                <button
                  onClick={onSave}
                  className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100 shadow-inner"
                >
                  <Heart className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 -mt-3 text-slate-500">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold">{property.location}</span>
              </div>

              {/* Price */}
              <div className="bg-emerald-600 rounded-2xl px-6 py-4 text-white shadow-xl shadow-emerald-500/20">
                <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">Asking Price</p>
                <p className="text-4xl font-black tracking-tight">{property.price}</p>
              </div>

              {/* Room stats */}
              <div className="flex items-center gap-6 border-t border-b border-slate-100 py-5">
                <div className="flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-lg font-black text-slate-900">{property.beds}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Beds</p>
                  </div>
                </div>
                <div className="w-px h-10 bg-slate-100" />
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-lg font-black text-slate-900">{property.baths}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Baths</p>
                  </div>
                </div>
                <div className="w-px h-10 bg-slate-100" />
                <div className="flex items-center gap-2">
                  <Maximize className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-lg font-black text-slate-900">{property.sqft}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ft²</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">About this property</h2>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{description}</p>
              </div>

              {/* Owner */}
              <div className="bg-slate-50 rounded-3xl p-5 flex items-center gap-4 border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg shadow-emerald-500/20 rotate-3">
                  <span className="-rotate-3">{ownerName.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Listed by</p>
                  <p className="font-black text-slate-900 truncate">{ownerName}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Phone className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-500">{phone}</span>
                  </div>
                </div>
                <User className="w-5 h-5 text-slate-300 shrink-0" />
              </div>

              {/* CTA */}
              <button
                onClick={onSave}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/25 group"
              >
                <CalendarCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Schedule a Viewing
              </button>
            </motion.div>
          </div>
        </div>

        {/* ── Suggested properties ─────────────────────────────────────── */}
        {suggested.length > 0 && (
          <div className="mt-20">
            <div className="mb-8">
              <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
                You may also like
              </p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                Similar {property.type}s
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {suggested.map((p, idx) => (
                <PropertyCard
                  key={p.id}
                  prop={p}
                  idx={idx}
                  onClick={() => onSelectProperty(p)}
                  onSave={onSave}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PropertyDetail;
