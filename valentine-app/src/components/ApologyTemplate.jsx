/**
 * ApologyTemplate.jsx
 * "Forgive Me" — A fully dynamic, mobile-first emotional celebration template.
 * Soft Frosted Glass Aesthetic.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { optimizeCloudinaryUrl } from '../utils/imageHelpers';
import BorderGlow from './BorderGlow';

// ── Confetti / Heart-Burst on Forgiveness ──────────────────────────
const BURST_PARTICLES = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 30,
  color: ['#ffb3ba','#ffdfba','#ffffba','#baffc9','#bae1ff','#ffc0cb','#ff69b4','#ffffff'][i % 8],
  size: Math.random() * 12 + 6,
  delay: Math.random() * 0.4,
  duration: 1.5 + Math.random() * 1.5,
  rotate: Math.random() * 720 - 360,
  shape: Math.random() > 0.3 ? 'circle' : 'heart'
}));

function HeartConfetti({ active }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {BURST_PARTICLES.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: '-10vh', x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 0.5 }}
          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rotate, scale: 1 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            top: 0,
            width: p.size,
            height: p.size,
            borderRadius: p.shape === 'circle' ? '50%' : 0,
            backgroundColor: p.shape === 'circle' ? p.color : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: p.size,
          }}
        >
          {p.shape === 'heart' && <span style={{ color: p.color }}>❤️</span>}
        </motion.div>
      ))}
    </div>
  );
}

// ── Mending Broken Heart Transition ────────────────────────────────
function MendingHeartTransition({ onComplete }) {
  const controls = useAnimation();

  useEffect(() => {
    async function animate() {
      await controls.start('visible');
      await new Promise(r => setTimeout(r, 800));
      await controls.start('mended');
      await new Promise(r => setTimeout(r, 1000));
      onComplete();
    }
    animate();
  }, [controls, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <div className="relative w-48 h-44 select-none drop-shadow-xl">
        {/* Left half */}
        <motion.svg
          viewBox="0 0 100 90"
          className="absolute inset-0 w-full h-full"
          initial={{ x: -30, rotate: -15, opacity: 0 }}
          animate={controls}
          variants={{
            visible: { x: -15, rotate: -8, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
            mended:  { x: 0, rotate: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut', type: 'spring', stiffness: 200 } },
          }}
        >
          <clipPath id="leftHalfIntro">
            <rect x="0" y="0" width="50" height="90" />
          </clipPath>
          <path d="M10 35 A22 22 0 0 1 50 28 A22 22 0 0 1 90 35 Q90 62 50 90 Q10 62 10 35 Z" fill="#ff6b81" clipPath="url(#leftHalfIntro)" />
        </motion.svg>

        {/* Right half */}
        <motion.svg
          viewBox="0 0 100 90"
          className="absolute inset-0 w-full h-full"
          initial={{ x: 30, rotate: 15, opacity: 0 }}
          animate={controls}
          variants={{
            visible: { x: 15, rotate: 8, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
            mended:  { x: 0, rotate: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut', type: 'spring', stiffness: 200 } },
          }}
        >
          <clipPath id="rightHalfIntro">
            <rect x="50" y="0" width="50" height="90" />
          </clipPath>
          <path d="M10 35 A22 22 0 0 1 50 28 A22 22 0 0 1 90 35 Q90 62 50 90 Q10 62 10 35 Z" fill="#ff6b81" clipPath="url(#rightHalfIntro)" />
        </motion.svg>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={controls}
          variants={{
            visible: { opacity: 0, scale: 0 },
            mended:  { opacity: [0, 1, 0], scale: [0, 1.5, 0], transition: { delay: 0.5, duration: 1 } },
          }}
        >
          <span className="text-5xl">✨</span>
        </motion.div>
      </div>
      <motion.p
        className="mt-8 text-rose-400 text-sm font-bold tracking-widest uppercase apology-body"
        initial={{ opacity: 0 }}
        animate={controls}
        variants={{
          visible: { opacity: 0 },
          mended: { opacity: 1, transition: { delay: 0.3, duration: 0.8 } },
        }}
      >
        My heart is yours...
      </motion.p>
    </motion.div>
  );
}

// ── Intro Video Screen ──────────────────────────────────────────────
function ApologyIntroScreen({ introVideoUrl, onComplete, introButtonText }) {
  const videoRef = useRef(null);
  const [phase, setPhase] = useState('idle');
  const [showTap, setShowTap] = useState(true);

  const handleTap = () => {
    if (phase !== 'idle') return;
    setShowTap(false);
    setPhase('playing');
    if (videoRef.current) {
      videoRef.current.play().catch(() => setPhase('transitioning'));
    } else {
      setPhase('transitioning');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {phase === 'transitioning' ? (
        <MendingHeartTransition key="transition" onComplete={onComplete} />
      ) : (
        <motion.div
          key="intro"
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer select-none overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%)' }}
          onClick={handleTap}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {introVideoUrl && (
            <video preload="none" ref={videoRef}
              src={optimizeCloudinaryUrl(introVideoUrl, 854)}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              onEnded={() => setPhase('transitioning')}
              preload="metadata"
            />
          )}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
          <AnimatePresence>
            {showTap && (
              <motion.div
                className="relative z-10 flex flex-col items-center gap-6 text-center px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="text-7xl drop-shadow-lg">
                  🥺
                </motion.div>
                <motion.div
                  className="px-8 py-3 rounded-full border border-rose-200 text-rose-500 font-bold tracking-widest text-sm uppercase bg-white/60 backdrop-blur-md shadow-[0_8px_32px_rgba(255,182,193,0.4)]"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {introButtonText || 'Tap to Open 💌'}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {phase === 'playing' && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
              onClick={(e) => { e.stopPropagation(); setPhase('transitioning'); }}
              className="absolute bottom-8 right-6 z-20 text-rose-400 hover:text-rose-600 font-bold text-xs tracking-widest uppercase bg-white/50 px-4 py-2 rounded-full backdrop-blur-md shadow-sm"
            >
              Skip →
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Runaway "No" Button with Emojis ─────────────────────────────────
function RunawayButton({ text, onEscape }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [escaped, setEscaped] = useState(0);
  const [emojis, setEmojis] = useState([]);

  const runAway = useCallback(() => {
    const randX = (Math.random() - 0.5) * 250;
    const randY = (Math.random() - 0.5) * 150;
    const oldPos = { ...pos };
    setPos({ x: randX, y: randY });
    setEscaped(c => c + 1);
    
    const id = Date.now();
    const char = ['🥺','😭','🏃','💨','💔'][Math.floor(Math.random()*5)];
    setEmojis(prev => [...prev, { id, x: oldPos.x, y: oldPos.y, char }]);
    setTimeout(() => {
      setEmojis(prev => prev.filter(e => e.id !== id));
    }, 1000);
    
    if (onEscape) onEscape();
  }, [pos, onEscape]);

  return (
    <div className="relative">
      <motion.button
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        onHoverStart={runAway}
        onTouchStart={runAway}
        onClick={runAway}
        className="px-6 py-3 rounded-full font-bold text-sm tracking-wide text-rose-500 border border-rose-200 bg-white/60 backdrop-blur-sm shadow-md cursor-not-allowed z-20 relative apology-body"
        style={{
          fontSize: escaped > 3 ? `${Math.max(10, 14 - escaped)}px` : '14px',
          opacity: escaped > 6 ? 0.6 : 1,
        }}
      >
        {text || 'No 🏃'}
      </motion.button>
      
      {/* Floating Emojis */}
      <AnimatePresence>
        {emojis.map(e => (
          <motion.div
            key={e.id}
            initial={{ opacity: 1, x: e.x, y: e.y, scale: 0.5 }}
            animate={{ opacity: 0, y: e.y - 40, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-2xl"
          >
            {e.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Drag to Mend Slider ─────────────────────────────────────────────
function DragToMend({ onMended }) {
  const [progress, setProgress] = useState(0);

  const handleDrag = (e) => {
    const val = Number(e.target.value);
    setProgress(val);
    if (val >= 100) {
      setTimeout(() => onMended(), 400); // slight delay before revealing button
    }
  };

  const leftOffset = -1 * (100 - progress) / 2.5; // moves from -40 to 0
  const rightOffset = (100 - progress) / 2.5;     // moves from 40 to 0
  const opacity = 0.5 + (progress / 200);

  return (
    <div className="w-full flex flex-col items-center py-6">
      <p className="text-rose-400 font-bold mb-6 text-sm uppercase tracking-widest animate-pulse apology-body">Drag to Mend</p>
      
      <div className="relative w-40 h-36 flex justify-center mb-8">
        {/* Left half */}
        <motion.svg
          viewBox="0 0 100 90"
          className="absolute inset-0 w-full h-full drop-shadow-md"
          style={{ x: leftOffset, opacity }}
        >
          <clipPath id="leftHalfDrag">
            <rect x="0" y="0" width="50" height="90" />
          </clipPath>
          <path d="M10 35 A22 22 0 0 1 50 28 A22 22 0 0 1 90 35 Q90 62 50 90 Q10 62 10 35 Z" fill={progress === 100 ? '#ff4757' : '#ff6b81'} clipPath="url(#leftHalfDrag)" />
        </motion.svg>
        {/* Right half */}
        <motion.svg
          viewBox="0 0 100 90"
          className="absolute inset-0 w-full h-full drop-shadow-md"
          style={{ x: rightOffset, opacity }}
        >
          <clipPath id="rightHalfDrag">
            <rect x="50" y="0" width="50" height="90" />
          </clipPath>
          <path d="M10 35 A22 22 0 0 1 50 28 A22 22 0 0 1 90 35 Q90 62 50 90 Q10 62 10 35 Z" fill={progress === 100 ? '#ff4757' : '#ff6b81'} clipPath="url(#rightHalfDrag)" />
        </motion.svg>
        
        {progress === 100 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: [1.2, 1] }} className="absolute inset-0 flex items-center justify-center">
             <span className="text-4xl drop-shadow-[0_0_15px_rgba(255,71,87,0.8)]">✨</span>
          </motion.div>
        )}
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleDrag}
        disabled={progress >= 100}
        className="w-full max-w-[200px] accent-rose-400 appearance-none bg-rose-200 h-3 rounded-full outline-none disabled:opacity-50 shadow-inner"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
}

// ── Relationship Timeline ───────────────────────────────────────────
const TIMELINE_STEPS = [
  { text: "We fight", icon: "🌧️", color: "text-slate-500", align: "start" },
  { text: "We talk", icon: "💬", color: "text-blue-500", align: "end" },
  { text: "We fix", icon: "🛠️", color: "text-amber-500", align: "start" },
  { text: "We stay", icon: "🤝", color: "text-emerald-500", align: "end" },
  { text: "We vibe", icon: "✨", color: "text-rose-500", align: "center" }
];

function DownRightArrow() {
  return (
    <div className="w-full flex justify-center py-2">
      <svg className="w-16 h-16 text-rose-300 opacity-60 translate-x-4" viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 10,5 C 10,35 30,25 30,55" />
        <polyline points="20,45 30,55 40,45" />
      </svg>
    </div>
  );
}

function DownLeftArrow() {
  return (
    <div className="w-full flex justify-center py-2">
      <svg className="w-16 h-16 text-rose-300 opacity-60 -translate-x-4" viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 30,5 C 30,35 10,25 10,55" />
        <polyline points="0,45 10,55 20,45" />
      </svg>
    </div>
  );
}

function DownCenterArrow() {
  return (
    <div className="w-full flex justify-center py-2">
      <svg className="w-12 h-16 text-rose-300 opacity-60" viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 28,5 C 28,30 20,30 20,55" />
        <polyline points="10,45 20,55 30,45" />
      </svg>
    </div>
  );
}

function RelationshipTimeline() {
  return (
    <div className="w-full max-w-sm mx-auto py-8 px-4 flex flex-col mt-4 mb-8">
      {TIMELINE_STEPS.map((step, i) => {
        const isStart = step.align === 'start';
        const isEnd = step.align === 'end';
        const isCenter = step.align === 'center';
        
        return (
          <div key={i} className="w-full flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex w-full ${isStart ? 'justify-start' : isEnd ? 'justify-end' : 'justify-center'}`}
            >
              <div className="bg-white/90 backdrop-blur-md border border-white/60 rounded-[2rem] px-6 py-3.5 flex items-center gap-4 shadow-[0_8px_20px_rgba(255,182,193,0.35)] hover:scale-105 transition-transform duration-300">
                <span className="text-3xl drop-shadow-sm">{step.icon}</span>
                <span className={`apology-title text-4xl font-bold ${step.color}`}>{step.text}</span>
              </div>
            </motion.div>
            
            {/* Draw Arrow to next step */}
            {i < TIMELINE_STEPS.length - 1 && (
               <motion.div
                 initial={{ opacity: 0, pathLength: 0 }}
                 whileInView={{ opacity: 1, pathLength: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
               >
                 {isStart ? <DownRightArrow /> : isEnd && i !== 3 ? <DownLeftArrow /> : <DownCenterArrow />}
               </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Gallery Scratch Card ──────────────────────────────────────────
function ApologyScratchCard({ img, enableScratchReveal }) {
  const canvasRef   = useRef(null);
  const isDrawing   = useRef(false);
  const [scratched, setScratched] = useState(false);

  useEffect(() => {
    if (!enableScratchReveal) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#fbcfe8'); // rose-200
    grad.addColorStop(1, '#fecdd3'); // rose-300
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for(let i=0; i<40; i++) {
      ctx.beginPath();
      ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*4 + 1, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 24px "Dancing Script", cursive';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch ✨', canvas.width/2, canvas.height/2 - 5);
    ctx.font = 'bold 16px "Nunito", sans-serif';
    ctx.fillStyle = '#fb7185';
    ctx.fillText('to reveal', canvas.width/2, canvas.height/2 + 20);
  }, [enableScratchReveal]);

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x:(src.clientX-r.left)*(canvas.width/r.width), y:(src.clientY-r.top)*(canvas.height/r.height) };
  };

  const scratch = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(x, y, 40, 0, Math.PI*2); ctx.fill();
    
    const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let t = 0;
    for (let i=3; i<data.length; i+=4) if (data[i]<128) t++;
    const p = Math.round((t/(canvas.width*canvas.height))*100);
    if (p > 50 && !scratched) setScratched(true);
  };

  return (
    <div className="relative aspect-square w-full h-full rounded-2xl overflow-hidden shadow-md border-4 border-white/60 bg-white cursor-pointer group">
      <img src={optimizeCloudinaryUrl(img, 600)} alt="Gallery" className={`w-full h-full object-cover transition-transform duration-500 ${!enableScratchReveal || scratched ? 'group-hover:scale-110' : ''}`} loading="lazy" />
      
      {enableScratchReveal && (
        <canvas ref={canvasRef} width={300} height={300}
          className={`absolute inset-0 w-full h-full touch-none ${scratched ? 'pointer-events-none' : 'cursor-crosshair'}`}
          style={{ opacity: scratched ? 0 : 1, transition:'opacity 0.8s ease' }}
          onPointerDown={() => { isDrawing.current = true; }}
          onPointerMove={scratch}
          onPointerUp={() => { isDrawing.current = false; }}
          onPointerCancel={() => { isDrawing.current = false; }}
        />
      )}
    </div>
  );
}

// ── Forgiven Celebration ────────────────────────────────────────────
function ForgivenScreen({ message, peaceOfferings = [], successImageUrl, peaceOfferingsTitle }) {
  const [claimedGift, setClaimedGift] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="flex flex-col items-center justify-center text-center py-8 w-full"
    >
      <motion.img 
        src={optimizeCloudinaryUrl(successImageUrl || "https://media1.tenor.com/m/Z-A_2HIfuUEAAAAC/milk-and-mocha-bear-hug.gif", 500)} 
        alt="Success Graphic"
        className="w-40 h-40 rounded-3xl object-cover mb-6 shadow-xl border-4 border-white"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.h2
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-rose-500 mb-2 apology-title drop-shadow-sm"
      >
        Yay! Thank You! 💕
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="text-slate-700 text-base leading-relaxed max-w-sm apology-body font-semibold mb-8"
      >
        {message}
      </motion.p>

      {/* Coupons Section */}
      {peaceOfferings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="w-full flex flex-col items-center mt-4"
        >
          <h3 className="apology-title text-3xl text-rose-500 mb-6 drop-shadow-sm">{peaceOfferingsTitle || "How can I make it up to you? Pick one! 👇"}</h3>
          <div className="flex flex-col gap-4 w-full px-2 max-w-sm">
            {peaceOfferings.map((offering, idx) => {
              const isClaimed = claimedGift === idx;
              const isOtherClaimed = claimedGift !== null && claimedGift !== idx;

              return (
                <motion.div
                  key={idx}
                  whileHover={claimedGift === null ? { scale: 1.05 } : {}}
                  whileTap={claimedGift === null ? { scale: 0.95 } : {}}
                  onClick={() => { if (claimedGift === null) setClaimedGift(idx); }}
                  className={`relative w-full bg-white/80 backdrop-blur-md border-2 border-dashed border-rose-300 rounded-2xl p-5 flex items-center justify-center cursor-pointer shadow-[0_4px_15px_rgba(255,182,193,0.3)] transition-all duration-500 ${
                    isClaimed ? 'scale-105 border-rose-500 bg-rose-50 z-10' : isOtherClaimed ? 'opacity-40 blur-sm grayscale' : ''
                  }`}
                >
                  <p className="apology-body text-rose-600 font-bold text-lg text-center">{offering}</p>
                  
                  <AnimatePresence>
                    {isClaimed && (
                      <motion.div
                        initial={{ opacity: 0, scale: 3, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: -10 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div className="border-[5px] border-rose-500 text-rose-500 text-4xl font-black px-6 py-2 rounded-xl uppercase tracking-widest apology-title bg-white/50 backdrop-blur-sm shadow-2xl" style={{ transform: 'rotate(-5deg)' }}>
                          DEAL! 🤝
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Main Template ───────────────────────────────────────────────────
export default function ApologyTemplate({ siteData }) {
  const data = siteData?.apology || {};
  const {
    introVideoUrl   = '',
    bgVideoUrl      = '',
    heroTitle       = 'I Am So Sorry 💔',
    heroSubtitle    = 'From the bottom of my heart...',
    apologyMessage  = 'I know I messed up. I am truly sorry for hurting you.',
    forgiveQuestion = 'Will you forgive me? 🥺',
    runawayButtonText  = 'No 🏃',
    forgiveButtonText  = 'Yes, I forgive you 💕',
    forgivenMessage    = 'Thank you for giving me another chance. 💖',
    successImageUrl    = 'https://media1.tenor.com/m/Z-A_2HIfuUEAAAAC/milk-and-mocha-bear-hug.gif',
    peaceOfferingsTitle= 'How can I make it up to you? Pick one! 👇',
    peaceOfferings     = ["Sushi Date 🍣", "Shopping Spree 🛍️", "Unlimited Cuddles 🤗"],
    musicUrl           = '',
    enableScratchReveal= false,
    galleryImages      = [],
  } = data;

  const introButtonText = siteData?.introButtonText || 'Tap to Open 💌';
  const primaryColor = siteData?.themeColors?.apology?.primary || '#e11d48';
  const bgColor = siteData?.themeColors?.apology?.background || '#fff0f5';

  const [unlocked, setUnlocked] = useState(false);
  const [mended, setMended] = useState(false);
  const [forgiven, setForgiven] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleForgive = () => {
    setForgiven(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4500);
  };

  return (
    <div id="apology-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .apology-title { font-family: 'Dancing Script', cursive; }
        .apology-body  { font-family: 'Nunito', sans-serif; }
        .apology-text-shadow {
          text-shadow: 0 2px 10px rgba(255, 240, 245, 0.95), 0 1px 3px rgba(255, 240, 245, 0.9);
        }
        #apology-container {
          --apology-primary: ${primaryColor};
          --apology-bg: ${bgColor};
        }
        #apology-container .text-rose-600,
        #apology-container .text-rose-500,
        #apology-container .text-rose-400,
        #apology-container .text-rose-300,
        #apology-container .text-rose-200 { color: var(--apology-primary) !important; }
        
        #apology-container .bg-rose-500,
        #apology-container .bg-rose-600,
        #apology-container .bg-rose-50,
        #apology-container .bg-rose-200 { background-color: var(--apology-primary) !important; }
        
        #apology-container .border-rose-200,
        #apology-container .border-rose-300,
        #apology-container .border-rose-500 { border-color: var(--apology-primary) !important; }
        
        #apology-container .accent-rose-400 { accent-color: var(--apology-primary) !important; }
      `}</style>

      <HeartConfetti active={showConfetti} />

      <AnimatePresence>
        {!unlocked && (
          <ApologyIntroScreen
            key="intro"
            introVideoUrl={introVideoUrl}
            onComplete={() => setUnlocked(true)}
            introButtonText={introButtonText}
          />
        )}
      </AnimatePresence>

      {unlocked && (
        <div className="relative min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: bgColor }}>
          {musicUrl && <audio id="apology-audio" src={musicUrl} autoPlay loop />}
          {bgVideoUrl && (
            <>
              <video
                src={optimizeCloudinaryUrl(bgVideoUrl, 1080)}
                autoPlay loop muted playsInline
                className="fixed inset-0 w-full h-full object-cover pointer-events-none opacity-75"
                style={{ zIndex: 0 }}
              />
              <div className="fixed inset-0 backdrop-blur-[3px] pointer-events-none" style={{ zIndex: 1, backgroundColor: `${bgColor}A0` }} />
            </>
          )}

          <div className="relative z-10 flex flex-col items-center min-h-screen py-16 px-4">
            
            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16 mt-8">
              <h1 className="apology-title text-6xl md:text-7xl text-rose-600 mb-4 apology-text-shadow">{heroTitle}</h1>
              <p className="apology-body text-rose-500 font-bold text-xl apology-text-shadow">{heroSubtitle}</p>
            </motion.div>

            {/* Letter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full max-w-xl mb-8 relative"
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="350 80 80"
                backgroundColor="rgba(255, 255, 255, 0.85)"
                borderRadius={32}
                glowRadius={40}
                glowIntensity={1.0}
                colors={['#ff6b81', '#f472b6', '#ffb6c1']}
                className="w-full"
              >
                <div className="p-8 relative">
                  <span className="absolute -top-6 left-6 text-6xl text-rose-200 font-serif leading-none">"</span>
                  <p className="apology-body text-slate-700 text-lg leading-relaxed text-center font-medium relative z-10 whitespace-pre-wrap">
                    {apologyMessage}
                  </p>
                  <span className="absolute -bottom-8 right-6 text-6xl text-rose-200 font-serif leading-none">"</span>
                </div>
              </BorderGlow>
            </motion.div>

            {/* Relationship Timeline */}
            <RelationshipTimeline />

            {/* Interactive Question Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full max-w-lg mt-8 relative z-20"
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="350 80 80"
                backgroundColor="rgba(255, 255, 255, 0.85)"
                borderRadius={40}
                glowRadius={40}
                glowIntensity={1.0}
                colors={['#ff6b81', '#f472b6', '#ffb6c1']}
                className="w-full"
              >
                <div className="p-8 min-h-[400px] flex flex-col items-center justify-center relative">
              <AnimatePresence mode="wait">
                {forgiven ? (
                  <ForgivenScreen key="forgiven" message={forgivenMessage} peaceOfferings={peaceOfferings} successImageUrl={successImageUrl} peaceOfferingsTitle={peaceOfferingsTitle} />
                ) : !mended ? (
                  <motion.div key="slider" exit={{ opacity: 0, scale: 0.9 }} className="w-full">
                    <DragToMend onMended={() => setMended(true)} />
                  </motion.div>
                ) : (
                  <motion.div key="question" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col items-center">
                    <h2 className="apology-title text-4xl text-rose-600 mb-10 text-center apology-text-shadow">{forgiveQuestion}</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full relative min-h-[80px]">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleForgive}
                        className="apology-body px-8 py-4 rounded-full font-bold text-white text-base shadow-[0_4px_20px_rgba(255,71,87,0.4)] z-30"
                        style={{ background: 'linear-gradient(135deg, #ff6b81 0%, #ff4757 100%)' }}
                      >
                        {forgiveButtonText}
                      </motion.button>
                      <RunawayButton text={runawayButtonText} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
                </div>
              </BorderGlow>
            </motion.div>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div className="w-full max-w-2xl mt-24 mb-12">
                <h3 className="apology-title text-4xl text-center text-rose-400 mb-8">Our Beautiful Moments</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((url, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="aspect-square"
                    >
                      <ApologyScratchCard img={url} enableScratchReveal={enableScratchReveal} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-16 text-rose-300 text-xs font-bold uppercase tracking-widest apology-body">Made with ❤️ · EverWish</p>
          </div>
        </div>
      )}
    </div>
  );
}
