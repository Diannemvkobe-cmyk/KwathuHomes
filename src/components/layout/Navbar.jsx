import React from 'react';
import { Home, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ scrolled, onGetStarted, onAbout, onContact }) => {
  const { user } = useAuth();

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 transition-all duration-500 rounded-full border border-white/20 px-8 py-4 ${scrolled ? 'bg-white/70 backdrop-blur-2xl shadow-2xl shadow-emerald-900/10' : 'bg-white/10 backdrop-blur-md'
      }`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3 cursor-pointer" onClick={() => window.location.reload()}>
            <Home className="text-white w-5 h-5 -rotate-3" />
          </div>
          <span className="text-xl font-black tracking-tighter cursor-pointer" onClick={() => window.location.reload()}>
            KWATHU<span className="text-emerald-600">HOMES</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {[
            { name: 'Home', action: () => window.location.reload() },
            { name: 'About', action: onAbout },
            { name: 'Contact', action: onContact }
          ].map((item) => (
            <a
              key={item.name}
              href="#"
              className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                item.action();
              }}
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button
                onClick={onGetStarted}
                className="hidden sm:block text-xs font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="bg-emerald-600 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/30 active:scale-95"
              >
                Get Started
              </button>
            </>
          ) : (
            <button
              onClick={onGetStarted}
              className="flex items-center gap-3 bg-emerald-600 text-white pl-4 pr-2 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/30 active:scale-95 group"
            >
              <span className="hidden sm:inline">{user.role} Dashboard</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <User className="w-4 h-4" />
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

