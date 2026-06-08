/**
 * LoveLetterEnvelope.jsx
 * Premium scroll-triggered envelope — sticky scroll track pattern.
 *
 * Scroll architecture:
 *   ┌─ Outer div: h-[150vh], ref={containerRef}         ← scroll space
 *   │   useScroll target=containerRef, offset=['start start','end end']
 *   │   → scrollYProgress goes 0→1 over exactly 150vh of scroll
 *   └─ Inner div: sticky top-0 h-screen                 ← viewport pin
 *       The envelope + letter live here, centered.
 *
 * Z-index layers (inside the 280px envelope assembly):
 *   z-0:  Envelope back  — static linen gradient
 *   z-5:  Top flap       — rotateX open, sits BELOW the letter
 *   z-10: Letter card    — ONLY moving element, slides up
 *   z-20: Front pocket   — clip-path polygon, masks letter bottom
 *   z-40: Heading        — fades out before letter reaches it
 */
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── Google Fonts ──────────────────────────────────────────────────── */
const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&display=swap';

/* ── Colour palette ────────────────────────────────────────────────── */
const C = {
  back:    '#E8DDD3',
  front:   '#F5EDE4',
  flapOut: '#DDD0C4',
  flapIn:  '#C4B5A6',
  paper:   '#FDFBF7',
  lines:   '#E8E0D8',
  ink:     '#3B2F25',
  seal:    '#C17F59',
};

