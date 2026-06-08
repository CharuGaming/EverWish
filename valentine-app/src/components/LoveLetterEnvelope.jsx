/**
 * LoveLetterEnvelope.jsx
 * Premium scroll-triggered envelope with letter pull-out animation.
 *
 * Architecture — 3 z-layers inside a relative container:
 *   Layer 1 (z-0):  Envelope back   — muted linen texture, side folds
 *   Layer 2 (z-10): Letter card     — the ONLY moving element (slides up)
 *   Layer 3 (z-20): Front pocket    — clip-path polygon, hides bottom of letter
 *   Layer 4 (z-30): Top flap        — rotates open via scroll
 */
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── Google Fonts ──────────────────────────────────────────────────── */
const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&display=swap';

/* ── Colour palette — soft, premium paper tones ────────────────────── */
const COLORS = {
  envelopeBack:   '#E8DDD3',   // warm linen
  envelopeFront:  '#F5EDE4',   // lighter warm cream
  flapOuter:      '#DDD0C4',   // slightly darker for flap contrast
  flapInner:      '#C4B5A6',   // inner face when flap opens
  letterPaper:    '#FDFBF7',   // soft paper white
  letterLines:    '#E8E0D8',   // subtle ruled lines
  ink:            '#3B2F25',   // warm dark brown ink
  inkLight:       '#6B5D50',   // lighter brown for secondary text
  seal:           '#C17F59',   // wax-seal copper
};

