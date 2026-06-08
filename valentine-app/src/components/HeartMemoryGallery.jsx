/**
 * HeartMemoryGallery.jsx
 * ─────────────────────────────────────────────────────────────────────
 * Heart-shaped collage of 5 photos, each in an asymmetric panel.
 * Clicking a panel triggers a "Locus Unwrap" animation — the panel
 * expands FROM its exact screen position to a full-screen modal.
 *
 * Container: 520 × 480 px (scales down on mobile via transform).
 * Heart clip masks the outer rectangle.
 * 5 panels tile the rectangle via clip-path polygon.
 */
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,400&family=Dancing+Script:wght@500;700&display=swap';

/* ── Heart SVG path (520 × 480 viewBox) ──────────────────────────── */
const HEART_PATH =
  'M260,460 C190,420 30,340 30,200 C30,110 100,65 175,65 C210,65 242,78 260,105 C278,78 310,65 345,65 C420,65 490,110 490,200 C490,340 330,420 260,460 Z';

/* ── 5 panel polygon clip-paths (px inside 520×480 box) ─────────── */
// All 5 together tile the full rectangle; heart masks the outer area.
const PANELS = [
  {
    // top-left lobe
    clip: 'polygon(0px 0px,260px 0px,260px 212px,145px 302px,0px 302px)',
    labelPos: { bottom: '42%', left: '18%' },
  },
  {
    // top-right lobe
    clip: 'polygon(260px 0px,520px 0px,520px 302px,375px 302px,260px 212px)',
    labelPos: { bottom: '42%', right: '18%' },
  },
  {
    // bottom-left wedge
    clip: 'polygon(0px 302px,145px 302px,260px 212px,260px 480px,0px 480px)',
    labelPos: { bottom: '28%', left: '6%' },
  },
  {
    // bottom-center triangle (heart tip)
    clip: 'polygon(145px 302px,375px 302px,260px 480px)',
    labelPos: { bottom: '12%', left: '50%', transform: 'translateX(-50%)' },
  },
  {
    // bottom-right wedge
    clip: 'polygon(375px 302px,520px 302px,520px 480px,260px 480px)',
    labelPos: { bottom: '28%', right: '6%' },
  },
];

const DEFAULT_LABELS = ['Proposal 💍', 'First Date ☕', 'Our Travels ✈️', 'Forever 💛', 'Just Us 🌟'];

/* ── Divider lines inside the heart (decorative gold seams) ──────── */
const SEAMS = [
  // vertical centre top
  { x1: 260, y1: 0,   x2: 260, y2: 212 },
  // diagonal top-left to centre
  { x1: 0,   y1: 302, x2: 145, y2: 302 },
  // diagonal top-right to centre
  { x1: 375, y1: 302, x2: 520, y2: 302 },
  // left arm of centre star
  { x1: 145, y1: 302, x2: 260, y2: 212 },
  // right arm of centre star
  { x1: 375, y1: 302, x2: 260, y2: 212 },
  // left to bottom tip
  { x1: 145, y1: 302, x2: 260, y2: 480 },
  // right to bottom tip
  { x1: 375, y1: 302, x2: 260, y2: 480 },
];

