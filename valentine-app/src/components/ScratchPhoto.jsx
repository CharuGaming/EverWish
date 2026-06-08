/**
 * ScratchPhoto.jsx — Heart-shaped scratch-to-reveal card
 * CSS mask clips everything (image + canvas) to a heart.
 * On reveal: photo springs in + hearts burst outward.
 */
import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_THRESHOLD = 42;

// SVG data-URL heart mask (100×100 viewBox)
const HEART_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M10 35 A22 22 0 0 1 50 28 A22 22 0 0 1 90 35 Q90 62 50 90 Q10 62 10 35 Z' fill='white'/%3E%3C/svg%3E")`;

const BURST_EMOJIS = ['❤️','💛','🧡','💗','💖','✨','🌟','💕'];

// Hearts that fly outward on reveal
function BurstHearts() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * 360;
        const rad   = (angle * Math.PI) / 180;
        const dist  = 90 + Math.random() * 50;
        return (
          <motion.div
            key={i}
            className="absolute text-xl pointer-events-none z-50"
            style={{ left: '50%', top: '50%' }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
            animate={{ opacity: 0, x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, scale: 1.6 }}
            transition={{ duration: 0.85, delay: i * 0.04, ease: 'easeOut' }}
          >
            {BURST_EMOJIS[i % BURST_EMOJIS.length]}
          </motion.div>
        );
      })}
    </>
  );
}

export default function ScratchPhoto({ src, alt = '', primary = '#f59e0b', threshold = DEFAULT_THRESHOLD, onClick }) {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const isDrawing    = useRef(false);
  const lastPos      = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [pct,      setPct]      = useState(0);
  const [ready,    setReady]    = useState(false);
  const [burst,    setBurst]    = useState(false);

  // ── Init canvas overlay ─────────────────────────────────────────────
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = containerRef.current?.querySelector('img');
    if (!canvas || !img || revealed) return;

    const dpr = window.devicePixelRatio || 1;
    const w   = img.offsetWidth;
    const h   = img.offsetHeight;
    if (!w || !h) return;

    canvas.width        = w * dpr;
    canvas.height       = h * dpr;
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Amber/golden gradient overlay (birthday theme)
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.8);
    g.addColorStop(0,   '#92400e');
    g.addColorStop(0.6, '#78350f');
    g.addColorStop(1,   '#3b1507');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Gold sparkle dots
    ctx.fillStyle = 'rgba(251,191,36,0.18)';
    for (let i = 0; i < 55; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2 + 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Heart hint text
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = 'rgba(251,191,36,0.95)';
    ctx.font         = `bold ${Math.max(11, w * 0.07)}px system-ui, sans-serif`;
    ctx.fillText('♥ Scratch Here ♥', w / 2, h / 2 - 12);
    ctx.font      = `${Math.max(9, w * 0.05)}px system-ui, sans-serif`;
    ctx.fillStyle = 'rgba(251,191,36,0.55)';
    ctx.fillText('rub to reveal', w / 2, h / 2 + 14);

    setReady(true);
  }, [revealed]);

  useEffect(() => {
    const img = containerRef.current?.querySelector('img');
    if (!img) return;
    if (img.complete) { initCanvas(); return; }
    img.addEventListener('load', initCanvas);
    return () => img.removeEventListener('load', initCanvas);
  }, [initCanvas]);

  // ── Pointer helpers ─────────────────────────────────────────────────
  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx    = canvas.getContext('2d');
    const dpr    = window.devicePixelRatio || 1;
    const radius = Math.max(canvas.offsetWidth * 0.11, 22);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    if (lastPos.current) {
      ctx.moveTo(lastPos.current.x * dpr, lastPos.current.y * dpr);
      ctx.lineTo(x * dpr, y * dpr);
      ctx.lineWidth = radius * 2 * dpr;
      ctx.lineCap   = 'round';
      ctx.lineJoin  = 'round';
      ctx.stroke();
    }
    ctx.arc(x * dpr, y * dpr, radius * dpr, 0, Math.PI * 2);
    ctx.fill();
    lastPos.current = { x, y };

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] === 0) transparent++;
    const p = Math.round((transparent / (canvas.width * canvas.height)) * 100);
    setPct(p);

    if (p >= threshold) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setRevealed(true);
      setBurst(true);
      setTimeout(() => setBurst(false), 1100);
    }
  };

  const onStart = e => { e.preventDefault(); isDrawing.current = true; lastPos.current = null; scratch(...Object.values(getPos(e, canvasRef.current))); };
  const onMove  = e => { e.preventDefault(); if (!isDrawing.current) return; scratch(...Object.values(getPos(e, canvasRef.current))); };
  const onEnd   = () => { isDrawing.current = false; lastPos.current = null; };

  return (
    // Outer wrapper — NOT masked, so burst hearts are visible
    <div className="relative flex items-center justify-center py-3 select-none">

      {/* Heart-masked container */}
      <div
        ref={containerRef}
        className="relative cursor-crosshair"
        style={{
          width: '200px',
          height: '190px',
          maskImage: HEART_MASK,
          WebkitMaskImage: HEART_MASK,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          touchAction: 'none',
        }}
      >
        {/* Photo underneath */}
        <AnimatePresence>
          {revealed ? (
            <motion.img
              key="revealed"
              src={src} alt={alt}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 16 }}
              draggable={false}
            />
          ) : (
            <img
              key="hidden"
              src={src} alt={alt}
              loading="lazy" decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          )}
        </AnimatePresence>

        {/* Scratch canvas */}
        <AnimatePresence>
          {!revealed && (
            <motion.canvas
              ref={canvasRef}
              className="absolute inset-0 touch-none"
              style={{ display: ready ? 'block' : 'none' }}
              onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
              onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
              exit={{ opacity: 0, transition: { duration: 0.45 } }}
            />
          )}
        </AnimatePresence>

        {/* Progress bar */}
        {!revealed && pct > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 pointer-events-none">
            <motion.div className="h-full rounded-full"
              style={{ backgroundColor: primary, width: `${pct}%` }}
              transition={{ duration: 0.1 }} />
          </div>
        )}

        {/* Click after reveal */}
        {revealed && onClick && <div className="absolute inset-0 cursor-zoom-in" onClick={onClick} />}
      </div>

      {/* Burst hearts — outside mask so they're visible */}
      <AnimatePresence>
        {burst && <BurstHearts />}
      </AnimatePresence>
    </div>
  );
}
