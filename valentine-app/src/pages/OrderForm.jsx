// OrderForm.jsx — Dynamic Order Form page (/order/:templateId)
// Collects customer info + conditional inputs based on template category,
// uploads media to Cloudinary, persists the order, then redirects to WhatsApp.

import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, Music, Image as ImageIcon, Plus, Trash2,
  Loader2, CheckCircle2, AlertCircle, ArrowLeft, Send, ChevronRight
} from 'lucide-react';
import { uploadImage, createOrder } from '../api';

// ── WhatsApp Business number (country code, no +) ────────────────
const WA_NUMBER = '94712000590';

// ── Template metadata map ────────────────────────────────────────
const TEMPLATE_META = {
  v1: { name: 'The Polaroid Love Story',     category: 'valentine', emoji: '📸', price: 'Rs. 2,500' },
  v2: { name: 'The Modern Romance',          category: 'valentine', emoji: '💫', price: 'Rs. 2,500' },
  v3: { name: 'The Valentine Experience',    category: 'valentine', emoji: '💝', price: 'Rs. 3,000' },
  v4: { name: 'The Proposal Suite',          category: 'valentine', emoji: '💍', price: 'Rs. 3,500' },
  b1: { name: 'The Unwrapping Experience',   category: 'birthday',  emoji: '🎁', price: 'Rs. 2,500' },
  b2: { name: 'The Balloon Pop',             category: 'birthday',  emoji: '🎈', price: 'Rs. 2,500' },
  b3: { name: 'The Card Flip',               category: 'birthday',  emoji: '🃏', price: 'Rs. 2,500' },
  b4: { name: 'The Surprise Party',          category: 'birthday',  emoji: '🎉', price: 'Rs. 3,000' },
};

// ── Shared styled input / textarea ───────────────────────────────
const inputCls = 'w-full bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:bg-white/20 transition-all backdrop-blur-sm';
const labelCls = 'block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5';

