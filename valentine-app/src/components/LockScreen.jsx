import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { Heart } from "lucide-react";

const MAX_TAPS = 10;

export default function LockScreen({ onUnlock, onUnlockImmediate, lockScreenPrompt, valentineMessage, themeColors }) {
  const [tapCount, setTapCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const colors = themeColors?.polaroid || {};
  const primaryColor = colors.primary || '#e11d48';
  const backgroundColor = colors.background || '#fff0f5';

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

  return (
    <motion.div
      key="lockscreen"
      className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
      style={{ backgroundColor }}
      onClick={handleTap}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.7 } }}
    >
      {/* Dynamic overlay that fills as you tap */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: overlayOpacity }}
        transition={{ duration: 0.25 }}
        style={{ backgroundColor: primaryColor }}
      />

      <AnimatePresence mode="wait">
        {!showMessage ? (
          <motion.div
            key="tap-ui"
            className="relative z-10 flex flex-col items-center gap-6 text-center px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
          >
            {/* Pulsing heart */}
            <motion.div
              animate={{
                scale: [1, 1.18, 1],
                filter: [
                  `drop-shadow(0 0 8px ${primaryColor}77)`,
                  `drop-shadow(0 0 28px ${primaryColor})`,
                  `drop-shadow(0 0 8px ${primaryColor}77)`,
                ],
              }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart
                size={96}
                fill={overlayOpacity > 0.5 ? "white" : primaryColor}
                color={overlayOpacity > 0.5 ? "white" : primaryColor}
              />
            </motion.div>

            {/* Prompt text */}
            <motion.p
              className="serif text-2xl md:text-3xl font-semibold"
              style={{ color: overlayOpacity > 0.55 ? "white" : primaryColor }}
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
                    borderColor: overlayOpacity > 0.55 ? "white" : primaryColor,
                    backgroundColor:
                      i < tapCount
                        ? overlayOpacity > 0.55
                          ? "white"
                          : primaryColor
                        : "transparent",
                  }}
                  animate={i < tapCount ? { scale: [1.4, 1] } : {}}
                  transition={{ duration: 0.25 }}
                />
              ))}
            </div>

            <p
              className="text-sm font-medium tracking-wider uppercase"
              style={{ color: overlayOpacity > 0.55 ? "rgba(255,255,255,0.7)" : primaryColor }}
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
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Heart size={80} fill="white" color="white" />
            </motion.div>
            <h1 className="serif text-4xl md:text-6xl font-bold text-white leading-tight">
              {valentineMessage ? valentineMessage.replace('! 💕','').replace('!','') : 'Happy'}<br />Valentine's Day!
            </h1>
            <p className="text-white/70 text-lg font-light tracking-wide">
              💕 Just for you…
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
