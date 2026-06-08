/**
 * LoveLetterEnvelope.jsx
 * Scroll-triggered envelope pull-out animation.
 * The letter card slides up out of the envelope as user scrolls.
 */
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FONT_LINK_LETTER = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&display=swap';

const ENVELOPE_STYLE = {
  background: 'linear-gradient(145deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)',
  boxShadow: '0 25px 80px rgba(0,0,0,0.4), 0 8px 30px rgba(251,191,36,0.2)',
};

const LETTER_STYLE = {
  background: 'linear-gradient(160deg, #fffdf5 0%, #fefce8 100%)',
  boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
};

export default function LoveLetterEnvelope({ content }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Letter pulls out as scroll increases
  const letterY     = useTransform(scrollYProgress, [0.1, 0.55], ['55%', '-42%']);
  const letterScale = useTransform(scrollYProgress, [0.1, 0.55], [0.88, 1]);
  const letterOpacity = useTransform(scrollYProgress, [0.08, 0.2], [0, 1]);
  // Envelope flap opens as letter comes out
  const flapRotate  = useTransform(scrollYProgress, [0.1, 0.4], [0, -170]);

  if (!content) return null;

  return (
    <>
      <link href={FONT_LINK_LETTER} rel="stylesheet" />
      {/* sticky scroll container — 200vh gives scroll room */}
      <div ref={containerRef} style={{ height: '220vh' }}>
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6">

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 z-10"
          >
            <span className="text-3xl block mb-3">💌</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-4xl md:text-5xl font-light text-white">
              A Letter For You
            </h2>
            <p className="text-white/40 text-sm mt-2">Scroll to open ↓</p>
          </motion.div>

          {/* Envelope + Letter wrapper */}
          <div className="relative w-full max-w-sm" style={{ height: '320px' }}>

            {/* ── Envelope Back (bottom layer) ── */}
            <div
              className="absolute inset-0 rounded-2xl z-0 overflow-hidden"
              style={ENVELOPE_STYLE}
            >
              {/* Bottom triangle fold */}
              <div className="absolute bottom-0 left-0 right-0 h-0 border-l-[180px] border-r-[180px] border-b-[120px] border-l-transparent border-r-transparent"
                style={{ borderBottomColor: '#d97706' }} />
              {/* Left fold */}
              <div className="absolute top-0 left-0 w-0 h-0 border-t-[160px] border-r-[180px] border-t-transparent"
                style={{ borderRightColor: '#f59e0b' }} />
              {/* Right fold */}
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[160px] border-l-[180px] border-t-transparent"
                style={{ borderLeftColor: '#f59e0b' }} />
            </div>

            {/* ── Envelope Flap (top, rotates open) ── */}
            <motion.div
              className="absolute top-0 left-0 right-0 z-20 origin-top overflow-hidden"
              style={{ rotate: flapRotate, height: '160px' }}
            >
              <div className="w-0 h-0 mx-auto"
                style={{
                  borderLeft: '180px solid transparent',
                  borderRight: '180px solid transparent',
                  borderTop: '160px solid #fbbf24',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                }} />
            </motion.div>

            {/* ── The Letter Card (slides up) ── */}
            <motion.div
              className="absolute left-2 right-2 z-10 rounded-xl p-6 overflow-y-auto"
              style={{
                ...LETTER_STYLE,
                y: letterY,
                scale: letterScale,
                opacity: letterOpacity,
                top: '12px',
                maxHeight: '420px',
                transformOrigin: 'bottom center',
              }}
            >
              {/* Ruled lines decoration */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="absolute left-6 right-6 h-px bg-amber-100"
                  style={{ top: `${60 + i * 28}px` }} />
              ))}
              {/* Letter content */}
              <div className="relative z-10">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.2rem', lineHeight: '1.9', color: '#3b1a00' }}
                  className="whitespace-pre-line">
                  {content}
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}
