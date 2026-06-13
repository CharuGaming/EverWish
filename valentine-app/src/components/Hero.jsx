/**
 * Hero.jsx  –  Polaroid template hero section.
 *
 * Layering (bottom → top):
 *   0.  bgVideoUrl  (or static gradient if absent)  — fixed background
 *   1.  Cinematic dark gradient overlay
 *   2.  Floating polaroid / content (z-10+)
 *
 * All Framer Motion animations use `willChange: "transform"` and
 * `translateZ(0)` hints for GPU compositing, keeping the background
 * video decode on a separate layer.
 */

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, CalendarHeart } from 'lucide-react';
import { siteData } from '../siteData';
import { optimizeCloudinaryUrl } from '../utils/imageHelpers';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};
const itemVariants = {
  hidden:   { opacity: 0, y: 32 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const wordVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero({ siteDataOverride }) {
  const d = siteDataOverride || siteData;
  const {
    coupleName,
    heroSubtitle,
    heroImageUrl,
    heroDate,
    loveLetterText,
    coupleEmoji,
    customTitles,
  } = d;

  const bgVideoUrl = d.polaroid?.bgVideoUrl || '';
  const isBgVideo  = bgVideoUrl && (
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(bgVideoUrl) ||
    /\/video\/upload\//i.test(bgVideoUrl)
  );

  const videoRef = useRef(null);
  const headingWords = (customTitles?.heroMainTitle || 'Our Love Story').split(' ');

  return (
    <motion.section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Layer 0: Section-level bg video / fallback ─────────────────── */}
      {isBgVideo ? (
        <video
          ref={videoRef}
          src={bgVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: 0, willChange: 'transform' }}
        />
      ) : bgVideoUrl ? (
        /* Static image fallback */
        <img
          src={optimizeCloudinaryUrl(bgVideoUrl, 1080)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: 0 }}
          loading="lazy"
        />
      ) : null}

      {/* ── Layer 1: Cinematic overlay (improves text readability) ──────── */}
      {bgVideoUrl && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: 'linear-gradient(to bottom, rgba(5,0,10,0.50) 0%, rgba(10,2,10,0.28) 50%, rgba(5,0,10,0.60) 100%)',
          }}
        />
      )}

      {/* ── Layer 2: Couple emoji badge ─────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="text-5xl mb-6 relative"
        style={{ zIndex: 10, willChange: 'transform' }}
      >
        {coupleEmoji}
      </motion.div>

      {/* ── Layer 2: Hero image – polaroid style ────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="relative mb-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
        style={{ zIndex: 10, willChange: 'transform' }}
        whileHover={{ rotate: 2, scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div
          className="polaroid bg-white p-3 pb-8"
          style={{ transform: 'rotate(-1.5deg)', maxWidth: '320px', borderRadius: '4px' }}
        >
          <img
            src={optimizeCloudinaryUrl(heroImageUrl, 600)}
            alt="Us"
            loading="lazy"
            decoding="async"
            fetchpriority="high"
            className="w-72 h-72 object-cover block"
          />
          <p
            className="serif text-center mt-3 text-sm text-gray-800 font-medium italic"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {coupleName}
          </p>
        </div>

        {/* Floating heart on polaroid */}
        <motion.div
          className="absolute -top-4 -right-4 text-3xl"
          animate={{ scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        >
          ❤️
        </motion.div>
      </motion.div>

      {/* ── Layer 2: Staggered Heading ───────────────────────────────────── */}
      <motion.h1
        variants={containerVariants}
        className="serif text-5xl md:text-7xl font-bold leading-tight flex flex-wrap justify-center gap-x-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
        style={{ zIndex: 10, position: 'relative', willChange: 'transform' }}
      >
        {headingWords.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            className="text-white"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>

      {/* ── Date badge ──────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="mt-6 flex items-center gap-2 text-white/90 text-sm font-medium tracking-widest uppercase drop-shadow-md"
        style={{ zIndex: 10, position: 'relative', willChange: 'transform' }}
      >
        <CalendarHeart size={16} />
        <span>{heroDate}</span>
      </motion.div>

      {/* ── Subtitle ────────────────────────────────────────────────────── */}
      <motion.p
        variants={itemVariants}
        className="mt-5 max-w-md text-white/80 text-lg font-light leading-relaxed drop-shadow"
        style={{ zIndex: 10, position: 'relative', willChange: 'transform' }}
      >
        {customTitles?.heroSubtitle || heroSubtitle}
      </motion.p>

      {/* ── Love letter card – Glassmorphic ─────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="mt-12 max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl px-8 py-7 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        style={{ zIndex: 10, position: 'relative', willChange: 'transform' }}
      >
        <Heart size={22} fill="white" color="white" className="mx-auto mb-4 opacity-80" />
        <p className="serif italic text-white/90 leading-relaxed text-base md:text-lg drop-shadow-sm">
          "{loveLetterText}"
        </p>
        <p className="serif mt-4 text-white/80 font-medium tracking-wide drop-shadow-sm">— with all my love ❤️</p>
      </motion.div>

      {/* ── Scroll cue ──────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="mt-16 flex flex-col items-center gap-1 text-white/70 drop-shadow-sm"
        style={{ zIndex: 10, position: 'relative' }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs tracking-widest uppercase font-semibold">Scroll to explore</span>
        <span className="text-xl">↓</span>
      </motion.div>
    </motion.section>
  );
}
