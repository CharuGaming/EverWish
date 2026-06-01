// DemoPage.jsx – renders a fully interactive template from mock data.
// Reached via route /demo/:templateId  (e.g. /demo/v1, /demo/b2)
// Mirrors ClientPage's render logic but skips the API fetch entirely.

import { useState, useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MOCK_DATA } from '../mockData';
import { mergeDemoData } from '../utils/demoData';
import { getDemoSite, toComponentData } from '../api';

import LockScreen        from '../components/LockScreen';
import Hero              from '../components/Hero';
import LoveMap           from '../components/LoveMap';
import Gallery           from '../components/Gallery';
import GiftBox           from '../components/GiftBox';
import Footer            from '../components/Footer';
import FloatingDecor     from '../components/FloatingDecor';
import CursorTrail       from '../components/CursorTrail';
import GlobalMusicPlayer from '../components/GlobalMusicPlayer';
import HeartBurst        from '../components/HeartBurst';
import FloatingBalloons  from '../components/FloatingBalloons';
import ThingsToDoSection from '../components/ThingsToDoSection';
import TemplateModern, { ModernLockScreen } from '../components/TemplateModern';
import TemplateValentine from '../components/TemplateValentine';
import TemplateProposal  from '../components/TemplateProposal';
import TemplateCustom    from '../components/TemplateCustom';
import BirthdayTemplate1 from '../components/BirthdayTemplate1';
import BirthdayTemplate2 from '../components/BirthdayTemplate2';
import BirthdayTemplate3 from '../components/BirthdayTemplate3';
import BirthdayTemplate4 from '../components/BirthdayTemplate4';
import CinematicAnniversary from '../components/CinematicAnniversary';
import CinematicBirthday   from '../components/CinematicBirthday';

// ── Demo banner overlaid at the top ──────────────────────────
function DemoBanner() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 py-2 text-xs font-bold text-white uppercase tracking-widest pointer-events-none"
      style={{ background: 'linear-gradient(90deg,#e11d48,#9333ea)' }}
    >
      ✨ Demo Preview — Contact us to personalise this for you!
    </div>
  );
}

// ── Unknown template fallback ─────────────────────────────────
function UnknownTemplate({ id }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6"
      style={{ background: '#fff0f5' }}>
      <div className="text-5xl">🤔</div>
      <h1 className="text-2xl font-bold text-rose-600">Unknown Template</h1>
      <p className="text-slate-500 text-sm">No demo found for template ID: <strong>{id}</strong></p>
    </div>
  );
}

