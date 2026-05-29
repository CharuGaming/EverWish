import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Gift, X, Sparkles } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../utils/imageHelpers';

export default function BirthdayGift({ gift, primary = '#f59e0b' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [opened, setOpened] = useState(false);

  if (!gift || (!gift.imageUrl && !gift.message)) return null;

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-lg mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: primary }}>
            🎁 Just For You
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white">
            A Special Gift
          </h2>
          <p className="text-slate-500 mt-3 text-sm leading-relaxed max-w-xs mx-auto">
            A little something with all my love — tap to unwrap your surprise!
          </p>
        </motion.div>

        {/* Gift Box Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <motion.button
            onClick={() => setOpened(true)}
            whileHover={{ scale: 1.06, rotate: [-1, 1, -1] }}
            whileTap={{ scale: 0.95 }}
            transition={{ rotate: { duration: 0.3 } }}
            className="relative inline-flex flex-col items-center gap-4 px-10 py-8 rounded-[2rem] font-black text-white shadow-2xl cursor-pointer select-none overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${primary}, ${primary}cc)`,
              boxShadow: `0 20px 60px ${primary}50`
            }}
            aria-label="Unwrap your gift"
          >
            {/* Shimmer overlay */}
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
              }}
            />
            <Gift size={40} className="drop-shadow-lg" />
            <span className="text-lg tracking-wide drop-shadow">Tap to Unwrap 🎁</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Gift Modal */}
      <AnimatePresence>
        {opened && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-lg p-6 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpened(false)}
          >
            {/* Confetti burst particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute pointer-events-none text-2xl"
                style={{ top: '50%', left: '50%' }}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [0, 1.5, 1],
                  x: (Math.cos((i / 12) * Math.PI * 2) * (100 + Math.random() * 100)),
                  y: (Math.sin((i / 12) * Math.PI * 2) * (100 + Math.random() * 100)),
                }}
                transition={{ duration: 1.2, delay: 0.1 + i * 0.03, ease: 'easeOut' }}
              >
                {['🎁','✨','🎊','🎂','🌟','💖','🎈','⭐'][i % 8]}
              </motion.div>
            ))}

            <motion.div
              className="relative max-w-md w-full cursor-default rounded-[2rem] overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(160deg, #ffffff 0%, #f8f8ff 100%)',
                border: `2px solid ${primary}30`
              }}
              initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent bar */}
              <div
                className="h-2 w-full"
                style={{ background: `linear-gradient(90deg, ${primary}, ${primary}88)` }}
              />

              <button
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer z-10"
                onClick={() => setOpened(false)}
                aria-label="Close gift"
              >
                <X size={18} />
              </button>

              {/* Gift image */}
              {gift.imageUrl && (
                <div className="relative overflow-hidden">
                  <img
                    src={optimizeCloudinaryUrl(gift.imageUrl, 800)}
                    alt="Your gift"
                    className="w-full max-h-72 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, ${primary}20, transparent)` }}
                  />
                </div>
              )}

              {/* Gift message */}
              <div className="p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles size={18} style={{ color: primary }} />
                  <span
                    className="text-xs font-bold uppercase tracking-[0.25em]"
                    style={{ color: primary }}
                  >
                    With Love
                  </span>
                  <Sparkles size={18} style={{ color: primary }} />
                </div>

                {gift.message && (
                  <p className="text-slate-700 font-serif italic text-lg leading-relaxed">
                    "{gift.message}"
                  </p>
                )}

                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="h-px w-10 rounded-full" style={{ backgroundColor: primary, opacity: 0.4 }} />
                  <span className="text-2xl">🎂</span>
                  <div className="h-px w-10 rounded-full" style={{ backgroundColor: primary, opacity: 0.4 }} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
