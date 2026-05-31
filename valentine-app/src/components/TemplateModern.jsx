import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Gift } from 'lucide-react';
import ThingsToDoSection from './ThingsToDoSection';
import LoveLock   from './LoveLock';
import ReasonsJar from './ReasonsJar';
import Heartbeat  from './Heartbeat';
import TimeCapsule from './TimeCapsule';

// ── Custom floating hearts for lockscreen tap ───────────────────────
function FloatingHeart({ x, y, id, onComplete }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 1, scale: 0.5, x: x - 12, y: y - 12 }}
      animate={{ opacity: 0, scale: 1.5, y: y - 120, x: x - 12 + (Math.random() - 0.5) * 50 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className="absolute text-rose-500 pointer-events-none text-2xl z-50"
    >
      ❤️
    </motion.div>
  );
}

// ── Entry Lock Screen (Love Meter Gauge) ───────────────────────────
export function ModernLockScreen({ onUnlock, onUnlockImmediate, lockProps, themeColors }) {
  const [clicks, setClicks] = useState(0);
  const [hearts, setHearts] = useState([]);
  const maxClicks = 10;

  const handleClick = (e) => {
    if (clicks >= maxClicks) return;
    
    const nextClicks = clicks + 1;
    setClicks(nextClicks);

    // Spawn floating heart at tap coordinate
    const id = `${Date.now()}-${Math.random()}`;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHearts(prev => [...prev, { id, x, y }]);

    if (nextClicks === 1) {
      onUnlockImmediate(); // Start audio context on first user gesture
    }

    if (nextClicks >= maxClicks) {
      setTimeout(() => {
        onUnlock();
      }, 500);
    }
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = clicks / maxClicks;
  const strokeDashoffset = circumference - progress * circumference;

  const primaryColor = themeColors?.modern?.primary || '#e11d48';
  const backgroundColor = themeColors?.modern?.background || '#f7f5f0';

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden select-none cursor-pointer p-6"
      style={{ background: backgroundColor }}
      onClick={handleClick}
    >
      <style>{`
        .lock-primary-text { color: ${primaryColor} !important; }
        .lock-primary-stroke { stroke: ${primaryColor} !important; }
        .lock-heart-icon { fill: ${clicks > 0 ? primaryColor : 'transparent'} !important; stroke: ${clicks > 0 ? primaryColor : '#cbd5e1'} !important; }
      `}</style>
      <AnimatePresence>
        {hearts.map(h => (
          <FloatingHeart 
            key={h.id} 
            x={h.x} 
            y={h.y} 
            id={h.id} 
            onComplete={() => setHearts(prev => prev.filter(item => item.id !== h.id))} 
          />
        ))}
      </AnimatePresence>

      <div className="text-center z-10 max-w-sm pointer-events-none">
        <h1 className="text-2xl font-serif text-slate-800 mb-2">Surprise Waiting...</h1>
        <p className="lock-primary-text text-xs uppercase tracking-widest font-semibold mb-8 animate-pulse">
          {lockProps?.lockScreenPrompt || 'Tap repeatedly to fill the meter'}
        </p>

        {/* SVG Gauge */}
        <div className="relative w-44 h-44 mx-auto mb-8 flex items-center justify-center">
          <svg className="w-full h-full rotate-[-90deg]">
            {/* Background Circle */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="6"
            />
            {/* Foreground Progress Circle */}
            <motion.circle
              cx="88"
              cy="88"
              r={radius}
              fill="transparent"
              stroke={primaryColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ tension: 150, friction: 20 }}
              strokeLinecap="round"
            />
          </svg>

          {/* Centered Heart Icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1 + progress * 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 - progress * 0.8 }}
            >
              <Heart 
                size={40} 
                className="lock-heart-icon text-slate-300" 
              />
            </motion.div>
            <span className="lock-primary-text text-[10px] font-bold tracking-wider mt-1.5 font-mono">
              {Math.min(clicks * 10, 100)}%
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          Tap anywhere inside the window to charge the love meter
        </p>
      </div>
    </div>
  );
}

// ── Main Page Layout (Modern Template) ─────────────────────────────
export default function TemplateModern({ siteData }) {
  const [giftOpen, setGiftOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  const allImages = [
    ...(siteData.gallery?.centerImage ? [{ url: siteData.gallery.centerImage, caption: siteData.gallery.centerCaption }] : []),
    ...(siteData.gallery?.supporting || []).map(s => ({ url: s.url, caption: s.caption }))
  ];

  const colors = siteData?.themeColors?.modern || {};
  const primaryColor = colors.primary || '#e11d48';
  const backgroundColor = colors.background || '#f7f5f0';

  return (
    <div className="min-h-screen text-slate-800 font-sans pb-20 template-modern-root" style={{ backgroundColor }}>
      <style>{`
        .template-modern-root {
          --primary-modern: ${primaryColor};
          --bg-modern: ${backgroundColor};
        }
        .template-modern-root .text-rose-500,
        .template-modern-root .text-rose-600,
        .template-modern-root .text-rose-700,
        .template-modern-root .text-rose-800,
        .template-modern-root .text-pink-500,
        .template-modern-root .text-pink-600 {
          color: var(--primary-modern) !important;
        }
        .template-modern-root .bg-rose-500,
        .template-modern-root .bg-rose-600,
        .template-modern-root .bg-rose-400,
        .template-modern-root .bg-pink-500,
        .template-modern-root .bg-rose-50,
        .template-modern-root .bg-rose-100/50,
        .template-modern-root .bg-rose-50/50 {
          background-color: var(--primary-modern) !important;
        }
        
        .template-modern-root .bg-rose-500 .text-white,
        .template-modern-root .bg-rose-600 .text-white,
        .template-modern-root button.bg-rose-600,
        .template-modern-root button.bg-rose-500,
        .template-modern-root .bg-rose-600 *,
        .template-modern-root .bg-rose-500 * {
          color: #ffffff !important;
        }

        .template-modern-root .bg-amber-400 {
          background-color: #fbbf24 !important; /* Keep ribbon gold */
        }
        
        .template-modern-root .border-rose-200,
        .template-modern-root .border-rose-300,
        .template-modern-root .border-rose-100,
        .template-modern-root .border-pink-300 {
          border-color: var(--primary-modern) !important;
        }
      `}</style>
      
      {/* SECTION 2: Memories Layout (Hero) */}
      <section className="max-w-2xl mx-auto pt-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="text-rose-500 text-5xl md:text-8xl font-serif italic block mb-6 animate-pulse">
            Happy Valentine's Day {siteData.coupleEmoji || '🥰'}
          </span>
          <h1 className="text-xl md:text-2xl font-semibold tracking-[0.25em] text-slate-500 uppercase font-sans">
            {siteData.coupleName || 'Our Story'}
          </h1>
          <div className="w-20 h-0.5 bg-rose-200 mx-auto mt-6" />
        </motion.div>

        {/* Primary Memory Image */}
        {siteData.heroImageUrl ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full max-w-lg mx-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-white p-2.5 mb-8"
          >
            <img 
              src={siteData.heroImageUrl} 
              alt="Our memory" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </motion.div>
        ) : (
          <div className="w-full max-w-lg mx-auto aspect-[4/5] rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300 border border-slate-200 mb-8 p-6 text-xs uppercase tracking-widest font-semibold">
            Primary Memory Image
          </div>
        )}

        {/* Romantic Quote */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-lg font-serif italic text-slate-700 leading-relaxed max-w-md mx-auto mb-8 px-4"
        >
          "{siteData.heroSubtitle || 'Love is not about how many days, months, or years you have been together. It is all about how much you love each other every single day.'}"
        </motion.p>

        {/* Timeline Dates */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center justify-center gap-6 mb-16 text-amber-800"
        >
          <div className="text-sm font-semibold tracking-widest font-mono uppercase bg-amber-50/50 border border-amber-900/10 px-4 py-2 rounded-xl">
            {siteData.timelineDates?.startDate || '2020'}
          </div>
          
          {/* Handdrawn style SVG Curved Arrow */}
          <svg width="60" height="24" viewBox="0 0 60 24" fill="none" className="opacity-60">
            <path d="M5 19C15 5 45 5 55 19" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M50 17L55 19L53 14" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          <div className="text-sm font-semibold tracking-widest font-mono uppercase bg-amber-50/50 border border-amber-900/10 px-4 py-2 rounded-xl">
            {siteData.timelineDates?.endDate || '2026'}
          </div>
        </motion.div>
      </section>

      {/* Love Message Section */}
      {siteData.loveLetterText && (
        <section className="max-w-xl mx-auto px-6 mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden"
          >
            {/* Soft decorative background patterns */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-rose-50 rounded-br-full -z-10 opacity-60" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-50 rounded-tl-full -z-10 opacity-60" />
            
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-500 font-mono mb-4 block">
              A Message For You
            </span>
            <p className="text-base md:text-lg font-serif text-slate-700 leading-relaxed whitespace-pre-line italic">
              {siteData.loveLetterText}
            </p>
          </motion.div>
        </section>
      )}

      {/* SECTION 3: Virtual Gift Box — Explosion Reveal */}
      {(() => {
        // Generate explosion data once via closure
        const explosionParticles = Array.from({ length: 36 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 36 + (Math.random() - 0.5) * 0.5;
          const dist = 90 + Math.random() * 160;
          return {
            id: i,
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist - 50,
            rotation: Math.random() * 720 - 360,
            delay: Math.random() * 0.15,
            duration: 0.8 + Math.random() * 0.5,
            emoji: ["❤️","🌸","✨","💖","🎀","💕","🌹","⭐"][Math.floor(Math.random() * 8)],
            size: Math.random() * 14 + 6,
          };
        });
        const boxFragments = Array.from({ length: 12 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 12;
          const dist = 50 + Math.random() * 110;
          return {
            id: i,
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist - 30,
            rotation: Math.random() * 540 - 270,
            delay: Math.random() * 0.08,
            width: 12 + Math.random() * 20,
            height: 10 + Math.random() * 16,
            color: ["#e11d48","#f43f5e","#fb7185","#fda4af","#fbbf24","#f59e0b"][Math.floor(Math.random() * 6)],
          };
        });

        return (
          <section className="max-w-2xl mx-auto px-6 text-center mb-20 relative min-h-[420px] flex flex-col items-center justify-center">
            {/* Explosion Particles */}
            <AnimatePresence>
              {giftOpen && explosionParticles.map(p => (
                <motion.div
                  key={`ep-${p.id}`}
                  className="absolute pointer-events-none z-40"
                  style={{ fontSize: p.size }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: p.x, y: p.y,
                    scale: [0.3, 1.3, 1, 0],
                    rotate: p.rotation,
                  }}
                  transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
                >{p.emoji}</motion.div>
              ))}
            </AnimatePresence>

            {/* Box Fragments */}
            <AnimatePresence>
              {giftOpen && boxFragments.map(f => (
                <motion.div
                  key={`bf-${f.id}`}
                  className="absolute z-30 rounded-sm pointer-events-none"
                  style={{ width: f.width, height: f.height, backgroundColor: f.color }}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    x: f.x, y: f.y,
                    scale: [1, 0.8, 0.3],
                    rotate: f.rotation,
                  }}
                  transition={{ duration: 0.7, delay: f.delay, ease: "easeOut" }}
                />
              ))}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!giftOpen ? (
                <motion.div
                  key="closed-box"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{
                    scale: [1, 1.15, 0],
                    opacity: [1, 1, 0],
                    transition: { duration: 0.4, ease: "easeIn" },
                  }}
                  onClick={() => setGiftOpen(true)}
                  className="relative w-56 h-56 flex flex-col items-center justify-center cursor-pointer select-none"
                >
                  {/* Shaking motion on hover */}
                  <motion.div
                    whileHover={{ 
                      rotate: [0, -3, 3, -3, 3, 0],
                      transition: { duration: 0.5, repeat: Infinity }
                    }}
                    whileTap={{ scale: 0.92 }}
                    className="relative w-40 h-40"
                  >
                    {/* Lid */}
                    <motion.div 
                      className="absolute -top-7 -left-2.5 w-[170px] h-10 bg-rose-600 rounded-t-xl z-20 shadow-md flex items-center justify-center"
                      style={{ transformOrigin: 'bottom center' }}
                      whileHover={{ y: -8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                    >
                      {/* Lid Ribbon Horizontal */}
                      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-7 bg-amber-400" />
                    </motion.div>

                    {/* Bow on Top of Lid */}
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                      <svg width="70" height="36" viewBox="0 0 70 36" fill="none" className="filter drop-shadow-sm">
                        <path d="M35 24 C12 0, 5 36, 35 24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                        <path d="M35 24 C58 0, 65 36, 35 24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                        <circle cx="35" cy="24" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* Box Body */}
                    <div className="w-40 h-32 bg-rose-500 rounded-b-2xl relative z-10 shadow-lg overflow-hidden border border-rose-400">
                      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-7 bg-amber-400 shadow-inner" />
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-7 bg-amber-400 shadow-inner" />
                    </div>
                  </motion.div>

                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mt-8 text-xs font-semibold text-rose-500 tracking-widest uppercase"
                  >
                    Tap to open your gift ✨
                  </motion.span>
                </motion.div>
              ) : (
                <motion.div
                  key="opened-gift"
                  initial={{ scale: 0, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 16, stiffness: 120, delay: 0.6 }}
                  className="bg-white border border-slate-200 w-full max-w-md rounded-3xl overflow-hidden shadow-md relative p-6 text-center"
                >
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 mt-2">
                    Special Gift Box 💐
                  </h3>

                  {siteData.gift?.bouquetUrl ? (
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.8 }}
                      className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-50 border border-slate-100 flex items-center justify-center p-2"
                    >
                      <img 
                        src={siteData.gift.bouquetUrl} 
                        alt="Gift bouquet" 
                        className="max-w-full max-h-full object-contain rounded-xl"
                      />
                    </motion.div>
                  ) : (
                    <div className="w-full aspect-[4/3] rounded-2xl bg-rose-50 border-2 border-dashed border-rose-200 flex items-center justify-center text-rose-300 text-3xl mb-6">
                      💐
                    </div>
                  )}

                  <h4 className="text-lg font-serif italic text-slate-800 mb-3 px-2">
                    For {siteData.gift?.recipient || 'My Love'}
                  </h4>
                  
                  <p className="text-sm text-slate-600 leading-relaxed px-4 whitespace-pre-wrap">
                    {siteData.gift?.message || 'You deserve all the flowers in the world.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        );
      })()}

      {/* SECTION 4: Lightbox Gallery */}
      <section className="max-w-4xl mx-auto px-6">
        <h2 className="text-center font-serif text-2xl text-slate-800 mb-10">Our Memory Grid</h2>
        
        {allImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {allImages.map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedImg(img)}
                className="aspect-square bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-1.5 cursor-pointer hover:shadow-md transition-all duration-200"
              >
                <img 
                  src={img.url} 
                  alt={img.caption || "Gallery picture"} 
                  className="w-full h-full object-cover rounded-xl"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
            <p className="text-sm">No gallery photos added yet.</p>
          </div>
        )}

        {/* Gallery Lightbox */}
        <AnimatePresence>
          {selectedImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImg(null)}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-6"
            >
              <button
                onClick={() => setSelectedImg(null)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition z-50"
              >
                <X size={20} />
              </button>

              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative max-w-4xl max-h-[80vh] flex items-center justify-center"
                onClick={e => e.stopPropagation()}
              >
                <img
                  src={selectedImg.url}
                  alt={selectedImg.caption || "Zoomed view"}
                  className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                />
              </motion.div>

              {selectedImg.caption && (
                <p className="text-white/80 font-serif italic text-center mt-4 max-w-md px-6">
                  {selectedImg.caption}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <ThingsToDoSection items={siteData.thingsToDo} themeColors={siteData.themeColors?.modern} />

      {/* ── Valentine Exclusive Features ────────────────────── */}
      <LoveLock
        initials={siteData.loveLock?.initials}
        isEnabled={siteData.loveLock?.isEnabled}
      />

      <ReasonsJar reasons={siteData.reasonsJar} />

      <Heartbeat />

      <TimeCapsule
        unlockDate={siteData.timeCapsule?.unlockDate}
        message={siteData.timeCapsule?.message}
        mediaUrl={siteData.timeCapsule?.mediaUrl}
      />

      {/* Footer */}
      <footer className="text-center mt-20 pt-8 border-t border-slate-200/40">
        <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-mono">
          © {new Date().getFullYear()} · Made By EverWish
        </span>
      </footer>

    </div>
  );
}
