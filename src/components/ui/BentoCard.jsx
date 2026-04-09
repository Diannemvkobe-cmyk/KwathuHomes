/*
Purpose
- Displays a small “bento” style card with an icon, title, and description.
- Used for simple highlight blocks in the UI.

How It Works
- Accepts an icon component, title, description, and optional className.
- Adds a hover lift and color transition for a gentle interactive feel.

Where It Fits
- Used on landing sections and dashboards to present key bits of info.
*/
import React from 'react';
import { motion } from 'framer-motion';

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

export default BentoCard;
