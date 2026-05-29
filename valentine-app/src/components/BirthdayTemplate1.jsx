import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BirthdayLandingPage from './BirthdayLandingPage';
import MidnightCountdown from './MidnightCountdown';

export default function BirthdayTemplate1({ siteData, onUnlock }) {
  const [unlocked, setUnlocked] = useState(false);
  const primary = siteData?.themeColors?.bday1?.primary || '#f59e0b';
  const bg = siteData?.themeColors?.bday1?.background || '#fffbeb';

  const handleOpen = () => {
    setUnlocked(true);
    if (onUnlock) setTimeout(onUnlock, 1500); // trigger any global burst/music
  };

  return (
    <MidnightCountdown unlockTime={siteData?.unlockTime}>
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="lockscreen"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
            onClick={handleOpen}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-black mb-2" style={{ color: primary }}>A Gift For You!</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Tap to unwrap 🎁</p>
            </div>
            
            <div className="relative w-64 h-64">
              <motion.div className="absolute bottom-0 w-full h-48 rounded-lg shadow-2xl" style={{ backgroundColor: primary }} exit={{ y: 200, opacity: 0 }} transition={{ duration: 0.6 }} />
              <motion.div className="absolute bottom-0 left-1/2 -ml-4 w-8 h-48 bg-white/40 backdrop-blur-sm shadow-inner" exit={{ y: 200, opacity: 0 }} transition={{ duration: 0.6 }} />
              <motion.div className="absolute bottom-40 left-[-10px] right-[-10px] h-16 rounded-md shadow-xl z-10" style={{ backgroundColor: primary, filter: 'brightness(1.1)' }} exit={{ y: -200, rotate: -15, opacity: 0 }} transition={{ duration: 0.8 }} />
              <motion.div className="absolute bottom-40 left-[-10px] right-[-10px] h-16 flex items-center justify-center z-20" exit={{ y: -200, rotate: -15, opacity: 0 }} transition={{ duration: 0.8 }}>
                <div className="w-full h-8 bg-white/50 backdrop-blur-sm shadow-inner" />
              </motion.div>
              <motion.div className="absolute bottom-52 left-1/2 -ml-8 w-16 h-12 flex justify-between z-30" exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.4 }}>
                <div className="w-8 h-12 bg-white/70 rounded-l-full" />
                <div className="w-8 h-12 bg-white/70 rounded-r-full" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <BirthdayLandingPage siteData={siteData} themeColors={siteData?.themeColors?.bday1} />
          </motion.div>
        )}
      </AnimatePresence>
    </MidnightCountdown>
  );
}
