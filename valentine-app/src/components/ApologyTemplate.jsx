/**
 * ApologyTemplate.jsx
 * "Forgive Me" — A fully dynamic, mobile-first emotional celebration template.
 * Features: intro video + mending heart transition, fixed looping bg video,
 * glassmorphic content, & a runaway "No" button.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// ── Confetti / Heart-Burst on Forgiveness ──────────────────────────
const BURST_PARTICLES = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 30,
  color: ['#f43f5e','#fb7185','#fbbf24','#a78bfa','#34d399','#ec4899','#f9a8d4','#fff'][i % 8],
  size: Math.random() * 10 + 5,
  delay: Math.random() * 0.6,
  duration: 1.4 + Math.random() * 1.2,
  rotate: Math.random() * 720 - 360,
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
            borderRadius: Math.random() > 0.5 ? '50%' : 2,
            backgroundColor: p.color,
          }}
        />
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
      style={{ background: 'radial-gradient(ellipse at center, #1a0010 0%, #0a0005 100%)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Broken halves */}
      <div className="relative w-48 h-44 select-none">
        {/* Left half */}
        <motion.svg
          viewBox="0 0 100 90"
          className="absolute inset-0 w-full h-full"
          initial={{ x: -30, rotate: -15, opacity: 0 }}
          animate={controls}
          variants={{
            visible: { x: -20, rotate: -10, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
            mended:  { x: 0, rotate: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut', type: 'spring', stiffness: 200 } },
          }}
        >
          <clipPath id="leftHalf">
            <rect x="0" y="0" width="50" height="90" />
          </clipPath>
          <path
            d="M10 35 A22 22 0 0 1 50 28 A22 22 0 0 1 90 35 Q90 62 50 90 Q10 62 10 35 Z"
            fill="#f43f5e"
            opacity="0.9"
            clipPath="url(#leftHalf)"
          />
          {/* Crack line */}
          <polyline
            points="50,20 48,40 52,55 47,70 50,90"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            fill="none"
            clipPath="url(#leftHalf)"
          />
        </motion.svg>

        {/* Right half */}
        <motion.svg
          viewBox="0 0 100 90"
          className="absolute inset-0 w-full h-full"
          initial={{ x: 30, rotate: 15, opacity: 0 }}
          animate={controls}
          variants={{
            visible: { x: 20, rotate: 10, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
            mended:  { x: 0, rotate: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut', type: 'spring', stiffness: 200 } },
          }}
        >
          <clipPath id="rightHalf">
            <rect x="50" y="0" width="50" height="90" />
          </clipPath>
          <path
            d="M10 35 A22 22 0 0 1 50 28 A22 22 0 0 1 90 35 Q90 62 50 90 Q10 62 10 35 Z"
            fill="#f43f5e"
            opacity="0.9"
            clipPath="url(#rightHalf)"
          />
          <polyline
            points="50,20 52,40 48,55 53,70 50,90"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            fill="none"
            clipPath="url(#rightHalf)"
          />
        </motion.svg>

        {/* Golden sparkle on mend */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={controls}
          variants={{
            visible: { opacity: 0, scale: 0 },
            mended:  { opacity: [0, 1, 0], scale: [0, 2, 0], transition: { delay: 0.5, duration: 1 } },
          }}
        >
          <span className="text-5xl">✨</span>
        </motion.div>
      </div>

      <motion.p
        className="mt-8 text-white/80 text-sm font-light tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={controls}
        variants={{
          visible: { opacity: 0 },
          mended: { opacity: 1, transition: { delay: 0.3, duration: 0.8 } },
        }}
      >
        My heart is yours... always.
      </motion.p>
    </motion.div>
  );
}

// ── Intro Video Screen ──────────────────────────────────────────────
function ApologyIntroScreen({ introVideoUrl, onComplete, introButtonText }) {
  const videoRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle | playing | transitioning
  const [showTap, setShowTap] = useState(true);

  const handleTap = () => {
    if (phase !== 'idle') return;
    setShowTap(false);
    setPhase('playing');
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else {
      setPhase('transitioning');
    }
  };

  const handleVideoEnd = () => {
    setPhase('transitioning');
  };

  return (
    <AnimatePresence mode="wait">
      {phase === 'transitioning' ? (
        <MendingHeartTransition key="transition" onComplete={onComplete} />
      ) : (
        <motion.div
          key="intro"
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer select-none overflow-hidden"
          style={{ background: '#0a0005' }}
          onClick={handleTap}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Background Video */}
          {introVideoUrl && (
            <video
              ref={videoRef}
              src={introVideoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted={false}
              onEnded={handleVideoEnd}
              preload="metadata"
              style={{ willChange: 'transform' }}
            />
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Tap prompt */}
          <AnimatePresence>
            {showTap && (
              <motion.div
                className="relative z-10 flex flex-col items-center gap-6 text-center px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-7xl"
                >
                  💔
                </motion.div>
                <motion.div
                  className="px-8 py-3 rounded-full border border-white/30 text-white font-semibold tracking-widest text-sm uppercase backdrop-blur-md"
                  style={{ background: 'rgba(244,63,94,0.25)' }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {introButtonText || 'Tap to Open 💌'}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip button if video is playing */}
          {phase === 'playing' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={(e) => { e.stopPropagation(); setPhase('transitioning'); }}
              className="absolute bottom-8 right-6 z-20 text-white/50 hover:text-white/90 text-xs tracking-widest uppercase transition-colors cursor-pointer"
            >
              Skip →
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Runaway "No" Button ─────────────────────────────────────────────
function RunawayButton({ text, onEscape }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [escaped, setEscaped] = useState(0); // count attempts

  const runAway = useCallback(() => {
    const randX = (Math.random() - 0.5) * 300;
    const randY = (Math.random() - 0.5) * 200;
    setPos({ x: randX, y: randY });
    setEscaped(c => c + 1);
    if (onEscape) onEscape();
  }, [onEscape]);

  return (
    <motion.button
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onHoverStart={runAway}
      onTouchStart={runAway}
      onClick={runAway}
      className="px-6 py-3 rounded-full font-bold text-sm tracking-wide text-white border border-white/20 backdrop-blur-sm select-none cursor-not-allowed"
      style={{
        background: 'rgba(255,255,255,0.1)',
        fontSize: escaped > 3 ? `${Math.max(8, 14 - escaped)}px` : '14px',
        opacity: escaped > 6 ? 0.4 : 1,
      }}
    >
      {text || 'No 🏃'}
    </motion.button>
  );
}

// ── Forgiven Celebration ────────────────────────────────────────────
function ForgivenScreen({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="flex flex-col items-center justify-center text-center px-6 py-12 min-h-[60vh]"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 1.5, repeat: 2, ease: 'easeInOut' }}
        className="text-8xl mb-6"
      >
        💖
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-white mb-4"
        style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 2px 20px rgba(244,63,94,0.6)' }}
      >
        Thank You! 💕
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-white/90 text-base leading-relaxed max-w-sm"
        style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
      >
        {message || 'Thank you for giving me another chance. I promise I will do better. You are my everything. 💖'}
      </motion.p>
    </motion.div>
  );
}

// ── Gallery Row ─────────────────────────────────────────────────────
function ApologyGallery({ images }) {
  if (!images || images.length === 0) return null;
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-16">
      <p className="text-center text-white/60 text-xs uppercase tracking-widest mb-6 font-mono">Our Memories 💌</p>
      <div className="grid grid-cols-3 gap-2">
        {images.map((url, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            onClick={() => setSelected(url)}
            className="aspect-square rounded-xl overflow-hidden cursor-pointer shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.img
              src={selected}
              alt=""
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl font-light cursor-pointer"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  const [forgiven, setForgiven] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [noEscapeCount, setNoEscapeCount] = useState(0);

  const handleForgive = () => {
    setForgiven(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const handleNoEscape = () => {
    setNoEscapeCount(c => c + 1);
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Lato:ital,wght@0,300;0,400;1,300&display=swap');
        .apology-title { font-family: 'Dancing Script', cursive; }
        .apology-body  { font-family: 'Lato', sans-serif; }
      `}</style>

      {/* Confetti */}
      <HeartConfetti active={showConfetti} />

      {/* ── INTRO VIDEO / LOCKSCREEN ─────────────────── */}
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

      {/* ── MAIN PAGE ────────────────────────────────── */}
      {unlocked && (
        <div className="relative min-h-screen w-full overflow-x-hidden">

          {/* Fixed Looping Background Video */}
          {bgVideoUrl ? (
            <video
              src={bgVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="fixed inset-0 w-full h-full object-cover pointer-events-none"
              style={{ zIndex: 0, willChange: 'transform' }}
            />
          ) : (
            <div
              className="fixed inset-0 pointer-events-none"
              style={{ zIndex: 0, background: 'radial-gradient(ellipse at top, #1a0010 0%, #0a0005 50%, #120008 100%)' }}
            />
          )}

          {/* Cinematic gradient overlay for readability */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 1, background: 'linear-gradient(to bottom, rgba(10,0,5,0.65) 0%, rgba(10,0,5,0.35) 50%, rgba(10,0,5,0.75) 100%)' }}
          />

          {/* Scrollable Content */}
          <div className="relative z-10 flex flex-col items-center min-h-screen">

            {/* ── HERO SECTION ─────────────────────────────── */}
            <section className="w-full max-w-2xl mx-auto px-4 pt-20 pb-12 text-center flex flex-col items-center">
              {/* Animated broken heart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 }}
                className="text-7xl mb-4 select-none"
                animate={{ y: [0, -8, 0] }}
                // eslint-disable-next-line
                transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.5 }, scale: { duration: 0.5 } }}
              >
                💔
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="apology-title text-5xl md:text-7xl text-white mb-3"
                style={{ textShadow: '0 4px 30px rgba(244,63,94,0.5)' }}
              >
                {heroTitle}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="apology-body italic text-white/80 text-lg tracking-wide mb-2"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
              >
                {heroSubtitle}
              </motion.p>

              <motion.div
                className="w-20 h-px bg-rose-400/50 mx-auto mt-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </section>

            {/* ── APOLOGY MESSAGE ───────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-xl mx-auto px-4 mb-14"
            >
              <div
                className="relative rounded-3xl p-8 text-center"
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 8px 40px rgba(244,63,94,0.15)',
                }}
              >
                {/* Quote marks */}
                <span className="absolute -top-5 left-6 text-6xl text-rose-400/30 font-serif leading-none select-none">"</span>
                <p
                  className="apology-body text-white/95 text-base leading-relaxed"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                >
                  {apologyMessage}
                </p>
                <span className="absolute -bottom-6 right-6 text-6xl text-rose-400/30 font-serif leading-none select-none">"</span>
              </div>
            </motion.section>

            {/* ── FORGIVE ME INTERACTIVE SECTION ────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-xl mx-auto px-4 mb-20 flex flex-col items-center"
            >
              <div
                className="w-full rounded-3xl p-8 flex flex-col items-center"
                style={{
                  background: 'rgba(244,63,94,0.12)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(244,63,94,0.25)',
                  boxShadow: '0 8px 40px rgba(244,63,94,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                  minHeight: forgiven ? 'auto' : '300px',
                  overflow: 'hidden',
                }}
              >
                <AnimatePresence mode="wait">
                  {forgiven ? (
                    <ForgivenScreen key="forgiven" message={forgivenMessage} />
                  ) : (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center w-full"
                    >
                      {/* Emoji */}
                      <motion.div
                        animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-6xl mb-6 select-none"
                      >
                        🥺
                      </motion.div>

                      {/* Question */}
                      <h2
                        className="apology-title text-3xl md:text-4xl text-white text-center mb-2"
                        style={{ textShadow: '0 2px 15px rgba(244,63,94,0.6)' }}
                      >
                        {forgiveQuestion}
                      </h2>

                      {/* Escape counter hint */}
                      {noEscapeCount > 0 && noEscapeCount < 5 && (
                        <motion.p
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="text-white/40 text-xs mt-1 mb-4 italic"
                        >
                          {noEscapeCount === 1 ? "Don't try to run away from love! 💕" : noEscapeCount === 2 ? "Hehe... that's not gonna work 😏" : "You can't escape! 💖"}
                        </motion.p>
                      )}
                      {noEscapeCount >= 5 && (
                        <p className="text-white/30 text-xs mt-1 mb-4 italic">The "No" button gave up trying to run 😂</p>
                      )}

                      {/* Buttons */}
                      <div className="relative w-full flex justify-center items-center gap-6 mt-6" style={{ minHeight: 80 }}>
                        {/* YES button */}
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleForgive}
                          className="apology-body relative z-10 px-8 py-3 rounded-full font-bold text-white text-sm tracking-wide shadow-xl cursor-pointer"
                          style={{
                            background: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
                            boxShadow: '0 4px 24px rgba(244,63,94,0.5)',
                          }}
                        >
                          {forgiveButtonText}
                        </motion.button>

                        {/* NO runaway button */}
                        <RunawayButton text={runawayButtonText} onEscape={handleNoEscape} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* ── GALLERY ──────────────────────────────────── */}
            {galleryImages.length > 0 && (
              <ApologyGallery images={galleryImages} />
            )}

            {/* Footer */}
            <div className="pb-12 text-center">
              <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-mono">
                Made with ❤️ · EverWish
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
