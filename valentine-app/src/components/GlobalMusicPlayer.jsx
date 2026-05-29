import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music } from 'lucide-react';

export default function GlobalMusicPlayer({ musicData }) {
  const { audioUrl, thumbnailUrl, isEnabled } = musicData || {};
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);

  // Fallback thumbnail if none is provided
  const defaultThumbnail = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300";
  const displayThumbnail = thumbnailUrl || defaultThumbnail;

  useEffect(() => {
    if (!isEnabled || !audioUrl) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    const attemptPlay = () => {
      if (!audio.paused) return;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setHasInteracted(true);
            removeListeners();
          })
          .catch((error) => {
            console.log("Autoplay prevented:", error);
          });
      }
    };

    const handleInteraction = () => {
      attemptPlay();
    };

    // Listeners for first interaction to trigger audio
    window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
    window.addEventListener('click', handleInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });

    const removeListeners = () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    return () => {
      removeListeners();
      audio.pause();
    };
  }, [audioUrl, isEnabled]);

  const togglePlay = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().then(() => {
        setHasInteracted(true);
      }).catch(err => console.error("Play failed", err));
    }
  };

  if (!isEnabled || !audioUrl) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        >
          {/* Status Tooltip */}
          <AnimatePresence>
            {!isPlaying && !hasInteracted && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="hidden md:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-slate-200"
              >
                <Music size={14} className="text-slate-600 animate-pulse" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Scroll to play</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Record Player Widget */}
          <button
            onClick={togglePlay}
            className="relative group w-16 h-16 rounded-full shadow-2xl focus:outline-none hover:scale-105 transition-transform"
          >
            {/* The Record (Spinning image) */}
            <div className={`w-full h-full rounded-full overflow-hidden border-4 border-slate-900 bg-black ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
              <img src={displayThumbnail} alt="Music Record" className="w-full h-full object-cover opacity-80" />
              {/* Record center hole */}
              <div className="absolute inset-0 m-auto w-3 h-3 bg-white rounded-full border border-slate-300" />
            </div>

            {/* Play/Pause Overlay Icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
              {isPlaying ? (
                <Pause size={24} className="text-white fill-white" />
              ) : (
                <Play size={24} className="text-white fill-white ml-1" />
              )}
            </div>
          </button>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
