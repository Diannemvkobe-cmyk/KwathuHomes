import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Home,
  ChevronLeft,
  Briefcase,
  UserCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Auth = ({ onBack, onAuthSuccess }) => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('Buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData, role };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      login(data.user, data.token);
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-5%] w-80 h-80 bg-emerald-400 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-blue-400 rounded-full blur-[120px]" />
      </div>

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="absolute top-10 left-10 flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-black text-xs uppercase tracking-widest transition-all group"
      >
        <span className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all">
          <ChevronLeft className="w-4 h-4" />
        </span>
        Back
      </motion.button>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20 rotate-3 mx-auto mb-6">
            <Home className="text-white w-8 h-8 -rotate-3" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
            KWATHU<span className="text-emerald-600">HOMES</span>
          </h1>
          <p className="text-slate-500 font-medium">
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Start your property journey today.'}
          </p>
        </div>

        <motion.div
          layout
          className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100"
        >
          {/* View Toggle */}
          <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white shadow-xl text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white shadow-xl text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  {/* Role Selection */}
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <button
                      type="button"
                      onClick={() => setRole('Buyer')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${role === 'Buyer'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                        }`}
                    >
                      <UserCheck className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Buyer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('Seller')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${role === 'Seller'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                        }`}
                    >
                      <Briefcase className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Seller</span>
                    </button>
                  </div>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      placeholder="FULL NAME"
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                required
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                required
                type="password"
                placeholder="PASSWORD"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center px-4">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <p className="mt-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          By continuing, you agree to our <span className="text-emerald-600 hover:underline cursor-pointer">Terms of Service</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
