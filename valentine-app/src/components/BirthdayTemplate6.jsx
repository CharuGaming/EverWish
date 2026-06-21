import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music2, Gift, ChevronDown, Check } from 'lucide-react';

import InteractiveHero from './InteractiveHero';
import LoveLetterEnvelope from './LoveLetterEnvelope';
import HeartMemoryGallery from './HeartMemoryGallery';
import { optimizeCloudinaryUrl } from '../utils/imageHelpers';
import BorderGlow from './BorderGlow';

// ── Google Fonts ────────────────────────────────────────────────────
const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Inter:wght@400;600;700&display=swap';

// ── Glass card style (shared) ───────────────────────────────────────
const GLASS = {
  background: 'rgba(0,0,0,0.25)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.10)',
  boxShadow: '0 8px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)',
};

// ── Scroll Reveal ───────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0, y = 60 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

// ── Audio Player ────────────────────────────────────────────────────
function AudioPlayer({ audioUrl, lyrics, noMusicText }) {
  const audioRef = useRef(null);
  const [playing, setPlaying]   = useState(false);
  const [muted,   setMuted]     = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current,  setCurrent]  = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    playing ? audioRef.current.pause() : audioRef.current.play();
    setPlaying(p => !p);
  };
  const fmt = s => (!s || isNaN(s)) ? '0:00' : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  const seek = e => {
    if (!audioRef.current || !duration) return;
    audioRef.current.currentTime = ((e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth) * duration;
  };

  if (!audioUrl) return (
    <div className="flex items-center gap-3 text-white/30 py-8 justify-center">
      <Music2 size={20}/><span className="text-sm">{noMusicText || 'No music uploaded yet'}</span>
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
          {playing ? <Pause size={20} className="text-white"/> : <Play size={20} className="text-white ml-0.5"/>}
        </button>
        <div className="flex-1 space-y-1">
          <div className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden" onClick={seek}>
            <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all" style={{ width: `${progress}%` }}/>
          </div>
          <div className="flex justify-between text-[10px] text-white/40 font-mono">
            <span>{fmt(current)}</span><span>{fmt(duration)}</span>
          </div>
        </div>
        <button onClick={() => setMuted(!muted)} className="text-white/50 hover:text-white transition-colors flex-shrink-0">
          {muted ? <VolumeX size={18}/> : <Volume2 size={18}/>}
        </button>
      </div>
      {lyrics && (
        <div className="max-h-52 overflow-y-auto rounded-2xl p-5"
          style={{ background:'rgba(255,200,50,0.05)', border:'1px solid rgba(255,200,50,0.15)' }}>
          <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line font-light italic">{lyrics}</p>
        </div>
      )}
    </div>
  );
}

