import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function BirthdayMessage({ message, primary = '#f59e0b' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  if (!message) return null;

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2.5rem] p-8 md:p-12 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${primary}18 0%, ${primary}08 100%)`,
            border: `1.5px solid ${primary}30`,
            boxShadow: `0 20px 60px ${primary}20, inset 0 1px 0 ${primary}30`
          }}
        >
          {/* Decorative corner lines */}
          <span
            className="absolute top-5 left-5 text-4xl opacity-20 font-serif leading-none select-none"
            style={{ color: primary }}
          >
            ❝
          </span>
          <span
            className="absolute bottom-5 right-5 text-4xl opacity-20 font-serif leading-none rotate-180 select-none"
            style={{ color: primary }}
          >
            ❝
          </span>

          {/* Subtle top accent line */}
          <div
            className="absolute top-0 left-12 right-12 h-px rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${primary}60, transparent)` }}
          />

          {/* Section label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-center mb-8"
            style={{ color: primary }}
          >
            💌 A Special Message
          </motion.p>

          {/* Message text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="text-xl md:text-2xl font-serif italic text-center leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap relative z-10"
          >
            {message}
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <div className="h-px w-12 rounded-full" style={{ backgroundColor: primary, opacity: 0.4 }} />
            <span className="text-xl">🎂</span>
            <div className="h-px w-12 rounded-full" style={{ backgroundColor: primary, opacity: 0.4 }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
