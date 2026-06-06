/**
 * ScratchPhoto.jsx
 * A canvas-based scratch-to-reveal wrapper for a single photo.
 * Renders a frosted scratch overlay; when the user has scratched
 * enough of the surface, the photo underneath is fully revealed.
 *
 * Props
 *  src       {string}  – image URL
 *  alt       {string}  – alt text / caption
 *  primary   {string}  – theme accent hex (for glow & hint text)
 *  threshold {number}  – % of canvas that must be cleared (default 45)
 */
import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const DEFAULT_THRESHOLD = 42; // percent

export default function ScratchPhoto({ src, alt = '', primary = '#f59e0b', threshold = DEFAULT_THRESHOLD, onClick }) {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const isDrawing    = useRef(false);
  const lastPos      = useRef(null);
  const [revealed, setRevealed]   = useState(false);
  const [pct,      setPct]        = useState(0);
  const [ready,    setReady]      = useState(false); // canvas initialised?

  // ── Draw the scratch overlay ──────────────────────────────────────
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = containerRef.current?.querySelector('img');
    if (!canvas || !img || revealed) return;

    const dpr = window.devicePixelRatio || 1;
    const w   = img.offsetWidth;
    const h   = img.offsetHeight;
    if (!w || !h) return;

    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // ── Frosted overlay gradient ──────────────────────────────────
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0,    '#1a1a2e');
    g.addColorStop(0.45, '#16213e');
    g.addColorStop(1,    '#0f3460');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Subtle star/sparkle pattern
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 1.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center hint text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = `bold ${Math.max(12, w * 0.07)}px system-ui, sans-serif`;
    ctx.fillText('✦ Scratch Here ✦', w / 2, h / 2 - 10);
    ctx.font = `${Math.max(10, w * 0.055)}px system-ui, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.fillText('rub to reveal', w / 2, h / 2 + 16);

    setReady(true);
  }, [revealed]);

  // ── Init after image loads ────────────────────────────────────────
  useEffect(() => {
    const img = containerRef.current?.querySelector('img');
    if (!img) return;
    if (img.complete) { initCanvas(); return; }
    img.addEventListener('load', initCanvas);
    return () => img.removeEventListener('load', initCanvas);
  }, [initCanvas]);

  // ── Pointer helpers ───────────────────────────────────────────────
  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const dpr  = window.devicePixelRatio || 1;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left),
        y: (e.touches[0].clientY - rect.top),
      };
    }
    return {
      x: (e.clientX - rect.left),
      y: (e.clientY - rect.top),
    };
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
      ctx.lineWidth  = radius * 2 * dpr;
      ctx.lineCap    = 'round';
      ctx.lineJoin   = 'round';
      ctx.stroke();
    }
    ctx.arc(x * dpr, y * dpr, radius * dpr, 0, Math.PI * 2);
    ctx.fill();
    lastPos.current = { x, y };

    // Measure transparency
    const data        = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent   = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] === 0) transparent++;
    const p = Math.round((transparent / (canvas.width * canvas.height)) * 100);
    setPct(p);
    if (p >= threshold) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setRevealed(true);
    }
  };

  const onStart = e => { e.preventDefault(); isDrawing.current = true; lastPos.current = null; const p = getPos(e, canvasRef.current); scratch(p.x, p.y); };
  const onMove  = e => { e.preventDefault(); if (!isDrawing.current) return; const p = getPos(e, canvasRef.current); scratch(p.x, p.y); };
  const onEnd   = () => { isDrawing.current = false; lastPos.current = null; };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl shadow-lg cursor-crosshair select-none"
      style={{ touchAction: 'none' }}
    >
      {/* Base photo (always rendered beneath) */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-auto object-cover block"
        draggable={false}
      />

      {/* Scratch canvas overlay */}
      <AnimatePresence>
        {!revealed && (
          <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 touch-none"
            style={{ display: ready ? 'block' : 'none' }}
            onMouseDown={onStart}
            onMouseMove={onMove}
            onMouseUp={onEnd}
            onMouseLeave={onEnd}
            onTouchStart={onStart}
            onTouchMove={onMove}
            onTouchEnd={onEnd}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          />
        )}
      </AnimatePresence>

      {/* Progress bar (only while scratching) */}
      {!revealed && pct > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 pointer-events-none">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: primary, width: `${pct}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}

      {/* Revealed checkmark */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center pointer-events-none"
            style={{ backgroundColor: primary }}
          >
            <Sparkles size={14} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap to open lightbox (only after reveal) */}
      {revealed && onClick && (
        <div
          className="absolute inset-0 cursor-zoom-in"
          onClick={onClick}
        />
      )}
    </div>
  );
}
