import { motion } from "framer-motion";
import { Heart, CalendarHeart } from "lucide-react";
import { siteData } from "../siteData";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero({ siteDataOverride }) {
  const d = siteDataOverride || siteData;
  const { coupleName, heroSubtitle, heroImageUrl, heroDate, loveLetterText, coupleEmoji } = d;

  return (
    <motion.section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fff0f5 0%, #fce7f3 60%, #fff0f5 100%)" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Soft radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(225,29,72,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Couple emoji badge */}
      <motion.div
        variants={itemVariants}
        className="text-5xl mb-6 relative z-10"
      >
        {coupleEmoji}
      </motion.div>

      {/* Hero image – polaroid style */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 mb-10"
        whileHover={{ rotate: 2, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <div
          className="polaroid"
          style={{ transform: "rotate(-1.5deg)", maxWidth: "320px" }}
        >
          <img
            src={heroImageUrl}
            alt="Us"
            loading="eager"
            fetchpriority="high"
            className="w-72 h-72 object-cover block"
          />
          <p
            className="serif text-center mt-3 text-sm text-gray-500 italic"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {coupleName}
          </p>
        </div>

        {/* Floating heart on polaroid */}
        <motion.div
          className="absolute -top-4 -right-4 text-3xl"
          animate={{ scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          ❤️
        </motion.div>
      </motion.div>

      {/* Heading */}
      <motion.h1
        variants={itemVariants}
        className="serif text-5xl md:text-7xl font-bold leading-tight text-rose-700 relative z-10"
      >
        Our Love Story
      </motion.h1>

      {/* Date badge */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 mt-4 flex items-center gap-2 text-rose-400 text-sm font-medium tracking-widest uppercase"
      >
        <CalendarHeart size={16} />
        <span>{heroDate}</span>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        className="relative z-10 mt-5 max-w-md text-rose-600/70 text-lg font-light leading-relaxed"
      >
        {heroSubtitle}
      </motion.p>

      {/* Love letter card */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 mt-12 max-w-lg bg-white/80 backdrop-blur-sm border border-rose-100 rounded-3xl px-8 py-7 shadow-xl shadow-rose-100/60"
      >
        <Heart size={22} fill="#e11d48" color="#e11d48" className="mx-auto mb-4" />
        <p
          className="serif italic text-gray-600 leading-relaxed text-base md:text-lg"
        >
          "{loveLetterText}"
        </p>
        <p className="serif mt-4 text-rose-400 font-semibold">— with all my love ❤️</p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 mt-16 flex flex-col items-center gap-1 text-rose-300"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-xs tracking-widest uppercase font-medium">
          Scroll to explore
        </span>
        <span className="text-xl">↓</span>
      </motion.div>
    </motion.section>
  );
}
