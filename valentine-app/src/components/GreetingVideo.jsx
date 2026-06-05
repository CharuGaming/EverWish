import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Video } from 'lucide-react';

/**
 * GreetingVideo — Premium video player for personal greeting videos.
 * Appears below the hero section with a glassmorphic border and smooth reveal.
 *
 * Props:
 *   videoUrl {string}  - Cloudinary video URL
 *   primary  {string}  - Theme color for accents (default amber)
 */
export default function GreetingVideo({ videoUrl, primary = '#f59e0b' }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  if (!videoUrl) return null;

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
    } else {
      // Pause all other audio/video on the page
      document.querySelectorAll('audio, video').forEach(el => {
        if (el !== v) el.pause();
      });
      v.play().catch(() => {});
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="py-16 px-6"
    >
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-2" style={{ color: primary }}>
            🎬 A Personal Message
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white">
            Video For You
          </h2>
        </div>

        {/* Video Player Card */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
          style={{
            border: `1.5px solid ${primary}40`,
            boxShadow: `0 20px 60px ${primary}20, 0 0 0 1px ${primary}15`,
          }}
          onClick={toggle}
        >
          {/* Glassmorphic top bar */}
          <div
            className="relative px-5 py-3 flex items-center gap-3"
            style={{
              background: `linear-gradient(90deg, ${primary}22, ${primary}0a)`,
              borderBottom: `1px solid ${primary}25`,
            }}
          >
            <Video size={16} style={{ color: primary }} />
            <span className="text-sm font-black uppercase tracking-widest" style={{ color: primary }}>
              Personal Greeting
            </span>
            <div className="ml-auto flex gap-1.5">
              {['#f43f5e', '#fbbf24', '#34d399'].map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c, opacity: 0.7 }} />
              ))}
            </div>
          </div>

          {/* Video element */}
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            controls
            className="w-full max-h-[480px] object-cover bg-black"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />

          {/* Hover overlay when paused */}
          {!playing && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ top: '44px' }} // offset below the top bar
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm"
                style={{
                  background: `${primary}cc`,
                  boxShadow: `0 0 30px ${primary}80`,
                }}
              >
                <Play size={24} className="text-white ml-1" fill="white" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom glow line */}
        <div
          className="mx-auto mt-6 h-px rounded-full max-w-xs"
          style={{ background: `linear-gradient(90deg, transparent, ${primary}60, transparent)` }}
        />
      </div>
    </motion.section>
  );
}
