import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => (
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
          <li><a href="#" className="hover:text-white transition-colors">ABOUT</a></li>
          <li><a href="#" className="hover:text-white transition-colors">CONTACT</a></li>
          <li><a href="#" className="hover:text-white transition-colors">WORK WITH US</a></li>
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
);

export default Footer;
