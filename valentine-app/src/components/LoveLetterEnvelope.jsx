/**
 * LoveLetterEnvelope.jsx — Clean Scroll-Reveal Letter Card
 *
 * No envelope shapes, no clip-paths, no sticky scroll tricks.
 * Just a premium paper card that reveals its text as the user scrolls.
 *
 * Animation: each paragraph fades in + slides up (staggered via delay),
 * triggered once when the card enters the viewport.
 */
import { motion } from 'framer-motion';

/* ── Google Fonts ──────────────────────────────────────────────────── */
const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,300;1,400&display=swap';

/* ── Shared animation preset ───────────────────────────────────────── */
const REVEAL = (delay = 0) => ({
  initial:    { opacity: 0, y: 28 },
  whileInView:{ opacity: 1, y: 0  },
  viewport:   { once: true, amount: 0.25 },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function LoveLetterEnvelope({ content }) {
  if (!content) return null;

  /* Split on double-newline into paragraphs; fall back to single block */
  const paragraphs = content
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <>
      <link href={FONT_LINK} rel="stylesheet" />

      {/* ── Section wrapper — flows naturally, no sticky tricks ── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">

          {/* ── Section heading ──────────────────────────────────── */}
          <motion.div
            {...REVEAL(0)}
            className="text-center mb-10"
          >
            <span className="text-3xl block mb-3">💌</span>
            <h2
              className="text-4xl md:text-5xl font-light text-white tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              A Letter For You
            </h2>
          </motion.div>

          {/* ── Paper card ───────────────────────────────────────── */}
          <motion.div
            {...REVEAL(0.15)}
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: '#FDFBF7',
              boxShadow: `
                0 4px 6px rgba(0,0,0,0.04),
                0 20px 60px rgba(0,0,0,0.18),
                0 40px 80px rgba(0,0,0,0.10),
                inset 0 1px 0 rgba(255,255,255,0.9)
              `,
              border: '1px solid rgba(200,190,175,0.30)',
            }}
          >
            {/* Top amber accent line — keeps the glassmorphic colour system */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-t-2xl" />

            {/* Red margin line — authentic notebook paper feel */}
            <div
              className="absolute top-0 bottom-0 w-px"
              style={{ left: '52px', background: 'rgba(205,100,100,0.16)' }}
            />

            {/* Ruled lines */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0"
                  style={{
                    top:        `${80 + i * 30}px`,
                    height:     '1px',
                    background: '#E8E0D8',
                    opacity:    0.55,
                  }}
                />
              ))}
            </div>

            {/* ── Letter content ─────────────────────────────────── */}
            <div
              className="relative z-10 px-8 py-10"
              style={{ paddingLeft: '68px' }}
            >
              {paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  {...REVEAL(0.25 + i * 0.12)}
                  className="mb-5 last:mb-0"
                  style={{
                    fontFamily:    "'Dancing Script', cursive",
                    fontSize:      '1.18rem',
                    lineHeight:    '2',
                    color:         '#3B2F25',
                    letterSpacing: '0.01em',
                  }}
                >
                  {para}
                </motion.p>
              ))}

              {/* Decorative closing flourish */}
              <motion.div
                {...REVEAL(0.30 + paragraphs.length * 0.12)}
                className="mt-8 flex items-center gap-3"
              >
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
                <span className="text-amber-400 text-lg">♥</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
              </motion.div>
            </div>

            {/* Subtle corner fold */}
            <div
              className="absolute top-0 right-0 w-10 h-10 pointer-events-none"
              style={{
                background: 'linear-gradient(225deg, rgba(216,204,188,0.6) 0%, transparent 55%)',
                borderRadius: '0 16px 0 0',
              }}
            />
          </motion.div>

        </div>
      </section>
    </>
  );
}
