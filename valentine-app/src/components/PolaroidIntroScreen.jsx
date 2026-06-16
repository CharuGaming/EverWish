/**
 * PolaroidIntroScreen.jsx
 *
 * Dual-Video intro experience for the Classic Polaroid template.
 *
 * Phase 1 — "Tap to Open" splash:
 *   • Subtle floating Polaroid cards animate in the background.
 *   • A glassmorphic CTA prompts the user to tap.
 *   • No video buffering yet — keeps initial load instant.
 *
 * Phase 2 — Intro video plays full-screen (if introVideoUrl provided):
 *   • The video fills the viewport, object-cover.
 *   • A "Skip" button appears after 2 s.
 *   • On video end OR skip → fade into main template.
 *
 * Phase 3 — If NO introVideoUrl is set:
 *   • The old tap-based lock screen experience runs instead.
 *   • This ensures 100 % backward compatibility.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Heart, SkipForward } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../utils/imageHelpers';

// ── Floating polaroid decoration ──────────────────────────────────────────────
const CARD_CONFIGS = [
  { src: null, rotate: -14, x: '-38%', y: '-18%', scale: 0.72, delay: 0   },
  { src: null, rotate:  11, x:  '34%', y: '-22%', scale: 0.68, delay: 0.3 },
  { src: null, rotate:  -6, x: '-42%', y:  '24%', scale: 0.65, delay: 0.6 },
  { src: null, rotate:   9, x:  '36%', y:  '20%', scale: 0.63, delay: 0.9 },
];

function FloatingPolaroid({ cfg, photoUrl, index }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ x: cfg.x, y: cfg.y, rotate: cfg.rotate, scale: cfg.scale, zIndex: 0 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: [0, 0.7, 0.7],
        y: [30, 0, -8, 0],
      }}
      transition={{
        opacity: { delay: cfg.delay, duration: 0.8 },
        y: { delay: cfg.delay, duration: 4 + index * 0.6, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.92)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          padding: '10px 10px 32px 10px',
          borderRadius: '3px',
          width: '140px',
        }}
      >
        {photoUrl ? (
          <img
            src={optimizeCloudinaryUrl(photoUrl, 400)}
            alt=""
            draggable={false}
            loading="lazy"
            style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '1px', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%', height: '130px', borderRadius: '1px', display: 'block',
              background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ── Main tap-based lock (no intro video) ──────────────────────────────────────
const MAX_TAPS = 10;

function TapLockScreen({ onUnlock, lockScreenPrompt, valentineMessage, primaryColor, shouldReduceMotion }) {
  const [tapCount, setTapCount]   = useState(0);
  const [showMsg,  setShowMsg]    = useState(false);

  const handleTap = useCallback(() => {
    if (tapCount >= MAX_TAPS) return;
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= MAX_TAPS) {
      setShowMsg(true);
      setTimeout(onUnlock, 1800);
    }
  }, [tapCount, onUnlock]);

  const overlayOpacity = tapCount / MAX_TAPS;

  return (
    <motion.div
      key="tap-lock"
      className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
      style={{ zIndex: 50 }}
      onClick={handleTap}
      exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.5 } }}
    >
      {/* Tint overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: overlayOpacity * 0.85 }}
        transition={{ duration: 0.2 }}
        style={{
          backgroundColor: primaryColor,
          backdropFilter: shouldReduceMotion ? 'none' : `blur(${overlayOpacity * 8}px)`,
          WebkitBackdropFilter: shouldReduceMotion ? 'none' : `blur(${overlayOpacity * 8}px)`,
        }}
      />

      <AnimatePresence mode="wait">
        {!showMsg ? (
          <motion.div
            key="tap-ui"
            className="relative z-10 flex flex-col items-center gap-6 text-center px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { scale: [1, 1.12, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ willChange: 'transform', filter: `drop-shadow(0 4px 12px ${primaryColor}44)` }}
            >
              <Heart
                size={96}
                fill={overlayOpacity > 0.5 ? 'white' : primaryColor}
                color={overlayOpacity > 0.5 ? 'white' : primaryColor}
              />
            </motion.div>

            <motion.p className="serif text-2xl md:text-3xl font-semibold drop-shadow-md text-white">
              {lockScreenPrompt || 'Tap until the screen is full red'}
            </motion.p>

            <div className="flex gap-2 mt-2">
              {Array.from({ length: MAX_TAPS }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border-2"
                  style={{
                    borderColor: 'white',
                    backgroundColor: i < tapCount ? 'white' : 'transparent',
                    boxShadow: i < tapCount && !shouldReduceMotion ? '0 0 10px rgba(255,255,255,0.8)' : 'none',
                  }}
                  animate={i < tapCount && !shouldReduceMotion ? { scale: [1.3, 1] } : {}}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            <p className="text-sm font-medium tracking-wider uppercase drop-shadow-md" style={{ color: 'rgba(255,255,255,0.9)' }}>
              {MAX_TAPS - tapCount > 0 ? `${MAX_TAPS - tapCount} more tap${MAX_TAPS - tapCount !== 1 ? 's' : ''} to go…` : ''}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            className="relative z-10 flex flex-col items-center gap-4 text-center px-8"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          >
            <Heart size={80} fill="white" color="white" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
            <h1 className="serif text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {valentineMessage || "Happy Valentine's Day!"}
            </h1>
            <p className="text-white/90 text-lg font-light tracking-wide drop-shadow-md">💕 Just for you…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main PolaroidIntroScreen ──────────────────────────────────────────────────
export default function PolaroidIntroScreen({
  onUnlock,
  introVideoUrl,
  heroPhotos = [],       // optional array of photo URLs for floating polaroids
  lockScreenPrompt,
  valentineMessage,
  introButtonText,
  themeColors,
}) {
  const shouldReduceMotion = useReducedMotion();
  const primaryColor       = themeColors?.polaroid?.primary || '#e11d48';

  // phases: 'splash' | 'video' | 'done'
  const [phase,      setPhase]      = useState('splash');
  const [showSkip,   setShowSkip]   = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);
  const skipTimerRef = useRef(null);

  // If no intro video → fall back to old tap-lock
  const hasVideo = !!introVideoUrl;

  const handleDone = useCallback(() => {
    clearTimeout(skipTimerRef.current);
    setPhase('done');
    setTimeout(onUnlock, 600); // let fade-out animate first
  }, [onUnlock]);

  const handleSplashTap = useCallback(() => {
    if (!hasVideo) return; // tap-lock handles itself
    setPhase('video');
    // show skip button after 2 s
    skipTimerRef.current = setTimeout(() => setShowSkip(true), 2000);
    // start video
    setTimeout(() => videoRef.current?.play(), 100);
  }, [hasVideo]);

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(skipTimerRef.current), []);

  // ── No intro video → old tap-lock ──────────────────────────────────────────
  if (!hasVideo) {
    return (
      <TapLockScreen
        onUnlock={onUnlock}
        lockScreenPrompt={lockScreenPrompt}
        valentineMessage={valentineMessage}
        primaryColor={primaryColor}
        shouldReduceMotion={shouldReduceMotion}
      />
    );
  }

  // ── With intro video ───────────────────────────────────────────────────────
  return (
    <AnimatePresence mode="wait">
      {/* ── PHASE: splash ────────────────────────────────────────────────── */}
      {phase === 'splash' && (
        <motion.div
          key="splash"
          className="fixed inset-0 flex items-center justify-center overflow-hidden cursor-pointer select-none"
          style={{ zIndex: 50, background: 'linear-gradient(135deg, #0a0005 0%, #200012 50%, #0a0005 100%)' }}
          onClick={handleSplashTap}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          {/* Floating polaroid background decoration */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            {CARD_CONFIGS.map((cfg, i) => (
              <FloatingPolaroid
                key={i}
                cfg={cfg}
                photoUrl={heroPhotos[i] || null}
                index={i}
              />
            ))}
          </div>

          {/* Dark vignette over cards */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)' }}
          />

          {/* CTA */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-8 text-center px-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Pulsing heart */}
            <motion.div
              animate={shouldReduceMotion ? {} : { scale: [1, 1.1, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: `drop-shadow(0 0 24px ${primaryColor}88)` }}
            >
              <Heart size={80} fill={primaryColor} color={primaryColor} />
            </motion.div>

            <h1
              className="text-white font-bold text-3xl md:text-5xl leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {valentineMessage || "A surprise, just for you 💕"}
            </h1>

            {/* Glassmorphic tap button */}
            <motion.div
              animate={shouldReduceMotion ? {} : {
                boxShadow: [
                  `0 0 0 0px ${primaryColor}55`,
                  `0 0 0 18px ${primaryColor}00`,
                  `0 0 0 0px ${primaryColor}00`,
                ],
              }}
              transition={{ delay: 1.2, duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              style={{
                borderRadius: '9999px',
                display: 'inline-block',
              }}
            >
              <button
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: `1px solid ${primaryColor}55`,
                  color: '#fff',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  padding: '16px 44px',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: `0 8px 30px ${primaryColor}40`,
                }}
              >
                {introButtonText || '✨ Tap to Open'}
              </button>
            </motion.div>

            <p className="text-white/40 text-xs tracking-widest uppercase animate-pulse mt-2">
              Tap anywhere to begin
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* ── PHASE: video ─────────────────────────────────────────────────── */}
      {phase === 'video' && (
        <motion.div
          key="video"
          className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden"
          style={{ zIndex: 50 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          transition={{ duration: 0.5 }}
        >
          {/* Full-screen intro video */}
          <video
            ref={videoRef}
            src={introVideoUrl}
            playsInline
            muted={false}
            autoPlay={false}
            onEnded={handleDone}
            onCanPlay={() => setVideoReady(true)}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          />

          {/* Loading pulse while video buffers */}
          <AnimatePresence>
            {!videoReady && (
              <motion.div
                key="buf"
                className="relative z-10 flex flex-col items-center gap-3"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="text-5xl"
                >
                  💕
                </motion.div>
                <p className="text-white/50 text-xs tracking-widest uppercase animate-pulse">Loading…</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip button (appears after 2 s) */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                key="skip"
                onClick={handleDone}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-8 right-8 z-20 flex items-center gap-2 px-4 py-2 rounded-full text-white/70 hover:text-white text-sm font-semibold tracking-wide transition-colors cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <SkipForward size={16} />
                Skip
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
