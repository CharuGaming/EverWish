// PreviewModal.jsx – Mobile-frame preview modal for template demos
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Smartphone } from 'lucide-react';

// Template id → friendly name (for the WhatsApp message)
const TEMPLATE_NAMES = {
  v1: 'The Polaroid Love Story',
  v2: 'The Modern Romance',
  v3: 'The Valentine Experience',
  v4: 'The Proposal Suite',
  b1: 'The Unwrapping Experience',
  b2: 'The Balloon Pop',
  b3: 'The Card Flip',
  b4: 'The Surprise Party',
};

const TEMPLATE_PRICES = {
  v1: 'Rs. 2,500', v2: 'Rs. 2,500', v3: 'Rs. 3,000', v4: 'Rs. 3,500',
  b1: 'Rs. 2,500', b2: 'Rs. 2,500', b3: 'Rs. 2,500', b4: 'Rs. 3,000',
};

export default function PreviewModal({ isOpen, templateId, whatsappNumber, onClose }) {
  const name   = TEMPLATE_NAMES[templateId]  || 'this template';
  const price  = TEMPLATE_PRICES[templateId] || '';
  const demoUrl = `/demo/${templateId}?demo=1`;
  const waUrl   = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello! I'd like to purchase the *${name}* template on EverWish. 😊`
  )}`;

  // Reset iframe load state whenever a new template is opened
  const [iframeLoaded, setIframeLoaded] = useState(false);
  useEffect(() => { if (isOpen) setIframeLoaded(false); }, [isOpen, templateId]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="preview-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* ── Layout column: close • phone • buy ── */}
          <motion.div
            key="preview-content"
            initial={{ scale: 0.9, opacity: 0, y: 24 }}
            animate={{ scale: 1,   opacity: 1, y: 0  }}
            exit={{ scale: 0.9,   opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4"
          >
            {/* ── Header row: title + close ── */}
            <div className="flex items-center justify-between w-full max-w-[375px]">
              <div className="flex items-center gap-2 text-white">
                <Smartphone size={16} className="opacity-70" />
                <span className="text-sm font-bold opacity-90">{name}</span>
                {price && (
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
                    {price}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
                aria-label="Close preview"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Mobile phone frame ── */}
            <div
              className="relative bg-neutral-900 rounded-[3rem] shadow-2xl overflow-hidden flex-shrink-0"
              style={{
                width: 'min(375px, calc(100vw - 32px))',
                height: 'min(812px, calc(100svh - 160px))',
                border: '8px solid #1c1c1c',
                boxShadow: '0 0 0 1px #333, 0 40px 80px rgba(0,0,0,0.8)',
              }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-neutral-900 rounded-b-2xl z-10 flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-neutral-700" />
                <div className="w-14 h-3.5 rounded-full bg-neutral-800" />
              </div>

              {/* Skeleton loader — visible while iframe is loading */}
              {!iframeLoaded && (
                <div className="absolute inset-0 z-10 flex flex-col gap-4 p-6 pt-10 bg-neutral-900">
                  {/* Fake hero block */}
                  <div className="h-40 w-full rounded-2xl bg-neutral-800 animate-pulse" />
                  {/* Fake content lines */}
                  <div className="space-y-3 mt-2">
                    <div className="h-4 w-3/4 rounded-full bg-neutral-800 animate-pulse" />
                    <div className="h-4 w-1/2 rounded-full bg-neutral-700 animate-pulse" />
                    <div className="h-4 w-2/3 rounded-full bg-neutral-800 animate-pulse" />
                  </div>
                  {/* Fake gallery grid */}
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="h-24 rounded-xl bg-neutral-800 animate-pulse" />
                    <div className="h-24 rounded-xl bg-neutral-700 animate-pulse" />
                    <div className="h-24 rounded-xl bg-neutral-700 animate-pulse" />
                    <div className="h-24 rounded-xl bg-neutral-800 animate-pulse" />
                  </div>
                  <div className="mt-auto flex items-center justify-center gap-2 opacity-40">
                    <Smartphone size={14} className="text-neutral-400" />
                    <span className="text-neutral-400 text-xs font-medium">Loading preview…</span>
                  </div>
                </div>
              )}

              {/* iframe – full template demo */}
              <iframe
                key={templateId}
                src={demoUrl}
                title={`${name} Demo`}
                className="absolute inset-0 w-full h-full border-0"
                style={{ marginTop: 0, opacity: iframeLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
                loading="lazy"
                allow="autoplay"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>

            {/* ── Buy Now CTA below the phone ── */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-xl shadow-rose-500/30 text-sm transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle size={16} />
              Buy Now — {price}
            </a>

            <p className="text-white/40 text-xs">
              Press <kbd className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded text-[10px]">Esc</kbd> or click outside to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
