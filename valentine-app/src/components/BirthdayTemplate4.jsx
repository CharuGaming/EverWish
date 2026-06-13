import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BirthdayLandingPage from './BirthdayLandingPage';
import confetti from 'canvas-confetti';
import MidnightCountdown from './MidnightCountdown';
import { getContrastYIQ } from '../utils/colorHelpers';

export default function BirthdayTemplate4({ siteData, onUnlock }) {
  const [lightsOn, setLightsOn] = useState(false);
  const primary = siteData?.themeColors?.bday4?.primary || '#8b5cf6';
  const onPrimary = getContrastYIQ(primary);

  const handleSwitch = () => {
    setLightsOn(true);
    
    // Trigger massive confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    if (onUnlock) setTimeout(onUnlock, 500);
  };

  return (
    <MidnightCountdown unlockTime={siteData?.unlockTime}>
      <AnimatePresence mode="wait">
        {!lightsOn ? (
          <motion.div
            key="lockscreen"
            className="fixed inset-0 z-50 bg-neutral-950 flex flex-col items-center justify-center cursor-pointer"
            onClick={handleSwitch}
            exit={{ opacity: 0, backgroundColor: '#ffffff' }}
            transition={{ duration: 0.4 }}
          >
            <motion.div 
              className="w-16 h-32 bg-neutral-800 rounded-lg shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] border border-neutral-700 flex flex-col p-2"
            >
              <div className="flex-1 bg-neutral-700 rounded-md shadow-sm border-b-2 border-neutral-600 transition-transform hover:translate-y-1" />
              <div className="flex-1" />
            </motion.div>
            <p className="text-neutral-600 font-bold mt-8 uppercase tracking-[0.3em] text-sm">{siteData?.customTitles?.gameSectionTitle || "Turn on the lights"}</p>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>
            <BirthdayLandingPage siteData={siteData} themeColors={siteData?.themeColors?.bday4} />
          </motion.div>
        )}
      </AnimatePresence>
    </MidnightCountdown>
  );
}
