/*
Purpose
- Provides a skeleton placeholder while property cards are loading.
- Keeps layout stable so content pops in smoothly.

How It Works
- Accepts idx for small staggered animation timing.
- Uses simple pulse classes to mimic loading states.

Where It Fits
- Shown in place of PropertyCard while data is fetched.
*/
import React from 'react';
import { motion } from 'framer-motion';

const PropertyCardSkeleton = ({ idx }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: idx * 0.05 }}
    className="animate-pulse"
  >
    <div className="rounded-[2rem] overflow-hidden mb-6 aspect-[4/5] bg-slate-200" />
    <div className="px-2">
      <div className="h-6 bg-slate-200 rounded mb-2 w-3/4" />
      <div className="h-3 bg-slate-100 rounded mb-4 w-1/2" />
      <div className="flex gap-6 border-t border-slate-100 pt-5">
        <div className="h-4 bg-slate-100 rounded w-16" />
        <div className="h-4 bg-slate-100 rounded w-16" />
        <div className="h-4 bg-slate-100 rounded w-16" />
      </div>
    </div>
  </motion.div>
);

export default PropertyCardSkeleton;
