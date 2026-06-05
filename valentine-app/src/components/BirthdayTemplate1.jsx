import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import BirthdayLandingPage from './BirthdayLandingPage';
import MidnightCountdown from './MidnightCountdown';

/* ── Particle ───────────────────────────────────────────────────── */
function Particle({ x, color, size, delay, duration }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, bottom: '-5%', width: size, height: size, background: color, filter: 'blur(0.5px)' }}
      animate={{ y: [0, -window.innerHeight * 1.2], opacity: [0, 0.9, 0.7, 0], rotate: [0, 360] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeOut', repeatDelay: Math.random() * 4 }}
    />
  );
}

/* ── 3D Gift Box (pure SVG perspective illusion) ────────────────── */
function Gift3D({ primary, accentLight, accentDark, onClick, isOpen }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotY = useSpring(useTransform(mouseX, [-200, 200], [-18, 18]), { stiffness: 80, damping: 20 });
  const rotX = useSpring(useTransform(mouseY, [-200, 200], [12, -12]), { stiffness: 80, damping: 20 });

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const onMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      style={{ width: 260, height: 260, perspective: 800 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
    >
      <motion.div
        style={{ rotateY: rotY, rotateX: rotX, transformStyle: 'preserve-3d', width: '100%', height: '100%' }}
        animate={isOpen ? { rotateY: [0, 25, -25, 0], rotateX: [-10, 10, -10, 0], scale: [1, 1.05, 0.9, 1.15] } : {
          rotateY: [0, 4, -4, 0],
          rotateX: [0, -3, 3, 0],
        }}
        transition={isOpen ? { duration: 0.7, ease: 'easeInOut' } : {
          duration: 6, repeat: Infinity, ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 260 260" width="260" height="260" style={{ overflow: 'visible' }}>
          <defs>
            {/* Box face - front */}
            <linearGradient id="boxFront" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={accentLight} />
              <stop offset="100%" stopColor={primary} />
            </linearGradient>
            {/* Box face - top */}
            <linearGradient id="boxTop" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={primary} />
              <stop offset="100%" stopColor={accentLight} />
            </linearGradient>
            {/* Box face - side */}
            <linearGradient id="boxSide" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={accentDark} />
              <stop offset="100%" stopColor={primary} />
            </linearGradient>
            {/* Lid front */}
            <linearGradient id="lidFront" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={accentLight} stopOpacity="0.95"/>
              <stop offset="100%" stopColor={primary} stopOpacity="0.9"/>
            </linearGradient>
            {/* Ribbon */}
            <linearGradient id="ribbon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.85"/>
              <stop offset="100%" stopColor="#fff" stopOpacity="0.45"/>
            </linearGradient>
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Shadow */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor={primary} floodOpacity="0.55"/>
            </filter>
          </defs>

          {/* Ambient glow under box */}
          <ellipse cx="130" cy="228" rx="72" ry="14"
            fill={primary} opacity="0.35" filter="url(#glow)" />

          {/* ── Box Body (isometric 3D) ── */}
          {/* Right side face */}
          <path d="M178,108 L218,88 L218,188 L178,208 Z" fill="url(#boxSide)" filter="url(#shadow)" />
          {/* Front face */}
          <path d="M82,108 L178,108 L178,208 L82,208 Z" fill="url(#boxFront)" />
          {/* Top face */}
          <path d="M82,108 L122,88 L218,88 L178,108 Z" fill="url(#boxTop)" />

          {/* Front ribbon vertical */}
          <path d="M124,108 L136,108 L136,208 L124,208 Z" fill="url(#ribbon)" />
          {/* Front ribbon horizontal */}
          <path d="M82,148 L178,148 L178,160 L82,160 Z" fill="url(#ribbon)" />
          {/* Side ribbon vertical */}
          <path d="M178,148 L218,128 L218,140 L178,160 Z" fill="url(#ribbon)" opacity="0.6"/>

          {/* ── Lid ── */}
          <motion.g
            animate={isOpen ? { y: -45, rotate: -18, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: isOpen ? 0.1 : 0 }}
            style={{ originX: '130px', originY: '88px' }}
          >
            {/* Lid right side */}
            <path d="M178,92 L218,72 L218,90 L178,110 Z" fill="url(#boxSide)" opacity="0.85" />
            {/* Lid front */}
            <path d="M82,92 L178,92 L178,110 L82,110 Z" fill="url(#lidFront)" />
            {/* Lid top */}
            <path d="M82,92 L122,72 L218,72 L178,92 Z" fill="url(#boxTop)" opacity="0.95" />

            {/* Lid ribbon vertical */}
            <path d="M124,92 L136,92 L136,110 L124,110 Z" fill="url(#ribbon)" />
            {/* Lid ribbon horizontal top */}
            <path d="M82,92 L178,92 L178,96 L82,96 Z" fill="url(#ribbon)" opacity="0.5" />

            {/* Bow left loop */}
            <ellipse cx="115" cy="68" rx="20" ry="13" fill={primary} opacity="0.9"
              transform="rotate(-20,115,68)" />
            <ellipse cx="113" cy="66" rx="13" ry="8" fill={accentLight} opacity="0.6"
              transform="rotate(-20,113,66)" />
            {/* Bow right loop */}
            <ellipse cx="147" cy="65" rx="20" ry="13" fill={primary} opacity="0.9"
              transform="rotate(20,147,65)" />
            <ellipse cx="149" cy="63" rx="13" ry="8" fill={accentLight} opacity="0.6"
              transform="rotate(20,149,63)" />
            {/* Bow center knot */}
            <ellipse cx="130" cy="67" rx="9" ry="7" fill="#fff" opacity="0.9" />
          </motion.g>

          {/* Shine/gloss on front face */}
          <path d="M90,115 L130,115 L120,135 L82,135 Z" fill="#fff" opacity="0.07" />
        </svg>
      </motion.div>

      {/* Glow ring around box */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ margin: 'auto', width: 200, height: 200, top: 30 }}
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-full h-full rounded-full"
          style={{ background: `radial-gradient(circle, ${primary}40 0%, transparent 70%)` }} />
      </motion.div>
    </motion.div>
  );
}

/* ── Star / sparkle ─────────────────────────────────────────────── */
function Sparkle({ x, y, delay, size = 6, color = '#fff' }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0], rotate: [0, 90, 180] }}
      transition={{ duration: 1.5 + Math.random(), delay, repeat: Infinity, repeatDelay: 2 + Math.random() * 4 }}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
        <path d="M12 2 L13.5 10 L22 12 L13.5 14 L12 22 L10.5 14 L2 12 L10.5 10 Z" />
      </svg>
    </motion.div>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function BirthdayTemplate1({ siteData, onUnlock }) {
  const [unlocked, setUnlocked] = useState(false);
  const [opened, setOpened] = useState(false);
  const primary    = siteData?.themeColors?.bday1?.primary    || '#8b5cf6';
  const accentLight = lighten(primary, 40);
  const accentDark  = darken(primary, 25);

  const particles = useRef(
    Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 3 + Math.random() * 7,
      color: [primary, accentLight, '#fff', '#fbbf24', '#f472b6'][i % 5],
      delay: Math.random() * 8,
      duration: 5 + Math.random() * 7,
    }))
  ).current;

  const sparkles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: `${5 + Math.random() * 90}%`,
      y: `${5 + Math.random() * 85}%`,
      delay: Math.random() * 4,
      size: 8 + Math.random() * 10,
      color: [primary, accentLight, '#fff', '#fbbf24'][i % 4],
    }))
  ).current;

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => {
      setUnlocked(true);
      if (onUnlock) onUnlock();
    }, 900);
  };

  return (
    <MidnightCountdown unlockTime={siteData?.unlockTime}>
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="lockscreen"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
            style={{ background: `radial-gradient(ellipse at 50% 60%, ${primary}22 0%, #0f0a1a 55%, #080510 100%)` }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.7 }}
          >
            {/* Ambient grid */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(${primary}08 1px, transparent 1px), linear-gradient(90deg, ${primary}08 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Particles */}
            {particles.map(p => <Particle key={p.id} {...p} />)}

            {/* Sparkles */}
            {sparkles.map(s => <Sparkle key={s.id} {...s} />)}

            {/* Radial glow center */}
            <div className="absolute pointer-events-none"
              style={{
                width: 500, height: 500,
                background: `radial-gradient(circle, ${primary}18 0%, transparent 70%)`,
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              }}
            />

            {/* Header text */}
            <motion.div
              className="text-center mb-10 relative z-10"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.p
                className="text-xs font-black uppercase tracking-[0.4em] mb-3"
                style={{ color: primary }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨ Something Special Awaits ✨
              </motion.p>
              <h1 className="text-5xl md:text-6xl font-black leading-tight"
                style={{
                  background: `linear-gradient(135deg, #fff 30%, ${accentLight})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))',
                }}
              >
                A Gift<br />
                <span style={{
                  background: `linear-gradient(135deg, ${accentLight}, ${primary})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  For You!
                </span>
              </h1>
            </motion.div>

            {/* 3D Gift Box */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.5, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.5 }}
            >
              <Gift3D primary={primary} accentLight={accentLight} accentDark={accentDark}
                onClick={handleOpen} isOpen={opened} />
            </motion.div>

            {/* Tap hint */}
            <motion.div
              className="mt-10 relative z-10 flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.div
                className="flex items-center gap-2 px-6 py-3 rounded-full border font-bold text-sm uppercase tracking-widest"
                style={{
                  color: primary,
                  borderColor: `${primary}50`,
                  background: `${primary}12`,
                  backdropFilter: 'blur(8px)',
                }}
                animate={{ y: [0, -5, 0], boxShadow: [`0 0 0px ${primary}00`, `0 0 20px ${primary}55`, `0 0 0px ${primary}00`] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  🎁
                </motion.span>
                Tap to Unwrap
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}>
                  🎁
                </motion.span>
              </motion.div>
              <p className="text-white/25 text-[11px] tracking-widest uppercase">Click or tap the gift</p>
            </motion.div>

            {/* Burst of confetti on open */}
            <AnimatePresence>
              {opened && (
                <>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full pointer-events-none z-20"
                      style={{
                        width: 8 + Math.random() * 12,
                        height: 8 + Math.random() * 12,
                        background: [primary, accentLight, '#fbbf24', '#f472b6', '#38bdf8'][i % 5],
                        left: '50%', top: '50%',
                      }}
                      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                      animate={{
                        x: (Math.random() - 0.5) * 600,
                        y: (Math.random() - 0.5) * 500,
                        scale: 0,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <BirthdayLandingPage siteData={siteData} themeColors={siteData?.themeColors?.bday1} />
          </motion.div>
        )}
      </AnimatePresence>
    </MidnightCountdown>
  );
}

/* ── Color helpers ──────────────────────────────────────────────── */
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function toHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.min(255, Math.max(0, v)).toString(16).padStart(2, '0')).join('');
}
function lighten(hex, amount) {
  try {
    const { r, g, b } = hexToRgb(hex);
    return toHex(r + amount, g + amount, b + amount);
  } catch { return hex; }
}
function darken(hex, amount) {
  try {
    const { r, g, b } = hexToRgb(hex);
    return toHex(r - amount, g - amount, b - amount);
  } catch { return hex; }
}
