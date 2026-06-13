import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getSite, toComponentData } from '../api';

// Existing components (now accept siteDataOverride / gift props)
import LockScreen    from '../components/LockScreen';
import Hero          from '../components/Hero';
import LoveMap       from '../components/LoveMap';
import Gallery       from '../components/Gallery';
import GiftBox       from '../components/GiftBox';
import Footer        from '../components/Footer';
import FloatingDecor from '../components/FloatingDecor';
import CursorTrail   from '../components/CursorTrail';
import GlobalMusicPlayer from '../components/GlobalMusicPlayer';
import TemplateModern, { ModernLockScreen } from '../components/TemplateModern';
import TemplateValentine from '../components/TemplateValentine';
import TemplateProposal  from '../components/TemplateProposal';
import TemplateCustom   from '../components/TemplateCustom';
import BirthdayTemplate1 from '../components/BirthdayTemplate1';
import BirthdayTemplate2 from '../components/BirthdayTemplate2';
import BirthdayTemplate3 from '../components/BirthdayTemplate3';
import BirthdayTemplate4 from '../components/BirthdayTemplate4';
import ThingsToDoSection from '../components/ThingsToDoSection';
import HeartBurst        from '../components/HeartBurst';
import FloatingBalloons  from '../components/FloatingBalloons';
import CinematicAnniversary from '../components/CinematicAnniversary';
import CinematicBirthday   from '../components/CinematicBirthday';

// ── Romantic loading spinner ──────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: 'linear-gradient(160deg,#fff0f5 0%,#fce7f3 60%,#fff0f5 100%)' }}>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="text-6xl"
      >
        💕
      </motion.div>
      <p className="text-rose-400 text-sm font-medium tracking-widest uppercase animate-pulse">
        Loading your surprise…
      </p>
    </div>
  );
}

// ── Not found screen ──────────────────────────────────────────────
function NotFoundScreen({ siteId }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6"
      style={{ background: 'linear-gradient(160deg,#fff0f5 0%,#fce7f3 60%,#fff0f5 100%)' }}>
      <div className="text-5xl mb-2">💔</div>
      <h1 className="text-2xl font-bold text-rose-700">Site not found</h1>
      <p className="text-rose-400 text-sm">No celebration page exists for <strong>"{siteId}"</strong>.</p>
      <p className="text-slate-400 text-xs mt-2">Ask the sender to check the link.</p>
    </div>
  );
}

// ── Expired screen ────────────────────────────────────────────────
function ExpiredScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'linear-gradient(160deg,#fafafa 0%,#f5f5f5 100%)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl shadow-neutral-200/50 border border-neutral-100"
      >
        <div className="text-5xl mb-6">🕊️</div>
        <h1 className="text-2xl font-serif font-bold text-neutral-800 mb-3">A Beautiful Memory</h1>
        <p className="text-neutral-500 text-sm leading-relaxed mb-6">
          This celebration page has expired after its 14-day lifetime. We hope you had a truly wonderful special day!
        </p>
        <div className="w-16 h-[1px] bg-neutral-200 mx-auto mb-6"></div>
        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
          © {new Date().getFullYear()} · EverWish
        </p>
      </motion.div>
    </div>
  );
}

