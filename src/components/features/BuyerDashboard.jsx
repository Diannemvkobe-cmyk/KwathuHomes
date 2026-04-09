/*
Purpose
- Gives buyers a simple space to manage saved homes, profile, and notifications.
- Encourages adding a phone number so owners can reach them.

How It Works
- Shows three tabs: Saved, Buyer Profile, Notifications.
- Reads/writes lightweight data from local storage via engagement utils.
- Syncs profile (phone) to the server when authenticated.
- Provides a bell panel for quick notification previews.

Key Props
- user: the logged-in buyer.
- onLogout: sign-out handler.
- savedProperties: list of saved homes for this user.
- onBackToBrowse: navigate back to the property list.
- onViewSavedProperty, onRemoveSavedProperty: actions for saved items.

Where It Fits
- Opens after login for buyers to manage their experience.
*/
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  MapPin,
  Search,
  Bell,
  LogOut,
  Home,
  User,
  Phone,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiUrl } from '../../utils/api';
import {
  formatDateTime,
  getBuyerProfile,
  getNotifications,
  getUnreadNotificationsCount,
  markAllNotificationsRead,
  saveBuyerProfile,
} from '../../utils/engagement';

const BuyerDashboard = ({
  user,
  onLogout,
  savedProperties = [],
  onBackToBrowse,
  onViewSavedProperty,
  onRemoveSavedProperty,
}) => {
  const { token, login } = useAuth();
  const [activeTab, setActiveTab] = useState('saved');
  const [showBellPanel, setShowBellPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [phone, setPhone] = useState('');
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);

  const reloadData = () => {
    setNotifications(getNotifications(user));
    const profile = getBuyerProfile(user);
    setPhone(profile?.phone || user?.phone || '');
  };

  useEffect(() => {
    reloadData();
    const onData = () => reloadData();
    const onStorage = () => reloadData();
    window.addEventListener('kwathu:data-updated', onData);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('kwathu:data-updated', onData);
      window.removeEventListener('storage', onStorage);
    };
  }, [user]);

  useEffect(() => {
    if (phone) {
      setShowPhonePopup(false);
      return;
    }
    setShowPhonePopup(true);
  }, [phone]);

  const unreadCount = useMemo(() => getUnreadNotificationsCount(user), [user, notifications]);

  const handleOpenNotifications = () => {
    setShowBellPanel((prev) => !prev);
    markAllNotificationsRead(user);
    reloadData();
  };

  const handleSavePhone = async () => {
    if (!phone.trim()) {
      return;
    }

    setSavingPhone(true);
    saveBuyerProfile(user, { phone: phone.trim() });

    try {
      if (token) {
        const res = await fetch(apiUrl('/auth/profile'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: user?.name,
            email: user?.email,
            phone: phone.trim(),
            profilePic: user?.profilePic || null,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            login(data.user, token);
          }
        }
      }
    } catch (error) {
      console.error('Error syncing phone:', error);
    } finally {
      setSavingPhone(false);
      setShowPhonePopup(false);
      reloadData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {showPhonePopup && (
        <div className="fixed top-6 right-6 z-[70] max-w-sm rounded-2xl bg-white border border-amber-200 shadow-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-black text-slate-900">Add your buyer phone number</p>
              <p className="text-xs text-slate-600 mt-1">Please complete your buyer profile so owners can contact you.</p>
              <button
                onClick={() => setActiveTab('profile')}
                className="mt-3 text-[10px] font-black uppercase tracking-widest text-emerald-600"
              >
                Open Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3">
              <Home className="text-white w-4 h-4 -rotate-3" />
            </div>
            <span
              className="text-lg font-black tracking-tighter uppercase cursor-pointer"
              onClick={() => (onBackToBrowse ? onBackToBrowse() : window.location.reload())}
            >
              KWATHU<span className="text-emerald-600">HOMES</span>
            </span>
          </div>

          <div className="flex items-center gap-6 relative">
            <button
              onClick={() => (onBackToBrowse ? onBackToBrowse() : window.location.reload())}
              className="hidden sm:inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest transition-all px-4 py-2 hover:bg-emerald-50 rounded-xl"
            >
              Browse collection
            </button>
            <button
              onClick={handleOpenNotifications}
              className="relative w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 min-w-4 h-4 px-1 bg-emerald-500 rounded-full border-2 border-white text-[9px] font-black text-white leading-none flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showBellPanel && (
              <div className="absolute top-12 right-0 w-[92vw] max-w-sm sm:w-96 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Notifications</p>
                  <button
                    onClick={() => {
                      setActiveTab('notifications');
                      setShowBellPanel(false);
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-emerald-600"
                  >
                    View more
                  </button>
                </div>
                <div className="max-h-72 overflow-auto">
                  {notifications.slice(0, 5).map((item) => (
                    <div key={item.id} className="px-4 py-3 border-b border-slate-50">
                      <p className="text-xs font-black text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.message}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="px-4 py-8 text-xs text-slate-400 text-center">No notifications yet.</p>
                  )}
                </div>
              </div>
            )}

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <div className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Buyer Dashboard</div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              My Buyer <span className="text-emerald-600 italic">Space</span>
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

        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'saved' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 border border-slate-100'
              }`}
          >
            Saved Homes
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'profile' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 border border-slate-100'
              }`}
          >
            Buyer Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'notifications' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 border border-slate-100'
              }`}
          >
            Notifications
          </button>
        </div>

        {activeTab === 'saved' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {savedProperties.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 text-center py-24">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">No Saved Properties</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                    You have not saved any homes yet.
                  </p>
                  <button
                    onClick={() => (onBackToBrowse ? onBackToBrowse() : window.location.reload())}
                    className="bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">Saved Properties</h3>
                  </div>
                  <div className="space-y-4">
                    {savedProperties.map((property) => (
                      <div
                        key={property._id}
                        role="button"
                        tabIndex={0}
                        onClick={() => onViewSavedProperty && onViewSavedProperty(property)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') onViewSavedProperty && onViewSavedProperty(property);
                        }}
                        className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all bg-slate-50/60 cursor-pointer"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 shadow-sm">
                            <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black uppercase tracking-tight text-slate-900 truncate">{property.title}</p>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{property.location}</span>
                            </div>
                            <p className="mt-2 text-xs font-black text-emerald-600">{property.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveSavedProperty && onRemoveSavedProperty(property._id);
                            }}
                            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all text-[10px] font-black uppercase tracking-widest"
                            title="Remove saved property"
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewSavedProperty && onViewSavedProperty(property);
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-[10px] font-black uppercase tracking-widest"
                            title="View details"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Quick Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Update Profile</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-black text-slate-900 uppercase tracking-tight">View Notifications</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-2">Buyer Profile</h2>
              <p className="text-sm text-slate-500 mb-8">Add your phone number so sellers can contact you after inquiries.</p>

              <div className="grid gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Full Name</label>
                  <input value={user?.name || ''} disabled className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-700" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Email</label>
                  <input value={user?.email || ''} disabled className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-700" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Contact Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +260 97 123 4567"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSavePhone}
                disabled={savingPhone || !phone.trim()}
                className="mt-8 bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50 inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {savingPhone ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/60">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">All Notifications</h2>
              </div>
              <div>
                {notifications.length === 0 && (
                  <p className="px-8 py-16 text-center text-sm text-slate-400">No notifications yet.</p>
                )}
                {notifications.map((item) => (
                  <div key={item.id} className="px-8 py-5 border-b border-slate-50 last:border-b-0">
                    <p className="text-sm font-black text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{item.message}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">{formatDateTime(item.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default BuyerDashboard;
