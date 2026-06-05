import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BirthdayLandingPage from './BirthdayLandingPage';
import MidnightCountdown from './MidnightCountdown';
import { getContrastYIQ } from '../utils/colorHelpers';

export default function BirthdayTemplate3({ siteData, onUnlock }) {
  const [isOpen, setIsOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  
  const primary = siteData?.themeColors?.bday3?.primary || '#10b981';
  const bg = siteData?.themeColors?.bday3?.background || '#ecfdf5';
  const onPrimary = getContrastYIQ(primary);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => {
      setTransitioning(true);
      if (onUnlock) onUnlock();
    }, 2000); // Wait for user to read card inside
  };

  return (
    <MidnightCountdown unlockTime={siteData?.unlockTime}>
      <AnimatePresence mode="wait">
        {!transitioning ? (
          <motion.div
            key="lockscreen"
            className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
            onClick={handleOpen}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ perspective: 1500 }} className="w-72 h-96 relative">
              <motion.div 
                className="w-full h-full absolute transform-style-3d origin-left shadow-2xl rounded-xl z-20"
                animate={{ rotateY: isOpen ? -160 : 0 }}
                transition={{ duration: 1.2, type: 'spring', bounce: 0.2 }}
                style={{ backgroundColor: primary }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center backface-hidden" style={{ color: onPrimary }}>
                  <span className="text-6xl mb-4">🎂</span>
                  <h2 className="text-2xl font-bold font-serif text-center px-4">Open Me!</h2>
                </div>
                <div className="absolute inset-0 bg-white transform rotate-y-180 backface-hidden flex items-center justify-center p-6 border-2 border-slate-100 rounded-xl">
                </div>
              </motion.div>
              <div className="w-full h-full absolute top-0 left-0 bg-white shadow-xl rounded-xl z-10 flex flex-col items-center justify-center p-8 border border-slate-100 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-4" style={{ fontFamily: 'Dancing Script, cursive' }}>Happy Birthday!</h3>
                <p className="text-sm text-slate-500 font-serif leading-relaxed">
                  Wishing you a day filled with joy and wonderful surprises.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <BirthdayLandingPage siteData={siteData} themeColors={siteData?.themeColors?.bday3} />
          </motion.div>
        )}
      </AnimatePresence>
    </MidnightCountdown>
  );
}
