// CinematicBirthday.jsx — Premium cinematic birthday template
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music2, Gift, ChevronDown, Check } from 'lucide-react';
import ScratchPhoto from './ScratchPhoto';

// ── Google Fonts ───────────────────────────────────────────────────
const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Inter:wght@400;600;700&display=swap';

// ── Scroll Reveal ──────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0, y = 50 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  );
}

// ── Audio Player ───────────────────────────────────────────────────
function AudioPlayer({ audioUrl, lyrics }) {
  const audioRef = useRef(null);
  const [playing, setPlaying]   = useState(false);
  const [muted, setMuted]       = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent]   = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else          { audioRef.current.play();  setPlaying(true);  }
  };
  const fmt = s => { if (!s || isNaN(s)) return '0:00'; return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`; };
  const seek = e => {
    if (!audioRef.current || !duration) return;
    const pct = (e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;
    audioRef.current.currentTime = pct * duration;
  };

  if (!audioUrl) return (
    <div className="flex items-center gap-3 text-white/30 py-8 justify-center">
      <Music2 size={20} /><span className="text-sm">No music uploaded yet</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={audioUrl} muted={muted}
        onTimeUpdate={() => { const t = audioRef.current?.currentTime||0; setCurrent(t); setProgress(duration?(t/duration)*100:0); }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration||0)}
        onEnded={() => setPlaying(false)} />
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all active:scale-90 flex-shrink-0">
          {playing ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-0.5" />}
        </button>
        <div className="flex-1 space-y-1">
          <div className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden" onClick={seek}>
            <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-white/40 font-mono">
            <span>{fmt(current)}</span><span>{fmt(duration)}</span>
          </div>
        </div>
        <button onClick={() => setMuted(!muted)} className="text-white/50 hover:text-white transition-colors flex-shrink-0">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
      {lyrics && (
        <div className="max-h-52 overflow-y-auto rounded-2xl p-5 relative"
          style={{ background: 'rgba(255,200,50,0.05)', border: '1px solid rgba(255,200,50,0.15)', boxShadow: '0 0 30px rgba(251,191,36,0.08)' }}>
          <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line font-light italic">{lyrics}</p>
        </div>
      )}
    </div>
  );
}

// ── 3D Gift Box Reveal ─────────────────────────────────────────────
function GiftBoxReveal({ giftImageUrl, giftRevealText }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div key="closed" exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.4 }}
            className="relative cursor-pointer select-none" onClick={() => setOpened(true)}>
            {/* Box body */}
            <div className="relative w-52 h-48 md:w-64 md:h-56">
              <div className="absolute bottom-0 left-0 right-0 h-36 md:h-44 rounded-b-2xl"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 20px 60px rgba(245,158,11,0.4)' }}>
                {/* Ribbon vertical */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-6 bg-amber-300/60" />
              </div>
              {/* Lid */}
              <motion.div
                animate={{ y: [0, -6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-0 left-0 right-0 h-16 rounded-t-2xl rounded-b-sm overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                {/* Bow */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-0">
                  <div className="w-8 h-6 rounded-full border-4 border-amber-300 -rotate-12" />
                  <div className="w-2 h-2 rounded-full bg-amber-200 z-10" />
                  <div className="w-8 h-6 rounded-full border-4 border-amber-300 rotate-12" />
                </div>
                {/* Ribbon horizontal */}
                <div className="absolute left-0 right-0 bottom-0 h-5 bg-amber-300/60" />
              </motion.div>
            </div>
            {/* Pulse ring */}
            <motion.div className="absolute inset-0 rounded-2xl border-2 border-amber-400/50"
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
            <p className="text-center text-amber-300 text-xs font-bold uppercase tracking-widest mt-6 animate-pulse">
              Tap to Unwrap 🎀
            </p>
          </motion.div>
        ) : (
          <motion.div key="opened" initial={{ scale: 0.6, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }} className="text-center max-w-sm">
            {giftImageUrl && (
              <motion.img src={giftImageUrl} alt="Gift" initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 250 }}
                className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-3xl mx-auto mb-6 shadow-2xl shadow-amber-500/30 border-2 border-amber-400/30" />
            )}
            {!giftImageUrl && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                className="text-8xl mb-6">🎁</motion.div>
            )}
            {giftRevealText && (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="text-white/90 text-lg md:text-xl font-light italic leading-relaxed px-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {giftRevealText}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function CinematicBirthday({ siteData = {} }) {
  const {
    coupleName    = 'Happy Birthday!',
    heroSubtitle  = 'Today is all about you ✨',
    cinematicBirthday = {},
    gallery       = {},
  } = siteData;

  const {
    introVideoUrl      = '',
    bgVideoUrl         = '',
    giftImageUrl       = '',
    giftRevealText     = '',
    yearRecapText      = '',
    birthdayBucketList = [],
    songAudioUrl       = '',
    songLyrics         = '',
    galleryImages      = [],
  } = cinematicBirthday || {};

  const [phase, setPhase] = useState('intro'); // intro | playing | hero
  const introVideoRef = useRef(null);

  const handleTap = useCallback(() => {
    if (introVideoUrl) { setPhase('playing'); setTimeout(() => introVideoRef.current?.play(), 100); }
    else setPhase('hero');
  }, [introVideoUrl]);

  useEffect(() => {
    if (phase === 'playing') {
      const t = setTimeout(() => setPhase('hero'), 10000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Merge gallery images from both sources
  const allGalleryImages = [
    ...galleryImages,
    ...(gallery?.supporting?.map(s => s.url) || []),
  ].filter(Boolean);

  return (
    <div className="relative bg-[#0a0806] text-white min-h-screen overflow-x-hidden font-sans">
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{`
        .font-serif-bday { font-family: 'Cormorant Garamond', Georgia, serif; }
        body { background: #0a0806; }
      `}</style>

      {/* ── INTRO SCREEN ─────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
            style={{ background: 'radial-gradient(ellipse at center, #1a0f00 0%, #0a0806 70%)' }}>
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div key={i} className="absolute text-2xl select-none"
                  style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }}
                  animate={{ y: [0, -30, 0], opacity: [0.4, 0.9, 0.4], rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3+Math.random()*3, repeat: Infinity, delay: Math.random()*3 }}>
                  {['🎂','🎈','🎉','🎁','✨','🌟'][i % 6]}
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }} className="text-center px-8 z-10">
              <motion.button onClick={handleTap} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                animate={{ boxShadow: ['0 0 0 0 rgba(251,191,36,0.5)','0 0 0 24px rgba(251,191,36,0)','0 0 0 0 rgba(251,191,36,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-900 font-bold px-10 py-4 rounded-full shadow-2xl shadow-amber-500/40 text-base tracking-wide">
                Tap to Open
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── INTRO VIDEO ──────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'playing' && (
          <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[190] bg-black flex items-center justify-center">
            <video ref={introVideoRef} src={introVideoUrl} className="w-full h-full object-cover"
              playsInline onEnded={() => setPhase('hero')} />
            <button onClick={() => setPhase('hero')}
              className="absolute top-6 right-6 text-white/60 hover:text-white text-xs uppercase tracking-widest font-bold bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm transition">
              Skip →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'hero' && (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>

            {/* HERO SECTION */}
            <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
              {bgVideoUrl ? (
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" src={bgVideoUrl} />
              ) : (
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, #3d1a00 0%, #0a0806 70%)' }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
              <div className="relative z-10 text-center px-6">
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="text-amber-300 text-xs font-bold uppercase tracking-[0.4em] mb-4">🎂 Happy Birthday</motion.p>
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1 }}
                  className="font-serif-bday text-5xl md:text-8xl font-light text-white leading-tight mb-4">{coupleName}</motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                  className="text-white/60 text-base md:text-lg max-w-md mx-auto font-light">{heroSubtitle}</motion.p>
              </div>
              <motion.button onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{ opacity: { delay: 2 }, y: { duration: 2, repeat: Infinity } }}
                className="absolute bottom-10 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors">
                <span className="text-[10px] uppercase tracking-widest">Scroll to explore</span>
                <ChevronDown size={20} />
              </motion.button>
            </section>

            {/* GIFT BOX REVEAL */}
            <section className="py-20 px-6 bg-gradient-to-b from-transparent via-amber-950/20 to-transparent">
              <div className="max-w-2xl mx-auto text-center">
                <Reveal className="mb-12">
                  <Gift className="mx-auto mb-4 text-amber-400" size={28} />
                  <h2 className="font-serif-bday text-4xl md:text-5xl text-white font-light mb-3">A Gift For You</h2>
                  <p className="text-white/40 text-sm">Something special, just for you 🎁</p>
                </Reveal>
                <Reveal delay={0.2}>
                  <GiftBoxReveal giftImageUrl={giftImageUrl} giftRevealText={giftRevealText} />
                </Reveal>
              </div>
            </section>

            {/* YEAR RECAP */}
            {yearRecapText && (
              <section className="py-20 px-6">
                <div className="max-w-2xl mx-auto">
                  <Reveal className="text-center mb-10">
                    <span className="text-3xl block mb-4">🌟</span>
                    <h2 className="font-serif-bday text-4xl md:text-5xl text-white font-light">Your Year in Review</h2>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500" />
                      <span className="font-serif-bday text-8xl text-amber-500/20 absolute -top-2 left-6 leading-none select-none">"</span>
                      <p className="font-serif-bday text-xl md:text-2xl text-white/80 leading-relaxed italic relative z-10 pt-6 whitespace-pre-line">{yearRecapText}</p>
                    </div>
                  </Reveal>
                </div>
              </section>
            )}

            {/* BIRTHDAY BUCKET LIST */}
            {birthdayBucketList?.length > 0 && (
              <section className="py-20 px-6 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent">
                <div className="max-w-2xl mx-auto">
                  <Reveal className="text-center mb-12">
                    <span className="text-3xl block mb-4">✅</span>
                    <h2 className="font-serif-bday text-4xl md:text-5xl text-white font-light mb-3">Birthday Bucket List</h2>
                    <p className="text-white/40 text-sm">Things to do today!</p>
                  </Reveal>
                  <div className="space-y-4">
                    {birthdayBucketList.map((item, i) => (
                      <Reveal key={i} delay={i * 0.1}>
                        <div className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/30 rounded-2xl p-5 transition-all group">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/40 transition-colors">
                            <Check size={14} className="text-amber-400" />
                          </div>
                          <p className="text-white/80 font-medium">{item}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* MUSIC & LYRICS */}
            {songAudioUrl && (
              <section className="py-20 px-6 bg-gradient-to-b from-transparent via-amber-950/20 to-transparent">
                <div className="max-w-2xl mx-auto">
                  <Reveal className="text-center mb-10">
                    <Music2 className="mx-auto mb-4 text-amber-400" size={28} />
                    <h2 className="font-serif-bday text-4xl md:text-5xl text-white font-light mb-2">Your Birthday Song</h2>
                    <p className="text-white/40 text-sm">Play it loud 🎵</p>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8">
                      <AudioPlayer audioUrl={songAudioUrl} lyrics={songLyrics} />
                    </div>
                  </Reveal>
                </div>
              </section>
            )}

            {/* PHOTO GALLERY */}
            {allGalleryImages.length > 0 && (
              <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                  <Reveal className="text-center mb-12">
                    <h2 className="font-serif-bday text-4xl md:text-5xl text-white font-light mb-3">Memories</h2>
                    <p className="text-white/40 text-sm">Moments captured in time 📸</p>
                  </Reveal>
                  <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                    {allGalleryImages.map((url, i) => (
                      <Reveal key={i} delay={i * 0.07} className="break-inside-avoid">
                        <ScratchPhoto 
                          src={url} 
                          alt={`Memory ${i+1}`} 
                          primary="#fbbf24" 
                        />
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* FOOTER */}
            <footer className="py-16 text-center">
              <motion.div className="text-4xl mb-4" animate={{ scale: [1,1.15,1] }} transition={{ duration: 2, repeat: Infinity }}>🎂</motion.div>
              <p className="text-white/20 text-xs uppercase tracking-[0.3em] font-medium">Made with love · EverWish</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
