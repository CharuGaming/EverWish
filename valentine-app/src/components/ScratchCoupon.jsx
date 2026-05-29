import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SCRATCH_THRESHOLD = 45;

export default function ScratchCoupon({ prize, primary = '#f59e0b' }) {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [pct, setPct] = useState(0);
  const isDrawing = useRef(false);
  const lastPos = useRef(null);

  if (!prize) return null;

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width;
    const sy = canvas.height / r.height;
    if (e.touches) return { x: (e.touches[0].clientX - r.left) * sx, y: (e.touches[0].clientY - r.top) * sy };
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
  };

  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 52;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (lastPos.current) ctx.moveTo(lastPos.current.x, lastPos.current.y);
    else ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPos.current = { x, y };

    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] === 0) transparent++;
    const p = Math.round((transparent / (canvas.width * canvas.height)) * 100);
    setPct(p);
    if (p >= SCRATCH_THRESHOLD) { setRevealed(true); ctx.clearRect(0, 0, canvas.width, canvas.height); }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const g = ctx.createLinearGradient(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    g.addColorStop(0, '#94a3b8'); g.addColorStop(0.4, '#e2e8f0');
    g.addColorStop(0.7, '#94a3b8'); g.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (let i = 0; i < 28; i++) {
      ctx.font = `${14 + Math.random() * 10}px serif`;
      ctx.fillText('★', Math.random() * canvas.offsetWidth, Math.random() * canvas.offsetHeight);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(15,23,42,0.6)';
    ctx.font = 'bold 16px system-ui';
    ctx.fillText('✦ Scratch Here ✦', canvas.offsetWidth / 2, canvas.offsetHeight / 2 - 8);
    ctx.font = '12px system-ui';
    ctx.fillStyle = 'rgba(15,23,42,0.38)';
    ctx.fillText('Rub to reveal your gift', canvas.offsetWidth / 2, canvas.offsetHeight / 2 + 14);
  }, []);

  const onStart = (e) => { e.preventDefault(); isDrawing.current = true; lastPos.current = null; const p = getPos(e, canvasRef.current); scratch(p.x, p.y); };
  const onMove = (e) => { e.preventDefault(); if (!isDrawing.current) return; const p = getPos(e, canvasRef.current); scratch(p.x, p.y); };
  const onEnd = () => { isDrawing.current = false; lastPos.current = null; };

  return (
    <section className="py-20 px-6">
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }} className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-2" style={{ color: primary }}>🎰 Scratch & Win</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800">Your Lucky Prize</h2>
          <p className="text-slate-500 text-sm mt-2">Scratch the card below to reveal your surprise!</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
          className="rounded-[2rem] overflow-hidden shadow-2xl select-none" style={{ boxShadow: `0 25px 60px ${primary}25` }}>
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ background: `linear-gradient(90deg,${primary},${primary}bb)` }}>
            <div>
              <p className="text-white font-black text-lg tracking-wide">🎁 BIRTHDAY TICKET</p>
              <p className="text-white/60 text-xs font-mono">LUCKY DRAW</p>
            </div>
            <span className="text-3xl">🏆</span>
          </div>

          {/* Scratch zone */}
          <div className="relative bg-white" style={{ height: 180 }}>
            {/* Prize (revealed bg) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6">
              <AnimatePresence>
                {revealed && (
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} className="text-center">
                    <p className="text-4xl mb-2">🎉</p>
                    <p className="font-black text-2xl md:text-3xl" style={{ color: primary }}>{prize}</p>
                    <p className="text-slate-400 text-xs mt-1 font-medium">You've won! 🥳</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Canvas */}
            {!revealed && (
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
                onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd} />
            )}
            {!revealed && pct > 0 && (
              <div className="absolute bottom-2 right-3 text-[10px] font-bold text-slate-400 font-mono">{pct}%</div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-dashed border-slate-200">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">EverWish · Birthday Edition</span>
            <span className="text-[10px] font-mono text-slate-400">★★★★★</span>
          </div>
        </motion.div>

        {!revealed && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            onClick={() => { setRevealed(true); const c = canvasRef.current; if (c) c.getContext('2d').clearRect(0,0,c.width,c.height); }}
            className="block mx-auto mt-4 text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors cursor-pointer">
            Skip → Reveal immediately
          </motion.button>
        )}
      </div>
    </section>
  );
}
