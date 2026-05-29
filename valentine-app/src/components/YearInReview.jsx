import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PALETTE = [
  { bg: '#1db954', text: '#fff' },
  { bg: '#f59e0b', text: '#1e1b4b' },
  { bg: '#ec4899', text: '#fff' },
  { bg: '#8b5cf6', text: '#fff' },
  { bg: '#22d3ee', text: '#0f172a' },
  { bg: '#f43f5e', text: '#fff' },
  { bg: '#6366f1', text: '#fff' },
  { bg: '#fb923c', text: '#fff' },
];

function StatCard({ label, value, index, inView }) {
  const palette = PALETTE[index % PALETTE.length];
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: -2 }}
      animate={inView ? { opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04, rotate: 0 }}
      className="relative rounded-3xl p-6 md:p-8 overflow-hidden"
      style={{ backgroundColor: palette.bg }}
    >
      {/* Background number watermark */}
      <div
        className="absolute -bottom-4 -right-2 text-[7rem] font-black leading-none select-none pointer-events-none"
        style={{ color: 'rgba(0,0,0,0.08)', lineHeight: 1 }}
      >
        {index + 1}
      </div>

      {/* Content */}
      <p className="text-sm font-bold uppercase tracking-[0.2em] mb-4 opacity-70" style={{ color: palette.text }}>
        {label}
      </p>
      <p
        className="text-4xl md:text-5xl font-black leading-none break-words"
        style={{ color: palette.text }}
      >
        {value}
      </p>
    </motion.div>
  );
}

export default function YearInReview({ stats = [], primary = '#f59e0b' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  if (!stats || stats.length === 0) return null;

  return (
    <section ref={ref} className="py-20 px-6 overflow-hidden">
      <div className="max-w-3xl mx-auto">
        {/* Spotify-Wrapped style header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          {/* Pill badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.25em] text-white mb-6 shadow-lg"
            style={{ background: `linear-gradient(135deg,${primary},#ec4899)` }}
          >
            ✦ Year in Review ✦
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-none">
            Your Year,
            <br />
            <span style={{ color: primary }}>By the Numbers</span>
          </h2>
          <p className="text-slate-500 text-sm mt-4 max-w-sm mx-auto leading-relaxed">
            A look back at everything that made this year uniquely, wonderfully <em>yours</em>.
          </p>
        </motion.div>

        {/* Stats grid — alternating full-width and half-width for Spotify-wrapped feel */}
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {stats.map((stat, i) => {
            const isWide = i === 0 || (i % 5 === 0 && i > 0);
            return (
              <div key={i} className={isWide ? 'col-span-2' : 'col-span-1'}>
                <StatCard label={stat.label} value={stat.value} index={i} inView={inView} />
              </div>
            );
          })}
        </div>

        {/* Footer caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center text-slate-400 text-xs mt-10 font-medium tracking-widest uppercase"
        >
          Here's to another incredible year 🥂
        </motion.p>
      </div>
    </section>
  );
}
