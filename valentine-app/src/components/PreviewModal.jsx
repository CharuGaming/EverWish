/**
 * PreviewModal.jsx — Glassmorphic Long Screenshot Preview Modal
 *
 * Replaces the old iframe phone-frame preview.
 * Now renders a full-page scrollable screenshot in a premium dark glassmorphic modal.
 * Falls back gracefully to a "no preview" empty state when longScreenshotUrl is absent.
 *
 * Props
 *   isOpen          {boolean}  — controls visibility
 *   onClose         {fn}       — close callback
 *   screenshotUrl   {string}   — Cloudinary URL for the long screenshot image
 *   templateName    {string}   — human-readable template title
 *   templateId      {string}   — template id (e.g. 'v1'), used for the live demo fallback link
 *   whatsappNumber  {string}   — WA number for the "Buy Now" CTA (optional)
 *   price           {string}   — price string for the "Buy Now" CTA (optional)
 */
import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ExternalLink, ImageOff, MessageCircle } from 'lucide-react';

// ── Custom thin brand-coloured scrollbar ──────────────────────────────
const SCROLLBAR_CSS = `
  .preview-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .preview-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 99px;
    margin: 8px 0;
  }
  .preview-scroll::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(244,63,94,0.65) 0%, rgba(236,72,153,0.65) 100%);
    border-radius: 99px;
  }
  .preview-scroll::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(244,63,94,0.9) 0%, rgba(236,72,153,0.9) 100%);
  }
  /* Firefox */
  .preview-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(244,63,94,0.6) rgba(255,255,255,0.04);
  }
`;

// Inject styles once into <head>
function injectScrollbarStyles() {
  const id = 'everwish-preview-scrollbar';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = SCROLLBAR_CSS;
    document.head.appendChild(s);
  }
}

