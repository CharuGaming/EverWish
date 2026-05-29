import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// Calculates exact age breakdown from a birth date
function calcLifeStats(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;

  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Total hours alive
  const diffMs = now - birth;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  return { years, months, days, hours };
}

// Individual stat counter card
function StatCard({ value, label, emoji, color, delay, inView }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!inView || value === 0) {
      setDisplayed(value);
      return;
    }
    const duration = 1800; // ms
    const start = performance.now();
    const startVal = 0;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(startVal + (value - startVal) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="relative flex flex-col items-center justify-center rounded-3xl p-6 md:p-8 overflow-hidden group"
      style={{ background: `${color}18`, border: `1.5px solid ${color}40` }}
    >
      {/* Glow behind */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl blur-2xl"
        style={{ background: color }}
      />
      <span className="text-4xl mb-3 relative z-10">{emoji}</span>
      <span
        className="text-4xl md:text-5xl font-black tabular-nums relative z-10"
        style={{ color }}
      >
        {displayed.toLocaleString()}
      </span>
      <span className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 relative z-10">
        {label}
      </span>
    </motion.div>
  );
}

export default function LifeStats({ birthDate, primary = '#f59e0b' }) {
  const stats = calcLifeStats(birthDate);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  if (!stats) return null;

  const statItems = [
    { value: stats.years,  label: 'Years',  emoji: '🎂', color: primary,    delay: 0   },
    { value: stats.months, label: 'Months', emoji: '🌙', color: '#8b5cf6',  delay: 150 },
    { value: stats.days,   label: 'Days',   emoji: '☀️',  color: '#f43f5e',  delay: 300 },
    { value: stats.hours,  label: 'Hours',  emoji: '⚡',  color: '#22d3ee',  delay: 450 },
  ];

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: primary }}>
            Life in Numbers
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight">
            Your Amazing Journey ✨
          </h2>
          <p className="text-slate-500 mt-3 text-sm max-w-sm mx-auto leading-relaxed">
            Every moment of your life has been a beautiful chapter — here's exactly how much of it you've lived!
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="h-px w-16 rounded-full" style={{ backgroundColor: primary, opacity: 0.4 }} />
            <span className="text-lg">🎉</span>
            <div className="h-px w-16 rounded-full" style={{ backgroundColor: primary, opacity: 0.4 }} />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {statItems.map((s) => (
            <StatCard key={s.label} {...s} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
