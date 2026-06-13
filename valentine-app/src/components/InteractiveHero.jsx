/**
 * InteractiveHero.jsx
 * Floating Polaroid hero with nickname in script font.
 * Used in CinematicBirthday when useInteractiveHero = true.
 */
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../utils/imageHelpers';

const SCRIPT_FONT = "'Dancing Script', cursive";

// Polaroid positions/rotations for up to 5 photos
const POLAROID_CONFIG = [
  { x: '-38%', y: '-8%',  rotate: -12, scale: 0.82, zIndex: 1 },
  { x:  '32%', y: '-14%', rotate:  10, scale: 0.78, zIndex: 2 },
  { x: '-44%', y:  '28%', rotate:   7, scale: 0.75, zIndex: 1 },
  { x:  '38%', y:  '22%', rotate: -9,  scale: 0.72, zIndex: 2 },
  { x:  '-5%', y: '-42%', rotate:   4, scale: 0.70, zIndex: 0 },
];

const FLOAT_VARIANTS = {
  float: (i) => ({
    y: [0, -10, 0],
    rotate: [POLAROID_CONFIG[i]?.rotate ?? 0, (POLAROID_CONFIG[i]?.rotate ?? 0) + 3, POLAROID_CONFIG[i]?.rotate ?? 0],
    transition: { duration: 3.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 },
  }),
};

export default function InteractiveHero({ nickname, heroPhotos = [], coupleName, heroSubtitle, onScroll, customTitles }) {
  const displayName = customTitles?.heroMainTitle || nickname || coupleName || 'Happy Birthday!';
  const displaySub = customTitles?.heroSubtitle || heroSubtitle;
  const photos = heroPhotos.slice(0, 5);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Floating Polaroids — explicitly z-0 so they NEVER overlap center content */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {photos.map((url, i) => {
          const cfg = POLAROID_CONFIG[i] || POLAROID_CONFIG[0];
          return (
            <motion.div
              key={i}
              custom={i}
              variants={FLOAT_VARIANTS}
              animate="float"
              className="absolute"
              style={{
                x: cfg.x, y: cfg.y,
                rotate: cfg.rotate,
                scale: cfg.scale,
                zIndex: cfg.zIndex,
              }}
            >
              {/* Polaroid frame */}
              <div style={{
                background: 'rgba(255,255,255,0.92)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
                padding: '10px 10px 28px 10px',
                borderRadius: '4px',
                width: '150px',
              }}>
                <img src={optimizeCloudinaryUrl(url, 400)} alt={`Memory ${i+1}`}
                  className="w-full object-cover rounded-sm"
                  style={{ height: '140px' }}
                  draggable={false}
                  loading="lazy"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Center content — z-20 guarantees it always sits above all Polaroids */}
      <div className="relative text-center px-8" style={{ zIndex: 20 }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-amber-300 text-xs font-bold uppercase tracking-[0.4em] mb-3"
        >
          🎂 Happy Birthday
        </motion.p>

        {/* Large script nickname — dark pill backdrop + multi-layer shadow for legibility */}
        <div className="relative inline-block">
          {/* Blurred dark gradient behind text so it reads over any Polaroid */}
          <div
            aria-hidden
            className="absolute inset-0 -inset-x-6 -inset-y-2 rounded-2xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 72%)',
              filter: 'blur(18px)',
            }}
          />
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 120 }}
            className="relative"
            style={{
              fontFamily: SCRIPT_FONT,
              fontSize: 'clamp(3.5rem, 12vw, 8rem)',
              lineHeight: 1.1,
              color: '#fff',
              /* Four-layer shadow: close sharp → medium → wide soft → ambient */
              textShadow: [
                '0 2px 4px rgba(0,0,0,0.95)',
                '0 4px 12px rgba(0,0,0,0.85)',
                '0 8px 28px rgba(0,0,0,0.70)',
                '0 16px 48px rgba(0,0,0,0.50)',
              ].join(', '),
            }}
          >
            {displayName}
          </motion.h1>
        </div>

        {displaySub && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="relative mt-4 max-w-sm mx-auto"
          >
            {/* Dark backdrop behind subtitle for legibility over any bg */}
            <div
              aria-hidden
              className="absolute inset-0 -inset-x-4 -inset-y-2 rounded-xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.50) 0%, transparent 80%)',
                filter: 'blur(12px)',
              }}
            />
            <p
              className="relative font-light text-base md:text-lg"
              style={{
                color: 'rgba(255,255,255,0.90)',
                textShadow: [
                  '0 1px 3px rgba(0,0,0,0.99)',
                  '0 3px 10px rgba(0,0,0,0.90)',
                  '0 6px 22px rgba(0,0,0,0.70)',
                ].join(', '),
              }}
            >
              {displaySub}
            </p>
          </motion.div>
        )}

        {/* Pulsating glassmorphic CTA — single animate prop (merged entry + pulse) */}
        <motion.button
          onClick={onScroll}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            boxShadow: [
              '0 0 0 0px rgba(251,191,36,0.55)',
              '0 0 0 18px rgba(251,191,36,0)',
              '0 0 0 0px rgba(251,191,36,0)',
            ],
          }}
          transition={{
            opacity: { delay: 1.6, duration: 0.6 },
            y:       { delay: 1.6, duration: 0.6 },
            boxShadow: { delay: 2.4, duration: 2.2, repeat: Infinity, ease: 'easeOut' },
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          style={{
            marginTop: '2rem',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff',
            fontWeight: 700,
            letterSpacing: '0.15em',
            padding: '14px 36px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          ✨ Tap for Surprise
        </motion.button>
      </div>

      {/* Scroll arrow */}
      <motion.div
        onClick={onScroll}
        initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 2.2 }, y: { duration: 2, repeat: Infinity } }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll to explore</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
}
