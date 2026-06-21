import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BirthdayLandingPage from './BirthdayLandingPage';
import MidnightCountdown from './MidnightCountdown';
import { optimizeCloudinaryUrl } from '../utils/imageHelpers';

/* ─────────────────────────────────────────────────────────────────────────
   Video Gatekeeper — BirthdayTemplate1 (bday1)
   Refactored 3-Phase Flow:
     Phase 1 (Idle): Solid background using gatekeeperBgColor with a centered
                     glassmorphic button displaying gatekeeperButtonText.
     Phase 2 (Playing): Intro video (introVideoUrl) plays full-screen. Button is hidden.
     Phase 3 (Unlocked): Renders BirthdayLandingPage wrapped in a premium "Liquid Glass"
                         layout over a looping HTML5 background video (bgVideoUrl).
───────────────────────────────────────────────────────────────────────── */

export default function BirthdayTemplate1({ siteData, onUnlock }) {
  const [phase, setPhase]       = useState('idle');   // 'idle' | 'playing' | 'unlocked'
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const b = siteData?.birthday || {};
  const primary              = siteData?.themeColors?.bday1?.primary || '#8b5cf6';
  const gatekeeperBgColor    = b.gatekeeperBgColor || '#fdf2f8';
  const gatekeeperButtonText = b.gatekeeperButtonText || 'Tap to Open 🎁';
  const introVideoUrl        = b.introVideoUrl || '';
  const bgVideoUrl           = b.bgVideoUrl || '';
  
  const hasVideo             = !!introVideoUrl && !videoError;

  /* ── Tap handler ─────────────────────────────────────── */
  const handleTap = useCallback(() => {
    if (phase !== 'idle') return;

    if (hasVideo) {
      setPhase('playing');
      // Slight delay so the button exit transition completes
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {
            // Autoplay blocked — unlock immediately
            setPhase('unlocked');
            if (onUnlock) onUnlock();
          });
        } else {
          setPhase('unlocked');
          if (onUnlock) onUnlock();
        }
      }, 150);
    } else {
      // No video — unlock directly
      setPhase('playing');
      setTimeout(() => {
        setPhase('unlocked');
        if (onUnlock) onUnlock();
      }, 600);
    }
  }, [phase, hasVideo, onUnlock]);

  /* ── Video ended ─────────────────────────────────────── */
  const handleVideoEnd = useCallback(() => {
    setPhase('unlocked');
    if (onUnlock) onUnlock();
  }, [onUnlock]);

  /* ── Video load error ────────────────────────────────── */
  const handleVideoError = useCallback(() => {
    setVideoError(true);
    if (phase === 'playing') {
      setPhase('unlocked');
      if (onUnlock) onUnlock();
    }
  }, [phase, onUnlock]);

  return (
    <MidnightCountdown unlockTime={siteData?.unlockTime}>
      <AnimatePresence mode="wait">

        {/* ── Phase 1 & 2: Gatekeeper view ─────────────────────── */}
        {phase !== 'unlocked' && (
          <motion.div
            key="gatekeeper"
            className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ backgroundColor: gatekeeperBgColor }}
          >
            {/* Ambient center glow */}
            <div
              className="absolute pointer-events-none w-[560px] h-[560px] rounded-full opacity-40"
              style={{
                background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)`,
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />

            {/* ── Full-screen video (shown during Phase 2) ─────────── */}
            {hasVideo && (
              <video
                ref={videoRef}
                src={optimizeCloudinaryUrl(introVideoUrl, 1080)}
                playsInline
                preload="metadata"
                onEnded={handleVideoEnd}
                onError={handleVideoError}
                className="absolute inset-0 w-full h-full object-cover z-20"
                style={{
                  opacity: phase === 'playing' ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* ── Button UI (shown during Phase 1) ────────────────── */}
            <AnimatePresence>
              {phase === 'idle' && (
                <motion.div
                  key="idle-ui"
                  className="relative z-10 flex flex-col items-center px-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.button
                    onClick={handleTap}
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 15 }}
                  >
                    {/* Glassmorphic premium button */}
                    <span
                      className="flex items-center gap-3 px-12 py-5 rounded-full font-black text-slate-800 text-xl uppercase tracking-widest shadow-xl border border-white/40 cursor-pointer"
                      style={{
                        background: 'rgba(255, 255, 255, 0.25)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                      }}
                    >
                      {gatekeeperButtonText}
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skip UI (optional fallback overlay during playing phase) */}
            {phase === 'playing' && hasVideo && (
              <div className="absolute inset-x-0 bottom-8 flex justify-center z-30">
                <button
                  onClick={() => {
                    setPhase('unlocked');
                    if (onUnlock) onUnlock();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors"
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  Skip ›
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Phase 3: Unlocked view ───────────────────────────── */}
        {phase === 'unlocked' && (
          <motion.div
            key="unlocked-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative min-h-screen w-full overflow-x-hidden"
          >
            {/* Base Layer (z-0): Looping HTML5 Background Video (or color fallback) */}
            {bgVideoUrl ? (
              <video
                src={optimizeCloudinaryUrl(bgVideoUrl, 1080)}
                autoPlay
                loop
                muted
                playsInline
                className="fixed inset-0 w-full h-full object-cover z-0"
                style={{ pointerEvents: 'none' }}
              />
            ) : (
              <div
                className="fixed inset-0 z-0"
                style={{
                  background: `linear-gradient(to bottom, ${gatekeeperBgColor}, ${primary}15)`,
                }}
              />
            )}

            {/* Content Layer (z-10): Wrapper with Liquid Glass style */}
            <div
              className="relative z-10 min-h-screen bg-white/20 backdrop-blur-md border-x border-white/30 shadow-2xl max-w-4xl mx-auto"
            >
              <BirthdayLandingPage siteData={siteData} themeColors={siteData?.themeColors?.bday1} />
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </MidnightCountdown>
  );
}