export default function PreviewModal({
  isOpen,
  onClose,
  screenshotUrl,
  templateName,
  templateId,
  whatsappNumber,
  price,
}) {
  // Escape key support
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    injectScrollbarStyles();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  // Build WA buy-now link
  const waUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hello! I'd like to purchase the *${templateName || 'EverWish Template'}* template 😊`
      )}`
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ══ Backdrop ══════════════════════════════════════════════ */}
          <motion.div
            key="pm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            style={{ zIndex: 200 }}
            aria-hidden="true"
          />

          {/* ══ Modal wrapper (centres content) ═══════════════════════ */}
          <div
            className="fixed inset-0 flex items-center justify-center p-4 md:p-8 pointer-events-none"
            style={{ zIndex: 201 }}
          >
            <motion.div
              key="pm-box"
              initial={{ opacity: 0, scale: 0.93, y: 28 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.93, y: 28 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full pointer-events-auto"
              style={{ maxWidth: '680px' }}
              role="dialog"
              aria-modal="true"
              aria-label={`Preview – ${templateName || 'Template'}`}
            >

              {/* ── Glass card ─────────────────────────────────────── */}
              <div
                className="relative rounded-[1.75rem] overflow-hidden flex flex-col"
                style={{
                  background: 'linear-gradient(145deg, rgba(10,6,18,0.97) 0%, rgba(25,8,30,0.99) 100%)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow:
                    '0 48px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(244,63,94,0.12), inset 0 1px 0 rgba(255,255,255,0.07)',
                }}
              >
                {/* Decorative glow blobs */}
                <div
                  className="absolute -top-28 -right-28 w-72 h-72 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.18) 0%, transparent 70%)' }}
                />
                <div
                  className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)' }}
                />

                {/* ── Header ─────────────────────────────────────────── */}
                <div
                  className="relative flex items-center justify-between px-5 py-4 flex-shrink-0"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {/* Left info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg,rgba(244,63,94,0.25),rgba(236,72,153,0.25))',
                        border: '1px solid rgba(244,63,94,0.28)',
                      }}
                    >
                      <ZoomIn size={14} className="text-rose-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-rose-400/70 leading-none mb-0.5">
                        Template Preview
                      </p>
                      <p className="text-sm font-bold text-white/90 truncate leading-tight">
                        {templateName || 'EverWish Template'}
                      </p>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    {/* Live demo link — hidden on mobile to keep header clean */}
                    {templateId && (
                      <a
                        href={`/demo/${templateId}?demo=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                        style={{
                          color: 'rgba(255,255,255,0.5)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = 'rgba(244,63,94,0.9)';
                          e.currentTarget.style.background = 'rgba(244,63,94,0.08)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                          e.currentTarget.style.background = '';
                        }}
                        title="Open live interactive demo"
                      >
                        <ExternalLink size={11} />
                        Live Demo
                      </a>
                    )}

                    {/* Close */}
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.10)',
                      }}
                      aria-label="Close preview"
                    >
                      <X size={15} className="text-white/60" />
                    </button>
                  </div>
                </div>

                {/* ── Scrollable Screenshot ─────────────────────────── */}
                <div
                  className="preview-scroll overflow-y-auto relative"
                  style={{ maxHeight: 'min(70vh, 640px)' }}
                >
                  {screenshotUrl ? (
                    <div>
                      {/* Top fade-in gradient */}
                      <div
                        className="sticky top-0 left-0 right-0 h-6 pointer-events-none z-10"
                        style={{
                          background: 'linear-gradient(to bottom, rgba(10,6,18,0.7) 0%, transparent 100%)',
                        }}
                      />
                      <img
                        src={screenshotUrl}
                        alt={`Full page screenshot of ${templateName}`}
                        className="w-full h-auto block"
                        loading="lazy"
                        draggable={false}
                      />
                      {/* Bottom fade-out gradient — hint for more content */}
                      <div
                        className="sticky bottom-0 left-0 right-0 h-10 pointer-events-none"
                        style={{
                          background: 'linear-gradient(to top, rgba(10,6,18,0.85) 0%, transparent 100%)',
                        }}
                      />
                    </div>
                  ) : (
                    /* ── Empty / no screenshot state ─────────────────── */
                    <div className="flex flex-col items-center justify-center gap-5 py-20 px-8 text-center">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <ImageOff size={22} className="text-white/25" />
                      </div>
                      <div>
                        <p className="text-white/50 font-bold text-sm mb-1.5">
                          Preview coming soon
                        </p>
                        <p className="text-white/30 text-xs leading-relaxed max-w-[260px]">
                          A screenshot hasn't been uploaded for this template yet.
                          Try the live interactive demo in the meantime.
                        </p>
                      </div>
                      {templateId && (
                        <a
                          href={`/demo/${templateId}?demo=1`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                          style={{
                            background: 'linear-gradient(135deg,rgba(244,63,94,0.2),rgba(236,72,153,0.2))',
                            border: '1px solid rgba(244,63,94,0.28)',
                            color: 'rgba(244,63,94,0.85)',
                          }}
                        >
                          <ExternalLink size={12} />
                          Open Live Demo
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Footer ─────────────────────────────────────────── */}
                <div
                  className="flex items-center justify-between px-5 py-3 flex-shrink-0 gap-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {/* Scroll hint */}
                  <p className="text-[10px] font-medium text-white/25 flex-shrink-0">
                    {screenshotUrl ? '↕ Scroll to explore' : ''}
                  </p>

                  {/* Buy now CTA */}
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-extrabold px-5 py-2 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 flex-shrink-0 ml-auto"
                      style={{
                        background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                        boxShadow: '0 4px 18px rgba(244,63,94,0.35)',
                        color: '#fff',
                      }}
                    >
                      <MessageCircle size={13} />
                      {price ? `Order — ${price}` : 'Order Now'}
                    </a>
                  )}

                  {/* Brand watermark */}
                  {!waUrl && (
                    <p
                      className="text-[10px] font-black uppercase tracking-widest ml-auto"
                      style={{ color: 'rgba(244,63,94,0.45)' }}
                    >
                      EverWish
                    </p>
                  )}
                </div>
              </div>

              {/* Dismiss hint */}
              <p className="text-center text-[11px] text-white/30 mt-3 font-medium select-none">
                Press{' '}
                <kbd className="bg-white/10 border border-white/15 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                  Esc
                </kbd>{' '}
                or click outside to close
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
