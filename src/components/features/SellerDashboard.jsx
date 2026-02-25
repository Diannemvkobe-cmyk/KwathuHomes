import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  PlusCircle,
  UserCircle,
  Settings,
  LogOut,
  Home,
  Search,
  Bell,
  MapPin,
  Image as ImageIcon,
  Camera,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Package,
  Eye,
  MessageSquare,
  User as UserIcon,
  Trash2
} from 'lucide-react';

// ─── Sidebar Item Component ──────────────────────────────────────────────────
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${active
      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
      : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
      }`}
  >
    <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
    <span className="text-sm font-black uppercase tracking-widest">{label}</span>
  </button>
);

// ─── Stat Card Component ─────────────────────────────────────────────────────
const StatCard = ({ label, value, trend, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
        {trend}
      </div>
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
    <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
  </div>
);

// ─── SellerDashboard Main Component ──────────────────────────────────────────
const SellerDashboard = ({ onLogout, onViewListing }) => {
  const { user, token, login } = useAuth();
  const [activeTab, setActiveTab] = useState('My Listings');
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+260 XX XXX XXXX',
    agency: user?.agency || 'Zambian Estates'
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties/my/listings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setListings(data);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'My Listings' && token) {
      fetchMyListings();
    }
  }, [activeTab, token]);

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setListings(listings.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  // ── Sub-views ──

  const MyListingsView = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Listings" value={listings.length.toString()} trend="+New" icon={Package} color="bg-emerald-600" />
        <StatCard label="Total Views" value="0" trend="+0%" icon={Eye} color="bg-blue-600" />
        <StatCard label="Active Inquiries" value="0" trend="+0 today" icon={MessageSquare} color="bg-purple-600" />
        <StatCard label="Estimated Value" value={`K${(listings.reduce((acc, curr) => acc + (parseFloat(curr.price.replace(/[^\d.]/g, '')) || 0), 0) / 1000).toFixed(0)}k`} trend="Live" icon={TrendingUp} color="bg-orange-600" />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Dashboard Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                <th className="px-8 py-5">Property</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5">Views</th>
                <th className="px-8 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing with server...</p>
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <p className="text-sm font-black uppercase tracking-widest text-slate-400">No listings found. Launch your first property!</p>
                  </td>
                </tr>
              ) : listings.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform bg-slate-100">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 uppercase text-sm tracking-tight">{item.title}</p>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                          <MapPin className="w-3 h-3" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'Active' || !item.status ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {item.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-black text-slate-900">{item.price}</td>
                  <td className="px-8 py-5 font-bold text-slate-500">{item.views || 0}</td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onViewListing(item)}
                        className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all"
                        title="View Listing"
                      >
                        <Eye className="w-5 h-5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingProperty(item);
                          setActiveTab('Edit Listing');
                        }}
                        className="p-2 hover:bg-emerald-50 rounded-xl shadow-sm border border-transparent hover:border-emerald-100 transition-all text-slate-400 hover:text-emerald-600"
                        title="Edit Listing"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteListing(item._id)}
                        className="p-2 hover:bg-red-50 rounded-xl shadow-sm border border-transparent hover:border-red-100 transition-all text-slate-300 hover:text-red-500"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const CreateListingView = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-50">
        <form className="space-y-8" onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const newProperty = {
            title: formData.get('title'),
            type: formData.get('type'),
            location: formData.get('location'),
            price: formData.get('price'),
            description: formData.get('description'),
            beds: parseInt(formData.get('beds')) || 0,
            baths: parseInt(formData.get('baths')) || 0,
            sqft: formData.get('sqft'),
            image: "/house-2.jfif", // Fallback
            ownerName: user.name
          };

          try {
            const res = await fetch('http://localhost:5000/api/properties', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(newProperty)
            });
            if (res.ok) {
              setActiveTab('My Listings');
            }
          } catch (error) {
            console.error('Error creating listing:', error);
          }
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Property Title</label>
              <input name="title" type="text" required placeholder="e.g. Modern Villa with Pool" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Category</label>
              <select name="type" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm">
                <option value="House">House</option>
                <option value="Flats">Flats</option>
                <option value="Apartment">Apartment</option>
                <option value="Shared House">Shared House</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Location</label>
              <input name="location" type="text" required placeholder="e.g. Lusaka, Leopard's Hill" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Asking Price (KMW)</label>
              <input name="price" type="text" required placeholder="e.g. K4,500,000" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Bedrooms</label>
              <input name="beds" type="number" required placeholder="5" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Bathrooms</label>
              <input name="baths" type="number" required placeholder="3" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Area (SqFt)</label>
              <input name="sqft" type="text" required placeholder="e.g. 3,500" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Description</label>
              <textarea name="description" rows="6" required placeholder="Describe the luxury and features..." className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] px-6 py-5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm resize-none" />
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-[2rem] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/30 active:scale-95 flex items-center justify-center gap-3">
            <PlusCircle className="w-5 h-5" />
            Publish Listing
          </button>
        </form>
      </div>
    </div>
  );

  const EditListingView = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-50">
        <form className="space-y-8" onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const updatedProperty = {
            title: formData.get('title'),
            type: formData.get('type'),
            location: formData.get('location'),
            price: formData.get('price'),
            description: formData.get('description'),
            beds: parseInt(formData.get('beds')) || 0,
            baths: parseInt(formData.get('baths')) || 0,
            sqft: formData.get('sqft'),
          };

          try {
            const res = await fetch(`http://localhost:5000/api/properties/${editingProperty._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(updatedProperty)
            });
            if (res.ok) {
              setEditingProperty(null);
              setActiveTab('My Listings');
            }
          } catch (error) {
            console.error('Error updating listing:', error);
          }
        }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 uppercase">Edit Listing Details</h2>
            <button
              type="button"
              onClick={() => { setEditingProperty(null); setActiveTab('My Listings'); }}
              className="text-xs font-black uppercase text-slate-400 hover:text-slate-600 px-4 py-2 hover:bg-slate-50 rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Property Title</label>
              <input name="title" type="text" required defaultValue={editingProperty?.title} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Category</label>
              <select name="type" defaultValue={editingProperty?.type} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm">
                <option value="House">House</option>
                <option value="Flats">Flats</option>
                <option value="Apartment">Apartment</option>
                <option value="Shared House">Shared House</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Location</label>
              <input name="location" type="text" required defaultValue={editingProperty?.location} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Asking Price (KMW)</label>
              <input name="price" type="text" required defaultValue={editingProperty?.price} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Bedrooms</label>
              <input name="beds" type="number" required defaultValue={editingProperty?.beds} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Bathrooms</label>
              <input name="baths" type="number" required defaultValue={editingProperty?.baths} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Area (SqFt)</label>
              <input name="sqft" type="text" required defaultValue={editingProperty?.sqft} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Description</label>
              <textarea name="description" rows="6" required defaultValue={editingProperty?.description} className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] px-6 py-5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm resize-none" />
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-[2rem] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/30 active:scale-95 flex items-center justify-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            Sync Changes
          </button>
        </form>
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-50">
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[3rem] bg-emerald-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-16 h-16 text-emerald-600" />
              )}
            </div>
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => setProfilePic(reader.result);
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
              className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-4 rounded-3xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white"
            >
              <Camera className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">{profileData.name}</h2>
            <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest mb-4">{user?.role} Member • Portfolio Manager</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Listings</p>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{listings.length} Managed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Email Address</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Contact Phone</label>
            <input
              type="text"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-4">Real Estate Agency</label>
            <input
              type="text"
              value={profileData.agency}
              onChange={(e) => setProfileData({ ...profileData, agency: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        <button
          onClick={async () => {
            setProfileSaving(true);
            try {
              const res = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  name: profileData.name,
                  email: profileData.email,
                  profilePic: profilePic
                })
              });
              if (res.ok) {
                const data = await res.json();
                login(data.user, token);
                alert('Profile details updated!');
              }
            } catch (error) {
              console.error('Error updating profile:', error);
            } finally {
              setProfileSaving(false);
            }
          }}
          disabled={profileSaving}
          className="mt-12 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs px-12 py-5 rounded-[2rem] hover:bg-emerald-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {profileSaving ? 'Saving...' : 'Confirm Changes'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 h-screen w-80 bg-white border-r border-slate-100 flex flex-col p-8 z-50">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3">
            <Home className="text-white w-5 h-5 -rotate-3" />
          </div>
          <span className="text-xl font-black tracking-tighter">
            KWATHU<span className="text-emerald-600">HOMES</span>
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="My Listings" active={activeTab === 'My Listings'} onClick={() => { setEditingProperty(null); setActiveTab('My Listings'); }} />
          <SidebarItem icon={PlusCircle} label="Add New Listing" active={activeTab === 'Add New Listing'} onClick={() => { setEditingProperty(null); setActiveTab('Add New Listing'); }} />
          <SidebarItem icon={UserCircle} label="My Profile" active={activeTab === 'My Profile'} onClick={() => { setEditingProperty(null); setActiveTab('My Profile'); }} />
          <SidebarItem icon={Settings} label="Global Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group font-black uppercase tracking-widest text-xs"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main className="flex-1 ml-80 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-12 py-6 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search Listings..." className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-3.5 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 ring-emerald-600/10 transition-all placeholder:text-slate-300" />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-white transition-all shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm group-hover:scale-105 transition-transform overflow-hidden">
                {profilePic ? (
                  <img src={profilePic} alt="" className="w-full h-full object-cover" />
                ) : (
                  user?.name.charAt(0)
                )}
              </div>
              <div className="pr-4 hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{user?.role} Account</p>
                <p className="text-xs font-black text-slate-900 tracking-tight leading-none">{user?.name}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content View */}
        <div className="p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'My Listings' && (
                <div>
                  <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">My Listings</h1>
                    <p className="text-slate-500 font-medium">Manage and monitor all your property listings in one place.</p>
                  </div>
                  <MyListingsView />
                </div>
              )}
              {activeTab === 'Add New Listing' && (
                <div>
                  <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Inventory Management</h1>
                    <p className="text-slate-500 font-medium">Add new properties to your portfolio.</p>
                  </div>
                  <CreateListingView />
                </div>
              )}
              {activeTab === 'My Profile' && (
                <div>
                  <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">My Profile</h1>
                    <p className="text-slate-500 font-medium">Manage your account information and preferences.</p>
                  </div>
                  <ProfileView />
                </div>
              )}
              {activeTab === 'Edit Listing' && editingProperty && (
                <div>
                  <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Edit Listing</h1>
                    <p className="text-slate-500 font-medium">Update the details of your property.</p>
                  </div>
                  <EditListingView />
                </div>
              )}
              {activeTab === 'Settings' && (
                <div className="flex items-center justify-center h-[60vh]">
                  <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xl">Settings Under Construction</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
