import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const BEAT_PATTERN = [100, 60, 100, 400]; // ms vibrate, pause, vibrate, pause

export default function Heartbeat() {
  const [beating, setBeating] = useState(false);
  const vibrateRef = useRef(null);

  const startBeat = useCallback(() => {
    setBeating(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      // Loop the heartbeat pattern
      const loop = () => {
        if (!vibrateRef.current) return;
        navigator.vibrate(BEAT_PATTERN);
        vibrateRef.current = setTimeout(loop, BEAT_PATTERN.reduce((a, b) => a + b, 0));
      };
      vibrateRef.current = setTimeout(loop, 0); // kick off immediately
    }
  }, []);

  const stopBeat = useCallback(() => {
    setBeating(false);
    if (vibrateRef.current) {
      clearTimeout(vibrateRef.current);
      vibrateRef.current = null;
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(0); // cancel vibration
    }
  }, []);

  return (
    <section className="py-20 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="max-w-xs mx-auto"
      >
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-400 mb-2">
          💗 Feel My Heartbeat
        </p>
        <h2 className="text-3xl font-black text-slate-800 mb-3">Hold the Heart</h2>
        <p className="text-slate-500 text-sm mb-10 leading-relaxed">
          Press and hold to feel my heartbeat on your fingertips 💓
        </p>

        {/* Heart */}
        <div className="flex justify-center mb-8 select-none">
          <motion.div
            onPointerDown={startBeat}
            onPointerUp={stopBeat}
            onPointerLeave={stopBeat}
            onTouchStart={startBeat}
            onTouchEnd={stopBeat}
            animate={beating
              ? { scale: [1, 1.18, 0.96, 1.22, 0.95, 1.1, 1] }
              : { scale: 1 }
            }
            transition={beating
              ? { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3 }
            }
            className="cursor-pointer touch-none"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <svg
              width="160"
              height="148"
              viewBox="0 0 160 148"
              className="drop-shadow-2xl"
              style={{ filter: beating ? 'drop-shadow(0 0 30px #f43f5e80)' : 'drop-shadow(0 8px 24px #f43f5e40)' }}
            >
              <defs>
                <radialGradient id="heartGrad" cx="50%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="50%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#9f1239" />
                </radialGradient>
                <radialGradient id="heartShine" cx="35%" cy="25%" r="40%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
              </defs>
              {/* Main heart path */}
              <path
                d="M80 140 C40 110 5 85 5 50 C5 25 25 5 50 5 C64 5 76 12 80 20 C84 12 96 5 110 5 C135 5 155 25 155 50 C155 85 120 110 80 140 Z"
                fill="url(#heartGrad)"
              />
              {/* Shine overlay */}
              <path
                d="M80 140 C40 110 5 85 5 50 C5 25 25 5 50 5 C64 5 76 12 80 20 C84 12 96 5 110 5 C135 5 155 25 155 50 C155 85 120 110 80 140 Z"
                fill="url(#heartShine)"
              />
            </svg>
          </motion.div>
        </div>

        {/* EKG line */}
        <div className="relative h-12 flex items-center justify-center overflow-hidden">
          <motion.svg
            width="240"
            height="48"
            viewBox="0 0 240 48"
            className="overflow-visible"
          >
            <motion.path
              d="M0 24 L40 24 L52 8 L60 40 L68 8 L76 32 L84 24 L240 24"
              fill="none"
              stroke={beating ? '#f43f5e' : '#fda4af'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={beating ? {
                pathLength: [0, 1],
                opacity: [0.4, 1, 0.4],
              } : { pathLength: 1, opacity: 0.3 }}
              transition={beating ? { duration: 0.6, repeat: Infinity } : { duration: 0.5 }}
            />
          </motion.svg>
        </div>

        <motion.p
          animate={beating ? { opacity: [0.7, 1, 0.7], scale: [1, 1.04, 1] } : { opacity: 0.5 }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="text-xs font-bold uppercase tracking-widest mt-4"
          style={{ color: beating ? '#f43f5e' : '#94a3b8' }}
        >
          {beating ? '💓 Beating for you…' : 'Hold to feel my heartbeat'}
        </motion.p>

        <p className="text-[10px] text-slate-400 mt-2">
          (Vibration works on supported mobile devices)
        </p>
      </motion.div>
    </section>
  );
}
