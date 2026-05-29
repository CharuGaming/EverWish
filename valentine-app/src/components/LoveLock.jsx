import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoveLock({ initials, isEnabled }) {
  const [phase, setPhase] = useState('idle'); // idle → snapping → locked

  if (!isEnabled || !initials) return null;

  const handleClick = () => {
    if (phase !== 'idle') return;
    setPhase('snapping');
    setTimeout(() => setPhase('locked'), 700);
  };

  return (
    <section className="py-20 px-6 flex flex-col items-center">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-xs font-bold uppercase tracking-[0.3em] text-rose-400 mb-3"
      >
        💖 Love Lock
      </motion.p>

      <AnimatePresence mode="wait">
        {phase !== 'locked' ? (
          <motion.div
            key="lock"
            initial={{ opacity: 0, y: 30 }}
            animate={
              phase === 'snapping'
                ? { scale: [1, 1.2, 0.9, 1.05, 1], rotate: [0, -8, 8, -4, 0] }
                : { opacity: 1, y: 0 }
            }
            exit={{ scale: 0, y: -200, opacity: 0, rotate: 20 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            onClick={handleClick}
            className="cursor-pointer select-none flex flex-col items-center gap-4"
          >
            {/* SVG Padlock */}
            <svg width="130" height="160" viewBox="0 0 130 160" className="drop-shadow-2xl">
              {/* Shackle */}
              <path
                d="M38 68 V44 C38 22 92 22 92 44 V68"
                fill="none"
                stroke="#fb7185"
                strokeWidth="12"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 4px 12px #fb718560)' }}
              />
              {/* Body */}
              <rect x="16" y="65" width="98" height="80" rx="16" fill="url(#lockGrad)" />
              {/* Shine */}
              <rect x="24" y="73" width="30" height="8" rx="4" fill="rgba(255,255,255,0.25)" />
              {/* Keyhole */}
              <circle cx="65" cy="108" r="11" fill="rgba(0,0,0,0.25)" />
              <rect x="60" y="110" width="10" height="18" rx="4" fill="rgba(0,0,0,0.2)" />
              {/* Initials */}
              <text x="65" y="152" textAnchor="middle" fontSize="11" fontWeight="900"
                fill="rgba(255,255,255,0.9)" fontFamily="system-ui, sans-serif" letterSpacing="1">
                {initials}
              </text>
              <defs>
                <linearGradient id="lockGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>
              </defs>
            </svg>

            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-sm font-bold text-rose-400 uppercase tracking-widest"
            >
              {phase === 'snapping' ? '🔒 Locking…' : 'Tap to lock our love'}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="locked"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            className="text-center"
          >
            {/* Closed lock */}
            <svg width="100" height="120" viewBox="0 0 130 160" className="drop-shadow-2xl mx-auto mb-5">
              <path
                d="M38 68 V52 C38 30 92 30 92 52 V68"
                fill="none" stroke="#fda4af" strokeWidth="12" strokeLinecap="round"
              />
              <rect x="16" y="65" width="98" height="80" rx="16" fill="url(#lockGrad2)" />
              <circle cx="65" cy="108" r="11" fill="rgba(0,0,0,0.25)" />
              <rect x="60" y="110" width="10" height="18" rx="4" fill="rgba(0,0,0,0.2)" />
              <text x="65" y="152" textAnchor="middle" fontSize="11" fontWeight="900"
                fill="rgba(255,255,255,0.9)" fontFamily="system-ui" letterSpacing="1">
                {initials}
              </text>
              <defs>
                <linearGradient id="lockGrad2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#9f1239" />
                </linearGradient>
              </defs>
            </svg>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-black text-rose-600 mb-1"
            >
              Locked Forever 💖
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-500 text-sm font-medium"
            >
              {initials} — sealed with love, forever.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