export default function LoveLetterEnvelope({ content }) {
  /* ── The outer 150vh div is the scroll target ──────────────────── */
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Perfect 1:1 mapping: progress=0 when container top hits viewport top,
    // progress=1 when container bottom hits viewport bottom.
    offset: ['start start', 'end end'],
  });

  /* ── Animation transforms (spread across 0 → 1) ────────────────── */
  // Heading: fades in at 0→0.12, holds, fades out 0.28→0.42
  const headingOpacity = useTransform(scrollYProgress, [0, 0.10, 0.30, 0.44], [0, 1, 1, 0]);
  const headingY       = useTransform(scrollYProgress, [0, 0.12], [20, 0]);

  // Flap: opens 0.10 → 0.45
  const flapRotateX    = useTransform(scrollYProgress, [0.10, 0.45], [0, -180]);

  // Letter: fades in 0.12→0.28, slides up 0.15→0.90
  const letterOpacity  = useTransform(scrollYProgress, [0.12, 0.28], [0, 1]);
  const letterY        = useTransform(scrollYProgress, [0.15, 0.90], ['20%', '-82%']);
  const letterScale    = useTransform(scrollYProgress, [0.15, 0.90], [0.90, 1]);
  const letterRotate   = useTransform(scrollYProgress, [0.15, 0.90], [1.5, 0]);

  if (!content) return null;

  return (
    <>
      <link href={FONT_LINK} rel="stylesheet" />

      {/*
        ┌────────────────────────────────────────────────────────────┐
        │  OUTER: 150vh scroll space — the "track" for the animation │
        └────────────────────────────────────────────────────────────┘
      */}
      <div ref={containerRef} style={{ height: '150vh' }}>

        {/*
          ┌──────────────────────────────────────────────────────────┐
          │  INNER: sticky to top-0 for the full 150vh scroll        │
          └──────────────────────────────────────────────────────────┘
        */}
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-4">

          {/* ── Heading (fades out before letter reaches it) ─────── */}
          <motion.div
            className="text-center pointer-events-none"
            style={{
              opacity: headingOpacity,
              y: headingY,
              zIndex: 40,
              marginBottom: '2.5rem',
            }}
          >
            <span className="text-3xl block mb-2">💌</span>
            <h2
              className="text-4xl md:text-5xl font-light text-white tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              A Letter For You
            </h2>
            <p className="text-white/40 text-xs mt-3 uppercase tracking-[0.25em]">
              Scroll to open ↓
            </p>
          </motion.div>

          {/* ── Envelope assembly (380px wide, 280px tall) ──────── */}
          <div
            className="relative w-full max-w-[380px] flex-shrink-0"
            style={{ height: '280px' }}
          >

            {/* ╔══════════════════════════════════════╗
                ║  L1 — Envelope back (z-0)            ║
                ╚══════════════════════════════════════╝ */}
            <div
              className="absolute inset-0 rounded-[20px]"
              style={{
                zIndex: 0,
                background: `linear-gradient(170deg, ${C.back} 0%, ${C.front} 100%)`,
                boxShadow: `
                  0 30px 60px rgba(0,0,0,0.28),
                  0 12px 28px rgba(0,0,0,0.16),
                  inset 0 1px 0 rgba(255,255,255,0.4)
                `,
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              {/* Inner pocket depth shadow */}
              <div
                className="absolute inset-x-3 top-[45%] bottom-3 rounded-b-[16px]"
                style={{
                  background: `linear-gradient(180deg, ${C.back}00 0%, ${C.back}40 100%)`,
                  boxShadow: 'inset 0 8px 20px rgba(0,0,0,0.08)',
                }}
              />
            </div>

            {/* ╔══════════════════════════════════════╗
                ║  L2 — Top flap (z-5) — OPENS        ║
                ║  z-5 < z-10 so opened flap always   ║
                ║  sits BEHIND the letter card.        ║
                ╚══════════════════════════════════════╝ */}
            <motion.div
              className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{
                zIndex: 5,
                rotateX: flapRotateX,
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                perspective: '800px',
                height: '52%',
              }}
            >
              {/* Outer face — visible when closed */}
              <div
                className="absolute inset-0 rounded-t-[20px]"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background: `linear-gradient(180deg, ${C.flapOut} 0%, ${C.back} 80%)`,
                  backfaceVisibility: 'hidden',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.12), inset 0 -2px 8px rgba(0,0,0,0.06)',
                }}
              >
                {/* Wax seal */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    left: '50%', top: '36%',
                    transform: 'translate(-50%, -50%)',
                    width: '36px', height: '36px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 40% 35%, ${C.seal}, #9A6040)`,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.3)',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#fff', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}>♥</span>
                </div>
              </div>

              {/* Inner face — visible when rotated past 90° */}
              <div
                className="absolute inset-0 rounded-t-[20px]"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background: `linear-gradient(180deg, ${C.flapIn} 0%, ${C.back} 100%)`,
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                }}
              />
            </motion.div>

            {/* ╔══════════════════════════════════════╗
                ║  L3 — Letter card (z-10) — MOVES    ║
                ║  Slides up from behind the pocket.   ║
                ║  Always above the opened flap (z-5). ║
                ╚══════════════════════════════════════╝ */}
            <motion.div
              className="absolute left-3 right-3 rounded-xl overflow-hidden"
              style={{
                zIndex: 10,
                y: letterY,
                scale: letterScale,
                opacity: letterOpacity,
                rotate: letterRotate,
                top: '16px',
                minHeight: '320px',
                maxHeight: '460px',
                transformOrigin: 'bottom center',
                background: `linear-gradient(175deg, ${C.paper} 0%, #FBF7F1 100%)`,
                boxShadow: `
                  0 -8px 30px rgba(0,0,0,0.12),
                  0 4px 20px rgba(0,0,0,0.08),
                  inset 0 1px 0 rgba(255,255,255,0.9)
                `,
                border: '1px solid rgba(200,190,175,0.35)',
              }}
            >
              {/* Red margin line */}
              <div
                className="absolute top-0 bottom-0 w-px"
                style={{ left: '42px', background: 'rgba(205,100,100,0.18)' }}
              />

              {/* Ruled horizontal lines */}
              <div className="absolute inset-0">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0"
                    style={{
                      top: `${50 + i * 26}px`,
                      height: '1px',
                      background: C.lines,
                      opacity: 0.55,
                    }}
                  />
                ))}
              </div>

              {/* Letter text */}
              <div className="relative z-10 py-7 pr-6" style={{ paddingLeft: '54px' }}>
                <p
                  className="whitespace-pre-line"
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: '1.12rem',
                    lineHeight: '1.88',
                    color: C.ink,
                    letterSpacing: '0.01em',
                  }}
                >
                  {content}
                </p>
              </div>

              {/* Corner fold */}
              <div
                className="absolute top-0 right-0 w-8 h-8"
                style={{
                  background: `linear-gradient(225deg, ${C.back}80 0%, transparent 60%)`,
                  borderRadius: '0 12px 0 0',
                }}
              />
            </motion.div>

            {/* ╔══════════════════════════════════════╗
                ║  L4 — Front pocket (z-20) — STATIC  ║
                ║  Letter slides up from BEHIND this.  ║
                ╚══════════════════════════════════════╝ */}
            <div
              className="absolute inset-0 rounded-b-[20px] pointer-events-none"
              style={{
                zIndex: 20,
                clipPath: 'polygon(0 42%, 50% 72%, 100% 42%, 100% 100%, 0 100%)',
                background: `linear-gradient(180deg, ${C.front} 0%, ${C.back} 100%)`,
                boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {/* Subtle diagonal fold creases */}
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '60%',
                  background: `
                    linear-gradient(135deg, transparent 48%, rgba(0,0,0,0.03) 49%, rgba(0,0,0,0.03) 51%, transparent 52%),
                    linear-gradient(225deg, transparent 48%, rgba(0,0,0,0.02) 49%, rgba(0,0,0,0.02) 51%, transparent 52%)
                  `,
                }}
              />
            </div>

          </div>{/* end envelope assembly */}
        </div>{/* end sticky */}
      </div>{/* end 150vh track */}
    </>
  );
}
