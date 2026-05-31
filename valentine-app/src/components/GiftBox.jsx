import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

// ── Explosion particle data generator ────────────────────────────────
function generateExplosionParticles(count = 40) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const distance = 100 + Math.random() * 180;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 60,
      size: Math.random() * 14 + 6,
      rotation: Math.random() * 720 - 360,
      delay: Math.random() * 0.15,
      duration: 0.8 + Math.random() * 0.6,
      emoji: ["❤️", "🌸", "✨", "💖", "🎀", "💕", "🌹", "⭐"][Math.floor(Math.random() * 8)],
    };
  });
}

// ── Box fragment for explosion ───────────────────────────────────────
function generateBoxFragments(count = 12) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count;
    const dist = 60 + Math.random() * 120;
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 40,
      rotation: Math.random() * 540 - 270,
      delay: Math.random() * 0.08,
      width: 12 + Math.random() * 20,
      height: 10 + Math.random() * 16,
      color: ["#e11d48", "#f43f5e", "#fb7185", "#fda4af", "#fbbf24", "#f59e0b"][Math.floor(Math.random() * 6)],
    };
  });
}

export default function GiftBox({
  recipient    = 'You',
  message      = "You deserve all the flowers in the world. Here's a virtual bouquet for you, filled with my endless love, hugs, and a promise to always make you smile.",
  bouquetUrl   = 'https://pngimg.com/uploads/bouquet/bouquet_PNG48.png',
}) {
  const [phase, setPhase] = useState('closed'); // 'closed' | 'exploding' | 'revealed'
  const [particles] = useState(() => generateExplosionParticles(40));
  const [fragments] = useState(() => generateBoxFragments(14));
  const containerRef = useRef(null);

  const handleOpen = () => {
    if (phase !== 'closed') return;
    setPhase('exploding');

    // After explosion, reveal the gift
    setTimeout(() => {
      setPhase('revealed');
    }, 900);
  };

  return (
    <section
      id="gift-box"
      className="py-24 px-6 text-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fff0f5 0%, #fce7f3 100%)" }}
    >
      <div className="max-w-md mx-auto" ref={containerRef}>
        {/* Section Title */}
        <span className="text-rose-400 text-xs tracking-widest uppercase font-semibold">
          A Special Surprise
        </span>
        <h2 className="serif text-4xl md:text-5xl font-bold text-rose-700 mt-2 mb-3">
          Your Virtual Gift
        </h2>
        <p className="text-rose-600/70 text-sm max-w-xs mx-auto mb-16 leading-relaxed">
          I couldn't send these to your doorstep, but I wrapped them with all my love. Tap the box to open! 🎁
        </p>

        {/* Gift Box wrapper */}
        <div className="relative min-h-[380px] flex flex-col items-center justify-center select-none">
          
          {/* ── EXPLOSION PARTICLES ── */}
          <AnimatePresence>
            {phase === 'exploding' &&
              particles.map((p) => (
                <motion.div
                  key={`particle-${p.id}`}
                  className="absolute pointer-events-none z-40"
                  style={{ fontSize: p.size }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: p.x,
                    y: p.y,
                    scale: [0.3, 1.3, 1, 0],
                    rotate: p.rotation,
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: "easeOut",
                  }}
                >
                  {p.emoji}
                </motion.div>
              ))}
          </AnimatePresence>

          {/* ── BOX FRAGMENTS (flying away pieces of the box) ── */}
          <AnimatePresence>
            {phase === 'exploding' &&
              fragments.map((f) => (
                <motion.div
                  key={`frag-${f.id}`}
                  className="absolute z-30 rounded-sm pointer-events-none"
                  style={{
                    width: f.width,
                    height: f.height,
                    backgroundColor: f.color,
                  }}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    x: f.x,
                    y: f.y,
                    scale: [1, 0.8, 0.3],
                    rotate: f.rotation,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: f.delay,
                    ease: "easeOut",
                  }}
                />
              ))}
          </AnimatePresence>

          {/* ── GIFT BOX (before explosion) ── */}
          <AnimatePresence>
            {phase === 'closed' && (
              <motion.div
                key="gift-box-closed"
                exit={{
                  scale: [1, 1.15, 0],
                  opacity: [1, 1, 0],
                  transition: { duration: 0.4, ease: "easeIn" },
                }}
                onClick={handleOpen}
                className="relative flex flex-col items-center cursor-pointer group z-10"
              >
                {/* Wiggle on hover */}
                <motion.div
                  whileHover={{
                    rotate: [0, -4, 4, -4, 4, 0],
                    transition: { duration: 0.5, repeat: Infinity },
                  }}
                  whileTap={{ scale: 0.92 }}
                  className="relative"
                >
                  {/* Box Lid */}
                  <div className="relative z-20 w-[170px] h-11 bg-rose-500 rounded-t-xl shadow-md border-b-2 border-rose-600 flex items-center justify-center">
                    {/* Bow on top */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                      <svg width="70" height="36" viewBox="0 0 70 36" fill="none" className="filter drop-shadow-sm">
                        <path d="M35 24 C12 0, 5 36, 35 24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                        <path d="M35 24 C58 0, 65 36, 35 24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                        <circle cx="35" cy="24" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
                      </svg>
                    </div>
                    {/* Lid ribbon */}
                    <div className="w-7 h-full bg-amber-400" />
                  </div>

                  {/* Box Body */}
                  <div className="relative w-40 h-32 bg-rose-600 rounded-b-2xl shadow-xl overflow-hidden border-t-2 border-rose-700 z-10">
                    {/* Vertical ribbon */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-7 bg-amber-400 shadow-inner" />
                    {/* Horizontal ribbon */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-7 bg-amber-400 shadow-inner" />
                  </div>
                </motion.div>

                {/* Tap indicator */}
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mt-8 text-xs font-semibold tracking-wider text-rose-400 uppercase"
                >
                  Tap to open ✨
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── REVEALED GIFT (after explosion) ── */}
          <AnimatePresence>
            {phase === 'revealed' && (
              <motion.div
                key="gift-revealed"
                className="flex flex-col items-center z-20"
                initial={{ scale: 0, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 18,
                  delay: 0.1,
                }}
              >
                {/* Glow behind gift */}
                <div
                  className="absolute rounded-full bg-rose-400/20 blur-3xl -z-10"
                  style={{ width: "240px", height: "240px" }}
                />

                {/* Gift Image */}
                <motion.img
                  src={bouquetUrl || 'https://pngimg.com/uploads/bouquet/bouquet_PNG48.png'}
                  alt="Gift"
                  className="w-60 h-60 object-contain drop-shadow-[0_15px_35px_rgba(225,29,72,0.35)] rounded-2xl"
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 250, damping: 15, delay: 0.2 }}
                />

                {/* Celebratory sparkle emojis floating around */}
                {["✨", "💖", "✨", "💕", "✨"].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-xl pointer-events-none"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + (i % 3) * 25}%`,
                    }}
                    animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SECRET MESSAGE (Graceful fade-in below bouquet) */}
        <AnimatePresence>
          {phase === 'revealed' && (
            <motion.div
              className="mt-8 p-6 bg-white/80 backdrop-blur border border-rose-100 rounded-3xl shadow-xl shadow-rose-100/60 max-w-sm mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Heart size={16} fill="#e11d48" color="#e11d48" className="mx-auto mb-3" />
              <h4 className="serif text-rose-700 font-bold text-lg mb-1">
                For {recipient} 💐
              </h4>
              <p className="text-gray-600 leading-relaxed text-sm italic">
                "{message}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
