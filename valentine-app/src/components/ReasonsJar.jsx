import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PAPER_COLORS = [
  'bg-rose-100 border-rose-300',
  'bg-pink-100 border-pink-300',
  'bg-fuchsia-100 border-fuchsia-300',
  'bg-red-100 border-red-300',
  'bg-orange-100 border-orange-300',
  'bg-purple-100 border-purple-300',
];

export default function ReasonsJar({ reasons = [] }) {
  const [chosen, setChosen] = useState(null);

  if (!reasons || reasons.length === 0) return null;

  const pickReason = () => {
    const idx = Math.floor(Math.random() * reasons.length);
    setChosen(reasons[idx]);
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-400 mb-2">
            💌 Why I Love You
          </p>
          <h2 className="text-3xl font-black text-slate-800">The Love Jar</h2>
          <p className="text-slate-500 text-sm mt-2">
            {reasons.length} little reasons, all for you.
          </p>
        </motion.div>

        {/* Glassmorphism Jar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 180 }}
          onClick={pickReason}
          className="relative cursor-pointer group"
        >
          {/* Jar lid */}
          <div className="w-48 h-7 mx-auto bg-rose-200/80 backdrop-blur-md rounded-t-2xl border border-rose-300/60 flex items-center justify-center mb-0 z-10 relative">
            <div className="w-24 h-2 bg-rose-300/60 rounded-full" />
          </div>

          {/* Jar body */}
          <div
            className="rounded-b-[3rem] rounded-t-lg min-h-[220px] p-5 relative overflow-hidden border border-white/50"
            style={{
              background: 'rgba(255,255,255,0.22)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 40px rgba(244,63,94,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
            }}
          >
            {/* Shine */}
            <div className="absolute top-0 left-2 w-6 h-full bg-white/20 rounded-full blur-sm pointer-events-none" />

            {/* Folded paper slips */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {reasons.slice(0, 12).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: [(i % 2 === 0 ? -8 : 6), (i % 2 === 0 ? -4 : 10), (i % 2 === 0 ? -8 : 6)] }}
                  transition={{ repeat: Infinity, duration: 3 + i * 0.3, ease: 'easeInOut' }}
                  className={`w-10 h-8 rounded-sm border shadow-sm transform ${PAPER_COLORS[i % PAPER_COLORS.length]}`}
                  style={{ borderRadius: '2px 6px 6px 2px' }}
                >
                  {/* Fold line */}
                  <div className="w-px h-full bg-current opacity-20 ml-2" />
                </motion.div>
              ))}
            </div>

            {/* CTA hint */}
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="text-center text-xs font-bold text-rose-400 uppercase tracking-widest mt-5"
            >
              Tap to draw a reason 💕
            </motion.p>
          </div>
        </motion.div>

        {/* Count badge */}
        <p className="text-center text-slate-400 text-xs mt-3 font-mono">
          {reasons.length} reasons inside
        </p>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {chosen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setChosen(null)}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.4, y: 80, rotate: -10 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.4, y: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
              style={{ border: '2px solid #fda4af' }}
            >
              {/* Decorative torn edge top */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-rose-50"
                style={{ clipPath: 'polygon(0 0,4% 100%,8% 0,12% 100%,16% 0,20% 100%,24% 0,28% 100%,32% 0,36% 100%,40% 0,44% 100%,48% 0,52% 100%,56% 0,60% 100%,64% 0,68% 100%,72% 0,76% 100%,80% 0,84% 100%,88% 0,92% 100%,96% 0,100% 100%,100% 0)' }}
              />
              <span className="text-4xl block mb-4 mt-4">💌</span>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-400 mb-4">
                A reason I love you
              </p>
              <p className="text-xl font-serif italic text-slate-800 leading-relaxed mb-6">
                "{chosen}"
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setChosen(null)}
                className="text-xs font-bold text-rose-400 hover:text-rose-600 uppercase tracking-widest cursor-pointer"
              >
                Close ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
