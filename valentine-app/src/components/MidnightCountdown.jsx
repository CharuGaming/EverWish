import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

function getTimeLeft(target) {
  const diff = new Date(target) - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function Digit({ value, label, color }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-16 h-20 sm:w-20 sm:h-24 md:w-28 md:h-32 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)' }}
      >
        {/* Subtle top shine */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 rounded-t-2xl" />
        {/* Horizontal split line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-black/30" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="text-3xl sm:text-4xl md:text-6xl font-black tabular-nums relative z-10"
            style={{ color }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">{label}</span>
    </div>
  );
}

export default function MidnightCountdown({ unlockTime, children }) {
  const [timeLeft, setTimeLeft] = useState(() => unlockTime ? getTimeLeft(unlockTime) : null);
  const [unlocked, setUnlocked] = useState(false);

  const fireConfetti = useCallback(() => {
    const end = Date.now() + 3000;
    const colors = ['#f59e0b', '#ec4899', '#8b5cf6', '#22d3ee', '#f43f5e'];
    const fire = () => {
      if (Date.now() > end) return;
      confetti({ particleCount: 60, spread: 120, origin: { x: Math.random(), y: 0.2 }, colors, ticks: 80 });
      requestAnimationFrame(fire);
    };
    fire();
  }, []);

  useEffect(() => {
    if (!unlockTime) return;
    if (!getTimeLeft(unlockTime)) { setUnlocked(true); return; }

    const id = setInterval(() => {
      const t = getTimeLeft(unlockTime);
      if (!t) {
        setTimeLeft(null);
        clearInterval(id);
        fireConfetti();
        setTimeout(() => setUnlocked(true), 1200);
      } else {
        setTimeLeft(t);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [unlockTime, fireConfetti]);

  // No lock time set — just render children
  if (!unlockTime) return <>{children}</>;
  if (unlocked) return <>{children}</>;

  const accent = '#f59e0b';

  return (
    <AnimatePresence>
      {!unlocked && (
        <motion.div
          key="countdown"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(160deg,#0f0c29,#302b63,#24243e)' }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
        >
          {/* Starfield */}
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}

          {/* Glow orb */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
            style={{ background: accent }}
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center px-6"
          >
            {/* Icon */}
            <motion.div
              className="text-6xl mb-6"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🎂
            </motion.div>

            {/* Label */}
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/40 mb-2">
              Your surprise unlocks in
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-10 leading-tight">
              Hold on…{' '}
              <span style={{ color: accent }}>something special</span>
              <br />is on its way 🎉
            </h1>

            {/* Timer digits */}
            {timeLeft ? (
              <div className="flex items-start justify-center gap-2 sm:gap-4 md:gap-6 flex-wrap max-w-2xl mx-auto">
                {timeLeft.d > 0 && (
                  <>
                    <Digit value={pad(timeLeft.d)} label="Days"   color="#8b5cf6" />
                    <span className="text-2xl sm:text-4xl font-black text-white/30 mt-6 sm:mt-8 animate-pulse">:</span>
                  </>
                )}
                <Digit value={pad(timeLeft.h)} label="Hours"   color={accent} />
                <span className="text-2xl sm:text-4xl font-black text-white/30 mt-6 sm:mt-8 animate-pulse">:</span>
                <Digit value={pad(timeLeft.m)} label="Minutes" color="#ec4899" />
                <span className="text-2xl sm:text-4xl font-black text-white/30 mt-6 sm:mt-8 animate-pulse">:</span>
                <Digit value={pad(timeLeft.s)} label="Seconds" color="#22d3ee" />
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                className="text-5xl font-black text-white mt-4"
              >
                🎊 Time's up!
              </motion.div>
            )}

            <p className="text-white/25 text-xs mt-10 font-mono tracking-wider">
              Come back when the clock hits zero 🕛
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
