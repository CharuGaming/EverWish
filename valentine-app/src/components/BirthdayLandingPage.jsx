import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import BirthdayMessage  from './BirthdayMessage';
import LifeStats        from './LifeStats';
import BirthdayGallery  from './BirthdayGallery';
import BirthdayGift     from './BirthdayGift';
import VoiceMessage     from './VoiceMessage';
import YearInReview     from './YearInReview';
import ScratchCoupon    from './ScratchCoupon';

// Scroll-triggered fade-in-up wrapper
function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function BirthdayLandingPage({ siteData, themeColors }) {
  const b       = siteData?.birthday || {};
  const primary = themeColors?.primary    || '#f59e0b';

  // Normalise gallery: accept either the old {supporting:[]} shape or a flat array
  const rawGallery = siteData?.birthdayGallery || siteData?.gallery?.supporting || [];
  const galleryImages = Array.isArray(rawGallery) ? rawGallery : [];

  // Virtual gift
  const gift = siteData?.virtualGift || null;

  // Life stats birth date
  const birthDate = b.birthDate || siteData?.birthDate || null;

  const defaultOrder = ['hero', 'message', 'lifeStats', 'gallery', 'voiceNote', 'yearInReview', 'gift', 'scratchPrize'];
  const order = (siteData?.sectionOrder && siteData.sectionOrder.length > 0) ? siteData.sectionOrder : defaultOrder;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen overflow-hidden"
    >
      {order.map((section) => {
        switch (section) {
          case 'hero': {
            const bgUrl = siteData?.heroBackgroundMediaUrl || '';
            const isVideo = bgUrl && /\.(mp4|webm|ogg|mov)$/i.test(bgUrl.split('?')[0]);
            const hasBg = !!bgUrl;

            return (
              <section
                key="hero"
                className="relative flex flex-col items-center justify-center min-h-[88vh] px-6 text-center overflow-hidden"
              >
                {/* ── Layer 0: Background media (video or image) ── */}
                {hasBg && isVideo && (
                  <video
                    src={bgUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{ pointerEvents: 'none' }}
                  />
                )}
                {hasBg && !isVideo && (
                  <img
                    src={bgUrl}
                    alt="Hero background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{ pointerEvents: 'none' }}
                    loading="eager"
                  />
                )}
                {!hasBg && (
                  /* Subtle radial glow when no bg media */
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none z-0"
                    style={{ background: primary }}
                  />
                )}

                {/* ── Layer 1: Cinematic overlay (always rendered over media) ── */}
                {hasBg && (
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.6) 100%)',
                    }}
                  />
                )}

                {/* ── Layer 2: Content ── */}
                <div className="relative z-20 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
                    className="text-7xl mb-6 inline-block drop-shadow-2xl"
                  >
                    🥳
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-5"
                    style={{
                      color: hasBg ? '#ffffff' : primary,
                      textShadow: hasBg ? '0 2px 20px rgba(0,0,0,0.7), 0 0 60px rgba(0,0,0,0.4)' : 'none',
                    }}
                  >
                    Happy Birthday
                    <br />
                    <span
                      style={{
                        color: hasBg ? primary : undefined,
                        textShadow: hasBg ? `0 0 40px ${primary}aa, 0 2px 20px rgba(0,0,0,0.8)` : 'none',
                      }}
                    >
                      {siteData?.coupleName || 'You'}!
                    </span>
                  </motion.h1>

                  {b.recipientAge && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55, type: 'spring', stiffness: 200 }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-white text-lg mb-6 shadow-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${primary}, ${primary}bb)`,
                        boxShadow: `0 8px 30px ${primary}60, 0 0 0 1px ${primary}40`,
                      }}
                    >
                      🎂 {b.recipientAge} Years Young!
                    </motion.div>
                  )}

                  {/* SVG Cake */}
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.9 }}
                    className="flex justify-center mt-8"
                  >
                    <svg width="180" height="190" viewBox="0 0 200 200"
                      className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                      <ellipse cx="100" cy="182" rx="88" ry="13" fill="#e2e8f0" opacity="0.6" />
                      <path d="M28 170 Q100 190 172 170 L172 112 Q100 132 28 112 Z" fill={primary} opacity="0.9" />
                      <ellipse cx="100" cy="112" rx="72" ry="14" fill={primary} />
                      <path d="M30 112 Q42 130 55 112 Q68 126 80 112 Q92 134 104 112 Q116 128 128 112 Q140 130 152 112 Q164 126 172 112" fill="#fff" opacity="0.8" />
                      <path d="M50 112 Q100 130 150 112 L150 72 Q100 90 50 72 Z" fill={primary} />
                      <ellipse cx="100" cy="72" rx="50" ry="10" fill="#fff" opacity="0.85" />
                      <path d="M52 72 Q62 90 72 72 Q82 85 92 72 Q102 88 112 72 Q122 86 132 72 Q142 90 148 72" fill="#fff" opacity="0.8" />
                      {Array.from({ length: Math.min(b.recipientAge || 3, 5) }).map((_, i, arr) => {
                        const cx = 100 + (i - (arr.length - 1) / 2) * 16;
                        return (
                          <g key={i}>
                            <rect x={cx - 3} y="42" width="6" height="30" fill="#cbd5e1" rx="2" />
                            <motion.circle
                              cx={cx} cy="34" r="6" fill="#fca5a5"
                              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                              transition={{ repeat: Infinity, duration: 0.5 + (i * 0.07) }}
                            />
                            <motion.path
                              d={`M${cx} 34 Q${cx + 5} 26 ${cx} 16 Q${cx - 5} 26 ${cx} 34`}
                              fill="#fef08a"
                              animate={{ scaleY: [1, 1.35, 1] }}
                              transition={{ repeat: Infinity, duration: 0.2 + (i * 0.04) }}
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </motion.div>

                  {/* Scroll hint when bg media is present */}
                  {hasBg && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.6 }}
                      className="mt-10 flex flex-col items-center gap-1"
                    >
                      <span className="text-white/50 text-xs font-bold uppercase tracking-[0.3em]">Scroll to explore</span>
                      <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                        className="w-px h-8 rounded-full"
                        style={{ background: `linear-gradient(to bottom, ${primary}cc, transparent)` }}
                      />
                    </motion.div>
                  )}
                </div>
              </section>
            );
          }
          case 'message':
            return b.birthdayMessage ? (
              <FadeUp key="message" delay={0}>
                <BirthdayMessage message={b.birthdayMessage} primary={primary} />
              </FadeUp>
            ) : null;
          case 'lifeStats':
            return birthDate ? (
              <FadeUp key="lifeStats" delay={0.05}>
                <LifeStats birthDate={birthDate} primary={primary} />
              </FadeUp>
            ) : null;
          case 'gallery':
            return galleryImages.length > 0 ? (
              <FadeUp key="gallery" delay={0.05}>
                <BirthdayGallery images={galleryImages} primary={primary} />
              </FadeUp>
            ) : null;
          case 'voiceNote':
            return siteData?.voiceNoteUrl ? (
              <FadeUp key="voiceNote" delay={0.05}>
                <VoiceMessage audioUrl={siteData.voiceNoteUrl} primary={primary} />
              </FadeUp>
            ) : null;
          case 'yearInReview':
            return siteData?.yearInReview?.length > 0 ? (
              <FadeUp key="yearInReview" delay={0.05}>
                <YearInReview stats={siteData.yearInReview} primary={primary} />
              </FadeUp>
            ) : null;
          case 'gift':
            return gift && (gift.imageUrl || gift.message) ? (
              <FadeUp key="gift" delay={0.05}>
                <BirthdayGift gift={gift} primary={primary} />
              </FadeUp>
            ) : null;
          case 'scratchPrize':
            return siteData?.scratchPrize ? (
              <FadeUp key="scratchPrize" delay={0.05}>
                <ScratchCoupon prize={siteData.scratchPrize} primary={primary} />
              </FadeUp>
            ) : null;
          default:
            return null;
        }
      })}

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer
        className="text-center py-10 text-xs font-bold uppercase tracking-[0.3em] mt-6 opacity-40"
        style={{ color: primary }}
      >
        Made with 💕 by EverWish
      </footer>
    </motion.div>
  );
}