// ── Main Client Page ──────────────────────────────────────────────
export default function ClientPage() {
  const { siteId } = useParams();

  const [loading, setLoading]     = useState(true);
  const [siteData, setSiteData]   = useState(null);
  const [notFound, setNotFound]   = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [playTrigger, setPlayTrigger] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    getSite(siteId).then(res => {
      if (res.success && res.data) {
        setSiteData(toComponentData(res.data));
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }).catch(() => {
      setNotFound(true);
      setLoading(false);
    });

  }, [siteId]);

  const triggerBurst = useCallback(() => {
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 2000);
  }, []);

  const handleUnlock = useCallback(() => {
    setIsUnlocked(true);
    triggerBurst();
  }, [triggerBurst]);
  
  const handleUnlockImmediate = useCallback(() => setPlayTrigger(true), []);

  if (loading)  return <LoadingScreen />;
  if (notFound) return <NotFoundScreen siteId={siteId} />;
  if (siteData && siteData.isActive === false) return <ExpiredScreen />;

  // Build custom lockscreen props from db data
  const lockProps = {
    lockScreenPrompt:  siteData.lockScreenPrompt,
    valentineMessage:  siteData.valentineMessage,
  };

  if (siteData.templateType === 'cinematic') {
    return (
      <div className="relative min-h-screen">
        <CinematicAnniversary siteData={siteData} />
      </div>
    );
  }

  if (siteData.templateType === 'bday5') {
    return (
      <div className="relative min-h-screen">
        <CinematicBirthday siteData={siteData} />
      </div>
    );
  }

  // Birthday templates
  if (siteData.category === 'birthday') {
    let TemplateComponent = BirthdayTemplate1;
    let themeColors = siteData?.themeColors?.bday1;
    if (siteData.templateType === 'bday2') {
      TemplateComponent = BirthdayTemplate2;
      themeColors = siteData?.themeColors?.bday2;
    }
    if (siteData.templateType === 'bday3') {
      TemplateComponent = BirthdayTemplate3;
      themeColors = siteData?.themeColors?.bday3;
    }
    if (siteData.templateType === 'bday4') {
      TemplateComponent = BirthdayTemplate4;
      themeColors = siteData?.themeColors?.bday4;
    }
    const bg = themeColors?.background || '#fffbeb';

    return (
      <div className="relative min-h-screen" style={{ backgroundColor: bg }}>
        <FloatingBalloons />
        <GlobalMusicPlayer musicData={siteData.music} />
        <TemplateComponent siteData={siteData} onUnlock={triggerBurst} />
      </div>
    );
  }

  // Valentine & Proposal templates manage their own lock screens
  if (siteData.templateType === 'valentine') {
    return (
      <div className="relative min-h-screen">
        <GlobalMusicPlayer musicData={siteData.music} />
        <HeartBurst show={showBurst} />
        <TemplateValentine siteData={siteData} onUnlock={triggerBurst} />
      </div>
    );
  }

  if (siteData.templateType === 'proposal') {
    return (
      <div className="relative min-h-screen">
        <GlobalMusicPlayer musicData={siteData.music} />
        <HeartBurst show={showBurst} />
        <TemplateProposal siteData={siteData} onUnlock={triggerBurst} />
      </div>
    );
  }

  if (siteData.templateType === 'custom') {
    return (
      <div className="relative min-h-screen">
        <GlobalMusicPlayer musicData={siteData.music} />
        <HeartBurst show={showBurst} />
        <TemplateCustom siteData={siteData} onUnlock={triggerBurst} />
      </div>
    );
  }

  const isPolaroid = !siteData.templateType || siteData.templateType === 'polaroid';
  const bgUrl = siteData?.heroBackgroundMediaUrl || '';
  // Detect video by extension OR Cloudinary /video/upload/ resource path
  const isBgVideo = bgUrl && (
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(bgUrl) ||
    /\/video\/upload\//i.test(bgUrl)
  );

  return (
    <div className="relative min-h-screen bg-[#050505]">
      {/* ── GLOBAL BACKGROUND VIDEO (FOR POLAROID ONLY) ── */}
      {isPolaroid && (
        <>
          {isBgVideo ? (
            <video
              src={bgUrl}
              autoPlay
              loop
              muted
              playsInline
              className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
            />
          ) : bgUrl ? (
            <img
              src={bgUrl}
              alt=""
              className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
            />
          ) : (
            <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-rose-950 to-black" />
          )}
          {/* Dark Cinematic Overlay */}
          <div className="fixed inset-0 z-[1] pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(15,2,20,0.6) 0%, rgba(60,5,30,0.4) 50%, rgba(15,2,20,0.65) 100%)' }} />
        </>
      )}

      <GlobalMusicPlayer musicData={siteData.music} />
      <HeartBurst show={showBurst} />
      <CursorTrail />

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          siteData.templateType === 'modern' ? (
            <ModernLockScreen
              key="modern-lock"
              onUnlock={handleUnlock}
              onUnlockImmediate={handleUnlockImmediate}
              lockProps={lockProps}
              themeColors={siteData.themeColors}
            />
          ) : (
            <LockScreen
              key="lock"
              onUnlock={handleUnlock}
              onUnlockImmediate={handleUnlockImmediate}
              lockScreenPrompt={lockProps.lockScreenPrompt}
              valentineMessage={lockProps.valentineMessage}
              themeColors={siteData.themeColors}
            />
          )
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative z-10"
          >
            {siteData.templateType === 'modern' ? (
              <TemplateModern siteData={siteData} />
            ) : siteData.templateType === 'valentine' ? (
              <TemplateValentine siteData={siteData} />
            ) : isPolaroid ? (
              <div className="template-polaroid-root text-white">
                <FloatingDecor />
                <Hero siteDataOverride={siteData} />
                <GiftBox
                  recipient={siteData.gift?.recipient}
                  message={siteData.gift?.message}
                  bouquetUrl={siteData.gift?.bouquetUrl}
                />
                <LoveMap siteDataOverride={siteData} />
                <Gallery siteDataOverride={siteData} />
                <ThingsToDoSection items={siteData.thingsToDo} themeColors={siteData.themeColors?.polaroid} />
                <Footer siteDataOverride={siteData} />
              </div>
            ) : (
              <div className="min-h-screen flex items-center justify-center">
                <h2 className="text-2xl text-rose-500 font-serif">Template Coming Soon...</h2>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
