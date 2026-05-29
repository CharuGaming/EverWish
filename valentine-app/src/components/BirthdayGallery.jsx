import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../utils/imageHelpers';

export default function BirthdayGallery({ images = [], primary = '#f59e0b' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [lightbox, setLightbox] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: primary }}>
            📸 Memories
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white">
            Birthday Gallery
          </h2>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="h-px w-16 rounded-full" style={{ backgroundColor: primary, opacity: 0.4 }} />
            <span className="text-lg">🎈</span>
            <div className="h-px w-16 rounded-full" style={{ backgroundColor: primary, opacity: 0.4 }} />
          </div>
        </motion.div>

        {/* Masonry-style CSS Grid */}
        <div
          className="columns-2 md:columns-3 gap-4 space-y-4"
          style={{ columnGap: '1rem' }}
        >
          {images.map((img, i) => {
            const src = typeof img === 'string' ? img : img?.url || img?.imageUrl || '';
            const caption = typeof img === 'object' ? img?.caption : '';
            if (!src) return null;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                className="break-inside-avoid mb-4 group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg"
                onClick={() => setLightbox({ src, caption })}
              >
                <img
                  src={optimizeCloudinaryUrl(src, 600)}
                  alt={caption || `Memory ${i + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-3">
                  {caption && (
                    <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full truncate max-w-full">
                      {caption}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
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
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-50 cursor-pointer"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X size={22} />
            </button>
            <motion.div
              className="relative max-w-3xl max-h-[85vh] flex flex-col items-center cursor-default"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-3xl overflow-hidden shadow-2xl"
                style={{ border: `2px solid ${primary}40` }}
              >
                <img
                  src={optimizeCloudinaryUrl(lightbox.src, 1200)}
                  alt={lightbox.caption}
                  className="max-w-full max-h-[75vh] object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {lightbox.caption && (
                <p className="mt-4 text-white/80 text-sm font-medium text-center">
                  {lightbox.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
