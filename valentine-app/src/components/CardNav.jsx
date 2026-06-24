import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * CardNav — GSAP-animated top navigation with expandable card dropdowns.
 *
 * Props:
 *  logo          – logo image src
 *  logoAlt       – alt text for logo
 *  items         – array of { label, bgColor, textColor, links: [{label, ariaLabel}] }
 *  baseColor     – nav bar background colour
 *  menuColor     – text / icon colour for menu items
 *  buttonBgColor – CTA button background
 *  buttonTextColor – CTA button text colour
 *  ease          – GSAP ease string  (default 'power3.out')
 */
export default function CardNav({
  logo            = '/logo.png',
  logoAlt         = 'Logo',
  items           = [],
  baseColor       = '#FFFFFF',
  menuColor       = '#000000',
  buttonBgColor   = '#F43F5E',
  buttonTextColor = '#ffffff',
  ease            = 'power3.out',
}) {
  const [openIdx, setOpenIdx] = useState(null);
  const cardRefs  = useRef([]);
  const arrowRefs = useRef([]);

  // Animate card open/close
  useEffect(() => {
    items.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      if (i === openIdx) {
        gsap.to(el, { height: 'auto', opacity: 1, duration: 0.35, ease });
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.25, ease });
      }
    });
    // Rotate arrows
    arrowRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, { rotate: i === openIdx ? 180 : 0, duration: 0.3, ease });
    });
  }, [openIdx, ease, items]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('[data-cardnav]')) setOpenIdx(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (i) => setOpenIdx((prev) => (prev === i ? null : i));

  return (
    <nav
      data-cardnav
      style={{ backgroundColor: baseColor }}
      className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-white/20 shadow-sm transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src={logo}
            alt={logoAlt}
            className="w-9 h-9 rounded-2xl object-cover shadow-md shadow-rose-400/20"
          />
          <span
            className="text-lg font-extrabold tracking-tight"
            style={{ color: menuColor }}
          >
            EverWish
          </span>
        </a>

        {/* Nav Items */}
        <div className="hidden md:flex items-center gap-1 relative">
          {items.map((item, i) => (
            <div key={i} className="relative">
              <button
                onClick={() => toggle(i)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-black/5"
                style={{ color: menuColor }}
              >
                {item.label}
                <span ref={(el) => (arrowRefs.current[i] = el)} className="inline-block text-xs opacity-60">
                  ▾
                </span>
              </button>

              {/* Dropdown Card */}
              <div
                ref={(el) => (cardRefs.current[i] = el)}
                style={{
                  height: 0,
                  opacity: 0,
                  overflow: 'hidden',
                  backgroundColor: item.bgColor || '#fff',
                  color: item.textColor || '#333',
                }}
                className="absolute top-full left-0 mt-2 w-48 rounded-2xl shadow-xl border border-white/30 backdrop-blur-xl z-50"
              >
                <ul className="py-2 px-2">
                  {(item.links || []).map((link, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        aria-label={link.ariaLabel}
                        className="block px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-black/5 transition-colors"
                        style={{ color: item.textColor || '#333' }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href="https://wa.me/message/OMLL3GNWH3JJA1"
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-rose-400/25 hover:scale-105 transition-transform"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}
