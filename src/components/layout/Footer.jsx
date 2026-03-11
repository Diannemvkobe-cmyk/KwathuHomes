/*
Purpose
- Presents a simple site footer with brand, social link, and quick navigation.
- Reinforces identity and provides secondary links.

How It Works
- Pure presentational component; does not accept props.
- Uses neutral styling with an emerald accent to match the brand.

Where It Fits
- Renders at the bottom of the app across pages.
*/
import React from 'react';
import { Linkedin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-900 text-white py-32 px-6">
    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-20">
      <div className="col-span-2">
        <h3 className="text-4xl font-black mb-10 tracking-tighter">KWATHU<span className="text-emerald-600">HOMES</span></h3>
        <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-md mb-12">
          Building the future of Zambian living. Join our exclusive community of elite home owners.
        </p>
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/diana-mukobe-?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Diana Mukobe on LinkedIn"
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer group"
          >
            <Linkedin className="w-6 h-6 text-slate-400 group-hover:text-white" />
          </a>
        </div>
      </div>
      <div>
        <h4 className="font-black text-xs uppercase tracking-widest mb-10 text-emerald-500">Navigation</h4>
        <ul className="space-y-6 text-slate-400 font-bold">
          <li><a href="#" className="hover:text-white transition-colors">ABOUT</a></li>
          <li><a href="#" className="hover:text-white transition-colors">CONTACT</a></li>
          <li><a href="#" className="hover:text-white transition-colors">WORK WITH US</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
      <p>&copy; 2026 KWATHUHOMES - ALL RIGHTS RESERVED - ZAMBIA OFFICE</p>
    </div>
  </footer>
);

export default Footer;
