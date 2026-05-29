import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export default function GiftBox({
  recipient    = 'You',
  message      = "You deserve all the flowers in the world. Here's a virtual bouquet for you, filled with my endless love, hugs, and a promise to always make you smile.",
  bouquetUrl   = 'https://pngimg.com/uploads/bouquet/bouquet_PNG48.png',
}) {
  const [isOpened, setIsOpened] = useState(false);
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);

    // Generate local floating particles (hearts/petals) around the bouquet
    const newParticles = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 200, // horizontal spread
      y: (Math.random() - 0.5) * 150 - 50, // vertical spread
      size: Math.random() * 12 + 8,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.2,
      emoji: ["❤️", "🌸", "✨", "💖"][Math.floor(Math.random() * 4)],
    }));
    setParticles(newParticles);
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

        {/* Gift Box wrapper (maintains layout so page doesn't shift) */}
        <div className="relative h-[320px] flex flex-col items-center justify-center select-none">
          
          {/* Confetti Particles (only when opened) */}
          <AnimatePresence>
            {isOpened &&
              particles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute pointer-events-none text-lg z-30"
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: p.x,
                    y: p.y - 100,
                    scale: [0.5, 1.2, 1, 0.4],
                    rotate: p.rotation + 180,
                  }}
                  transition={{
                    duration: 1.8,
                    delay: p.delay,
                    ease: "easeOut",
                  }}
                >
                  {p.emoji}
                </motion.div>
              ))}
          </AnimatePresence>

          {/* FLOWER BOUQUET POP-UP */}
          <AnimatePresence>
            {isOpened && (
              <motion.div
                className="absolute z-20 flex flex-col items-center"
                initial={{ scale: 0, y: 40 }}
                animate={{ scale: 1, y: -60 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                {/* Glowing drop shadow background */}
                <div
                  className="absolute inset-0 rounded-full bg-rose-400/20 blur-3xl -z-10"
                  style={{ width: "200px", height: "200px", transform: "translate(-15%, -15%)" }}
                />
                
                {/* Transparent Bouquet Image */}
                <img
                  src={bouquetUrl || 'https://pngimg.com/uploads/bouquet/bouquet_PNG48.png'}
                  alt="Flower Bouquet"
                  className="w-56 h-56 object-contain drop-shadow-[0_15px_30px_rgba(225,29,72,0.4)]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* GIFT BOX GRAPHIC */}
          <div
            onClick={handleOpen}
            className={`relative flex flex-col items-center cursor-pointer group z-10 transition-transform duration-300 ${
              isOpened ? "" : "hover:scale-105 active:scale-95"
            }`}
          >
            {/* Box Lid */}
            <AnimatePresence>
              {!isOpened && (
                <motion.div
                  className="relative z-20 w-36 h-10 bg-rose-500 rounded-t-lg shadow-md border-b-2 border-rose-600 flex items-center justify-center"
                  exit={{
                    y: -140,
                    rotate: -15,
                    opacity: 0,
                    transition: { duration: 0.6, ease: "easeOut" },
                  }}
                >
                  {/* Decorative Bow ribbon */}
                  <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 text-2xl filter drop-shadow">
                    🎀
                  </div>
                  <div className="w-6 h-full bg-rose-600" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Box Body */}
            <div className="relative w-32 h-28 bg-rose-600 rounded-b-lg shadow-xl overflow-hidden flex justify-center border-t-2 border-rose-700">
              {/* Vertical ribbon stripe */}
              <div className="w-5 h-full bg-rose-700" />
              {/* Horizontal ribbon stripe */}
              <div className="absolute top-1/2 left-0 w-full h-5 bg-rose-700 -translate-y-1/2" />
            </div>

            {/* Tap indicator */}
            {!isOpened && (
              <span className="absolute -bottom-10 text-xs font-semibold tracking-wider text-rose-400 uppercase animate-bounce">
                Tap to open
              </span>
            )}
          </div>
        </div>

        {/* SECRET MESSAGE (Graceful fade-in below bouquet) */}
        <AnimatePresence>
          {isOpened && (
            <motion.div
              className="mt-6 p-6 bg-white/80 backdrop-blur border border-rose-100 rounded-3xl shadow-xl shadow-rose-100/60 max-w-sm mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
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
