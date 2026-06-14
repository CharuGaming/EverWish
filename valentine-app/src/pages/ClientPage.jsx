import { useState, useEffect, useCallback, lazy, Suspense, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getSite, toComponentData } from '../api';

// Existing components (now accept siteDataOverride / gift props)
import LockScreen    from '../components/LockScreen';
import PolaroidIntroScreen from '../components/PolaroidIntroScreen';
import Hero          from '../components/Hero';
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
import HeartBurst        from '../components/HeartBurst';
import FloatingBalloons  from '../components/FloatingBalloons';
import CinematicAnniversary from '../components/CinematicAnniversary';
import CinematicBirthday   from '../components/CinematicBirthday';
import { optimizeCloudinaryUrl } from '../utils/imageHelpers';

// Lazy load components that are below the fold to optimize memory & bundles
const LoveMap = lazy(() => import('../components/LoveMap'));
const Gallery = lazy(() => import('../components/Gallery'));
const GiftBox = lazy(() => import('../components/GiftBox'));
const Footer = lazy(() => import('../components/Footer'));
const ThingsToDoSection = lazy(() => import('../components/ThingsToDoSection'));

// Intersection Observer Wrapper to load components only when scrolled close to viewport
function LazySection({ children, height = '200px' }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { rootMargin: '200px' } // Pre-load 200px before scrolling in
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [inView]);

  return (
    <div ref={ref} style={{ minHeight: inView ? 'auto' : height }}>
      {inView ? (
        <Suspense fallback={<div className="h-24 flex items-center justify-center text-white/40 text-xs">Loading section…</div>}>
          {children}
        </Suspense>
      ) : null}
    </div>
  );
}

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

  // Apply dark body background for polaroid/cinematic templates
  useEffect(() => {
    if (!siteData) return;
    const isPol = !siteData.templateType || siteData.templateType === 'polaroid' || siteData.templateType === 'cinematic' || siteData.templateType === 'bday5';
    if (isPol) {
      document.body.classList.add('polaroid-page');
    } else {
      document.body.classList.remove('polaroid-page');
    }
    return () => document.body.classList.remove('polaroid-page');
  }, [siteData]);

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
  const introVideoUrl = siteData.templateType === 'modern'
    ? (siteData.modern?.introVideoUrl || siteData.polaroid?.introVideoUrl || '')
    : (siteData.polaroid?.introVideoUrl || siteData.modern?.introVideoUrl || '');

  if (siteData.templateType === 'modern') {
    console.log("Modern Template Video Data:", siteData.modern);
  }
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
          {/* Always-present dark background */}
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, background: 'linear-gradient(135deg, #0a0005 0%, #1a0010 50%, #0a0005 100%)' }} />
          {/* Video or image overlay when uploaded */}
          {bgUrl && (
            isBgVideo ? (
              <video
                src={optimizeCloudinaryUrl(bgUrl, 1080)}
                autoPlay
                loop
                muted
                playsInline
                className="fixed inset-0 w-full h-full object-cover pointer-events-none"
                style={{ zIndex: 1 }}
              />
            ) : (
              <img
                src={optimizeCloudinaryUrl(bgUrl, 1080)}
                alt=""
                className="fixed inset-0 w-full h-full object-cover pointer-events-none"
                style={{ zIndex: 1 }}
              />
            )
          )}
          {/* Dark Cinematic Overlay */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 2, background: 'linear-gradient(to bottom, rgba(5,0,10,0.55) 0%, rgba(15,2,10,0.3) 50%, rgba(5,0,10,0.6) 100%)' }}
          />
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
              videoUrl={introVideoUrl}
            />
          ) : isPolaroid ? (
            <PolaroidIntroScreen
              key="polaroid-lock"
              onUnlock={handleUnlock}
              introVideoUrl={introVideoUrl}
              heroPhotos={siteData?.gallery?.supporting?.map(s => s.url).filter(Boolean) || []}
              lockScreenPrompt={lockProps.lockScreenPrompt}
              valentineMessage={lockProps.valentineMessage}
              introButtonText={siteData?.introButtonText}
              themeColors={siteData?.themeColors}
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
            style={{ position: 'relative', zIndex: 3 }}
          >
            {siteData.templateType === 'modern' ? (
              <TemplateModern siteData={siteData} />
            ) : siteData.templateType === 'valentine' ? (
              <TemplateValentine siteData={siteData} />
            ) : isPolaroid ? (
              <div className="template-polaroid-root text-white">
                <FloatingDecor />
                <Hero siteDataOverride={siteData} />
                <LazySection height="380px">
                  <GiftBox
                    recipient={siteData.gift?.recipient}
                    message={siteData.gift?.message}
                    bouquetUrl={siteData.gift?.bouquetUrl}
                  />
                </LazySection>
                <LazySection height="400px">
                  <LoveMap siteDataOverride={siteData} />
                </LazySection>
                <LazySection height="500px">
                  <Gallery siteDataOverride={siteData} />
                </LazySection>
                <LazySection height="400px">
                  <ThingsToDoSection items={siteData.thingsToDo} themeColors={siteData.themeColors?.polaroid} />
                </LazySection>
                <LazySection height="200px">
                  <Footer siteDataOverride={siteData} />
                </LazySection>
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
