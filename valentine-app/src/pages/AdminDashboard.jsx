import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listSites, saveSite, deleteSite, emptyTemplate, toggleSiteStatus, setSiteDemo, getStorefront, updateStorefront, uploadImage, listOrders, updateOrderStatus, toggleTemplateStatus } from '../api';
import {
  Heart, Plus, ExternalLink, Trash2, Edit3,
  Search, AlertCircle, Loader2, CheckCircle2,
  Sun, Moon, LayoutGrid, List, Copy, ToggleLeft, ToggleRight, AlertTriangle,
  Store, Users, Save, Star, Upload, Image as ImageIcon, ShoppingBag, X, Music, Eye, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// REMINDER: Add the following route to backend siteRoutes.js:
// PATCH /api/sites/:siteId/status -> updates isActive boolean.

function calculateStatus(isActive, expiresAt, isDemo) {
  if (isDemo) {
    return { text: "Active Demo (No Expiry)", color: "bg-fuchsia-100/50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border border-fuchsia-200/50 dark:border-fuchsia-500/20" };
  }

  if (!isActive) {
    return { text: "Inactive", color: "bg-neutral-200/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border border-neutral-300/50 dark:border-neutral-700/50" };
  }
  
  if (!expiresAt) {
    return { text: "Active", color: "bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20" };
  }

  const days = Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
  
  if (days <= 0) {
    return { text: "Expired", color: "bg-neutral-200/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border border-neutral-300/50 dark:border-neutral-700/50" };
  }
  if (days <= 3) {
    return { text: `Expires in ${days} Days`, color: "bg-orange-100/50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200/50 dark:border-orange-500/20" };
  }
  return { text: `${days} Days Left`, color: "bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20" };
}

function formatDate(dateStringOrObj) {
  if (!dateStringOrObj) return 'Legacy / No Date';
  try {
    const date = typeof dateStringOrObj === 'string' ? new Date(dateStringOrObj) : dateStringOrObj;
    if (isNaN(date.getTime())) return 'Invalid Date';
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  } catch (e) {
    return 'Invalid Date';
  }
}

function getExpirationInfo(createdAt, expiresAt, isDemo) {
  if (isDemo) return { date: null, isUrgent: false };
  if (!createdAt && !expiresAt) return { date: null, isUrgent: false };
  const expDate = expiresAt ? new Date(expiresAt) : new Date(new Date(createdAt).getTime() + 14 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const hoursLeft = (expDate - now) / (1000 * 60 * 60);
  return { date: expDate, isUrgent: hoursLeft > 0 && hoursLeft <= 48 };
}

export default function AdminDashboard() {
  const [sites, setSites]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [newId, setNewId]       = useState('');
  const [templateType, setTemplateType] = useState('polaroid');
  const [category, setCategory] = useState('valentine');
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch]     = useState('');
  const [toast, setToast]       = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Task 1: View Mode State & Delete Modal State
  const [viewMode, setViewMode] = useState('list');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, siteId: null });

  // Storefront Tab State
  const [activeTab, setActiveTab] = useState('sites'); // 'sites' | 'storefront' | 'orders'
  const [wipingDemos, setWipingDemos] = useState(false);
  const [wipingClients, setWipingClients] = useState(false);
  const [storefront, setStorefront] = useState({ templates: [], testimonials: [] });
  const [savingStorefront, setSavingStorefront] = useState(false);

  // ── Orders state ──────────────────────────────────────────────
  const [orders, setOrders]           = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // asset viewer modal

  const nav = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const nextTheme = !prev;
      if (nextTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return nextTheme;
    });
  };

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [sitesRes, storeRes] = await Promise.all([listSites(), getStorefront()]);
      setSites(sitesRes.data || []);
      if (storeRes.data) setStorefront(storeRes.data);
    } catch (e) {
      console.error(e);
      const msg = e.message.toLowerCase();
      if (msg.includes('token') || msg.includes('unauthorized')) {
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
        return;
      }
      showToast(`Failed to load data: ${e.message}`, false);
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await listOrders();
      setOrders(res.data || []);
    } catch (e) {
      const msg = e.message.toLowerCase();
      if (msg.includes('token') || msg.includes('unauthorized')) {
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
        return;
      }
      showToast(`Failed to load orders: ${e.message}`, false);
    }
    setOrdersLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (activeTab === 'orders') loadOrders(); }, [activeTab]);

  const handleCreate = async () => {
    const id = newId.trim().toLowerCase().replace(/\s+/g, '-');
    if (!id) return;
    setCreating(true);
    await saveSite(id, emptyTemplate(id, templateType, category));
    setCreating(false);
    setNewId('');
    setShowModal(false);
    showToast(`Site "${id}" created!`);
    nav(`/admin/edit/${id}`);
  };

  const confirmDelete = async () => {
    if (!deleteModal.siteId) return;
    setDeleting(deleteModal.siteId);
    await deleteSite(deleteModal.siteId);
    setDeleting(null);
    setDeleteModal({ isOpen: false, siteId: null });
    showToast(`Deleted "${deleteModal.siteId}".`);
    load();
  };

  const handleCopyLink = (siteId) => {
    const url = `${window.location.origin}/${siteId}`;
    navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard!");
  };

  const handleToggleStatus = async (siteId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      await toggleSiteStatus(siteId, updatedStatus);
      setSites(prev => prev.map(s => s.siteId === siteId ? { ...s, isActive: updatedStatus } : s));
      showToast(updatedStatus ? "Site activated!" : "Site deactivated!", true);
    } catch (err) {
      showToast("Failed to update status", false);
    }
  };

  const handleSetDemo = async (dbId) => {
    try {
      showToast("Setting as Demo...", true);
      const res = await setSiteDemo(dbId);
      if (res.success) {
        showToast("Demo successfully updated!");
        load(); // reload sites to reflect demo flags correctly
      }
    } catch (err) {
      showToast("Failed to set demo.", false);
    }
  };

  const filtered = sites.filter(s =>
    s.siteId?.toLowerCase().includes(search.toLowerCase()) ||
    s.general?.coupleName?.toLowerCase().includes(search.toLowerCase())
  );

  // Split into demos vs regular client sites
  const demoSites    = filtered.filter(s => s.isDemoPreview === true);
  const regularSites = filtered.filter(s => !s.isDemoPreview);

  const handleSaveStorefront = async () => {
    setSavingStorefront(true);
    try {
      await updateStorefront(storefront);
      showToast("Storefront updated successfully!");
    } catch (e) {
      showToast(`Failed: ${e.message}`, false);
    }
    setSavingStorefront(false);
  };

  const handleTemplateChange = (idx, field, val) => {
    const newTpls = [...storefront.templates];
    newTpls[idx][field] = val;
    setStorefront({ ...storefront, templates: newTpls });
  };

  const handleTestimonialChange = (idx, field, val) => {
    const newTests = [...storefront.testimonials];
    newTests[idx][field] = val;
    setStorefront({ ...storefront, testimonials: newTests });
  };

  const handleTestimonialImageUpload = async (idx, file) => {
    if (!file) return;
    try {
      showToast("Uploading screenshot...", true);
      const res = await uploadImage(file);
      if (res.success) {
        handleTestimonialChange(idx, 'screenshotUrl', res.url);
        showToast("Screenshot uploaded successfully!", true);
      } else {
        showToast(res.message || "Upload failed", false);
      }
    } catch (err) {
      showToast("Upload failed", false);
    }
  };

  const handleTemplateImageUpload = async (idx, file) => {
    if (!file) return;
    try {
      showToast("Uploading template thumbnail...", true);
      const res = await uploadImage(file);
      if (res.success) {
        handleTemplateChange(idx, 'imageUrl', res.url);
        showToast("Template thumbnail uploaded successfully!", true);
      } else {
        showToast(res.message || "Upload failed", false);
      }
    } catch (err) {
      showToast("Upload failed", false);
    }
  };

  const addTemplate = () => {
    setStorefront({
      ...storefront,
      templates: [
        ...storefront.templates,
        { id: `c-${Date.now()}`, name: 'New Template', price: 'Rs. 750', category: 'valentine', tag: 'New', description: 'Description', emoji: '✨', gradient: 'from-gray-400 to-gray-500' }
      ]
    });
  };

  const addTestimonial = () => {
    setStorefront({
      ...storefront,
      testimonials: [
        ...storefront.testimonials,
        { name: 'New User', templateName: 'Custom', rating: 5, text: 'Great template!', avatar: '👤', screenshotUrl: '' }
      ]
    });
  };

  const removeTemplate = (idx) => {
    const newTpls = [...storefront.templates];
    newTpls.splice(idx, 1);
    setStorefront({ ...storefront, templates: newTpls });
  };

  const handleToggleTemplateStatus = async (idx) => {
    try {
      const template = storefront.templates[idx];
      const res = await toggleTemplateStatus(template.id);
      
      const newTpls = [...storefront.templates];
      newTpls[idx].isActive = res.data.isActive;
      setStorefront({ ...storefront, templates: newTpls });
      showToast(`Template ${res.data.isActive ? 'activated' : 'deactivated'} successfully!`, true);
    } catch (err) {
      showToast(`Failed to toggle template status: ${err.message}`, false);
    }
  };

  const removeTestimonial = (idx) => {
    const newTests = [...storefront.testimonials];
    newTests.splice(idx, 1);
    setStorefront({ ...storefront, testimonials: newTests });
  };

  const handleWipeDemos = async () => {
    if (!window.confirm('Are you sure you want to permanently delete ALL Demo sites?')) return;
    setWipingDemos(true);
    const demoSites = sites.filter(s => s.isDemoPreview);
    try {
      await Promise.all(demoSites.map(s => deleteSite(s.siteId)));
      showToast(`${demoSites.length} demo sites deleted!`, true);
      load();
    } catch (e) {
      showToast('Error wiping demo sites', false);
    }
    setWipingDemos(false);
  };

  const handleWipeClients = async () => {
    if (!window.confirm('Are you sure you want to permanently delete ALL Client sites (non-demo)?')) return;
    setWipingClients(true);
    const regularSites = sites.filter(s => !s.isDemoPreview);
    try {
      await Promise.all(regularSites.map(s => deleteSite(s.siteId)));
      showToast(`${regularSites.length} client sites deleted!`, true);
      load();
    } catch (e) {
      showToast('Error wiping client sites', false);
    }
    setWipingClients(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-900 dark:to-neutral-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-500 overflow-x-hidden relative">
      
      {/* Floating Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="fixed top-5 right-6 z-40 p-3 bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl shadow-black/5 rounded-full hover:scale-105 transition-transform"
      >
        {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}
      </button>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold backdrop-blur-xl border ${toast.ok ? 'bg-emerald-500/80 text-white border-emerald-400/50' : 'bg-red-500/80 text-white border-red-400/50'}`}
          >
            <CheckCircle2 size={16} />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white/50 dark:bg-black/40 backdrop-blur-xl border-b border-white/40 dark:border-white/10 shadow-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img loading="lazy" src="/logo.png" alt="EverWish Logo" className="w-10 h-10 rounded-2xl object-cover shadow-lg shadow-rose-500/20" />
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">EverWish</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Admin Portal</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-6 pt-6 relative z-10">
        <div className="flex gap-2 p-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl w-fit shadow-sm">
          <button 
            onClick={() => setActiveTab('sites')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'sites' ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <Users size={16} /> Client Sites
          </button>
          <button 
            onClick={() => setActiveTab('storefront')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'storefront' ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <Store size={16} /> Manage Storefront
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <ShoppingBag size={16} /> Orders Received
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {activeTab === 'sites' ? (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Client Sites</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Manage all active celebration websites</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button onClick={handleWipeDemos} disabled={wipingDemos} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 border border-slate-200 dark:border-white/10 transition shadow-sm bg-white/40 dark:bg-black/30 backdrop-blur-md whitespace-nowrap">
              {wipingDemos ? 'Wiping...' : 'Wipe Demos'}
            </button>
            <button onClick={handleWipeClients} disabled={wipingClients} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 border border-slate-200 dark:border-white/10 transition shadow-sm bg-white/40 dark:bg-black/30 backdrop-blur-md whitespace-nowrap">
              {wipingClients ? 'Wiping...' : 'Wipe Users'}
            </button>
            <div className="flex bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 p-1 rounded-2xl shadow-sm">
              <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow text-rose-600 dark:text-rose-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>
                <List size={18} />
              </button>
              <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow text-rose-600 dark:text-rose-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>
                <LayoutGrid size={18} />
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow-xl shadow-rose-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={16} strokeWidth={3} /> Create Site
            </button>
          </div>
        </motion.div>

        {/* Main Glassy Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl shadow-black/5 rounded-3xl p-6 md:p-8"
        >
          {/* Search */}
          <div className="relative mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clients…"
              className="w-full bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:bg-white/60 dark:focus:bg-white/10 focus:ring-2 focus:ring-rose-500/50 transition-all shadow-inner"
            />
          </div>

          {/* Sites list/grid */}
          {loading ? (
            /* ── Glassmorphic skeleton loaders ── */
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="group bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-pulse"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Left: icon + text lines */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100/70 dark:bg-rose-500/10 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-44 rounded-full bg-slate-200 dark:bg-slate-700" />
                      <div className="h-3 w-28 rounded-full bg-slate-100 dark:bg-slate-800" />
                      <div className="flex gap-3 mt-1">
                        <div className="h-3 w-24 rounded-full bg-slate-100 dark:bg-slate-800" />
                        <div className="h-3 w-24 rounded-full bg-slate-100 dark:bg-slate-800" />
                      </div>
                    </div>
                  </div>
                  {/* Right: status pill + action icons */}
                  <div className="flex items-center gap-3 ml-auto">
                    <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="flex gap-1.5">
                      {[1,2,3,4].map(j => (
                        <div key={j} className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-10">

              {/* ══ Section 1: Storefront Demos ═══════════════════════════ */}
              <div>
                <h3 className="text-xl font-black text-white/90 mb-5 flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 text-base">🌟</span>
                  Active Storefront Demos
                  {demoSites.length > 0 && (
                    <span className="ml-1 text-xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/20">
                      {demoSites.length}
                    </span>
                  )}
                </h3>

                {demoSites.length === 0 ? (
                  <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-dashed border-white/10 bg-white/5 text-white/30 text-sm font-medium">
                    <span className="opacity-50">✦</span>
                    {search ? 'No demos match your search.' : 'No active demos set — click the ⭐ star icon on a site to promote it.'}
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {demoSites.map((site, idx) => {
                      const status = calculateStatus(site.isActive, site.expiresAt, site.isDemoPreview);
                      return (
                        <motion.div
                          key={site.siteId}
                          initial={{ opacity: 0, scale: viewMode === 'grid' ? 0.95 : 1, y: viewMode === 'list' ? 10 : 0 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`group bg-amber-500/5 border border-amber-400/20 hover:border-amber-400/50 rounded-3xl p-5 flex transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/10 hover:-translate-y-1 ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row md:items-center justify-between gap-6'}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/30 to-amber-300/10 border border-amber-400/30 flex-shrink-0 flex items-center justify-center text-xl shadow-sm">
                              ⭐
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-white text-base truncate">
                                {site.general?.coupleName || site.siteId}
                              </p>
                              <p className="text-xs text-amber-300/70 mt-1 mb-2 font-mono tracking-tight flex flex-wrap items-center gap-2 truncate">
                                <span>/{site.siteId}</span>
                                <span className="px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-[9px] uppercase tracking-wider text-amber-300 font-bold">
                                  Template: {site.templateType || 'polaroid'}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
                                  <Star size={9} className="fill-amber-400" /> Active Demo
                                </span>
                              </p>
                              <div className={`flex gap-3 text-[11px] text-slate-500 dark:text-slate-400 ${viewMode === 'list' ? 'items-center' : 'flex-col'}`}>
                                <span><strong className="font-semibold text-slate-600 dark:text-slate-300">Created On:</strong> {formatDate(site.createdAt)}</span>
                                {viewMode === 'list' && <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />}
                                {(() => {
                                  const expInfo = getExpirationInfo(site.createdAt, site.expiresAt, site.isDemoPreview);
                                  if (!expInfo.date) return null;
                                  return (
                                    <span className={expInfo.isUrgent ? 'text-red-500 font-bold' : ''}>
                                      <strong className={`font-semibold ${expInfo.isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}`}>Expires On:</strong> {formatDate(expInfo.date)}
                                    </span>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>

                          <div className={`flex items-center gap-3 mt-4 md:mt-0 ${viewMode === 'grid' ? 'pt-4 border-t border-amber-400/10 justify-between' : ''}`}>
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-extrabold shadow-sm ${status.color}`}>
                              {status.text}
                            </span>
                            <div className="flex items-center gap-1.5 ml-auto md:ml-0">
                              <button onClick={() => handleSetDemo(site._id)} title="Active Demo" className="p-2 rounded-xl transition shadow-sm border text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 cursor-default">
                                <Star size={16} className="fill-current" />
                              </button>
                              <button onClick={() => handleCopyLink(site.siteId)} title="Copy Public Link" className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <Copy size={16} />
                              </button>
                              <button onClick={() => handleToggleStatus(site.siteId, site.isActive)} title={site.isActive ? 'Deactivate Site' : 'Activate Site'} className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                {site.isActive !== false ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} />}
                              </button>
                              <button onClick={() => nav(`/admin/edit/${site.siteId}`)} title="Edit Site" className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <Edit3 size={16} />
                              </button>
                              <button onClick={() => setDeleteModal({ isOpen: true, siteId: site.siteId })} title="Delete Site" className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition shadow-sm border border-transparent hover:border-red-200 dark:hover:border-red-900">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Visual divider ─────────────────────────────────────── */}
              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <span className="text-white/20 text-xs font-bold uppercase tracking-[0.3em] select-none">Client Sites</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </div>

              {/* ══ Section 2: Regular Client Orders ══════════════════════ */}
              <div>
                <h3 className="text-xl font-black text-white/90 mb-5 flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 text-base">👥</span>
                  Client Orders
                  {regularSites.length > 0 && (
                    <span className="ml-1 text-xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/20">
                      {regularSites.length}
                    </span>
                  )}
                </h3>

                {regularSites.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 bg-white/20 dark:bg-black/20 rounded-3xl">
                    <AlertCircle size={32} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-medium">{search ? 'No clients match your search.' : 'No client sites yet. Create one above!'}</p>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {regularSites.map((site, idx) => {
                      const status = calculateStatus(site.isActive, site.expiresAt, site.isDemoPreview);
                      return (
                        <motion.div
                          key={site.siteId}
                          initial={{ opacity: 0, scale: viewMode === 'grid' ? 0.95 : 1, y: viewMode === 'list' ? 10 : 0 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`group bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-3xl p-5 flex transition-all duration-300 hover:shadow-lg shadow-black/5 hover:-translate-y-1 hover:border-rose-300 dark:hover:border-rose-500/30 ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row md:items-center justify-between gap-6'}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-500/20 dark:to-rose-500/5 border border-rose-200 dark:border-rose-500/20 flex-shrink-0 flex items-center justify-center text-xl shadow-sm">
                              💌
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white text-base truncate">
                                {site.general?.coupleName || site.siteId}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2 font-mono tracking-tight flex items-center gap-2 truncate">
                                <span>/{site.siteId}</span>
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                                  Template: {site.templateType || 'polaroid'}
                                </span>
                              </p>
                              <div className={`flex gap-3 text-[11px] text-slate-500 dark:text-slate-400 ${viewMode === 'list' ? 'items-center' : 'flex-col'}`}>
                                <span><strong className="font-semibold text-slate-600 dark:text-slate-300">Created On:</strong> {formatDate(site.createdAt)}</span>
                                {viewMode === 'list' && <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />}
                                {(() => {
                                  const expInfo = getExpirationInfo(site.createdAt, site.expiresAt, site.isDemoPreview);
                                  if (!expInfo.date) return null;
                                  return (
                                    <span className={expInfo.isUrgent ? 'text-red-500 font-bold' : ''}>
                                      <strong className={`font-semibold ${expInfo.isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}`}>Expires On:</strong> {formatDate(expInfo.date)}
                                    </span>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>

                          <div className={`flex items-center gap-3 mt-4 md:mt-0 ${viewMode === 'grid' ? 'pt-4 border-t border-slate-200 dark:border-slate-800 justify-between' : ''}`}>
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-extrabold shadow-sm ${status.color}`}>
                              {status.text}
                            </span>
                            <div className="flex items-center gap-1.5 ml-auto md:ml-0">
                              <button onClick={() => handleSetDemo(site._id)} title="Set as Demo" className="p-2 rounded-xl transition shadow-sm border text-slate-500 dark:text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 border-transparent hover:border-amber-200">
                                <Star size={16} />
                              </button>
                              <button onClick={() => handleCopyLink(site.siteId)} title="Copy Public Link" className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <Copy size={16} />
                              </button>
                              <button onClick={() => handleToggleStatus(site.siteId, site.isActive)} title={site.isActive ? 'Deactivate Site' : 'Activate Site'} className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                {site.isActive !== false ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} />}
                              </button>
                              <button onClick={() => nav(`/admin/edit/${site.siteId}`)} title="Edit Site" className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <Edit3 size={16} />
                              </button>
                              <button onClick={() => setDeleteModal({ isOpen: true, siteId: site.siteId })} title="Delete Site" className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition shadow-sm border border-transparent hover:border-red-200 dark:hover:border-red-900">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}
        </motion.div>
      </>
    ) : activeTab === 'orders' ? (
      /* ──── ORDERS RECEIVED ─────────────────────────────────── */
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Orders Received</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Customer submissions from the Order Form</p>
          </div>
          <button onClick={loadOrders} className="flex items-center gap-2 bg-white/50 dark:bg-black/30 border border-white/60 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold px-5 py-2.5 rounded-2xl text-sm hover:bg-white/80 dark:hover:bg-white/10 transition">
            <Loader2 size={14} className={ordersLoading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        <div className="bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl shadow-black/5 rounded-3xl overflow-hidden">
          {ordersLoading ? (
            <div className="space-y-3 p-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-24 text-slate-500 dark:text-slate-400">
              <ShoppingBag size={36} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm font-medium">No orders yet. Share your store link to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 bg-white/30 dark:bg-white/5">
                    {['Order ID', 'Customer', 'Template', 'Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-5 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {orders.map((order) => {
                    const statusColors = {
                      pending:     'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20',
                      in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
                      completed:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
                      cancelled:   'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700',
                    };
                    return (
                      <tr key={order._id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs font-bold text-rose-600 dark:text-rose-400">{order.orderId}</td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800 dark:text-white text-sm">{order.customerName}</p>
                          <p className="text-slate-400 text-xs font-mono">{order.customerPhone}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-700 dark:text-slate-200 text-xs">{order.templateName || order.templateId}</p>
                          <p className="text-slate-400 text-[10px] uppercase tracking-widest">{order.category}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">{formatDate(order.createdAt)}</td>
                        <td className="px-5 py-4">
                          <div className="relative inline-block">
                            <select
                              value={order.status}
                              onChange={async (e) => {
                                await updateOrderStatus(order.orderId, e.target.value);
                                setOrders(prev => prev.map(o => o.orderId === order.orderId ? { ...o, status: e.target.value } : o));
                                showToast('Status updated!');
                              }}
                              className={`appearance-none pr-8 pl-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest cursor-pointer outline-none transition-all ${statusColors[order.status]}`}
                            >
                              <option value="pending" className="bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400">Pending</option>
                              <option value="in_progress" className="bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400">In Progress</option>
                              <option value="completed" className="bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400">Completed</option>
                              <option value="cancelled" className="bg-white dark:bg-slate-900 text-neutral-500 dark:text-neutral-400">Cancelled</option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                              <ChevronDown size={12} />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-2 rounded-xl transition hover:border-rose-300 dark:hover:border-rose-500/30"
                          >
                            <Eye size={13} /> View Assets
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    ) : (
      /* STOREFRONT MANAGEMENT UI */
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Storefront Content</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Dynamically manage templates and testimonials</p>
          </div>
          <button
            onClick={handleSaveStorefront}
            disabled={savingStorefront}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {savingStorefront ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* Templates Editor */}
          <div className="bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl shadow-black/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><LayoutGrid className="text-rose-500" /> Templates</h3>
              <button onClick={addTemplate} className="text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-3 py-1.5 rounded-xl transition">
                + Add New
              </button>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {storefront.templates?.map((tpl, i) => (
                <div key={i} className="bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-3 relative group">
                  <button onClick={() => removeTemplate(i)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500">Name</label>
                      <input value={tpl.name || ''} onChange={e => handleTemplateChange(i, 'name', e.target.value)} className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500">ID / Route</label>
                      <input value={tpl.id || ''} onChange={e => handleTemplateChange(i, 'id', e.target.value)} className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500">Category</label>
                      <select value={tpl.category || 'valentine'} onChange={e => handleTemplateChange(i, 'category', e.target.value)} className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm">
                        <option value="valentine">Valentine & Proposal</option>
                        <option value="birthday">Birthday</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500">Price</label>
                      <input value={tpl.price || ''} onChange={e => handleTemplateChange(i, 'price', e.target.value)} className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500">Tag / Badge</label>
                      <input value={tpl.tag || ''} onChange={e => handleTemplateChange(i, 'tag', e.target.value)} className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500">Emoji & Gradient</label>
                      <div className="flex gap-2">
                        <input value={tpl.emoji || '✨'} onChange={e => handleTemplateChange(i, 'emoji', e.target.value)} className="w-12 text-center bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-2 py-2 text-sm" title="Emoji" />
                        <input value={tpl.gradient || 'from-gray-400 to-gray-500'} onChange={e => handleTemplateChange(i, 'gradient', e.target.value)} className="flex-1 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm" title="Tailwind Gradient Classes" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Live Animated Thumbnail (Overrides Emoji)</label>
                    <div className="flex items-center gap-3">
                      {tpl.imageUrl ? (
                        <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-black/5 flex-shrink-0 group/img">
                          <img loading="lazy" src={tpl.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => handleTemplateChange(i, 'imageUrl', '')}
                            className="absolute inset-0 bg-black/70 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-24 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 transition-colors cursor-pointer bg-white/30 dark:bg-black/10 flex-shrink-0">
                          <Upload size={16} className="text-slate-400" />
                          <span className="text-[9px] font-bold text-slate-500 mt-0.5">Upload</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => handleTemplateImageUpload(i, e.target.files[0])} 
                            className="hidden" 
                          />
                        </label>
                      )}
                      <div className="flex-1 text-xs text-slate-500">
                        Upload a screenshot of the first page to create a live animated preview card.
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500">Description</label>
                    <textarea value={tpl.description} onChange={e => handleTemplateChange(i, 'description', e.target.value)} rows={2} className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm" />
                  </div>
                  
                  {/* Template Activation Toggle */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10 mt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Active on Storefront</span>
                    <button
                      onClick={() => handleToggleTemplateStatus(i)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tpl.isActive !== false ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                      <motion.span
                        layout
                        animate={{ x: tpl.isActive !== false ? 22 : 2 }}
                        transition={{ type: "spring", stiffness: 700, damping: 30 }}
                        className="inline-block h-5 w-5 transform rounded-full bg-white shadow-md"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Editor */}
          <div className="bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl shadow-black/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><Star className="text-amber-500" /> Testimonials</h3>
              <button onClick={addTestimonial} className="text-sm font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 px-3 py-1.5 rounded-xl transition">
                + Add Feedback
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {storefront.testimonials?.map((test, i) => (
                <div key={i} className="bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-3 relative group">
                  <button onClick={() => removeTestimonial(i)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500">Customer Name</label>
                      <input value={test.name} onChange={e => handleTestimonialChange(i, 'name', e.target.value)} className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500">Template Used</label>
                      <input value={test.templateName} onChange={e => handleTestimonialChange(i, 'templateName', e.target.value)} className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500">Review Text</label>
                    <textarea value={test.text} onChange={e => handleTestimonialChange(i, 'text', e.target.value)} rows={3} className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Proof Screenshot (Chat / Review)</label>
                    <div className="flex items-center gap-3">
                      {test.screenshotUrl ? (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-black/5 flex-shrink-0 group/img">
                          <img loading="lazy" src={test.screenshotUrl} alt="Proof" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => handleTestimonialChange(i, 'screenshotUrl', '')}
                            className="absolute inset-0 bg-black/70 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 transition-colors cursor-pointer bg-white/30 dark:bg-black/10 flex-shrink-0">
                          <Upload size={16} className="text-slate-400" />
                          <span className="text-[9px] font-bold text-slate-500 mt-0.5">Upload</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => handleTestimonialImageUpload(i, e.target.files[0])} 
                            className="hidden" 
                          />
                        </label>
                      )}
                      <div className="flex-1 text-xs text-slate-500 leading-normal">
                        {test.screenshotUrl ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">✓ Screenshot Linked</span>
                        ) : (
                          <span>Upload a chat screenshot as proof.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </motion.div>
    )}
      </main>

      {/* Creation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-2xl shadow-black/20"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">New Client Site</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Site ID (URL Slug)</label>
                  <input
                    value={newId}
                    onChange={e => setNewId(e.target.value)}
                    placeholder="e.g. maleesha-charu"
                    className="w-full bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white/60 dark:focus:bg-white/20 focus:ring-2 focus:ring-rose-500/50 shadow-inner transition"
                  />
                  <p className="text-[11px] text-slate-500 mt-2 ml-1">Spaces are auto-converted to dashes.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Category</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setCategory('valentine'); setTemplateType('polaroid'); }} 
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${category === 'valentine' ? 'bg-rose-500 text-white' : 'bg-white/40 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400'}`}
                    >
                      Valentine / Proposal
                    </button>
                    <button 
                      onClick={() => { setCategory('birthday'); setTemplateType('bday1'); }} 
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${category === 'birthday' ? 'bg-amber-500 text-white' : 'bg-white/40 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400'}`}
                    >
                      Birthday
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Template Type</label>
                  <select
                    value={templateType}
                    onChange={e => setTemplateType(e.target.value)}
                    className="w-full bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:bg-white/60 dark:focus:bg-white/20 focus:ring-2 focus:ring-rose-500/50 shadow-inner transition appearance-none"
                  >
                    {category === 'valentine' ? (
                      <>
                        <option value="polaroid">Template 1 - Polaroid (Original)</option>
                        <option value="modern">Template 2 - Modern</option>
                        <option value="valentine">Template 3 - Valentine (Interactive)</option>
                        <option value="proposal">Template 4 - Proposal (Interactive)</option>
                        <option value="custom">Template 5 - Custom (Mix &amp; Match)</option>
                        <option value="cinematic">Template 6 - Cinematic Anniversary</option>
                      </>
                    ) : (
                      <>
                        <option value="bday1">Birthday Template 1 - The Unwrapping</option>
                        <option value="bday2">Birthday Template 2 - The Balloon Pop</option>
                        <option value="bday3">Birthday Template 3 - The Card Flip</option>
                        <option value="bday4">Birthday Template 4 - The Surprise Party</option>
                        <option value="bday5">Birthday Template 5 - Cinematic Birthday</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newId.trim() || creating}
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow-xl shadow-rose-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} strokeWidth={3} />}
                  Create Site
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task 4: Custom Delete Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl shadow-black/20 text-center"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Permanently?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-900 dark:text-white">/{deleteModal.siteId}</strong>? This action will completely erase the site and cannot be undone.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmDelete}
                  disabled={deleting === deleteModal.siteId}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {deleting === deleteModal.siteId ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Delete Permanently
                </button>
                <button
                  onClick={() => setDeleteModal({ isOpen: false, siteId: null })}
                  disabled={deleting === deleteModal.siteId}
                  className="w-full px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── Asset Viewer Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[2rem] p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Order Assets</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{selectedOrder.orderId} · {selectedOrder.customerName}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 transition">
                  <X size={18} />
                </button>
              </div>

              {/* Form Data */}
              <div className="mb-6">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3">Form Data</h4>
                <div className="space-y-2">
                  {Object.entries(selectedOrder.formData || {}).map(([key, val]) => (
                    <div key={key} className="flex gap-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 capitalize flex-shrink-0">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-sm text-slate-800 dark:text-white break-all">
                        {Array.isArray(val) ? val.join(' · ') : String(val || '—')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery Images */}
              {selectedOrder.images?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3">Gallery Photos ({selectedOrder.images.length})</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedOrder.images.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block">
                        <img loading="lazy" src={url} alt={`Photo ${i+1}`} className="w-full h-28 object-cover rounded-2xl border border-slate-200 dark:border-white/10 hover:scale-105 transition-transform" loading="lazy" decoding="async" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio */}
              {selectedOrder.audioUrl && (
                <div className="mb-6">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3">Background Music</h4>
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3">
                    <Music size={16} className="text-rose-400 flex-shrink-0" />
                    <a href={selectedOrder.audioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-rose-500 hover:text-rose-700 underline truncate">
                      {selectedOrder.audioUrl}
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
