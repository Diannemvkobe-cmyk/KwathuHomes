/*
Purpose
- Provides an admin-only console with overview metrics, users management, and system logs.
- Keeps admin actions predictable and transparent.

How It Works
- Checks the authenticated user’s role via AuthContext to allow access.
- Loads overview, traffic, users, and logs from simple REST endpoints.
- Resolves user names in logs for clarity and supports export.
- Offers a mobile-friendly sidebar with tabs: Overview, Users, Logs.

Where It Fits
- Accessible to Admin roles after login; others see an access restricted screen.
*/
import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LayoutDashboard, Users, FileText, LogOut, ShieldAlert, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Auth from './Auth';

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

const PanelShell = ({ kicker, title, subtitle, children }) => (
  <div className="space-y-8">
    <div>
      <div className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
        {kicker}
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
        {title}
      </h1>
      {subtitle ? <p className="text-slate-500 font-medium mt-3">{subtitle}</p> : null}
    </div>
    {children}
  </div>
);

const AdminDashboard = ({ onExit }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState(null);
  const [traffic, setTraffic] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'Buyer' });
  const [logs, setLogs] = useState([]);
  const [userLookup, setUserLookup] = useState({});
  const [logsLevel, setLogsLevel] = useState('All');
  const [logsQuery, setLogsQuery] = useState('');
  const [logsPage, setLogsPage] = useState(1);
  const [logsPageSize] = useState(20);

  const isAdmin = useMemo(() => {
    if (!user) return false;
    const role = String(user.role || '').toLowerCase();
    return role === 'admin' || role === 'administrator' || role === 'superadmin';
  }, [user]);

  useEffect(() => {
    const run = async () => {
      setError('');
      setLoading(true);
      try {
        if (activeTab === 'Overview') {
          const [o, t] = await Promise.all([
            fetch(import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/admin/overview` : '/api/admin/overview'),
            fetch(import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/admin/traffic` : '/api/admin/traffic')
          ]);
          if (!o.ok) throw new Error('Failed to load overview');
          if (!t.ok) throw new Error('Failed to load traffic');
          const odata = await o.json();
          const tdata = await t.json();
          setOverview(odata);
          setTraffic(Array.isArray(tdata?.series) ? tdata.series : []);
        } else if (activeTab === 'Users') {
          const u = await fetch(import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/admin/users` : '/api/admin/users');
          if (!u.ok) throw new Error('Failed to load users');
          const udata = await u.json();
          setUsersData(Array.isArray(udata) ? udata : []);
        } else if (activeTab === 'Logs') {
          const l = await fetch(import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/admin/logs` : '/api/admin/logs');
          if (!l.ok) throw new Error('Failed to load logs');
          const ldata = await l.json();
          setLogs(Array.isArray(ldata) ? ldata : []);
          // Resolve user names for any userId/ownerId present
          const ids = new Set();
          (Array.isArray(ldata) ? ldata : []).forEach(item => {
            const c = item?.context || {};
            if (c.userId) ids.add(c.userId);
            if (c.ownerId) ids.add(c.ownerId);
          });
          const current = {};
          for (const id of ids) {
            try {
              const r = await fetch(import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/admin/users/${id}` : `/api/admin/users/${id}`);
              if (r.ok) {
                const u = await r.json();
                current[id] = u;
              }
            } catch { }
          }
          setUserLookup(current);
        }
      } catch (e) {
        setError(e.message || 'Request failed');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [activeTab]);

  const filteredLogs = logs.filter((l) => {
    const levelOk = logsLevel === 'All' || l.level === logsLevel;
    if (!levelOk) return false;
    const q = logsQuery.trim().toLowerCase();
    if (!q) return true;
    const ctx = l.context || {};
    const hay = (l.message || '') + ' ' + JSON.stringify(ctx);
    return hay.toLowerCase().includes(q);
  });
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / logsPageSize));
  const page = Math.min(logsPage, totalPages);
  const pagedLogs = filteredLogs.slice((page - 1) * logsPageSize, (page - 1) * logsPageSize + logsPageSize);

  const getLogRows = () => filteredLogs.map((log) => {
    const ctx = log.context || {};
    const uid = ctx.userId || ctx.ownerId;
    const resolved = uid ? userLookup[uid] : null;
    const actorName = resolved?.name || ctx.email || (uid ? `User ${uid}` : 'User');
    const role = resolved?.role || ctx.role || '';
    const resource = ctx.title ? ctx.title : (ctx.propertyId ? `Property ${ctx.propertyId}` : (ctx.path || ctx.endpoint || ''));
    const ip = ctx.ip || ctx.clientIp || '';
    const method = ctx.method || ctx.httpMethod || '';
    return {
      timestamp: log.createdAt ? new Date(log.createdAt).toLocaleString() : '',
      level: log.level || '',
      actor: actorName,
      role,
      message: log.message || '',
      resource,
      method,
      ip,
      context: Object.keys(ctx).length ? JSON.stringify(ctx) : ''
    };
  });

  const exportCsv = () => {
    const rows = getLogRows();
    const headers = ['timestamp', 'level', 'actor', 'role', 'message', 'resource', 'method', 'ip', 'context'];
    const escapeCsv = (value) => {
      const str = String(value ?? '');
      if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    const csv = [headers.join(',')]
      .concat(rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(',')))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const rows = getLogRows();
    const escapeHtml = (value) => String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    const tableRows = rows.map((row) => (
      `<tr>
        <td>${escapeHtml(row.timestamp)}</td>
        <td>${escapeHtml(row.level)}</td>
        <td>${escapeHtml(row.actor)}</td>
        <td>${escapeHtml(row.role)}</td>
        <td>${escapeHtml(row.message)}</td>
        <td>${escapeHtml(row.resource)}</td>
        <td>${escapeHtml(row.method)}</td>
        <td>${escapeHtml(row.ip)}</td>
        <td>${escapeHtml(row.context)}</td>
      </tr>`
    )).join('');
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>System Logs</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { font-size: 18px; margin-bottom: 16px; }
            table { border-collapse: collapse; width: 100%; font-size: 11px; }
            th, td { border: 1px solid #ddd; padding: 6px 8px; vertical-align: top; }
            th { background: #f4f4f5; text-transform: uppercase; font-size: 10px; letter-spacing: 0.08em; }
            td { word-break: break-word; }
          </style>
        </head>
        <body>
          <h1>System Logs (${new Date().toLocaleString()})</h1>
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Level</th>
                <th>Actor</th>
                <th>Role</th>
                <th>Message</th>
                <th>Resource</th>
                <th>Method</th>
                <th>IP</th>
                <th>Context</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows || '<tr><td colspan="9">No logs</td></tr>'}
            </tbody>
          </table>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/admin/users` : '/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm)
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to create user');
      }
      setCreateForm({ name: '', email: '', password: '', role: 'Buyer' });
      const u = await fetch(import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/admin/users` : '/api/admin/users');
      const udata = await u.json();
      setUsersData(Array.isArray(udata) ? udata : []);
    } catch (e) {
      setError(e.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/admin/users/${id}` : `/api/admin/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsersData((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      setError(e.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Auth
        onBack={() => (onExit ? onExit() : (window.location.href = '/'))}
        onAuthSuccess={() => {
          // AuthContext updates will re-render and allow access if admin.
        }}
      />
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="px-8 py-7 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Area</p>
              <p className="text-lg font-black text-slate-900 tracking-tight uppercase">Access restricted</p>
            </div>
          </div>
          <div className="px-8 py-8">
            <p className="text-slate-600 font-medium">
              You don’t have permission to view this dashboard.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => (onExit ? onExit() : (window.location.href = '/'))}
                className="flex-1 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs py-4 rounded-2xl hover:bg-emerald-600 transition-all active:scale-95"
              >
                Back to site
              </button>
              <button
                onClick={() => {
                  logout();
                  if (onExit) onExit();
                }}
                className="flex-1 bg-white border border-slate-200 text-slate-700 font-black uppercase tracking-[0.2em] text-xs py-4 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-screen w-80 bg-white border-r border-slate-100 flex flex-col p-8 z-50 transition-transform duration-300 lg:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between gap-3 mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3">
              <Home className="text-white w-5 h-5 -rotate-3" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">
              KWATHU<span className="text-emerald-600">HOMES</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'Overview'} onClick={() => { setActiveTab('Overview'); setMobileSidebarOpen(false); }} />
          <SidebarItem icon={Users} label="Users" active={activeTab === 'Users'} onClick={() => { setActiveTab('Users'); setMobileSidebarOpen(false); }} />
          <SidebarItem icon={FileText} label="System Logs" active={activeTab === 'Logs'} onClick={() => { setActiveTab('Logs'); setMobileSidebarOpen(false); }} />
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50 space-y-2">
          <button
            onClick={() => {
              logout();
              if (onExit) onExit();
            }}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group font-black uppercase tracking-widest text-xs"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen lg:ml-80">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 sm:px-10 lg:px-12 py-5 sm:py-6 flex items-center justify-between gap-4">
          <div>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden mb-3 w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 inline-flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              aria-label="Open menu"
              type="button"
            >
              <Menu className="w-5 h-5" />
            </button>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Console</p>
            <p className="text-sm font-black text-slate-900 tracking-tight uppercase">
              {user?.name ? `Welcome, ${user.name}` : 'Welcome'}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
              {String(user?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="pr-4 hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Admin Account</p>
              <p className="text-xs font-black text-slate-900 tracking-tight leading-none">{user?.email || ''}</p>
            </div>
          </div>
        </header>

        <div className="p-6 sm:p-10 lg:p-12">
          {error ? (
            <div className="mb-6 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">{error}</div>
          ) : null}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'Overview' && (
                <PanelShell
                  kicker="Administration"
                  title="Overview"
                  subtitle=""
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Total Accounts</p>
                      <p className="text-4xl font-black tracking-tight">{overview?.totalAccounts ?? '—'}</p>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Buyers</p>
                      <p className="text-4xl font-black tracking-tight">{overview?.buyersCount ?? '—'}</p>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Sellers</p>
                      <p className="text-4xl font-black tracking-tight">{overview?.sellersCount ?? '—'}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">New Users (7d)</p>
                      <p className="text-4xl font-black tracking-tight">{overview?.newUsersThisWeek ?? '—'}</p>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Total Listings</p>
                      <p className="text-4xl font-black tracking-tight">{overview?.totalListings ?? '—'}</p>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">New Listings (30d)</p>
                      <p className="text-4xl font-black tracking-tight">{overview?.newListingsThisMonth ?? '—'}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:col-span-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Buyer Engagement</p>
                      <p className="text-4xl font-black tracking-tight">{overview?.buyerEngagementPercent != null ? `${overview.buyerEngagementPercent}%` : '—'}</p>
                    </div>
                  </div>
                  <div className="mt-8 bg-white rounded-[2rem] border border-slate-100 p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">Activity (24h)</p>
                    <div className="flex items-end gap-2 h-28">
                      {traffic.map((v, i) => (
                        <div key={i} className="flex-1 bg-emerald-100 rounded-t" style={{ height: `${Math.min(100, v * 8)}%` }} />
                      ))}
                    </div>
                  </div>
                </PanelShell>
              )}

              {activeTab === 'Users' && (
                <PanelShell
                  kicker="Accounts"
                  title="Users"
                  subtitle=""
                >
                  <form onSubmit={handleCreateUser} className="bg-white rounded-[2rem] border border-slate-100 p-6 mb-6">
                    <div className="grid md:grid-cols-5 gap-3">
                      <input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="Name" className="px-4 py-3 rounded-xl border border-slate-200" required />
                      <input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} placeholder="Email" className="px-4 py-3 rounded-xl border border-slate-200" required />
                      <input type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} placeholder="Password" className="px-4 py-3 rounded-xl border border-slate-200" required />
                      <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200">
                        <option>Buyer</option>
                        <option>Seller</option>
                        <option>Admin</option>
                      </select>
                      <button disabled={loading} className="px-4 py-3 rounded-xl bg-emerald-600 text-white font-black uppercase tracking-widest text-xs">Create</button>
                    </div>
                  </form>
                  <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">All Users</div>
                    <div className="divide-y divide-slate-100">
                      {loading && usersData.length === 0 ? (
                        <div className="px-6 py-6 text-slate-500">Loading…</div>
                      ) : usersData.length === 0 ? (
                        <div className="px-6 py-6 text-slate-500">No users</div>
                      ) : (
                        usersData.map(u => (
                          <div key={u.id} className="px-6 py-4 flex items-center justify-between gap-4">
                            <div>
                              <p className="font-bold text-slate-900">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black uppercase tracking-widest text-slate-500">{u.role}</span>
                              <button onClick={() => handleDeleteUser(u.id)} className="px-3 py-2 rounded-xl bg-red-50 text-red-600 border border-red-100 text-xs font-black uppercase tracking-widest">Delete</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </PanelShell>
              )}

              {activeTab === 'Logs' && (
                <PanelShell
                  kicker="System"
                  title="Logs"
                  subtitle=""
                >
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 mb-4">
                    <div className="grid md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <input
                          value={logsQuery}
                          onChange={(e) => { setLogsQuery(e.target.value); setLogsPage(1); }}
                          placeholder="Search message or context (who/what/where/why)…"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200"
                        />
                      </div>
                      <select
                        value={logsLevel}
                        onChange={(e) => { setLogsLevel(e.target.value); setLogsPage(1); }}
                        className="px-4 py-3 rounded-xl border border-slate-200"
                      >
                        <option>All</option>
                        <option>INFO</option>
                        <option>WARN</option>
                        <option>ERROR</option>
                      </select>
                      <button onClick={exportCsv} className="px-4 py-3 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs">
                        Export CSV
                      </button>
                      <button onClick={exportPdf} className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-700">
                        Export PDF
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        Results {filteredLogs.length} • Page {page}/{totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setLogsPage(Math.max(1, page - 1))}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                          disabled={page <= 1}
                        >
                          Prev
                        </button>
                        <button
                          onClick={() => setLogsPage(Math.min(totalPages, page + 1))}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                          disabled={page >= totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {loading && logs.length === 0 ? (
                        <div className="px-6 py-6 text-slate-500">Loading…</div>
                      ) : filteredLogs.length === 0 ? (
                        <div className="px-6 py-6 text-slate-500">No logs</div>
                      ) : (
                        pagedLogs.map(l => {
                          const ctx = l.context || {};
                          const uid = ctx.userId || ctx.ownerId;
                          const resolved = uid ? userLookup[uid] : null;
                          const actorName = resolved?.name || ctx.email || (uid ? `User ${uid}` : 'User');
                          const role = resolved?.role || ctx.role || '';
                          const what = l.message || '';
                          const resource = ctx.title ? ctx.title : (ctx.propertyId ? `Property ${ctx.propertyId}` : (ctx.path || ctx.endpoint || ''));
                          const ip = ctx.ip || ctx.clientIp || '—';
                          const method = ctx.method || ctx.httpMethod || '—';
                          return (
                            <div key={l.id} className="px-6 py-4">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{l.level}</span>
                                <span className="text-xs text-slate-500">{new Date(l.createdAt).toLocaleString()}</span>
                              </div>
                              <p className="text-slate-900 mt-2">
                                <span className="font-bold">{actorName}</span>
                                {role ? <span className="text-slate-500"> ({role})</span> : null}
                                {' '}<span>{what}</span>
                                {resource ? <span> — {resource}</span> : null}
                                {' '}<span className="text-slate-500 text-xs">{method !== '—' ? method : ''}{ip !== '—' ? ` • ${ip}` : ''}</span>
                              </p>
                              {Object.keys(ctx).length ? (
                                <details className="mt-2">
                                  <summary className="text-xs text-slate-500 cursor-pointer">Details</summary>
                                  <div className="flex items-center gap-2 mt-2">
                                    <button
                                      onClick={() => navigator.clipboard.writeText(JSON.stringify(ctx, null, 2))}
                                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                    >
                                      Copy JSON
                                    </button>
                                  </div>
                                  <pre className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-700 overflow-auto">{JSON.stringify(ctx, null, 2)}</pre>
                                </details>
                              ) : null}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </PanelShell>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

