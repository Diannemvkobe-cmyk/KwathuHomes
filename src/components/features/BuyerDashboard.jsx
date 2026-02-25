import React from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  MapPin,
  Search,
  User,
  ChevronRight,
  Heart,
  Bell,
  LogOut,
  Home
} from 'lucide-react';

const BuyerDashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3">
              <Home className="text-white w-4 h-4 -rotate-3" />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase cursor-pointer" onClick={() => window.location.reload()}>
              KWATHU<span className="text-emerald-600">HOMES</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl pr-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-0.5">Buyer Account</p>
                <p className="text-xs font-black text-slate-900">{user?.name || 'User'}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Welcome Back</div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              My Saved <span className="text-emerald-600 italic">Homes</span>
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition-all px-4 py-2 hover:bg-red-50 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Saved Houses List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 text-center py-24">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <Bookmark className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">No Saved Properties</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                You haven't saved any homes yet. Start exploring properties and heart them to see them here!
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-emerald-600 text-white px-8 py-4 rounded-ful rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95"
              >
                Start Exploring
              </button>
            </div>
          </div>

          {/* Sidebar Stats / Info */}
          <div className="space-y-6">
            <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-200/50 relative overflow-hidden">
              <div className="z-10 relative">
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">Ready to move?</h3>
                <p className="text-emerald-50 opacity-80 text-sm font-medium mb-6">Speak with our top agents to close your dream home deal.</p>
                <button className="w-full bg-white text-emerald-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]">
                  Find an Agent
                </button>
              </div>
              <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Saved Searches</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-200 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100">
                      <Search className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">Leopard's Hill</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;