// ── Upload overlay ────────────────────────────────────────────────
function UploadOverlay({ uploading, progress }) {
  return (
    <AnimatePresence>
      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-10 flex flex-col items-center gap-5 max-w-xs w-full mx-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 size={44} className="text-rose-400" />
            </motion.div>
            <p className="text-white font-bold text-base">Uploading your files…</p>
            <p className="text-white/60 text-xs text-center">Please don't close this page.<br />This may take a moment.</p>
            {progress > 0 && (
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-full bg-rose-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Multi-image upload field ──────────────────────────────────────
function ImageUploadField({ label, uploadedUrls, onAdd, onRemove, uploading }) {
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      await onAdd(file);
    }
    e.target.value = '';
  };

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="space-y-2">
        {uploadedUrls.map((url, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-2">
            <img src={url} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" loading="lazy" decoding="async" />
            <span className="flex-1 text-xs text-slate-400 truncate">Photo {i + 1} uploaded ✓</span>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-slate-400 hover:text-red-400 transition-colors p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-white/20 hover:border-rose-400/60 rounded-2xl py-4 cursor-pointer transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <ImageIcon size={16} className="text-slate-400" />
          <span className="text-sm text-slate-400 font-medium">Click to add photos</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}

// ── Reasons Jar dynamic list ──────────────────────────────────────
function ReasonsList({ reasons, onChange }) {
  const add = () => onChange([...reasons, '']);
  const update = (i, v) => {
    const next = [...reasons]; next[i] = v; onChange(next);
  };
  const remove = (i) => onChange(reasons.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className={labelCls}>💌 Reasons Jar — Why do you love them?</label>
      <p className="text-xs text-slate-400 mb-3">Add up to 20 short reasons. Each becomes a paper slip in the Love Jar.</p>
      <div className="space-y-2 mb-3">
        {reasons.map((r, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={r}
              onChange={e => update(i, e.target.value)}
              placeholder={`Reason ${i + 1}…`}
              className={inputCls + ' flex-1'}
            />
            <button type="button" onClick={() => remove(i)} className="p-2.5 text-slate-400 hover:text-red-400 bg-white/10 border border-white/20 rounded-xl transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      {reasons.length < 20 && (
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/20 px-4 py-2 rounded-xl transition-all"
        >
          <Plus size={14} /> Add a reason
        </button>
      )}
    </div>
  );
}

// ── Main OrderForm ────────────────────────────────────────────────
export default function OrderForm() {
  const { templateId } = useParams();
  const meta = TEMPLATE_META[templateId];

  const [form, setForm] = useState({
    customerName:   '',
    customerPhone:  '',
    // Valentine-specific
    initials:       '',
    reasons:        [''],
    // Birthday-specific
    recipientAge:   '',
    birthDate:      '',
    birthdayWish:   '',
  });

  const [galleryUrls, setGalleryUrls]   = useState([]);
  const [audioUrl, setAudioUrl]         = useState('');
  const [uploading, setUploading]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  // ── Upload helpers ─────────────────────────────────────────────
  const handleImageAdd = useCallback(async (file) => {
    setUploading(true);
    try {
      const res = await uploadImage(file);
      if (res.success) setGalleryUrls(prev => [...prev, res.url]);
      else setError(res.message || 'Image upload failed.');
    } catch {
      setError('Image upload failed. Please try again.');
    }
    setUploading(false);
  }, []);

  const handleImageRemove = (i) => setGalleryUrls(prev => prev.filter((_, idx) => idx !== i));

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(10);
    try {
      const res = await uploadImage(file);
      setUploadProgress(90);
      if (res.success) { setAudioUrl(res.url); setUploadProgress(100); }
      else setError(res.message || 'Audio upload failed.');
    } catch {
      setError('Audio upload failed. Please try again.');
    }
    setUploading(false);
    setUploadProgress(0);
  };

  // ── Form submission ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.customerName.trim() || !form.customerPhone.trim()) {
      setError('Please fill in your name and WhatsApp number.');
      return;
    }

    setSubmitting(true);

    const formData = meta?.category === 'birthday'
      ? { recipientAge: form.recipientAge, birthDate: form.birthDate, birthdayWish: form.birthdayWish }
      : { initials: form.initials, reasons: form.reasons.filter(r => r.trim()) };

    try {
      const res = await createOrder({
        customerName:  form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        templateId,
        templateName:  meta?.name || templateId,
        category:      meta?.category || 'valentine',
        formData,
        images:  galleryUrls,
        audioUrl,
      });

      if (!res.success) {
        setError(res.message || 'Failed to place order. Please try again.');
        setSubmitting(false);
        return;
      }

      setSuccess(true);

      // ── WhatsApp redirect notification ──────────────────────────
      const { orderId } = res.data;
      const waText = encodeURIComponent(
        `Hello EverWish! 🎉 I just placed a new order.\n\n` +
        `🔖 Order ID: ${orderId}\n` +
        `🎨 Template: ${meta?.name || templateId} ${meta?.emoji || ''}\n` +
        `👤 Name: ${form.customerName.trim()}\n` +
        `📱 Phone: ${form.customerPhone.trim()}\n\n` +
        `Please review my submission in the dashboard! 🙏`
      );

      setTimeout(() => {
        window.location.href = `https://wa.me/${WA_NUMBER}?text=${waText}`;
      }, 1500);

    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  // ── Unknown template ───────────────────────────────────────────
  if (!meta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6 bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="text-5xl">🤔</div>
        <h1 className="text-2xl font-bold text-rose-700">Template not found</h1>
        <Link to="/" className="text-rose-500 underline text-sm">← Back to store</Link>
      </div>
    );
  }

  // ── Success overlay ────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="flex flex-col items-center gap-5 bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-10 max-w-sm w-full text-center"
        >
          <CheckCircle2 size={56} className="text-emerald-400" />
          <h2 className="text-2xl font-black text-white">Order Placed! 🎉</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            We're redirecting you to WhatsApp to notify our team. They'll get started on your template right away!
          </p>
          <div className="flex items-center gap-2 text-white/50 text-xs">
            <Loader2 size={14} className="animate-spin" />
            Redirecting to WhatsApp…
          </div>
        </motion.div>
      </div>
    );
  }

  const isBirthday = meta.category === 'birthday';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 py-10 px-4">
      <UploadOverlay uploading={uploading} progress={uploadProgress} />

      <div className="max-w-lg mx-auto">

        {/* ── Back link ─────────────────────────────────────────── */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-xs font-bold uppercase tracking-widest mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to store
        </Link>

        {/* ── Header card ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-2xl shadow-xl shadow-rose-500/30 flex-shrink-0">
              {meta.emoji}
            </div>
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-0.5">You're ordering</p>
              <h1 className="text-white font-black text-lg leading-tight">{meta.name}</h1>
              <p className="text-rose-400 font-extrabold text-sm mt-0.5">{meta.price}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Form ──────────────────────────────────────────────── */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* ── Section: Your Info ─────────────────────────────── */}
          <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6 space-y-4">
            <h2 className="text-white font-black text-base flex items-center gap-2">
              <User size={16} className="text-rose-400" /> Your Details
            </h2>
            <div>
              <label className={labelCls}>Your Full Name</label>
              <input
                required
                value={form.customerName}
                onChange={e => set('customerName', e.target.value)}
                placeholder="e.g. Charu Perera"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>WhatsApp Number <span className="text-rose-400">*</span></label>
              <input
                required
                value={form.customerPhone}
                onChange={e => set('customerPhone', e.target.value)}
                placeholder="e.g. +94 71 234 5678"
                className={inputCls}
                type="tel"
              />
              <p className="text-xs text-slate-500 mt-1.5">We'll contact you here for updates.</p>
            </div>
          </div>

          {/* ── Section: Music ────────────────────────────────── */}
          <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6 space-y-4">
            <h2 className="text-white font-black text-base flex items-center gap-2">
              <Music size={16} className="text-rose-400" /> Background Music
            </h2>
            <div>
              <label className={labelCls}>Upload Audio File (MP3 / M4A)</label>
              {audioUrl ? (
                <div className="flex items-center gap-3 bg-white/10 border border-emerald-400/30 rounded-2xl px-4 py-3">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-emerald-300 font-medium flex-1 truncate">Audio uploaded successfully ✓</span>
                  <button type="button" onClick={() => setAudioUrl('')} className="text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-white/20 hover:border-rose-400/60 rounded-2xl py-4 cursor-pointer transition-colors">
                  <Music size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-400 font-medium">Click to upload music</span>
                  <input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} disabled={uploading} />
                </label>
              )}
              <p className="text-xs text-slate-500 mt-1.5">Optional. Plays automatically when the page opens.</p>
            </div>
          </div>

          {/* ── Section: Birthday fields ─────────────────────── */}
          {isBirthday && (
            <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6 space-y-4">
              <h2 className="text-white font-black text-base flex items-center gap-2">
                🎂 Birthday Details
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Recipient Age</label>
                  <input
                    value={form.recipientAge}
                    onChange={e => set('recipientAge', e.target.value)}
                    placeholder="e.g. 25"
                    type="number"
                    min="1"
                    max="120"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Birthday Date</label>
                  <input
                    value={form.birthDate}
                    onChange={e => set('birthDate', e.target.value)}
                    type="date"
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Main Birthday Wish</label>
                <textarea
                  value={form.birthdayWish}
                  onChange={e => set('birthdayWish', e.target.value)}
                  placeholder="Write a heartfelt wish for the birthday person…"
                  rows={4}
                  className={inputCls + ' resize-none'}
                />
              </div>
              <ImageUploadField
                label="🖼️ Gallery Photos (upload up to 12)"
                uploadedUrls={galleryUrls}
                onAdd={handleImageAdd}
                onRemove={handleImageRemove}
                uploading={uploading}
              />
            </div>
          )}

          {/* ── Section: Valentine fields ─────────────────────── */}
          {!isBirthday && (
            <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6 space-y-5">
              <h2 className="text-white font-black text-base flex items-center gap-2">
                💕 Valentine Details
              </h2>
              <div>
                <label className={labelCls}>Couple Initials</label>
                <input
                  value={form.initials}
                  onChange={e => set('initials', e.target.value)}
                  placeholder="e.g. A & B"
                  className={inputCls}
                />
                <p className="text-xs text-slate-500 mt-1.5">Displayed on the Love Lock and ring box.</p>
              </div>
              <ReasonsList
                reasons={form.reasons}
                onChange={v => set('reasons', v)}
              />
              <ImageUploadField
                label="🖼️ Couples Gallery Photos"
                uploadedUrls={galleryUrls}
                onAdd={handleImageAdd}
                onRemove={handleImageRemove}
                uploading={uploading}
              />
            </div>
          )}

          {/* ── Error message ──────────────────────────────────── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3"
              >
                <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Submit button ──────────────────────────────────── */}
          <motion.button
            type="submit"
            disabled={submitting || uploading}
            whileHover={{ scale: submitting || uploading ? 1 : 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-60 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-rose-500/30 text-base transition-all"
          >
            {submitting ? (
              <><Loader2 size={18} className="animate-spin" /> Placing your order…</>
            ) : (
              <><Send size={18} /> Place Order & Notify via WhatsApp</>
            )}
          </motion.button>

          <p className="text-center text-white/30 text-xs pb-6">
            By submitting, you agree to be contacted via WhatsApp regarding your order.
          </p>
        </motion.form>
      </div>
    </div>
  );
}