// ── Main DemoPage ─────────────────────────────────────────────
export default function DemoPage() {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  // When loaded inside PreviewModal's iframe, ?demo=1 is appended
  // — skip CPU-heavy particle effects to keep mobile smooth
  const isDemo = searchParams.get('demo') === '1';
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadDemo() {
      const rawSiteData = MOCK_DATA[templateId];
      const actualTemplateType = rawSiteData ? rawSiteData.templateType : templateId;

      try {
        const res = await getDemoSite(actualTemplateType);
        if (res.success && res.data) {
          // Use the real site configured as demo
          setSiteData(toComponentData(res.data));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log("No CMS demo found for this template, falling back to mock data.");
      }
      
      // Fallback gracefully to MOCK_DATA if no demo is set
      if (rawSiteData) {
        const themeCategory = rawSiteData.category === 'birthday' ? 'birthday' : 'valentine';
        setSiteData(mergeDemoData(rawSiteData, themeCategory, isDemo));
      } else {
        setSiteData(null);
      }
      setLoading(false);
    }
    loadDemo();
  }, [templateId, isDemo]);

  const [isUnlocked, setIsUnlocked]   = useState(false);
  const [playTrigger, setPlayTrigger] = useState(false);
  const [showBurst, setShowBurst]     = useState(false);

  const triggerBurst = useCallback(() => {
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 2000);
  }, []);

  const handleUnlock = useCallback(() => {
    setIsUnlocked(true);
    triggerBurst();
  }, [triggerBurst]);

  const handleUnlockImmediate = useCallback(() => setPlayTrigger(true), []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fff0f5' }}>
        <p className="text-slate-500 font-medium tracking-widest uppercase animate-pulse">Loading Demo...</p>
      </div>
    );
  }

  if (!siteData) return <UnknownTemplate id={templateId} />;

  const lockProps = {
    lockScreenPrompt: siteData.lockScreenPrompt,
    valentineMessage: siteData.valentineMessage,
  };

  // ── Birthday templates ──────────────────────────────────────
  if (siteData.templateType === 'cinematic') {
    return (
      <div className="relative min-h-screen pt-8">
        <DemoBanner />
        <CinematicAnniversary siteData={siteData} />
      </div>
    );
  }

  if (siteData.templateType === 'bday5') {
    return (
      <div className="relative min-h-screen pt-8">
        <DemoBanner />
        <CinematicBirthday siteData={siteData} />
      </div>
    );
  }

  if (siteData.category === 'birthday') {
    const bdayMap = { bday1: BirthdayTemplate1, bday2: BirthdayTemplate2, bday3: BirthdayTemplate3, bday4: BirthdayTemplate4 };
    const TemplateComponent = bdayMap[siteData.templateType] || BirthdayTemplate1;
    const themeKey  = siteData.templateType;
    const bg        = siteData.themeColors?.[themeKey]?.background || '#fffbeb';

    return (
      <div className="relative min-h-screen pt-8" style={{ backgroundColor: bg }}>
        <DemoBanner />
        {/* FloatingBalloons suppressed in iframe demo to reduce mobile GPU/CPU load */}
        {!isDemo && <FloatingBalloons />}
        <GlobalMusicPlayer musicData={siteData.music} />
        <TemplateComponent siteData={siteData} onUnlock={triggerBurst} />
      </div>
    );
  }

  // ── Valentine / Proposal / Custom ────────────────────────────
  if (siteData.templateType === 'valentine') {
    return (
      <div className="relative min-h-screen pt-8">
        <DemoBanner />
        <GlobalMusicPlayer musicData={siteData.music} />
        <HeartBurst show={showBurst} />
        <TemplateValentine siteData={siteData} onUnlock={triggerBurst} />
      </div>
    );
  }

  if (siteData.templateType === 'proposal') {
    return (
      <div className="relative min-h-screen pt-8">
        <DemoBanner />
        <GlobalMusicPlayer musicData={siteData.music} />
        <HeartBurst show={showBurst} />
        <TemplateProposal siteData={siteData} onUnlock={triggerBurst} />
      </div>
    );
  }

  if (siteData.templateType === 'custom') {
    return (
      <div className="relative min-h-screen pt-8">
        <DemoBanner />
        <GlobalMusicPlayer musicData={siteData.music} />
        <HeartBurst show={showBurst} />
        <TemplateCustom siteData={siteData} onUnlock={triggerBurst} />
      </div>
    );
  }

  // ── Polaroid + Modern (lock screen flow) ─────────────────────
  return (
    <div className="relative min-h-screen pt-8">
      <DemoBanner />
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
          >
            {siteData.templateType === 'modern' ? (
              <TemplateModern siteData={siteData} />
            ) : (
              /* Polaroid template */
              <div
                className="template-polaroid-root"
                style={{ background: siteData.themeColors?.polaroid?.background || '#fff0f5' }}
              >
                <FloatingDecor />
                <Hero siteDataOverride={siteData} />
                <GiftBox
                  recipient={siteData.gift?.recipient}
                  message={siteData.gift?.message}
                  bouquetUrl={siteData.gift?.bouquetUrl}
                />
                <LoveMap siteDataOverride={siteData} />
                <Gallery siteDataOverride={siteData} />
                <ThingsToDoSection
                  items={siteData.thingsToDo}
                  themeColors={siteData.themeColors?.polaroid}
                />
                <Footer siteDataOverride={siteData} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
