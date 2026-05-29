import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

function getTimeLeft(target) {
  const diff = new Date(target) - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

export default function TimeCapsule({ unlockDate, message, mediaUrl }) {
  if (!unlockDate && !message && !mediaUrl) return null;

  const isPast = !unlockDate || new Date() >= new Date(unlockDate);
  const [timeLeft, setTimeLeft] = useState(() => unlockDate ? getTimeLeft(unlockDate) : null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!unlockDate || isPast) return;
    const id = setInterval(() => {
      const t = getTimeLeft(unlockDate);
      setTimeLeft(t);
      if (!t) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [unlockDate, isPast]);

  const handleOpen = useCallback(() => {
    if (!isPast && timeLeft) return;
    setOpened(true);
  }, [isPast, timeLeft]);

  const isVideo = mediaUrl && /\.(mp4|webm|mov|ogg)$/i.test(mediaUrl);

  return (
    <section className="py-20 px-6">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-400 mb-2">
            ⏳ Time Capsule
          </p>
          <h2 className="text-3xl font-black text-slate-800">A Message From the Past</h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isPast && timeLeft ? (
            /* ── LOCKED VAULT ── */
            <motion.div
              key="locked"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="rounded-[2.5rem] overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(160deg,#1e293b,#0f172a)',
                border: '1.5px solid rgba(255,255,255,0.08)',
                boxShadow: '0 30px 80px rgba(244,63,94,0.15)',
              }}
            >
              {/* Vault door */}
              <div className="p-8 text-center">
                {/* Steel bolts */}
                <div className="flex justify-between mb-6 px-4">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="w-3 h-3 rounded-full bg-slate-600 border border-slate-500 shadow-inner" />
                  ))}
                </div>

                {/* Lock icon */}
                <motion.div
                  animate={{ rotate: [0, -3, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="flex justify-center mb-6"
                >
                  <svg width="64" height="80" viewBox="0 0 80 100">
                    <path d="M24 46 V30 C24 14 56 14 56 30 V46" fill="none"
                      stroke="#f43f5e" strokeWidth="7" strokeLinecap="round" />
                    <rect x="10" y="43" width="60" height="50" rx="10" fill="#1e3a5f" />
                    <rect x="10" y="43" width="60" height="50" rx="10" fill="none"
                      stroke="rgba(244,63,94,0.4)" strokeWidth="2" />
                    <circle cx="40" cy="68" r="8" fill="#f43f5e" opacity="0.8" />
                    <rect x="36" y="70" width="8" height="14" rx="3" fill="#f43f5e" opacity="0.7" />
                  </svg>
                </motion.div>

                <p className="text-white font-black text-lg mb-1">Sealed Until…</p>
                <p className="text-slate-400 text-xs mb-8 font-mono">
                  {unlockDate ? new Date(unlockDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                </p>

                {/* Countdown */}
                <div className="flex items-start justify-center gap-3 mb-6">
                  {[
                    { v: pad(timeLeft?.d ?? 0), l: 'Days' },
                    { v: pad(timeLeft?.h ?? 0), l: 'Hours' },
                    { v: pad(timeLeft?.m ?? 0), l: 'Mins' },
                    { v: pad(timeLeft?.s ?? 0), l: 'Secs' },
                  ].map(({ v, l }) => (
                    <div key={l} className="flex flex-col items-center gap-1">
                      <AnimatePresence mode="popLayout">
                        <motion.div
                          key={v}
                          initial={{ y: -8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black text-white"
                          style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.25)' }}
                        >
                          {v}
                        </motion.div>
                      </AnimatePresence>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{l}</span>
                    </div>
                  ))}
                </div>

                <p className="text-slate-500 text-xs">Come back when the time is right 💌</p>

                {/* Bottom bolts */}
                <div className="flex justify-between mt-6 px-4">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="w-3 h-3 rounded-full bg-slate-600 border border-slate-500 shadow-inner" />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : !opened ? (
            /* ── READY TO OPEN ── */
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5 }}
              onClick={handleOpen}
              className="rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer"
              style={{
                background: 'linear-gradient(160deg,#1e293b,#0f172a)',
                border: '1.5px solid rgba(244,63,94,0.3)',
                boxShadow: '0 30px 80px rgba(244,63,94,0.25)',
              }}
            >
              <div className="p-8 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="text-6xl mb-4"
                >
                  🔓
                </motion.div>
                <p className="text-white font-black text-xl mb-2">The Vault Is Open!</p>
                <p className="text-slate-400 text-sm mb-6">Tap to reveal your time capsule message</p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black text-white"
                  style={{ background: 'linear-gradient(90deg,#f43f5e,#ec4899)' }}>
                  Open Now 💌
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── OPENED ── */
            <motion.div
              key="opened"
              initial={{ opacity: 0, scaleY: 0.2, y: 40 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
              className="rounded-[2.5rem] overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(160deg,#fff0f5,#fdf2f8)',
                border: '2px solid #fda4af',
                boxShadow: '0 20px 60px rgba(244,63,94,0.18)',
              }}
            >
              <div className="p-8">
                <div className="text-center mb-6">
                  <span className="text-4xl">💌</span>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-400 mt-2">
                    Your Time Capsule
                  </p>
                </div>

                {/* Media */}
                {mediaUrl && (
                  <div className="rounded-2xl overflow-hidden mb-6 shadow-md bg-slate-100">
                    {isVideo ? (
                      <video src={mediaUrl} controls className="w-full max-h-72 object-cover" />
                    ) : (
                      <img src={mediaUrl} alt="Time capsule memory" className="w-full max-h-72 object-cover" />
                    )}
                  </div>
                )}

                {/* Message */}
                {message && (
                  <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
                    <p className="font-serif italic text-slate-700 leading-relaxed text-base whitespace-pre-line">
                      "{message}"
                    </p>
                  </div>
                )}

                <p className="text-center text-xs text-rose-300 font-medium mt-5">
                  Written with love, preserved in time 💕
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
