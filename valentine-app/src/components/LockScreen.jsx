import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useCallback } from "react";
import { Heart } from "lucide-react";

const MAX_TAPS = 10;

export default function LockScreen({ onUnlock, onUnlockImmediate, lockScreenPrompt, valentineMessage, themeColors }) {
  const [tapCount, setTapCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const colors = themeColors?.polaroid || {};
  const primaryColor = colors.primary || '#e11d48';
  const backgroundColor = 'transparent';

  const handleTap = useCallback(() => {
    if (tapCount >= MAX_TAPS) return;

    const next = tapCount + 1;
    setTapCount(next);

    if (next >= MAX_TAPS) {
      if (onUnlockImmediate) onUnlockImmediate();
      setShowMessage(true);
      setTimeout(() => {
        onUnlock();
      }, 1800);
    }
  }, [tapCount, onUnlock, onUnlockImmediate]);

  const overlayOpacity = tapCount / MAX_TAPS;

  // Optimize filter animation (which is very expensive to redraw on low-end devices)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const heartAnimation = shouldReduceMotion 
    ? {} 
    : {
        scale: [1, 1.12, 1],
        opacity: [0.9, 1, 0.9]
      };

  return (
    <motion.div
      key="lockscreen"
      className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden z-50"
      style={{ backgroundColor, willChange: "transform, opacity" }}
      onClick={handleTap}
      exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.5 } }}
    >
      {/* Dynamic overlay that fills as you tap (glassmorphic tint instead of solid color) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: overlayOpacity * 0.85 }}
        transition={{ duration: 0.2 }}
        style={{
          backgroundColor: primaryColor,
          backdropFilter: shouldReduceMotion ? 'none' : `blur(${overlayOpacity * 8}px)`,
          WebkitBackdropFilter: shouldReduceMotion ? 'none' : `blur(${overlayOpacity * 8}px)`,
          willChange: "opacity",
        }}
      />

      <AnimatePresence mode="wait">
        {!showMessage ? (
          <motion.div
            key="tap-ui"
            className="relative z-10 flex flex-col items-center gap-6 text-center px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
            style={{ willChange: "transform, opacity" }}
          >
            {/* Pulsing heart (hardware-accelerated, no filter redrawing loops) */}
            <motion.div
              animate={heartAnimation}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                willChange: "transform",
                filter: shouldReduceMotion ? 'none' : `drop-shadow(0 4px 12px ${primaryColor}44)`
              }}
            >
              <Heart
                size={96}
                fill={overlayOpacity > 0.5 ? "white" : primaryColor}
                color={overlayOpacity > 0.5 ? "white" : primaryColor}
              />
            </motion.div>

            {/* Prompt text */}
            <motion.p
              className="serif text-2xl md:text-3xl font-semibold drop-shadow-md"
              style={{ color: "white" }}
            >
              {lockScreenPrompt || 'Tap until the screen is full red'}
            </motion.p>

            {/* Tap dots */}
            <div className="flex gap-2 mt-2">
              {Array.from({ length: MAX_TAPS }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border-2"
                  style={{
                    borderColor: "white",
                    backgroundColor: i < tapCount ? "white" : "transparent",
                    boxShadow: i < tapCount && !shouldReduceMotion ? "0 0 10px rgba(255,255,255,0.8)" : "none",
                    willChange: "transform, background-color"
                  }}
                  animate={i < tapCount && !shouldReduceMotion ? { scale: [1.3, 1] } : {}}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            <p
              className="text-sm font-medium tracking-wider uppercase drop-shadow-md"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              {MAX_TAPS - tapCount > 0
                ? `${MAX_TAPS - tapCount} more tap${MAX_TAPS - tapCount !== 1 ? "s" : ""} to go…`
                : ""}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            className="relative z-10 flex flex-col items-center gap-4 text-center px-8"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            style={{ willChange: "transform, opacity" }}
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ willChange: "transform" }}
            >
              <Heart size={80} fill="white" color="white" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
            </motion.div>
            <h1 className="serif text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {valentineMessage || "Happy Valentine's Day!"}
            </h1>
            <p className="text-white/90 text-lg font-light tracking-wide drop-shadow-md">
              💕 Just for you…
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
