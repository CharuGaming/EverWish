'use client';

import { useState } from 'react';
import { VscHome, VscPreview, VscColorMode, VscCommentDiscussion } from 'react-icons/vsc';
import CardNav from '../components/CardNav';
import DotField from '../components/DotField';
import Dock from '../components/Dock';
import GradientBlinds from '../components/GradientBlinds';

const WHATSAPP_NUMBER = '94712000590';

export default function WebfrontHome() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  const themeColors = {
    bg:              isDarkMode ? '#0F0C13' : '#FFF5F8',
    text:            isDarkMode ? '#FFFFFF' : '#111111',
    subtext:         isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(17,17,17,0.65)',
    navBase:         isDarkMode ? '#1B1722' : '#FFFFFF',
    navMenu:         isDarkMode ? '#FFFFFF' : '#000000',
    dotGradientFrom: isDarkMode ? 'rgba(168,85,247,0.4)'  : 'rgba(255,105,180,0.4)',
    dotGradientTo:   isDarkMode ? 'rgba(180,151,207,0.2)' : 'rgba(255,182,193,0.2)',
    dotGlow:         isDarkMode ? '#1B1722' : '#FFE4E1',
    blindColors:     isDarkMode
      ? ['#2D0050', '#5227FF', '#9B4DFF', '#1B1722']
      : ['#FF9FFC', '#FFB3DE', '#F43F5E', '#FFF0F5'],
    badgeBg:         isDarkMode ? 'rgba(244,63,94,0.15)'  : 'rgba(244,63,94,0.1)',
    badgeText:       isDarkMode ? '#fb7185'                : '#e11d48',
    dockBg:          isDarkMode ? 'bg-neutral-900/80 border-neutral-700'
                                : 'bg-white/80 border-gray-200',
    pillBg:          isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    pillBorder:      isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
  };

  const navItems = [
    {
      label: 'Templates',
      bgColor:   isDarkMode ? '#2F293A' : '#FFF0F5',
      textColor: isDarkMode ? '#fff'    : '#333',
      links: [
        { label: 'Anniversary',   ariaLabel: 'Anniversary Templates' },
        { label: 'Birthdays',     ariaLabel: 'Birthday Templates'    },
        { label: 'Proposals',     ariaLabel: 'Proposal Templates'    },
      ],
    },
    {
      label: 'How It Works',
      bgColor:   isDarkMode ? '#3F374D' : '#FFE4E1',
      textColor: isDarkMode ? '#fff'    : '#333',
      links: [
        { label: 'Step by Step', ariaLabel: 'Guide'   },
        { label: 'Pricing',      ariaLabel: 'Pricing' },
      ],
    },
  ];

  const dockItems = [
    {
      icon:    <VscHome size={22} color={themeColors.text} />,
      label:   'Home',
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
    {
      icon:    <VscPreview size={22} color={themeColors.text} />,
      label:   'Templates',
      onClick: () => window.location.href = '/storefront',
    },
    {
      icon:    <VscColorMode size={22} color={themeColors.text} />,
      label:   isDarkMode ? 'Light Mode' : 'Dark Mode',
      onClick: toggleTheme,
    },
    {
      icon:    <VscCommentDiscussion size={22} color={themeColors.text} />,
      label:   'WhatsApp',
      onClick: () => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank'),
    },
  ];

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundColor: themeColors.bg,
        color: themeColors.text,
        transition: 'background-color 0.5s ease, color 0.5s ease',
      }}
    >
      {/* ── Z-0 layer A: Interactive Dot Grid ── */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <DotField
          dotRadius={1.5}
          dotSpacing={18}
          cursorRadius={400}
          cursorForce={0.2}
          bulgeOnly={true}
          bulgeStrength={25}
          glowRadius={200}
          sparkle={true}
          gradientFrom={themeColors.dotGradientFrom}
          gradientTo={themeColors.dotGradientTo}
          glowColor={themeColors.dotGlow}
        />
      </div>

      {/* ── Z-0 layer B: GradientBlinds WebGL shimmer ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <GradientBlinds
          gradientColors={themeColors.blindColors}
          angle={0}
          noise={0.15}
          blindCount={12}
          blindMinWidth={50}
          spotlightRadius={0.55}
          spotlightSoftness={1.2}
          spotlightOpacity={0.85}
          mouseDampening={0.18}
          distortAmount={0}
          shineDirection="left"
          mixBlendMode={isDarkMode ? 'screen' : 'multiply'}
        />
      </div>

      {/* ── Z-50: Top Navigation ── */}
      <div className="relative z-50">
        <CardNav
          logo="/logo.png"
          logoAlt="EverWish Logo"
          items={navItems}
          baseColor={themeColors.navBase}
          menuColor={themeColors.navMenu}
          buttonBgColor="#F43F5E"
          buttonTextColor="#ffffff"
          ease="power3.out"
        />
      </div>

      {/* ── Z-10: Hero Content ── */}
      <main
        className="relative z-10 flex flex-col items-center justify-center min-h-[88vh] px-4 text-center pointer-events-none"
      >
        <div className="pointer-events-auto flex flex-col items-center">
          {/* Badge */}
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-7"
            style={{
              backgroundColor: themeColors.badgeBg,
              color: themeColors.badgeText,
              border: `1px solid ${themeColors.badgeText}30`,
            }}
          >
            ✨ Over 10,000 Moments Shared
          </span>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-5 tracking-tight leading-[1.08]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Gift a Moment
            <br />
            <span className="bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
              They'll Never Forget
            </span>
          </h1>

          {/* Sub-copy */}
          <p
            className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mb-10"
            style={{ color: themeColors.subtext }}
          >
            Beautiful, interactive digital celebration pages — customised for your
            loved one and delivered in hours. Valentines, birthdays, proposals &amp; more.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <a
              href="/storefront"
              className="group flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-9 py-4 rounded-2xl shadow-xl shadow-rose-500/30 hover:scale-105 transition-all text-base"
            >
              Browse Templates →
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-bold px-9 py-4 rounded-2xl text-base hover:scale-105 transition-all"
              style={{
                backgroundColor: themeColors.pillBg,
                color: themeColors.text,
                border: `1.5px solid ${themeColors.pillBorder}`,
                backdropFilter: 'blur(12px)',
              }}
            >
              💬 Chat on WhatsApp
            </a>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['✅ Delivered in 24 hrs', '🔒 Private & Secure', '🎨 Fully Customised', '💬 WhatsApp Support'].map((pill) => (
              <span
                key={pill}
                className="px-4 py-2 rounded-full font-medium"
                style={{
                  backgroundColor: themeColors.pillBg,
                  color: themeColors.subtext,
                  border: `1px solid ${themeColors.pillBorder}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* ── Z-50: Bottom Floating Dock ── */}
      <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Dock
            items={dockItems}
            panelHeight={60}
            baseItemSize={45}
            magnification={70}
            className={`${themeColors.dockBg} backdrop-blur-xl`}
          />
        </div>
      </div>
    </div>
  );
}
