// OrderForm.jsx — Simplified Dynamic Order Form page (/order/:templateId)
// Collects customer name and WhatsApp, persists the order, then redirects to WhatsApp for media collection.

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Loader2, CheckCircle2, AlertCircle, ArrowLeft, Send
} from 'lucide-react';
import { createOrder } from '../api';

// ── WhatsApp Business number (country code, no +) ────────────────
const WA_NUMBER = '94712000590';

// ── Template metadata map ────────────────────────────────────────
const TEMPLATE_META = {
  v1: { name: 'The Polaroid Love Story',     category: 'valentine', emoji: '📸', price: 'Rs. 750' },
  v2: { name: 'The Modern Romance',          category: 'valentine', emoji: '💫', price: 'Rs. 750' },
  v3: { name: 'The Valentine Experience',    category: 'valentine', emoji: '💝', price: 'Rs. 750' },
  v4: { name: 'The Proposal Suite',          category: 'valentine', emoji: '💍', price: 'Rs. 750' },
  v5: { name: 'The Cinematic Anniversary',   category: 'valentine', emoji: '🎬', price: 'Rs. 750' },
  b1: { name: 'The Unwrapping Experience',   category: 'birthday',  emoji: '🎁', price: 'Rs. 750' },
  b2: { name: 'The Balloon Pop',             category: 'birthday',  emoji: '🎈', price: 'Rs. 750' },
  b3: { name: 'The Card Flip',               category: 'birthday',  emoji: '🃏', price: 'Rs. 750' },
  b4: { name: 'The Surprise Party',          category: 'birthday',  emoji: '🎉', price: 'Rs. 750' },
  b5: { name: 'The Cinematic Birthday',       category: 'birthday',  emoji: '🎬', price: 'Rs. 750' },
  'custom-design': { name: 'Fully Custom Design', category: 'valentine', emoji: '✦', price: 'Rs. 750 + Custom Quote' },
};

// ── Shared styled input ──────────────────────────────────────────
const inputCls = 'w-full bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:bg-white/20 transition-all backdrop-blur-sm';
const labelCls = 'block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5';

// ── Main OrderForm ────────────────────────────────────────────────
export default function OrderForm() {
  const { templateId } = useParams();
  const meta = TEMPLATE_META[templateId];

  const [form, setForm] = useState({
    customerName:   '',
    customerPhone:  '',
  });

  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  // ── Form submission ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.customerName.trim() || !form.customerPhone.trim()) {
      setError('Please fill in your name and WhatsApp number.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await createOrder({
        customerName:  form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        templateId,
        templateName:  meta?.name || templateId,
        category:      meta?.category || 'valentine',
        formData:      {}, // Omit dynamic fields
        images:        [], // Omit images
        audioUrl:      '', // Omit audio
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
        `Hello EverWish! ✨ I just placed a new order.\n\n` +
        `*Order ID:* ${orderId}\n` +
        `*Template:* ${meta?.name || templateId}\n` +
        `*Name:* ${form.customerName.trim()}\n\n` +
        `I am ready to send my photos, music, and details for this template here!`
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
            We're redirecting you to WhatsApp. You can send your photos and details there!
          </p>
          <div className="flex items-center gap-2 text-white/50 text-xs">
            <Loader2 size={14} className="animate-spin" />
            Redirecting to WhatsApp…
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 py-10 px-4">
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
              <p className="text-xs text-slate-500 mt-1.5">We'll contact you here to collect your photos and details.</p>
            </div>
          </div>

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
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-60 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-rose-500/30 text-base transition-all"
          >
            {submitting ? (
              <><Loader2 size={18} className="animate-spin" /> Placing your order…</>
            ) : (
              <><Send size={18} /> Place Order & Send Media via WhatsApp</>
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