export default function LoveLetterEnvelope({ content }) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  /* ── Animation transforms ─────────────────────────────────────── */
  // Letter slides from resting inside (20%) to fully extracted (-90%)
  const letterY       = useTransform(scrollYProgress, [0.15, 0.55], ['20%', '-90%']);
  const letterScale   = useTransform(scrollYProgress, [0.15, 0.55], [0.92, 1]);
  const letterOpacity = useTransform(scrollYProgress, [0.10, 0.22], [0, 1]);
  const letterRotate  = useTransform(scrollYProgress, [0.15, 0.55], [1, 0]);

  // Flap opens as user scrolls
  const flapRotateX   = useTransform(scrollYProgress, [0.12, 0.38], [0, -180]);
  const flapShadow    = useTransform(scrollYProgress, [0.12, 0.38], [
    '0 8px 20px rgba(0,0,0,0.15)',
    '0 -4px 12px rgba(0,0,0,0.08)',
  ]);

  // Heading fades in
  const headingOpacity = useTransform(scrollYProgress, [0.05, 0.18], [0, 1]);
  const headingY       = useTransform(scrollYProgress, [0.05, 0.18], [30, 0]);

  if (!content) return null;

  return (
    <>
      <link href={FONT_LINK} rel="stylesheet" />

      {/* ── Scroll container: 200vh gives scroll room for sticky ── */}
      <div ref={sectionRef} style={{ height: '200vh' }}>
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-visible px-4">

          {/* ── Section heading ─────────────────────────────────── */}
          <motion.div
            style={{ opacity: headingOpacity, y: headingY }}
            className="text-center mb-8 relative z-40"
          >
            <span className="text-3xl block mb-2">💌</span>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-4xl md:text-5xl font-light text-white tracking-wide"
            >
              A Letter For You
            </h2>
            <p className="text-white/40 text-xs mt-2 uppercase tracking-[0.25em]">
              Scroll to open ↓
            </p>
          </motion.div>

          {/* ── Envelope assembly ───────────────────────────────── */}
          <div
            className="relative w-full max-w-[380px]"
            style={{ height: '280px' }}
          >

            {/* ╔═══════════════════════════════════════════════════╗
               ║  LAYER 1 — Envelope back (z-0)                   ║
               ╚═══════════════════════════════════════════════════╝ */}
            <div
              className="absolute inset-0 rounded-[20px] z-0"
              style={{
                background: `linear-gradient(170deg, ${COLORS.envelopeBack} 0%, ${COLORS.envelopeFront} 100%)`,
                boxShadow: `
                  0 30px 60px rgba(0,0,0,0.25),
                  0 15px 30px rgba(0,0,0,0.15),
                  inset 0 1px 0 rgba(255,255,255,0.4)
                `,
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              {/* Inner shadow to simulate depth of envelope pocket */}
              <div
                className="absolute inset-x-3 top-[45%] bottom-3 rounded-b-[16px]"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.envelopeBack}00 0%, ${COLORS.envelopeBack}40 100%)`,
                  boxShadow: 'inset 0 8px 20px rgba(0,0,0,0.08)',
                }}
              />
            </div>

            {/* ╔═══════════════════════════════════════════════════╗
               ║  LAYER 2 — Letter card (z-10) — MOVES            ║
               ╚═══════════════════════════════════════════════════╝ */}
            <motion.div
              className="absolute left-3 right-3 z-10 rounded-xl"
              style={{
                y: letterY,
                scale: letterScale,
                opacity: letterOpacity,
                rotate: letterRotate,
                top: '16px',
                minHeight: '320px',
                maxHeight: '440px',
                transformOrigin: 'bottom center',
                background: `linear-gradient(175deg, ${COLORS.letterPaper} 0%, #FBF7F1 100%)`,
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
                className="absolute top-0 bottom-0 w-[1px]"
                style={{ left: '42px', background: 'rgba(205,100,100,0.18)' }}
              />

              {/* Ruled horizontal lines */}
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0"
                    style={{
                      top: `${52 + i * 26}px`,
                      height: '1px',
                      background: COLORS.letterLines,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>

              {/* Letter text */}
              <div className="relative z-10 px-8 py-7 pr-6" style={{ paddingLeft: '54px' }}>
                <p
                  className="whitespace-pre-line"
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: '1.15rem',
                    lineHeight: '1.88',
                    color: COLORS.ink,
                    letterSpacing: '0.01em',
                  }}
                >
                  {content}
                </p>
              </div>

              {/* Subtle corner fold */}
              <div
                className="absolute top-0 right-0 w-8 h-8"
                style={{
                  background: `linear-gradient(225deg, ${COLORS.envelopeBack}80 0%, transparent 60%)`,
                  borderRadius: '0 12px 0 0',
                }}
              />
            </motion.div>

            {/* ╔═══════════════════════════════════════════════════╗
               ║  LAYER 3 — Front pocket (z-20) — STATIC          ║
               ║  Letter slides up from BEHIND this layer          ║
               ╚═══════════════════════════════════════════════════╝ */}
            <div
              className="absolute inset-0 z-20 rounded-b-[20px] pointer-events-none"
              style={{
                clipPath: 'polygon(0 42%, 50% 72%, 100% 42%, 100% 100%, 0 100%)',
                background: `linear-gradient(180deg, ${COLORS.envelopeFront} 0%, ${COLORS.envelopeBack} 100%)`,
                boxShadow: `
                  0 -4px 16px rgba(0,0,0,0.06),
                  inset 0 2px 8px rgba(255,255,255,0.5)
                `,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {/* Subtle crease lines on the front pocket */}
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

            {/* ╔═══════════════════════════════════════════════════╗
               ║  LAYER 4 — Top flap (z-30) — ROTATES OPEN        ║
               ╚═══════════════════════════════════════════════════╝ */}
            <motion.div
              className="absolute top-0 left-0 right-0 z-30 pointer-events-none"
              style={{
                rotateX: flapRotateX,
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                height: '52%',
                filter: flapShadow,
              }}
            >
              {/* Outer face of flap (visible when closed) */}
              <div
                className="absolute inset-0 rounded-t-[20px]"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background: `linear-gradient(180deg, ${COLORS.flapOuter} 0%, ${COLORS.envelopeBack} 80%)`,
                  backfaceVisibility: 'hidden',
                  boxShadow: 'inset 0 -2px 8px rgba(0,0,0,0.06)',
                }}
              >
                {/* Wax seal decoration */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    left: '50%',
                    top: '38%',
                    transform: 'translate(-50%, -50%)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 40% 35%, ${COLORS.seal}, #9A6040)`,
                    boxShadow: `
                      0 2px 6px rgba(0,0,0,0.2),
                      inset 0 1px 2px rgba(255,255,255,0.3)
                    `,
                  }}
                >
                  <span style={{ fontSize: '14px', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' }}>♥</span>
                </div>
              </div>

              {/* Inner face of flap (visible when open / rotated past 90deg) */}
              <div
                className="absolute inset-0 rounded-t-[20px]"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background: `linear-gradient(180deg, ${COLORS.flapInner} 0%, ${COLORS.envelopeBack} 100%)`,
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                }}
              />
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}
