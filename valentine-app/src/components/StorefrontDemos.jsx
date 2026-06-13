import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { getPublicDemos } from '../api';

export default function StorefrontDemos() {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPublicDemos()
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setDemos(res.data);
        } else {
          setError('Failed to load active demos.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching storefront demos:', err);
        setError('Error fetching storefront demos. Please try again later.');
        setLoading(false);
      });
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
    })
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-3">
          <Sparkles size={12} className="text-rose-500 animate-pulse" />
          Live Examples
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          See Real EverWish Pages
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm">
          Click to view live examples built for our customers. See how templates look with actual couple photos, music, and love letters!
        </p>
      </div>

      {loading ? (
        // Loading Skeleton State
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white/40 border border-white/60 rounded-3xl p-4 animate-pulse flex flex-col gap-4 animate-pulse">
              <div className="w-full h-48 bg-slate-200/50 rounded-2xl" />
              <div className="h-4 bg-slate-200/60 rounded-md w-3/4" />
              <div className="h-3 bg-slate-200/50 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        // Elegant Error Message
        <div className="flex flex-col items-center justify-center p-8 bg-white/40 border border-white/60 rounded-3xl max-w-md mx-auto text-center backdrop-blur-xl">
          <AlertCircle className="text-rose-500 w-10 h-10 mb-3" />
          <p className="text-slate-700 text-sm font-semibold mb-1">{error}</p>
          <p className="text-slate-400 text-xs">Standard templates are still available for selection below.</p>
        </div>
      ) : demos.length === 0 ? (
        // Empty state
        <div className="text-center py-8 text-slate-400 text-sm font-medium">
          No live storefront demos are currently featured. Check back soon!
        </div>
      ) : (
        // Demo Cards Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo, i) => (
            <motion.a
              key={demo.slug || i}
              href={demo.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -4 }}
              className="group flex flex-col bg-white/50 backdrop-blur-xl border border-white/70 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-rose-100/30 transition-all duration-300 h-full"
            >
              {/* Preview Image / Sleek Glassmorphic Fallback */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                {demo.previewImage ? (
                  <img
                    src={demo.previewImage}
                    alt={demo.clientNames}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  // Sleek, glassmorphic fallback UI if preview image is missing
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-rose-300/10 to-purple-400/20 flex flex-col items-center justify-center p-6 text-center select-none">
                    <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center shadow-md border border-white/80 mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="text-rose-500 w-6 h-6 fill-rose-500/10" />
                    </div>
                    <span className="text-rose-600/90 text-[10px] font-black uppercase tracking-[0.2em]">EverWish Demo</span>
                  </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer">
                  <Eye className="text-white w-7 h-7 drop-shadow-md" />
                  <span className="text-white text-xs font-bold uppercase tracking-widest drop-shadow-sm">View Live Site</span>
                </div>
              </div>

              {/* Card Footer Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="inline-block text-[9px] font-black tracking-widest uppercase text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full mb-2 border border-rose-200/20">
                    {demo.templateName}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-rose-600 transition-colors">
                    {demo.clientNames}
                  </h3>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100/50 pt-3 mt-4 text-xs font-bold text-rose-500">
                  <span>Explore Design</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
