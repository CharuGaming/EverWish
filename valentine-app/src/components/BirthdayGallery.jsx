import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../utils/imageHelpers';

// Pre-defined random rotations for a playful polaroid look
const ROTATIONS = [
  "-rotate-2", "rotate-2", "-rotate-1", "rotate-3", "-rotate-3", "rotate-1"
];

export default function BirthdayGallery({ images = [], primary = '#f59e0b', customTitles }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [lightbox, setLightbox] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: primary }}>
            📸 Memories
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-2">
            {customTitles?.gallerySectionTitle || "Birthday Gallery"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Tap a photo to relive the moment
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="h-px w-16 rounded-full" style={{ backgroundColor: primary, opacity: 0.4 }} />
            <span className="text-lg">🎈</span>
            <div className="h-px w-16 rounded-full" style={{ backgroundColor: primary, opacity: 0.4 }} />
          </div>
        </motion.div>

        {/* Polaroid Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {images.map((img, i) => {
            const src     = typeof img === 'string' ? img : img?.url || img?.imageUrl || '';
            const caption = typeof img === 'object' ? img?.caption : '';
            if (!src) return null;
            const optimised = optimizeCloudinaryUrl(src, 600);
            const rotationClass = ROTATIONS[i % ROTATIONS.length];

            return (
              <motion.div
                key={i}
                className={`polaroid cursor-pointer transform ${rotationClass} hover:rotate-0 hover:z-20 transition-all duration-300`}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setLightbox({ src, caption })}
              >
                <div className="w-full aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={optimised}
                    alt={caption || `Memory ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="serif text-lg font-medium text-slate-800 tracking-wide">
                    {caption || "Beautiful Moment"}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 z-50 cursor-pointer"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <motion.div
              className="relative max-w-5xl w-full flex flex-col items-center justify-center pointer-events-auto cursor-default"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white p-3 md:p-4 pb-12 md:pb-16 rounded-sm shadow-2xl max-w-full inline-block">
                <img
                  src={optimizeCloudinaryUrl(lightbox.src, 1200)}
                  alt={lightbox.caption}
                  className="max-w-full max-h-[75vh] object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <p className="serif text-center text-slate-800 italic text-xl md:text-2xl mt-6 font-medium">
                  {lightbox.caption || "Beautiful Moment"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