export default function HeartMemoryGallery({ photos = [], labels = [] }) {
  const [selected, setSelected]     = useState(null);
  const [originRect, setOriginRect] = useState(null);
  const panelRefs = useRef([]);

  const memLabels = labels.length >= 5 ? labels : DEFAULT_LABELS;
  const imgs      = [...photos].slice(0, 5);
  // pad with placeholders if < 5
  while (imgs.length < 5) imgs.push(null);

  const handleOpen = useCallback((i) => {
    const rect = panelRefs.current[i]?.getBoundingClientRect();
    if (rect) { setOriginRect(rect); setSelected(i); }
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
    setOriginRect(null);
  }, []);

  return (
    <>
      <link href={FONT_LINK} rel="stylesheet" />

      {/* ── Responsive wrapper ─────────────────────────────────── */}
      <div className="flex justify-center items-center w-full py-4">
        {/* Scale container on small screens */}
        <div
          className="relative"
          style={{
            width: 'min(520px, 94vw)',
            aspectRatio: '520 / 480',
          }}
        >
          {/* ── Heart border glow (SVG underlay) ─────────────── */}
          <svg
            viewBox="0 0 520 480"
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 1 }}
          >
            {/* Outer glow */}
            <path
              d={HEART_PATH}
              fill="none"
              stroke="rgba(251,191,36,0.25)"
              strokeWidth="22"
              strokeLinejoin="round"
            />
            {/* Gold border */}
            <path
              d={HEART_PATH}
              fill="none"
              stroke="url(#heartGrad)"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Panel seam lines */}
            {SEAMS.map((s, i) => (
              <line
                key={i}
                x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                stroke="rgba(251,191,36,0.60)"
                strokeWidth="1.5"
              />
            ))}
            <defs>
              <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#FBBF24" />
                <stop offset="50%"  stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              {/* SVG clipPath for the heart */}
              <clipPath id="heart-clip-hmg" clipPathUnits="userSpaceOnUse">
                <path d={HEART_PATH} />
              </clipPath>
            </defs>
          </svg>

          {/* ── Clipped photo mosaic container ───────────────── */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `url(#heart-clip-hmg)`,
              WebkitClipPath: `url(#heart-clip-hmg)`,
              zIndex: 2,
            }}
          >
            {PANELS.map((panel, i) => (
              <div
                key={i}
                ref={el => (panelRefs.current[i] = el)}
                className="absolute inset-0 cursor-pointer group"
                style={{ clipPath: panel.clip, WebkitClipPath: panel.clip }}
                onClick={() => imgs[i] && handleOpen(i)}
              >
                {/* Photo */}
                {imgs[i] ? (
                  <img
                    src={imgs[i]}
                    alt={memLabels[i]}
                    className="absolute inset-0 w-full h-full"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    draggable={false}
                  />
                ) : (
                  /* Placeholder when no photo */
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(251,191,36,0.08)' }}
                  >
                    <span className="text-amber-400/40 text-3xl">📷</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

                {/* Memory label */}
                <div
                  className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ ...panel.labelPos, whiteSpace: 'nowrap' }}
                >
                  <span
                    className="text-white text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      background: 'rgba(0,0,0,0.55)',
                      backdropFilter: 'blur(6px)',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '0.72rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {memLabels[i]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Locus Unwrap Modal ────────────────────────────────── */}
      <AnimatePresence>
        {selected !== null && originRect && imgs[selected] && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              style={{ zIndex: 9998 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
            />

            {/* Expanding card — animates FROM panel rect TO full screen */}
            <motion.div
              className="fixed overflow-hidden"
              style={{ zIndex: 9999 }}
              initial={{
                top:          originRect.top,
                left:         originRect.left,
                width:        originRect.width,
                height:       originRect.height,
                borderRadius: '20px',
              }}
              animate={{
                top:          '50%',
                left:         '50%',
                x:            '-50%',
                y:            '-50%',
                width:        'min(90vw, 720px)',
                height:       'min(80vh, 600px)',
                borderRadius: '24px',
              }}
              exit={{
                top:          originRect.top,
                left:         originRect.left,
                x:            0,
                y:            0,
                width:        originRect.width,
                height:       originRect.height,
                borderRadius: '20px',
                opacity:      0,
              }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            >
              {/* Full image */}
              <img
                src={imgs[selected]}
                alt={memLabels[selected]}
                className="w-full h-full"
                style={{ objectFit: 'contain', background: '#0a0806' }}
                draggable={false}
              />

              {/* Label bar */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 px-6 py-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                }}
              >
                <p
                  className="text-white text-2xl"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {memLabels[selected]}
                </p>
              </motion.div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
