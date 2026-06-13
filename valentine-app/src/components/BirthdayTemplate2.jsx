import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BirthdayLandingPage from './BirthdayLandingPage';
import MidnightCountdown from './MidnightCountdown';
import { getContrastYIQ } from '../utils/colorHelpers';

export default function BirthdayTemplate2({ siteData, onUnlock }) {
  const [taps, setTaps] = useState(0);
  const [popped, setPopped] = useState(false);
  
  const b = siteData?.birthday || {};
  const primary = siteData?.themeColors?.bday2?.primary || '#3b82f6';
  const balloonColor = b.balloonColor || primary;
  const bg = siteData?.themeColors?.bday2?.background || '#eff6ff';
  const onPrimary = getContrastYIQ(primary);

  const MAX_TAPS = 7;

  const handleTap = () => {
    if (popped) return;
    const next = taps + 1;
    setTaps(next);
    if (next >= MAX_TAPS) {
      setPopped(true);
      if (onUnlock) setTimeout(onUnlock, 500);
    }
  };

  return (
    <MidnightCountdown unlockTime={siteData?.unlockTime}>
      <AnimatePresence mode="wait">
        {!popped ? (
          <motion.div
            key="lockscreen"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden"
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-20 text-center px-4 w-full">
              <h1 className="text-3xl font-black mb-2 text-slate-800">{siteData?.customTitles?.gameSectionTitle || "Keep tapping to inflate!"}</h1>
              <p className="text-slate-500 font-bold">Taps: {taps} / {MAX_TAPS}</p>
            </div>

            <motion.div 
              className="cursor-pointer relative flex flex-col items-center"
              onClick={handleTap}
              animate={{ scale: 1 + (taps * 0.15) }}
              whileTap={{ scale: 1 + (taps * 0.15) - 0.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <svg width="200" height="240" viewBox="0 0 200 240" className="drop-shadow-2xl">
                <path d="M100 10 C40 10 20 60 20 110 C20 170 70 210 95 230 C98 232 102 232 105 230 C130 210 180 170 180 110 C180 60 160 10 100 10 Z" fill={balloonColor} />
                <path d="M40 70 Q60 30 100 25" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
              </svg>
              <svg width="20" height="150" className="absolute top-[235px]">
                <path d="M10 0 Q20 30 0 60 T10 120 T5 150" fill="none" stroke="#94a3b8" strokeWidth="2" />
              </svg>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <BirthdayLandingPage siteData={siteData} themeColors={siteData?.themeColors?.bday2} />
          </motion.div>
        )}
      </AnimatePresence>
    </MidnightCountdown>
  );
}
