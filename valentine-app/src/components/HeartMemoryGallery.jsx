/**
 * HeartMemoryGallery.jsx (Repurposed as Polaroid Masonry Gallery)
 * ─────────────────────────────────────────────────────────────────────
 * Displays 6 photos in a masonry grid of scattered Polaroids.
 * Photos are NOT cropped (using natural aspect ratio w-full h-auto).
 * Clicking a photo triggers a "Locus Unwrap" animation to a full-screen modal.
 */
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { optimizeCloudinaryUrl } from '../utils/imageHelpers';

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,400&family=Dancing+Script:wght@500;700&display=swap';

const DEFAULT_LABELS = ['Proposal 💍', 'First Date ☕', 'Our Travels ✈️', 'Forever 💛', 'Just Us 🌟', 'Beautiful Moments ✨'];

// Randomish rotations for the polaroids to look natural and scattered
const ROTATIONS = [-3, 2, -1, 3, -2, 1];

export default function HeartMemoryGallery({ photos = [], labels = [], showCaptions = true }) {
  const [selected, setSelected]     = useState(null);
  const [originRect, setOriginRect] = useState(null);
  const itemRefs = useRef([]);

  const memLabels = labels.length >= 6 ? labels : DEFAULT_LABELS;
  const imgs      = [...photos].slice(0, 6);
  // pad with placeholders if < 6
  while (imgs.length < 6) imgs.push(null);

  const handleOpen = useCallback((i) => {
    const rect = itemRefs.current[i]?.getBoundingClientRect();
    if (rect) { setOriginRect(rect); setSelected(i); }
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
    setOriginRect(null);
  }, []);

  return (
    <>
      <link href={FONT_LINK} rel="stylesheet" />

      {/* ── Polaroid Grid ─────────────────────────────────── */}
      <div className="w-full py-4 px-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto items-start">
          {imgs.map((img, i) => (
            <div
              key={i}
              className="relative"
            >
              <motion.div
                ref={el => (itemRefs.current[i] = el)}
                className={`bg-[#FDFBF7] p-3 rounded-sm shadow-xl cursor-pointer ${showCaptions ? 'pb-10 sm:pb-12' : 'pb-4 sm:pb-4'}`}
                style={{ 
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
                initial={{ rotate: ROTATIONS[i % ROTATIONS.length] }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => img && handleOpen(i)}
              >
                {/* Photo: Uncropped (h-auto) */}
                {img ? (
                  <img
                    src={optimizeCloudinaryUrl(img, 600)}
                    alt={memLabels[i]}
                    className="w-full h-auto rounded-sm shadow-inner"
                    style={{ display: 'block' }}
                    draggable={false}
                    loading="lazy"
                  />
                ) : (
                  /* Placeholder when no photo */
                  <div className="w-full aspect-square flex items-center justify-center bg-black/5 rounded-sm">
                    <span className="text-black/20 text-3xl">📷</span>
                  </div>
                )}

                {/* Polaroid Caption */}
                {showCaptions && (
                  <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none px-2">
                    <span
                      className="text-[#3B2F25] text-base sm:text-lg font-bold"
                      style={{
                        fontFamily: "'Dancing Script', cursive",
                      }}
                    >
                      {memLabels[i]}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Locus Unwrap Modal ────────────────────────────────── */}
      <AnimatePresence>
        {selected !== null && originRect && imgs[selected] && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              style={{ zIndex: 9998 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
            />

            {/* Expanding card — animates FROM polaroid rect TO full screen */}
            <motion.div
              className="fixed overflow-hidden bg-black"
              style={{ zIndex: 9999 }}
              initial={{
                top:          originRect.top,
                left:         originRect.left,
                width:        originRect.width,
                height:       originRect.height,
                borderRadius: '4px', // match polaroid slightly rounded corners
              }}
              animate={{
                top:          '50%',
                left:         '50%',
                x:            '-50%',
                y:            '-50%',
                width:        'min(95vw, 900px)',
                height:       'min(85vh, 800px)',
                borderRadius: '16px',
              }}
              exit={{
                top:          originRect.top,
                left:         originRect.left,
                x:            0,
                y:            0,
                width:        originRect.width,
                height:       originRect.height,
                borderRadius: '4px',
                opacity:      0,
              }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            >
              {/* Full image — contain so it never crops */}
              <img
                src={optimizeCloudinaryUrl(imgs[selected], 1200)}
                alt={memLabels[selected]}
                className="w-full h-full"
                style={{ objectFit: 'contain' }}
                draggable={false}
              />

              {/* Label bar */}
              {showCaptions && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 px-6 py-6"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                  }}
                >
                  <p
                    className="text-white text-3xl text-center"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    {memLabels[selected]}
                  </p>
                </motion.div>
              )}

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
