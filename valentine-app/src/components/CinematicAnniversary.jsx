// CinematicAnniversary.jsx — Premium cinematic anniversary/valentine template
// Sections: Intro screen → Video hero → Timer → Love letter → Timeline → Music → Why I Love You

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { differenceInSeconds, intervalToDuration } from 'date-fns';
import { Play, Pause, Volume2, VolumeX, Heart, Music2, Clock, ChevronDown } from 'lucide-react';

// ── Scroll reveal wrapper ──────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0, y = 50 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Relationship Timer ─────────────────────────────────────────────────────
function RelationshipTimer({ startDate }) {
  const [elapsed, setElapsed] = useState({});

  useEffect(() => {
    if (!startDate) return;
    const start = new Date(startDate);
    const tick = () => {
      const now = new Date();
      const totalSecs = differenceInSeconds(now, start);
      if (totalSecs < 0) return;
      const dur = intervalToDuration({ start, end: now });
      setElapsed({
        years:   dur.years   || 0,
        months:  dur.months  || 0,
        days:    dur.days    || 0,
        hours:   dur.hours   || 0,
        minutes: dur.minutes || 0,
        seconds: dur.seconds || 0,
        totalDays: Math.floor(totalSecs / 86400),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startDate]);

  const units = [
    { label: 'Years',   value: elapsed.years },
    { label: 'Months',  value: elapsed.months },
    { label: 'Days',    value: elapsed.days },
    { label: 'Hours',   value: elapsed.hours },
    { label: 'Minutes', value: elapsed.minutes },
    { label: 'Seconds', value: elapsed.seconds },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl py-5 px-3"
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-3xl md:text-4xl font-black text-white tabular-nums leading-none"
            >
              {String(value ?? 0).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
          <span className="text-white/50 text-[10px] uppercase tracking-widest mt-2 font-bold">{label}</span>
        </div>
      ))}
      {elapsed.totalDays != null && (
        <p className="col-span-3 md:col-span-6 text-center text-white/40 text-xs mt-2 font-medium tracking-wide">
          That's <span className="text-rose-400 font-bold">{elapsed.totalDays.toLocaleString()}</span> beautiful days together ❤️
        </p>
      )}
    </div>
  );
}

// ── Custom Audio Player ────────────────────────────────────────────────────
function AudioPlayer({ audioUrl, lyrics }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrent] = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const seek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  if (!audioUrl) return (
    <div className="flex items-center justify-center gap-3 text-white/30 py-8">
      <Music2 size={20} />
      <span className="text-sm">No music uploaded yet</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        muted={muted}
        onTimeUpdate={() => {
          const t = audioRef.current?.currentTime || 0;
          setCurrent(t);
          setProgress(duration ? (t / duration) * 100 : 0);
        }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setPlaying(false)}
      />

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/30 transition-all active:scale-90 flex-shrink-0">
          {playing ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-0.5" />}
        </button>

        {/* Progress bar */}
        <div className="flex-1 space-y-1">
          <div
            className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden"
            onClick={seek}
          >
            <div className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-white/40 font-mono">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        <button onClick={() => setMuted(!muted)} className="text-white/50 hover:text-white transition-colors flex-shrink-0">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Lyrics */}
      {lyrics && (
        <div className="max-h-48 overflow-y-auto bg-white/5 border border-white/10 rounded-2xl p-5 scrollbar-thin">
          <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line font-light italic">{lyrics}</p>
        </div>
      )}
    </div>
  );
}

// ── Vertical Timeline Item ─────────────────────────────────────────────────
function TimelineItem({ item, index }) {
  const isLeft = index % 2 === 0;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
      className={`flex items-center gap-4 md:gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
    >
      {/* Content card */}
      <div className="flex-1">
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 hover:bg-white/10 transition-colors">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
          )}
          <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-1">{item.date}</p>
          <h3 className="text-white font-bold text-base mb-1">{item.title}</h3>
          {item.description && <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>}
        </div>
      </div>

      {/* Dot */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-rose-300 shadow-lg shadow-rose-500/40 z-10" />
      </div>

      {/* Spacer for alternating alignment */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
}

// ── Main Template Component ────────────────────────────────────────────────
export default function CinematicAnniversary({ siteData = {} }) {
  const {
    coupleName       = 'Our Story',
    heroSubtitle     = 'A love written in the stars',
    loveLetterText   = '',
    milestones       = [],
    music            = {},
    timelineDates    = {},
    cinematic        = {},
    gallery          = {},
  } = siteData;

  // cinematic-specific fields (stored in siteData.cinematic)
  const {
    introVideoUrl    = '',
    bgVideoUrl       = '',
    heroImageUrl     = '',
    songLyrics       = '',
    reasons          = [],
    startDate        = timelineDates?.startDate || '2022-01-01',
  } = cinematic || {};

  // ── Intro screen state ─────────────────────────────────────────
  const [phase, setPhase] = useState('intro'); // 'intro' | 'playing' | 'hero'
  const introVideoRef = useRef(null);

  const handleTapToOpen = useCallback(() => {
    if (introVideoUrl) {
      setPhase('playing');
      setTimeout(() => introVideoRef.current?.play(), 100);
    } else {
      setPhase('hero');
    }
  }, [introVideoUrl]);

  const handleVideoEnd = useCallback(() => {
    setPhase('hero');
  }, []);

  // Auto-advance if video stalls after 4s
  useEffect(() => {
    if (phase === 'playing' && introVideoRef.current) {
      const timer = setTimeout(() => setPhase('hero'), 8000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // ── Fallback background ────────────────────────────────────────
  const heroBg = bgVideoUrl
    ? null
    : heroImageUrl
    ? `url(${heroImageUrl})`
    : 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)';

  const scrollDown = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });

  return (
    <div className="relative bg-[#080612] text-white min-h-screen overflow-x-hidden font-sans">
      {/* ── Google Font ─────────────────────────────────────── */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        .font-serif-cin { font-family: 'Cormorant Garamond', Georgia, serif; }
        body { background: #080612; }
      `}</style>

      {/* ════════════════════════════════════════════════════════
           INTRO SCREEN
      ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#080612]"
          >
            {/* Starfield */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 80 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 2 + 1,
                    height: Math.random() * 2 + 1,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.6 + 0.2,
                    animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 4}s`,
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-center px-8 z-10"
            >
              <Heart className="mx-auto mb-6 text-rose-400" size={40} fill="currentColor" />
              <h1 className="font-serif-cin text-5xl md:text-7xl font-light text-white mb-4 leading-tight">
                {coupleName}
              </h1>
              <p className="text-white/50 text-sm tracking-widest uppercase font-medium mb-12">
                A love story — for your eyes only
              </p>

              <motion.button
                onClick={handleTapToOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ boxShadow: ['0 0 0 0 rgba(244,63,94,0.4)', '0 0 0 24px rgba(244,63,94,0)', '0 0 0 0 rgba(244,63,94,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-3 bg-rose-500 hover:bg-rose-600 text-white font-bold px-10 py-4 rounded-full shadow-2xl shadow-rose-500/40 text-base tracking-wide"
              >
                <Play size={18} fill="white" />
                Tap to Open
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════
           INTRO VIDEO PLAYBACK
      ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === 'playing' && (
          <motion.div
            key="video-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[190] bg-black flex items-center justify-center"
          >
            <video
              ref={introVideoRef}
              src={introVideoUrl}
              className="w-full h-full object-cover"
              playsInline
              onEnded={handleVideoEnd}
            />
            <button
              onClick={() => setPhase('hero')}
              className="absolute top-6 right-6 text-white/50 hover:text-white text-xs uppercase tracking-widest font-bold bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm transition"
            >
              Skip →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════
           HERO SECTION — Video Loop BG
      ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            {/* HERO */}
            <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
              {/* Background */}
              {bgVideoUrl ? (
                <video
                  autoPlay loop muted playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  src={bgVideoUrl}
                />
              ) : (
                <div className="absolute inset-0" style={{ background: heroBg, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              )}

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />

              {/* Hero text */}
              <div className="relative z-10 text-center px-6">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-rose-300 text-xs font-bold uppercase tracking-[0.4em] mb-4"
                >
                  Happy Anniversary
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 1 }}
                  className="font-serif-cin text-5xl md:text-8xl font-light text-white leading-tight mb-4"
                >
                  {coupleName}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="text-white/60 text-base md:text-lg max-w-md mx-auto font-light"
                >
                  {heroSubtitle}
                </motion.p>
              </div>

              {/* Scroll prompt */}
              <motion.button
                onClick={scrollDown}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{ opacity: { delay: 2 }, y: { duration: 2, repeat: Infinity } }}
                className="absolute bottom-10 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
              >
                <span className="text-[10px] uppercase tracking-widest">Scroll to explore</span>
                <ChevronDown size={20} />
              </motion.button>
            </section>

            {/* ════════════════════════════════════════════════
                 RELATIONSHIP TIMER
            ════════════════════════════════════════════════ */}
            <section className="py-20 px-6">
              <div className="max-w-4xl mx-auto">
                <Reveal className="text-center mb-12">
                  <Clock className="mx-auto mb-4 text-rose-400" size={28} />
                  <h2 className="font-serif-cin text-4xl md:text-5xl text-white font-light mb-3">
                    Our Time Together
                  </h2>
                  <p className="text-white/40 text-sm">Every second matters ❤️</p>
                </Reveal>
                <Reveal delay={0.2}>
                  <RelationshipTimer startDate={startDate} />
                </Reveal>
              </div>
            </section>

            {/* ════════════════════════════════════════════════
                 LOVE LETTER
            ════════════════════════════════════════════════ */}
            {loveLetterText && (
              <section className="py-20 px-6 bg-gradient-to-b from-transparent via-rose-950/20 to-transparent">
                <div className="max-w-2xl mx-auto">
                  <Reveal className="text-center mb-10">
                    <span className="text-3xl block mb-4">💌</span>
                    <h2 className="font-serif-cin text-4xl md:text-5xl text-white font-light">
                      A Letter for You
                    </h2>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-pink-400 to-purple-500" />
                      <span className="font-serif-cin text-8xl text-rose-500/20 absolute -top-2 left-6 leading-none select-none">"</span>
                      <p className="font-serif-cin text-xl md:text-2xl text-white/80 leading-relaxed italic relative z-10 pt-6">
                        {loveLetterText}
                      </p>
                      <span className="font-serif-cin text-8xl text-rose-500/20 absolute bottom-0 right-6 leading-none select-none rotate-180">"</span>
                    </div>
                  </Reveal>
                </div>
              </section>
            )}

            {/* ════════════════════════════════════════════════
                 MEMORIES TIMELINE
            ════════════════════════════════════════════════ */}
            {milestones?.length > 0 && (
              <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                  <Reveal className="text-center mb-14">
                    <h2 className="font-serif-cin text-4xl md:text-5xl text-white font-light mb-3">
                      Our Story
                    </h2>
                    <p className="text-white/40 text-sm">Milestones written in time</p>
                  </Reveal>

                  {/* Timeline */}
                  <div className="relative">
                    {/* Center line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-rose-500/0 via-rose-500/40 to-rose-500/0" />
                    <div className="space-y-10 pl-10 md:pl-0">
                      {milestones.map((item, i) => (
                        <TimelineItem key={item.id || i} item={item} index={i} />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ════════════════════════════════════════════════
                 MUSIC & LYRICS
            ════════════════════════════════════════════════ */}
            {music?.audioUrl && (
              <section className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
                <div className="max-w-2xl mx-auto">
                  <Reveal className="text-center mb-10">
                    <Music2 className="mx-auto mb-4 text-rose-400" size={28} />
                    <h2 className="font-serif-cin text-4xl md:text-5xl text-white font-light mb-2">
                      Our Song
                    </h2>
                    <p className="text-white/40 text-sm">The music of us</p>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8">
                      <AudioPlayer audioUrl={music.audioUrl} lyrics={songLyrics} />
                    </div>
                  </Reveal>
                </div>
              </section>
            )}

            {/* ════════════════════════════════════════════════
                 WHY I LOVE YOU
            ════════════════════════════════════════════════ */}
            {reasons?.length > 0 && (
              <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto">
                  <Reveal className="text-center mb-12">
                    <h2 className="font-serif-cin text-4xl md:text-5xl text-white font-light mb-3">
                      Why I Love You
                    </h2>
                    <p className="text-white/40 text-sm">Let me count the ways…</p>
                  </Reveal>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {reasons.map((reason, i) => (
                      <Reveal key={i} delay={i * 0.06}>
                        <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-400/30 rounded-2xl p-4 text-center text-white/80 text-sm font-medium leading-relaxed transition-all cursor-default select-none">
                          {reason}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ════════════════════════════════════════════════
                 PHOTO GALLERY
            ════════════════════════════════════════════════ */}
            {gallery?.supporting?.length > 0 && (
              <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                  <Reveal className="text-center mb-12">
                    <h2 className="font-serif-cin text-4xl md:text-5xl text-white font-light mb-3">
                      Caught on Camera
                    </h2>
                    <p className="text-white/40 text-sm">Moments we'll never forget</p>
                  </Reveal>
                  <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                    {gallery.supporting.map((photo, i) => (
                      <Reveal key={photo.id || i} delay={i * 0.1} className="break-inside-avoid">
                        <div className="relative group overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                          <img 
                            src={photo.url} 
                            alt={photo.caption || 'Memory'} 
                            className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          {photo.caption && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                              <p className="text-white text-sm font-medium">{photo.caption}</p>
                            </div>
                          )}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ════════════════════════════════════════════════
                 FOOTER
            ════════════════════════════════════════════════ */}
            <footer className="py-16 text-center">
              <Heart className="mx-auto mb-4 text-rose-500/40" size={24} fill="currentColor" />
              <p className="text-white/20 text-xs uppercase tracking-[0.3em] font-medium">
                Made with love · EverWish
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