// ── Gift Box Reveal ─────────────────────────────────────────────────
function GiftBoxReveal({ giftImageUrl, giftRevealText, tapToUnwrapText }) {
  const [opened, setOpened] = useState(false);
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div key="closed" exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.4 }}
            className="relative cursor-pointer select-none" onClick={() => setOpened(true)}>
            <div className="relative w-52 h-48 md:w-64 md:h-56">
              <div className="absolute bottom-0 left-0 right-0 h-36 md:h-44 rounded-b-2xl"
                style={{ background:'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow:'0 20px 60px rgba(245,158,11,0.4)' }}>
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-6 bg-amber-300/60"/>
              </div>
              <motion.div animate={{ y:[0,-6,0] }} transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }}
                className="absolute top-0 left-0 right-0 h-16 rounded-t-2xl rounded-b-sm overflow-hidden"
                style={{ background:'linear-gradient(135deg,#fbbf24,#f59e0b)' }}>
                <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-0">
                  <div className="w-8 h-6 rounded-full border-4 border-amber-300 -rotate-12"/>
                  <div className="w-2 h-2 rounded-full bg-amber-200 z-10"/>
                  <div className="w-8 h-6 rounded-full border-4 border-amber-300 rotate-12"/>
                </div>
                <div className="absolute left-0 right-0 bottom-0 h-5 bg-amber-300/60"/>
              </motion.div>
            </div>
            <motion.div className="absolute inset-0 rounded-2xl border-2 border-amber-400/50"
              animate={{ scale:[1,1.08,1], opacity:[0.6,0,0.6] }} transition={{ duration:2, repeat:Infinity }}/>
            <p className="text-center text-amber-300 text-xs font-bold uppercase tracking-widest mt-6 animate-pulse">
              {tapToUnwrapText || 'Tap to Unwrap 🎀'}
            </p>
          </motion.div>
        ) : (
          <motion.div key="opened" initial={{ scale:0.6, opacity:0, y:40 }} animate={{ scale:1, opacity:1, y:0 }}
            transition={{ type:'spring', stiffness:200, damping:18 }} className="text-center max-w-sm">
            {giftImageUrl
              ? <motion.img src={optimizeCloudinaryUrl(giftImageUrl, 600)} alt="Gift" initial={{ scale:0, rotate:-10 }} animate={{ scale:1, rotate:0 }}
                  transition={{ delay:0.2, type:'spring', stiffness:250 }}
                  loading="lazy"
                  className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-3xl mx-auto mb-6 shadow-2xl shadow-amber-500/30 border-2 border-amber-400/30"/>
              : <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.2, type:'spring' }}
                  className="text-8xl mb-6">🎁</motion.div>
            }
            {giftRevealText && (
              <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
                className="text-white/90 text-lg md:text-xl font-light italic leading-relaxed px-4"
                style={{ fontFamily:"'Cormorant Garamond',serif" }}>
                {giftRevealText}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- WebGL Shader Background Component ---
const ShaderBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec4 aVertexPosition;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = aVertexPosition;
        v_texCoord = aVertexPosition.xy * 0.5 + 0.5;
      }
    `;

    const fsSource = `
    precision highp float;
    uniform float u_time;
    uniform vec2 u_resolution;
    varying vec2 v_texCoord;
    void main() {
        vec2 uv = v_texCoord;
        float noise = sin(uv.x * 3.0 + u_time * 0.5) * cos(uv.y * 2.0 - u_time * 0.3) * 0.5 + 0.5;
        float noise2 = sin(uv.y * 4.0 - u_time * 0.4) * cos(uv.x * 3.0 + u_time * 0.6) * 0.5 + 0.5;
        vec3 color1 = vec3(0.91, 0.65, 0.70); // #e8a5b3
        vec3 color2 = vec3(1.0, 0.97, 0.97); // #fff8f7
        vec3 color3 = vec3(0.95, 0.82, 0.84); // #f2d2d6
        vec3 color = mix(color1, color2, noise);
        color = mix(color, color3, noise2 * 0.5);
        float vignette = 1.0 - length(uv - 0.5) * 0.5;
        color *= vignette;
        gl_FragColor = vec4(color, 1.0);
    }
    `;

    function compileShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0,  1.0,
       1.0,  1.0,
      -1.0, -1.0,
       1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'aVertexPosition');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();

    let animationFrameId;
    const render = (time) => {
      time *= 0.001;
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full pointer-events-none" />;
};

// --- Passcode Lock Screen ---
const PasscodeScreen = ({ title, hint, targetPasscode, onUnlock }) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState(false);
  const passcodeLength = targetPasscode.length || 4;

  const handleKeyPress = (num) => {
    if (inputCode.length < passcodeLength) {
      const newCode = inputCode + num;
      setInputCode(newCode);
      if (newCode.length === passcodeLength) {
        if (newCode === targetPasscode) {
          setTimeout(() => onUnlock(), 300);
        } else {
          setError(true);
          setTimeout(() => {
            setInputCode('');
            setError(false);
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setInputCode(inputCode.slice(0, -1));
  };

  return (
    <motion.div 
      className="bg-[#fff8f7] text-[#28171a] font-sans flex min-h-screen items-center justify-center relative overflow-hidden antialiased"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <ShaderBackground />
      <div className="relative z-10 w-full max-w-sm px-6 flex flex-col items-center gap-12">
        
        <div className="flex flex-col items-center gap-6 w-full">
          <h1 className="font-serif text-5xl text-[#854f5b] text-center tracking-tight font-bold">{title}</h1>
          <motion.div 
            className="flex gap-4 w-full justify-center"
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {Array.from({ length: passcodeLength }).map((_, i) => {
              const isFilled = i < inputCode.length;
              return (
                <div key={i} className="w-16 h-16 bg-white rounded-xl border border-[#d5c2c4]/30 flex items-center justify-center shadow-[0px_4px_10px_rgba(147,48,69,0.03)] font-serif text-3xl text-[#28171a]">
                  {isFilled ? inputCode[i] : (
                    <span className="material-symbols-outlined text-[#a13b4f]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>
          <p className="text-[#514346] text-center max-w-[280px]">
            {hint}
          </p>
        </div>

        <div className="bg-white/85 rounded-[32px] p-6 shadow-[0px_10px_30px_rgba(147,48,69,0.08)] w-full backdrop-blur-md">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button 
                key={num}
                onClick={() => handleKeyPress(num.toString())}
                className="aspect-square bg-[#854f5b] text-white rounded-[20px] font-serif text-2xl flex items-center justify-center shadow-inner hover:bg-[#6b3945] transition-all duration-200 active:scale-95"
              >
                {num}
              </button>
            ))}
            <button className="aspect-square bg-[#854f5b] text-white rounded-[20px] font-serif text-2xl flex items-center justify-center shadow-inner hover:bg-[#6b3945] transition-all duration-200 active:scale-95 pb-3">.</button>
            <button 
              onClick={() => handleKeyPress('0')}
              className="aspect-square bg-[#854f5b] text-white rounded-[20px] font-serif text-2xl flex items-center justify-center shadow-inner hover:bg-[#6b3945] transition-all duration-200 active:scale-95">0</button>
            <button 
              onClick={handleBackspace}
              className="aspect-square bg-[#854f5b] text-white rounded-[20px] flex items-center justify-center shadow-inner hover:bg-[#6b3945] transition-all duration-200 active:scale-95"
            >
              <span className="material-symbols-outlined text-[28px]">backspace</span>
            </button>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
};

// --- Intro Video Component ---
const IntroVideo = ({ videoUrl, onVideoEnd }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <video 
        src={videoUrl}
        autoPlay 
        playsInline 
        onEnded={onVideoEnd}
        className="w-full h-full object-cover"
      />
      <button 
        onClick={onVideoEnd}
        className="absolute top-8 right-8 text-white/50 hover:text-white transition px-4 py-2 bg-black/30 rounded-full text-sm backdrop-blur-md"
      >
        Skip
      </button>
    </motion.div>
  );
};

// --- Main Template Component ---
export default function BirthdayTemplate6({ siteData }) {
  const [phase, setPhase] = useState('passcode'); // 'passcode' | 'video' | 'landing'

  const passcodeData = siteData?.passcode || {};
  const passcodeTitle = passcodeData.title || "Enter Code";
  const passcodeHint = passcodeData.hint || "Hint: The day you finally said 'YES' to me.";
  const passcodeTarget = passcodeData.targetPasscode || "0214";
  const passcodeVideoUrl = passcodeData.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4";

  const bday6Data = siteData?.bday6 || {};
  const cinematicBirthday = siteData?.cinematicBirthday || {};

  const heroBadge = bday6Data.heroBadge || "🎂 Happy Birthday";
  const heroTitle = bday6Data.heroTitle || "Happy Birthday, Jamie!";
  const heroSubtitle = bday6Data.heroSubtitle || "Today is all about you ✨";
  const scrollText = bday6Data.scrollText || "Scroll to explore";
  const giftSectionTitle = bday6Data.giftSectionTitle || "A Gift For You";
  const giftSectionSubtitle = bday6Data.giftSectionSubtitle || "Something special, just for you 🎁";
  const giftUnwrapText = bday6Data.giftUnwrapText || "Tap to Unwrap 🎀";
  const yearRecapIcon = bday6Data.yearRecapIcon || "🌟";
  const yearRecapTitle = bday6Data.yearRecapTitle || "Your Year in Review";
  const bucketListIcon = bday6Data.bucketListIcon || "✅";
  const bucketListTitle = bday6Data.bucketListTitle || "Birthday Bucket List";
  const bucketListSubtitle = bday6Data.bucketListSubtitle || "Things to do today!";
  const songSectionTitle = bday6Data.songSectionTitle || "Your Birthday Song";
  const songSectionSubtitle = bday6Data.songSectionSubtitle || "Play it loud 🎵";
  const gallerySectionIcon = bday6Data.gallerySectionIcon || "💝";
  const gallerySectionTitle = bday6Data.gallerySectionTitle || "Our Memories";
  const gallerySectionSubtitle = bday6Data.gallerySectionSubtitle || "Tap a photo to relive the moment";
  const footerText = bday6Data.footerText || "Made with love · EverWish";
  const noMusicText = bday6Data.noMusicText || "No music uploaded yet";

  const bgVideoUrl = cinematicBirthday.bgVideoUrl || '';
  const giftImageUrl = cinematicBirthday.giftImageUrl || '';
  const giftRevealText = cinematicBirthday.giftRevealText || '';
  const yearRecapText = cinematicBirthday.yearRecapText || '';
  const birthdayBucketList = cinematicBirthday.birthdayBucketList || [];
  const songAudioUrl = cinematicBirthday.songAudioUrl || '';
  const songLyrics = cinematicBirthday.songLyrics || '';
  const galleryImages = cinematicBirthday.galleryImages || [];
  const nickname = cinematicBirthday.nickname || '';
  const heroPhotos = cinematicBirthday.heroPhotos || [];
  const useInteractiveHero = cinematicBirthday.useInteractiveHero ?? false;
  const loveLetterContent = cinematicBirthday.loveLetterContent || '';

  const allGalleryImages = [
    ...galleryImages,
    ...(siteData?.gallery?.supporting?.map(s => s.url) || []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen relative text-white font-sans overflow-x-hidden">
      <link href={FONT_LINK} rel="stylesheet"/>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-serif-bday { font-family: 'Cormorant Garamond', Georgia, serif; }
        body { background: #0a0806; }
      `}} />

      <AnimatePresence mode="wait">
        {phase === 'passcode' && (
          <PasscodeScreen 
            key="passcode"
            title={passcodeTitle}
            hint={passcodeHint}
            targetPasscode={passcodeTarget}
            onUnlock={() => setPhase('video')}
          />
        )}

        {phase === 'video' && (
          <IntroVideo 
            key="video"
            videoUrl={passcodeVideoUrl}
            onVideoEnd={() => setPhase('landing')}
          />
        )}

        {phase === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            {/* ══ GLOBAL FIXED BACKGROUND ══════════════════════════════════ */}
            <div className="fixed inset-0 w-full h-full" style={{ zIndex: -1 }}>
              {bgVideoUrl ? (
                <video autoPlay loop muted playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  src={optimizeCloudinaryUrl(bgVideoUrl, 1080)}/>
              ) : (
                <div className="absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at 40% 40%, #3d1a00 0%, #1a0800 50%, #0a0806 100%)' }}/>
              )}
              {/* Dark overlay for readability across ALL sections */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"/>
            </div>

            {/* ── HERO SECTION ───────────────────────────────────── */}
            {useInteractiveHero && heroPhotos.length > 0 ? (
              <InteractiveHero
                nickname={nickname}
                heroPhotos={heroPhotos}
                coupleName={heroTitle}
                heroSubtitle={heroSubtitle}
                onScroll={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                customTitles={{ heroMainTitle: heroTitle, heroSubtitle: heroSubtitle }}
              />
            ) : (
              <section className="relative h-screen flex flex-col items-center justify-center">
                <div className="relative z-10 text-center px-6">
                  <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
                    className="text-amber-300 text-xs font-bold uppercase tracking-[0.4em] mb-4">
                    {heroBadge}
                  </motion.p>
                  <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7, duration:1 }}
                    className="font-serif-bday text-5xl md:text-8xl font-light text-white leading-tight mb-4">
                    {heroTitle}
                  </motion.h1>
                  <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
                    className="text-white/60 text-base md:text-lg max-w-md mx-auto font-light">
                    {heroSubtitle}
                  </motion.p>
                </div>
                <motion.button onClick={() => window.scrollTo({ top: window.innerHeight, behavior:'smooth' })}
                  initial={{ opacity:0 }} animate={{ opacity:1, y:[0,8,0] }}
                  transition={{ opacity:{ delay:2 }, y:{ duration:2, repeat:Infinity } }}
                  className="absolute bottom-10 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors">
                  <span className="text-[10px] uppercase tracking-widest">{scrollText}</span>
                  <ChevronDown size={20}/>
                </motion.button>
              </section>
            )}

            {/* ── GIFT BOX REVEAL ────────────────────────────────── */}
            <section className="py-10 px-6">
              <div className="max-w-2xl mx-auto">
                <Reveal className="text-center mb-6">
                  <Gift className="mx-auto mb-3 text-amber-400" size={28}/>
                  <h2 className="font-serif-bday text-4xl md:text-5xl text-white font-light mb-2">{giftSectionTitle}</h2>
                  <p className="text-white/50 text-sm">{giftSectionSubtitle}</p>
                </Reveal>
                <Reveal delay={0.2}>
                  <BorderGlow
                    edgeSensitivity={30}
                    glowColor="45 85 85"
                    backgroundColor="rgba(10, 8, 6, 0.45)"
                    borderRadius={24}
                    glowRadius={40}
                    glowIntensity={1.2}
                    colors={['#f59e0b', '#fbbf24', '#d97706']}
                    className="w-full text-center"
                  >
                    <div className="p-8 text-center">
                      <GiftBoxReveal giftImageUrl={giftImageUrl} giftRevealText={giftRevealText} tapToUnwrapText={giftUnwrapText}/>
                    </div>
                  </BorderGlow>
                </Reveal>
              </div>
            </section>

            {/* ── YEAR RECAP ─────────────────────────────────────── */}
            {yearRecapText && (
              <section className="py-10 px-6">
                <div className="max-w-2xl mx-auto">
                  <Reveal className="text-center mb-6">
                    <span className="text-3xl block mb-3">{yearRecapIcon}</span>
                    <h2 className="font-serif-bday text-4xl md:text-5xl text-white font-light">{yearRecapTitle}</h2>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <BorderGlow
                      edgeSensitivity={30}
                      glowColor="45 85 85"
                      backgroundColor="rgba(10, 8, 6, 0.45)"
                      borderRadius={24}
                      glowRadius={40}
                      glowIntensity={1.2}
                      colors={['#f59e0b', '#fbbf24', '#d97706']}
                      className="w-full text-left"
                    >
                      <div className="relative p-8 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 rounded-t-3xl"/>
                        <span className="font-serif-bday text-8xl text-amber-500/20 absolute -top-2 left-6 leading-none select-none">"</span>
                        <p className="font-serif-bday text-xl md:text-2xl text-white/85 leading-relaxed italic relative z-10 pt-6 whitespace-pre-line">
                          {yearRecapText}
                        </p>
                      </div>
                    </BorderGlow>
                  </Reveal>
                </div>
              </section>
            )}

            {/* ── BIRTHDAY BUCKET LIST ────────────────────────────── */}
            {birthdayBucketList?.length > 0 && (
              <section className="py-10 px-6">
                <div className="max-w-2xl mx-auto">
                  <Reveal className="text-center mb-6">
                    <span className="text-3xl block mb-3">{bucketListIcon}</span>
                    <h2 className="font-serif-bday text-4xl md:text-5xl text-white font-light mb-2">{bucketListTitle}</h2>
                    <p className="text-white/50 text-sm">{bucketListSubtitle}</p>
                  </Reveal>
                  <div className="space-y-3">
                    {birthdayBucketList.map((item, i) => (
                      <Reveal key={i} delay={i * 0.08}>
                        <div className="flex items-center gap-4 rounded-2xl p-4 transition-all group"
                          style={{ ...GLASS, cursor:'default' }}>
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/40 transition-colors">
                            <Check size={14} className="text-amber-400"/>
                          </div>
                          <p className="text-white/85 font-medium">{item}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── LOVE LETTER ENVELOPE ────────────────────────────── */}
            {loveLetterContent && (
              <LoveLetterEnvelope content={loveLetterContent} />
            )}

            {/* ── MUSIC & LYRICS ──────────────────────────────────── */}
            {songAudioUrl && (
              <section className="py-10 px-6">
                <div className="max-w-2xl mx-auto">
                  <Reveal className="text-center mb-6">
                    <Music2 className="mx-auto mb-3 text-amber-400" size={28}/>
                    <h2 className="font-serif-bday text-4xl md:text-5xl text-white font-light mb-2">{songSectionTitle}</h2>
                    <p className="text-white/50 text-sm">{songSectionSubtitle}</p>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <BorderGlow
                      edgeSensitivity={30}
                      glowColor="45 85 85"
                      backgroundColor="rgba(10, 8, 6, 0.45)"
                      borderRadius={24}
                      glowRadius={40}
                      glowIntensity={1.2}
                      colors={['#f59e0b', '#fbbf24', '#d97706']}
                      className="w-full"
                    >
                      <div className="p-6">
                        <AudioPlayer audioUrl={songAudioUrl} lyrics={songLyrics} noMusicText={noMusicText}/>
                      </div>
                    </BorderGlow>
                  </Reveal>
                </div>
              </section>
            )}

            {/* ── PHOTO GALLERY (POLAROID MASONRY) ───────────────── */}
            {allGalleryImages?.length > 0 && (
              <section className="py-10 px-6">
                <div className="max-w-4xl mx-auto">
                  <Reveal className="text-center mb-6">
                    <span className="text-3xl block mb-3">{gallerySectionIcon}</span>
                    <h2 className="font-serif-bday text-4xl md:text-5xl text-white font-light">{gallerySectionTitle}</h2>
                    <p className="text-white/50 text-sm mt-2">{gallerySectionSubtitle}</p>
                  </Reveal>
                  <Reveal delay={0.15}>
                    <HeartMemoryGallery photos={allGalleryImages} />
                  </Reveal>
                </div>
              </section>
            )}

            {/* ── FOOTER ──────────────────────────────────────────── */}
            <footer className="py-10 text-center">
              <motion.div className="text-4xl mb-3"
                animate={{ scale:[1,1.15,1] }} transition={{ duration:2, repeat:Infinity }}>
                🎂
              </motion.div>
              <p className="text-white/25 text-xs uppercase tracking-[0.3em] font-medium">{footerText}</p>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
