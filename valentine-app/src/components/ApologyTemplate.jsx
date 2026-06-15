/**
 * ApologyTemplate.jsx
 * "Forgive Me" — A fully dynamic, mobile-first emotional celebration template.
 * Soft Frosted Glass Aesthetic.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

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
            <video
              ref={videoRef}
              src={introVideoUrl}
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
  { text: "We fight", icon: "🌧️", color: "text-slate-500" },
  { text: "We talk", icon: "💬", color: "text-blue-400" },
  { text: "We fix", icon: "🛠️", color: "text-amber-500" },
  { text: "We stay", icon: "🤝", color: "text-emerald-500" },
  { text: "We vibe", icon: "✨", color: "text-rose-500" }
];

function RelationshipTimeline() {
  return (
    <div className="w-full max-w-sm mx-auto py-12 px-4 relative mt-12 mb-8">
      <div className="absolute left-[39px] top-16 bottom-16 w-1 bg-rose-200 rounded-full" />
      {TIMELINE_STEPS.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20, filter: 'grayscale(100%)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'grayscale(0%)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: i * 0.15 }}
          className="flex items-center gap-6 mb-8 relative z-10"
        >
          <div className="w-12 h-12 rounded-full bg-white border-4 border-rose-100 flex items-center justify-center text-xl shadow-md shrink-0">
            {step.icon}
          </div>
          <div className="bg-white/60 backdrop-blur-md border border-white/60 px-6 py-3 rounded-2xl shadow-[0_4px_20px_rgba(255,182,193,0.3)]">
            <p className={`apology-title text-3xl font-bold ${step.color}`}>{step.text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Forgiven Celebration ────────────────────────────────────────────
function ForgivenScreen({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="flex flex-col items-center justify-center text-center py-8"
    >
      <motion.img 
        src="https://media1.tenor.com/m/Z-A_2HIfuUEAAAAC/milk-and-mocha-bear-hug.gif" 
        alt="Bear Hug"
        className="w-48 h-48 rounded-3xl object-cover mb-6 shadow-xl border-4 border-white"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.h2
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-rose-500 mb-4 apology-title drop-shadow-sm"
      >
        Yay! Thank You! 💕
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="text-slate-700 text-lg leading-relaxed max-w-sm apology-body font-semibold"
      >
        {message || 'Thank you for giving me another chance. I promise I will do better. You are my everything. 💖'}
      </motion.p>
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
    galleryImages      = [],
  } = data;

  const introButtonText = siteData?.introButtonText || 'Tap to Open 💌';

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .apology-title { font-family: 'Dancing Script', cursive; }
        .apology-body  { font-family: 'Nunito', sans-serif; }
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
        <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#fff0f5] via-[#ffe4e1] to-[#ffdae0]">
          {bgVideoUrl && (
            <video
              src={bgVideoUrl}
              autoPlay loop muted playsInline
              className="fixed inset-0 w-full h-full object-contain pointer-events-none opacity-40 mix-blend-overlay"
              style={{ zIndex: 0 }}
            />
          )}

          <div className="relative z-10 flex flex-col items-center min-h-screen py-16 px-4">
            
            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16 mt-8">
              <h1 className="apology-title text-6xl md:text-7xl text-rose-500 mb-4 drop-shadow-sm">{heroTitle}</h1>
              <p className="apology-body text-rose-400 font-semibold text-lg">{heroSubtitle}</p>
            </motion.div>

            {/* Letter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full max-w-xl bg-white/50 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-[0_8px_32px_rgba(255,182,193,0.3)] mb-8 relative"
            >
              <span className="absolute -top-6 left-6 text-6xl text-rose-200 font-serif leading-none">"</span>
              <p className="apology-body text-slate-700 text-lg leading-relaxed text-center font-medium relative z-10">
                {apologyMessage}
              </p>
              <span className="absolute -bottom-8 right-6 text-6xl text-rose-200 font-serif leading-none">"</span>
            </motion.div>

            {/* Relationship Timeline */}
            <RelationshipTimeline />

            {/* Interactive Question Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full max-w-lg mt-8 bg-white/50 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 shadow-[0_8px_32px_rgba(255,182,193,0.3)] min-h-[400px] flex flex-col items-center justify-center relative z-20"
            >
              <AnimatePresence mode="wait">
                {forgiven ? (
                  <ForgivenScreen key="forgiven" message={forgivenMessage} />
                ) : !mended ? (
                  <motion.div key="slider" exit={{ opacity: 0, scale: 0.9 }} className="w-full">
                    <DragToMend onMended={() => setMended(true)} />
                  </motion.div>
                ) : (
                  <motion.div key="question" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col items-center">
                    <h2 className="apology-title text-4xl text-rose-500 mb-10 text-center drop-shadow-sm">{forgiveQuestion}</h2>
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
                      className="aspect-square rounded-2xl overflow-hidden shadow-md border-4 border-white/60"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-16 text-rose-300 text-xs font-bold uppercase tracking-widest apology-body">Made with ❤️ · EverWish</p>
          </div>
        </div>
      )}
    </>
  );
}
