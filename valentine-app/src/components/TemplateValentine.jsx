import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import ThingsToDoSection from './ThingsToDoSection';
import LoveLock    from './LoveLock';
import { getContrastYIQ } from '../utils/colorHelpers';
import ReasonsJar  from './ReasonsJar';
import Heartbeat   from './Heartbeat';
import TimeCapsule from './TimeCapsule';
import { optimizeCloudinaryUrl } from '../utils/imageHelpers';
import BorderGlow from './BorderGlow';

// ── Confetti burst ────────────────────────────────────────────────
function Confetti({ active }) {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#f43f5e','#ec4899','#fb7185','#fbbf24','#a78bfa','#34d399'][i % 6],
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random(),
  }));
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: [1,1,0], rotate: 720 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{ position:'absolute', top:0, width:8, height:8, borderRadius:2, backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

// ── Heart-shape Memory Match Lockscreen ───────────────────────────
// Heart grid positions forming a perfect 10-card heart shape:
const HEART_POSITIONS = [
  // Row 1
  { col: 2, row: 1 }, { col: 4, row: 1 },
  // Row 2
  { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 4, row: 2 }, { col: 5, row: 2 },
  // Row 3
  { col: 2, row: 3 }, { col: 3, row: 3 }, { col: 4, row: 3 },
  // Row 4
  { col: 3, row: 4 }
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function MemoryCard({ card, isFlipped, isMatched, onClick, cardColor }) {
  return (
    <motion.div
      onClick={onClick}
      className="relative cursor-pointer select-none"
      style={{ width: 56, height: 56, perspective: 600 }}
      whileTap={{ scale: 0.92 }}
    >
      <motion.div
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ width:'100%', height:'100%', transformStyle:'preserve-3d', position:'relative' }}
      >
        {/* Back (Plain soft pink cover matching the reference) */}
        <div style={{ backfaceVisibility:'hidden', position:'absolute', inset:0, backgroundColor: cardColor || '#ffccd5' }}
          className="rounded-xl shadow-[0_2px_8px_rgba(251,207,232,0.6)] border border-pink-100/30 flex items-center justify-center transition-colors hover:opacity-90" />
        {/* Front (image) */}
        <div style={{ backfaceVisibility:'hidden', position:'absolute', inset:0, transform:'rotateY(180deg)' }}
          className={`rounded-xl overflow-hidden border-2 shadow-md ${isMatched ? 'border-green-400 ring-2 ring-green-300' : 'border-pink-300'}`}>
          {card.imageUrl
            ? <img src={optimizeCloudinaryUrl(card.imageUrl, 200)} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-rose-100 flex items-center justify-center text-2xl">{['💖', '🌹', '🧸', '🍫', '💍'][card.pairIndex] || '💕'}</div>
          }
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeartMemoryMatch({ matchImages, onComplete, themeColors, customTitles }) {
  const imgs = (matchImages && matchImages.length >= 5)
    ? matchImages.slice(0, 5)
    : Array.from({ length: 5 }, () => '');

  const [cards, setCards] = useState(() => {
    const deck = [...imgs, ...imgs].map((url, i) => ({
      id: i,
      imageUrl: url,
      pairIndex: i % 5,
    }));
    return shuffle(deck);
  });

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [locked, setLocked] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [done, setDone] = useState(false);

  const handleFlip = useCallback((idx) => {
    if (locked || flipped.includes(idx) || matched.includes(cards[idx].id)) return;
    const next = [...flipped, idx];
    setFlipped(next);
    if (next.length === 2) {
      setLocked(true);
      const [a, b] = next;
      if (cards[a].pairIndex === cards[b].pairIndex) {
        const newMatched = [...matched, cards[a].id, cards[b].id];
        setMatched(newMatched);
        setFlipped([]);
        setLocked(false);
        if (newMatched.length === cards.length) {
          setConfetti(true);
          setTimeout(() => { setDone(true); setTimeout(onComplete, 1200); }, 800);
        }
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false); }, 1000);
      }
    }
  }, [locked, flipped, matched, cards, onComplete]);

  const valColors = themeColors?.valentine || {};
  const primaryColor = valColors.primary || '#e11d48';
  const backgroundColor = valColors.background || '#fff0f5';
  const cardColor = valColors.cardColor || '#ffccd5';
  const onPrimary = getContrastYIQ(primaryColor);

  return (
    <motion.div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden select-none"
      style={{ background: 'transparent' }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 1 }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Quicksand:wght@500;600&display=swap');
        .cursive-title { font-family: 'Dancing Script', cursive; }
        .quicksand-subtitle { font-family: 'Quicksand', sans-serif; }
        .lock-primary-text { color: ${primaryColor} !important; }
      `}</style>
      <Confetti active={confetti} />
      <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} className="text-center mb-10 px-4">
        <h1 className="cursive-title text-5xl md:text-6xl lock-primary-text flex items-center justify-center gap-3">
          {customTitles?.gameSectionTitle || "For My Valentine"} <span className="inline-block animate-pulse text-4xl md:text-5xl">❤️</span>
        </h1>
        <p className="quicksand-subtitle text-xs sm:text-sm text-slate-800 font-semibold tracking-wide mt-6 mb-2">
          Match the pairs to unlock a surprise...
        </p>
      </motion.div>

      {/* Heart-shaped grid using absolute positioning */}
      <div className="relative scale-[0.85] sm:scale-100 transition-transform duration-300" style={{ width: 4 * 64 + 56, height: 3 * 64 + 56 }}>
        {HEART_POSITIONS.map((pos, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: (pos.col - 1) * 64,
            top: (pos.row - 1) * 64,
          }}>
            <MemoryCard
              card={cards[i]}
              isFlipped={flipped.includes(i)}
              isMatched={matched.includes(cards[i].id)}
              onClick={() => handleFlip(i)}
              cardColor={cardColor}
            />
          </div>
        ))}
      </div>

      {matched.length === 0 && (
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}
          className="mt-10 text-xs text-rose-400 font-medium">
          Tap any card to start ✨
        </motion.p>
      )}
    </motion.div>
  );
}


// ── Why I Love You section ─────────────────────────────────────────────────
function WhyILoveYou({ reasons = [] }) {
  if (!reasons.length) return null;
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="max-w-2xl mx-auto">
        {/* Glass header card */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="text-center mb-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-6">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-300 font-mono">From the heart</span>
          <h2 className="text-4xl font-serif text-white mt-2 mb-1 drop-shadow">Why I Love You</h2>
          <div className="w-16 h-0.5 bg-pink-400/50 mx-auto mt-3" />
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reasons.map((r, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:30, rotate: i%2===0 ? -2 : 2 }}
              whileInView={{ opacity:1, y:0, rotate:0 }}
              viewport={{ once:true }}
              transition={{ delay:i*0.08, type:'spring', stiffness:120 }}
              whileHover={{ scale:1.03, rotate: i%2===0 ? -1 : 1 }}
              className="relative bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 shadow-xl border border-white/20 text-left"
            >
              <span className="absolute -top-3 -left-2 text-xl">💗</span>
              <p className="text-white/90 font-serif italic text-base leading-relaxed pl-2"
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>{r}</p>
              <span className="text-[10px] font-bold text-pink-300/70 uppercase tracking-widest mt-2 block">#{i+1}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Scratch Card component ─────────────────────────────────────────
function ScratchCard({ imageUrl, caption }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [scratched, setScratched] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f9a8d4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Label
    ctx.fillStyle = '#be185d';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch Me! ✨', canvas.width / 2, canvas.height / 2 - 8);
    ctx.fillStyle = '#db2777';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Reveal the memory inside', canvas.width / 2, canvas.height / 2 + 12);
  }, []);

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - r.left) * (canvas.width / r.width), y: (src.clientY - r.top) * (canvas.height / r.height) };
  };

  const scratch = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    // Sample coverage
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] < 128) transparent++;
    const p = Math.round((transparent / (canvas.width * canvas.height)) * 100);
    setPct(p);
    if (p > 60 && !scratched) setScratched(true);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-rose-100 bg-white group">
      {/* Background image */}
      {imageUrl
        ? <img src={optimizeCloudinaryUrl(imageUrl, 600)} alt={caption||'memory'} className="w-full aspect-square object-cover" />
        : <div className="w-full aspect-square bg-rose-50 flex items-center justify-center text-5xl">💕</div>
      }
      {/* Canvas overlay */}
      <canvas
        ref={canvasRef}
        width={300} height={300}
        className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
        style={{ opacity: scratched ? 0 : 1, transition: 'opacity 0.8s ease' }}
        onMouseDown={() => { isDrawing.current = true; }}
        onMouseMove={scratch}
        onMouseUp={() => { isDrawing.current = false; }}
        onMouseLeave={() => { isDrawing.current = false; }}
        onTouchStart={(e) => { e.preventDefault(); isDrawing.current = true; }}
        onTouchMove={(e) => { e.preventDefault(); scratch(e); }}
        onTouchEnd={() => { isDrawing.current = false; }}
      />
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-3">
          <p className="text-white text-xs font-medium truncate">{caption}</p>
        </div>
      )}
      {!scratched && (
        <div className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {pct}%
        </div>
      )}
    </div>
  );
}

function ScratchMemories({ scratchMemories = [], customTitles }) {
  if (!scratchMemories.length) return null;
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="text-center mb-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-6">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-300 font-mono">Reveal our moments</span>
          <h2 className="text-4xl font-serif text-white mt-2 mb-1 drop-shadow">{customTitles?.gallerySectionTitle || "Scratch Memories"}</h2>
          <p className="text-sm text-white/60">Scratch each card to reveal a hidden memory 💝</p>
          <div className="w-16 h-0.5 bg-pink-400/50 mx-auto mt-4" />
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {scratchMemories.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity:0, scale:0.9 }}
              whileInView={{ opacity:1, scale:1 }}
              viewport={{ once:true }}
              transition={{ delay:i*0.1 }}
            >
              <ScratchCard imageUrl={m.imageUrl} caption={m.caption} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Love Letter section ───────────────────────────────────────────────
function LoveLetter({ text, coupleName }) {
  if (!text) return null;
  return (
    <section className="py-20 px-6">
      <div className="max-w-xl mx-auto">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="relative"
        >
          <BorderGlow
            edgeSensitivity={30}
            glowColor="350 80 80"
            backgroundColor="rgba(255, 255, 255, 0.12)"
            borderRadius={28}
            glowRadius={45}
            glowIntensity={1.2}
            colors={['#ff4757', '#ff6b81', '#38bdf8']}
            className="w-full"
          >
            <div className="p-8 sm:p-12 relative overflow-hidden">
              <div className="text-center mb-8">
                <span className="text-3xl">💌</span>
                <h2 className="text-3xl font-serif text-white mt-3 drop-shadow">A Love Letter</h2>
                {coupleName && <p className="text-xs text-pink-300/70 uppercase tracking-widest mt-1 font-mono">for {coupleName}</p>}
              </div>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-white/15" />
                <p className="pl-10 text-base font-serif italic text-white/85 leading-8 whitespace-pre-line"
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>{text}</p>
              </div>
              <p className="text-right text-pink-300/70 font-serif italic text-sm mt-8">With all my love 💕</p>
            </div>
          </BorderGlow>
        </motion.div>
      </div>
    </section>
  );
}

// ── Virtual Gift — Explosion Reveal ───────────────────────────────
function VirtualGift({ gift }) {
  const [phase, setPhase] = useState('closed'); // closed | exploding | revealed

  // Pre-generate explosion data
  const [explosionData] = useState(() => {
    const particles = Array.from({ length: 36 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 36 + (Math.random() - 0.5) * 0.5;
      const dist = 90 + Math.random() * 160;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 50,
        rotation: Math.random() * 720 - 360,
        delay: Math.random() * 0.15,
        duration: 0.8 + Math.random() * 0.5,
        emoji: ["❤️","🌸","✨","💖","🎀","💕","🌹","⭐"][Math.floor(Math.random() * 8)],
        size: Math.random() * 14 + 6,
      };
    });
    const fragments = Array.from({ length: 12 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 12;
      const dist = 50 + Math.random() * 110;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 30,
        rotation: Math.random() * 540 - 270,
        delay: Math.random() * 0.08,
        width: 12 + Math.random() * 20,
        height: 10 + Math.random() * 16,
        color: ["#e11d48","#f43f5e","#fb7185","#fda4af","#fbbf24","#f59e0b"][Math.floor(Math.random() * 6)],
      };
    });
    return { particles, fragments };
  });

  const handleOpen = () => {
    if (phase !== 'closed') return;
    setPhase('exploding');
    setTimeout(() => setPhase('revealed'), 900);
  };

  return (
    <section className="py-20 px-6 text-center relative overflow-hidden">
      <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-6 max-w-md mx-auto mb-12">
        <h2 className="text-3xl font-serif text-white mb-1 drop-shadow">
          Your Special Gift 🎁
        </h2>
        <p className="text-sm text-white/60">Something wrapped just for you…</p>
      </motion.div>

      <div className="relative min-h-[380px] flex flex-col items-center justify-center max-w-md mx-auto">
        {/* Explosion Particles */}
        <AnimatePresence>
          {(phase === 'exploding') && explosionData.particles.map(p => (
            <motion.div
              key={`ep-${p.id}`}
              className="absolute pointer-events-none z-40"
              style={{ fontSize: p.size }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: p.x, y: p.y,
                scale: [0.3, 1.3, 1, 0],
                rotate: p.rotation,
              }}
              transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
            >{p.emoji}</motion.div>
          ))}
        </AnimatePresence>

        {/* Box Fragments */}
        <AnimatePresence>
          {(phase === 'exploding') && explosionData.fragments.map(f => (
            <motion.div
              key={`bf-${f.id}`}
              className="absolute z-30 rounded-sm pointer-events-none"
              style={{ width: f.width, height: f.height, backgroundColor: f.color }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
              animate={{
                opacity: [1, 1, 0],
                x: f.x, y: f.y,
                scale: [1, 0.8, 0.3],
                rotate: f.rotation,
              }}
              transition={{ duration: 0.7, delay: f.delay, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Gift Box (closed state) */}
        <AnimatePresence>
          {phase === 'closed' && (
            <motion.div
              key="gift-closed"
              exit={{
                scale: [1, 1.15, 0],
                opacity: [1, 1, 0],
                transition: { duration: 0.4, ease: "easeIn" },
              }}
              onClick={handleOpen}
              className="flex justify-center cursor-pointer select-none"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                className="relative w-56 h-56 flex flex-col items-center justify-center"
              >
                <motion.div
                  whileHover={{ 
                    rotate: [0, -3, 3, -3, 3, 0],
                    transition: { duration: 0.5, repeat: Infinity }
                  }}
                  whileTap={{ scale: 0.92 }}
                  className="relative w-40 h-40"
                >
                  {/* Lid */}
                  <motion.div 
                    className="absolute -top-7 -left-2.5 w-[170px] h-10 bg-rose-600 rounded-t-xl z-20 shadow-md flex items-center justify-center border border-rose-500"
                    style={{ transformOrigin: 'bottom center' }}
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                  >
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-7 bg-amber-400" />
                  </motion.div>

                  {/* Bow */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                    <svg width="70" height="36" viewBox="0 0 70 36" fill="none" className="filter drop-shadow-sm">
                      <path d="M35 24 C12 0, 5 36, 35 24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                      <path d="M35 24 C58 0, 65 36, 35 24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                      <circle cx="35" cy="24" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
                    </svg>
                  </div>

                  {/* Box Body */}
                  <div className="w-40 h-32 bg-rose-500 rounded-b-2xl relative z-10 shadow-lg overflow-hidden border border-rose-400">
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-7 bg-amber-400 shadow-inner" />
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-7 bg-amber-400 shadow-inner" />
                  </div>
                </motion.div>

                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mt-8 text-xs font-semibold text-rose-500 tracking-widest uppercase"
                >
                  Tap to open your gift ✨
                </motion.span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revealed Gift */}
        <AnimatePresence>
          {phase === 'revealed' && (
            <motion.div
              key="gift-revealed"
              initial={{ scale: 0, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 16, stiffness: 120 }}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-rose-100 relative"
            >
              <div className="h-3 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400" />
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-4">A Special Gift</h3>
                {gift?.bouquetUrl ? (
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.3 }}
                    className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-rose-50"
                  >
                    <img src={optimizeCloudinaryUrl(gift.bouquetUrl, 600)} alt="gift" className="w-full h-full object-contain" />
                  </motion.div>
                ) : (
                  <div className="w-full aspect-[4/3] rounded-2xl bg-rose-50 border-2 border-dashed border-rose-200 flex items-center justify-center text-4xl mb-5">💐</div>
                )}
                <h4 className="text-xl font-serif italic text-rose-800 mb-3">
                  For {gift?.recipient || 'My Love'} 💕
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap px-2">
                  {gift?.message || 'You deserve all the flowers in the world.'}
                </p>
              </div>
              <div className="h-2 bg-gradient-to-r from-pink-200 via-rose-200 to-pink-200" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Hero banner ───────────────────────────────────────────────────
function ValentineHero({ siteData, heroTitle }) {
  const heroTitleText = siteData.customTitles?.heroMainTitle || heroTitle || "Happy Valentine's Day";
  const heroWords = heroTitleText.split(' ');

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      {/* ── Romantic overlay on top of global fixed video ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(15,2,20,0.4) 0%, rgba(80,10,40,0.2) 50%, rgba(15,2,20,0.5) 100%)' }} />

      {/* ── Layer 2: Floating decorative emojis ── */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {['💕','🌹','💖','✨','💗','🌸'].map((e,i) => (
          <motion.span key={i} className="absolute text-2xl select-none"
            style={{ left:`${8+i*15}%`, top:`${10+i*8}%`, opacity: 0.18 }}
            animate={{ y:[0,-20,0], rotate:[0,15,-15,0] }}
            transition={{ duration:3+i*0.5, repeat:Infinity, delay:i*0.4 }}
          >{e}</motion.span>
        ))}
      </div>

      {/* ── Layer 3: Content ── */}
      <div className="relative z-[3] flex flex-col items-center">
        <motion.span className="text-7xl sm:text-9xl block mb-6 drop-shadow-2xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale:[1,1.08,1], opacity: 1 }}
          transition={{ scale: { duration:2, repeat:Infinity }, opacity: { duration: 0.6 } }}>
          {siteData.coupleEmoji || '💕'}
        </motion.span>

        {/* Staggered word-by-word title reveal */}
        <h1 className="text-5xl sm:text-7xl font-serif font-bold mb-4 leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          {heroWords.map((word, i) => (
            <motion.span key={i}
              className="inline-block mr-3"
              style={{ color: i === 1 ? '#fda4af' : '#ffffff', textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-lg sm:text-xl font-serif italic text-white/80 mb-2 drop-shadow"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}>
          {siteData.coupleName || 'Our Love Story'}
        </motion.p>

        {siteData.heroDate && (
          <motion.p className="text-xs text-pink-300/80 font-mono uppercase tracking-widest mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
            {siteData.heroDate}
          </motion.p>
        )}
        {(siteData.customTitles?.heroSubtitle || siteData.heroSubtitle) && (
          <motion.p className="text-base font-serif italic text-white/70 max-w-md mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
            "{siteData.customTitles?.heroSubtitle || siteData.heroSubtitle}"
          </motion.p>
        )}

        <motion.div className="flex justify-center gap-3 mt-4"
          initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.4 }}>
          {Array.from({length:5}).map((_,i)=>(
            <motion.div key={i} animate={{ y:[0,-6,0] }} transition={{ duration:1.2, repeat:Infinity, delay:i*0.15 }}>
              <Heart size={18} fill="#f43f5e" color="#f43f5e" />
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div className="mt-14 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
          <span className="text-white/40 text-[11px] font-bold uppercase tracking-[0.3em]">Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="w-px h-8 rounded-full" style={{ background: 'linear-gradient(to bottom, #fda4af80, transparent)' }} />
        </motion.div>
      </div>
    </section>
  );
}

// ── Main export ───────────────────────────────────────────────────
export default function TemplateValentine({ siteData, onUnlock }) {
  const [unlocked, setUnlocked] = useState(false);
  const val = siteData?.valentine || {};
  const matchImages = val.matchImages || [];
  const reasons = val.reasons || [];
  const scratchMemories = val.scratchMemories || [];

  // Opening lock screen always plays; we use fallback emojis if no custom match images are configured
  const skipLock = false;

  const colors = siteData?.themeColors?.valentine || {};
  const primaryColor = colors.primary || '#e11d48';
  const backgroundColor = colors.background || '#fff0f5';
  const cardColor = colors.cardColor || '#ffccd5';
  const onPrimaryColor = getContrastYIQ(primaryColor);

  // Compute background media once — fallback to high-quality romantic video if none uploaded
  const bgUrl = siteData?.heroBackgroundMediaUrl || 'https://res.cloudinary.com/demo/video/upload/q_auto,f_auto/v1689254848/video/couple-sunset.mp4';
  const isBgVideo = bgUrl && /\.(mp4|webm|ogg|mov)$/i.test(bgUrl.split('?')[0]);

  return (
    <div className="relative min-h-screen template-valentine-root">

      {/* ── Global Fixed Background (always mounted — shows through lockscreen too) ── */}
      {isBgVideo
        ? <video src={optimizeCloudinaryUrl(bgUrl, 1080)} autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none" />
        : bgUrl
        ? <img src={optimizeCloudinaryUrl(bgUrl, 1080)} alt="" className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none" />
        : <div className="fixed inset-0 z-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #1a0a1e 0%, #3b0d2a 45%, #1a0a1e 100%)' }} />
      }
      {/* Persistent dark romantic overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(15,2,20,0.6) 0%, rgba(60,5,30,0.4) 50%, rgba(15,2,20,0.65) 100%)' }} />

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div key="lock" className="relative z-10"
            exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.6 }}>
            <HeartMemoryMatch
              matchImages={matchImages}
              onComplete={() => { setUnlocked(true); if (onUnlock) onUnlock(); }}
              themeColors={siteData?.themeColors}
              customTitles={siteData?.customTitles}
            />
          </motion.div>
        ) : (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1 }}
      className="min-h-screen template-valentine-root relative z-10" style={{ background: 'transparent' }}>


      <style>{`
        .template-valentine-root {
          --primary-val: ${primaryColor};
          --bg-val: ${backgroundColor};
          --card-val: ${cardColor};
        }
        .template-valentine-root .bg-amber-400 {
          background-color: #fbbf24 !important;
        }
      `}</style>
      <ValentineHero siteData={siteData} heroTitle={siteData?.heroTitle} />
      <WhyILoveYou reasons={reasons} />
      <ScratchMemories scratchMemories={scratchMemories} customTitles={siteData?.customTitles} />
      <LoveLetter text={siteData.loveLetterText} coupleName={siteData.coupleName} />
      <VirtualGift gift={siteData.gift} />
      <ThingsToDoSection items={siteData.thingsToDo} themeColors={siteData.themeColors?.valentine} />

      {/* ── Valentine Exclusive Features ─────────────────── */}
      <LoveLock
        initials={siteData.loveLock?.initials}
        isEnabled={siteData.loveLock?.isEnabled}
      />
      <ReasonsJar reasons={siteData.reasonsJar} />
      <Heartbeat />
      <TimeCapsule
        unlockDate={siteData.timeCapsule?.unlockDate}
        message={siteData.timeCapsule?.message}
        mediaUrl={siteData.timeCapsule?.mediaUrl}
      />
      <footer className="text-center py-8 text-[10px] uppercase tracking-widest text-white/30 font-mono border-t border-white/10">
        © {new Date().getFullYear()} · Made with 💕 by EverWish
      </footer>
    </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
