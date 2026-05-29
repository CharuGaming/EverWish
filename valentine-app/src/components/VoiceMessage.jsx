import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceMessage({ audioUrl, primary = '#f59e0b' }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  if (!audioUrl) return null;

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      // Pause all other audio elements on the page (like background music)
      document.querySelectorAll('audio').forEach(el => {
        if (el !== audio) el.pause();
      });
      audio.play().catch(err => {
        console.error("Audio play failed:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
  };

  const handleScrub = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    audio.currentTime = x * audio.duration;
  };

  const handleEnded = () => { setPlaying(false); setProgress(0); setCurrentTime(0); };

  // Bar count for waveform visualiser
  const BARS = 28;

  return (
    <section className="py-20 px-6">
      <div className="max-w-lg mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-2" style={{ color: primary }}>
            🎙️ A Special Message
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800">
            Voice Note For You
          </h2>
        </motion.div>

        {/* Cassette Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-[2.5rem] p-6 md:p-8 overflow-hidden relative"
          style={{
            background: 'linear-gradient(145deg,#1e1b4b,#312e81)',
            boxShadow: `0 25px 70px ${primary}30`,
          }}
        >
          {/* Sheen */}
          <div className="absolute inset-0 opacity-10"
            style={{ background: 'linear-gradient(130deg,rgba(255,255,255,0.3) 0%,transparent 60%)' }} />

          {/* Cassette spools */}
          <div className="flex items-center justify-center gap-8 mb-6">
            {[0, 1].map((i) => (
              <div key={i} className="relative w-14 h-14">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-white/20" />
                {/* Inner spool */}
                <motion.div
                  className="absolute inset-2 rounded-full border-4 border-white/30 flex items-center justify-center"
                  animate={playing ? { rotate: i === 0 ? 360 : -360 } : {}}
                  transition={playing ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
                >
                  <div className="w-3 h-3 rounded-full bg-white/50" />
                  {/* Spokes */}
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <div
                      key={deg}
                      className="absolute w-px h-2.5 bg-white/30 origin-bottom"
                      style={{ transform: `rotate(${deg}deg) translateX(-50%)`, bottom: '50%', left: '50%' }}
                    />
                  ))}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Label strip */}
          <div
            className="rounded-xl px-4 py-2 mb-6 text-center"
            style={{ background: `linear-gradient(90deg,${primary}dd,${primary}88)` }}
          >
            <p className="text-white font-black text-sm tracking-widest uppercase">
              🎵 Birthday Message
            </p>
          </div>

          {/* Waveform visualiser */}
          <div className="flex items-end justify-center gap-[3px] h-10 mb-5">
            {Array.from({ length: BARS }).map((_, i) => {
              const barProgress = (i / BARS) * 100;
              const played = barProgress <= progress;
              const h = 20 + Math.abs(Math.sin(i * 0.7 + 1) * 25 + Math.cos(i * 0.4) * 15);
              return (
                <motion.div
                  key={i}
                  className="rounded-full flex-1"
                  style={{
                    height: h,
                    background: played ? primary : 'rgba(255,255,255,0.15)',
                    transition: 'background 0.15s',
                  }}
                  animate={playing && played ? { scaleY: [1, 1.3, 0.8, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 + (i % 5) * 0.1, repeat: Infinity }}
                />
              );
            })}
          </div>

          {/* Scrub bar */}
          <div
            className="h-1.5 rounded-full bg-white/10 cursor-pointer mb-3 overflow-hidden relative"
            onClick={handleScrub}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ width: `${progress}%`, background: primary }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Time */}
          <div className="flex justify-between text-[11px] font-mono text-white/40 mb-5">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>

          {/* Play / Pause */}
          <div className="flex justify-center">
            <motion.button
              onClick={toggle}
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.06 }}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl cursor-pointer"
              style={{ background: `linear-gradient(135deg,${primary},${primary}cc)` }}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {playing ? (
                  <motion.svg key="pause" width="22" height="22" viewBox="0 0 24 24" fill="white"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <rect x="5" y="4" width="4" height="16" rx="1" />
                    <rect x="15" y="4" width="4" height="16" rx="1" />
                  </motion.svg>
                ) : (
                  <motion.svg key="play" width="22" height="22" viewBox="0 0 24 24" fill="white"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <path d="M6 4l14 8-14 8V4z" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <audio
            ref={audioRef}
            src={audioUrl}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            onEnded={handleEnded}
          />
        </motion.div>
      </div>
    </section>
  );
}
