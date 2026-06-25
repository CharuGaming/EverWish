import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import ThingsToDoSection from './ThingsToDoSection';
import { optimizeCloudinaryUrl } from '../utils/imageHelpers';
import BorderGlow from './BorderGlow';

// ── Shared helpers ──────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Lockscreen 1: Standard Tap ──────────────────────────────────────
function TapLockscreen({ prompt, onUnlock, primary }) {
  const [taps, setTaps] = useState(0);
  const MAX = 10;

  const handleTap = () => {
    const next = taps + 1;
    setTaps(next);
    if (next >= MAX) onUnlock();
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center select-none cursor-pointer relative overflow-hidden"
      style={{ background: '#fff0f5' }}
      onClick={handleTap}
    >
      <motion.div
        className="absolute inset-0 origin-bottom"
        style={{ backgroundColor: primary || '#e11d48', scaleY: taps / MAX }}
        animate={{ scaleY: taps / MAX }}
        transition={{ type: 'spring', stiffness: 200 }}
      />
      <div className="relative z-10 text-center px-6">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-6xl mb-6">💕</motion.div>
        <h1 className="text-2xl font-bold text-rose-700 mb-3">{prompt || 'Tap until the screen is full red'}</h1>
        <p className="text-sm text-rose-400">{MAX - taps} taps remaining</p>
      </div>
    </motion.div>
  );
}

// ── Lockscreen 2: Love Meter ────────────────────────────────────────
function MeterLockscreen({ prompt, onUnlock, primary }) {
  const [fill, setFill] = useState(0);

  const handleTap = () => {
    setFill(f => {
      const next = Math.min(f + 8, 100);
      if (next >= 100) setTimeout(onUnlock, 600);
      return next;
    });
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center select-none cursor-pointer"
      style={{ background: '#fff0f5' }}
      onClick={handleTap}
    >
      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-6xl mb-8">💗</motion.div>
      <h1 className="text-xl font-bold text-rose-700 mb-8 text-center px-6">{prompt || 'Tap to fill the love meter!'}</h1>
      <div className="w-64 h-8 bg-rose-100 rounded-full overflow-hidden border-2 border-rose-300 shadow-inner mb-4">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: primary || '#e11d48' }} animate={{ width: `${fill}%` }} transition={{ type: 'spring', stiffness: 300 }} />
      </div>
      <p className="text-sm text-rose-400 font-medium">{fill}% love</p>
    </motion.div>
  );
}

// ── Lockscreen 3: Memory Match ──────────────────────────────────────
const HEART_POSITIONS = [
  { col: 2, row: 1 }, { col: 4, row: 1 },
  { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 4, row: 2 }, { col: 5, row: 2 },
  { col: 2, row: 3 }, { col: 3, row: 3 }, { col: 4, row: 3 },
  { col: 3, row: 4 },
];
const FALLBACK_EMOJIS = ['💖', '🌹', '🧸', '🍫', '💍'];

function MemoryLockscreen({ matchImages, onUnlock, primary, cardColor, siteData }) {
  const imgs = (matchImages && matchImages.filter(Boolean).length >= 5)
    ? matchImages.slice(0, 5) : Array.from({ length: 5 }, () => '');

  const [cards] = useState(() => shuffle([...imgs, ...imgs].map((url, i) => ({ id: i, imageUrl: url, pairIndex: i % 5 }))));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [locked, setLocked] = useState(false);

  const handleFlip = useCallback((idx) => {
    if (locked || flipped.includes(idx) || matched.includes(cards[idx].id)) return;
    const next = [...flipped, idx];
    setFlipped(next);
    if (next.length === 2) {
      setLocked(true);
      const [a, b] = next;
      if (cards[a].pairIndex === cards[b].pairIndex) {
        const nm = [...matched, cards[a].id, cards[b].id];
        setMatched(nm);
        setFlipped([]);
        setLocked(false);
        if (nm.length === cards.length) setTimeout(onUnlock, 800);
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false); }, 900);
      }
    }
  }, [locked, flipped, matched, cards, onUnlock]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#fff0f5' }}>
      <h1 className="text-3xl font-bold text-rose-600 mb-2">{siteData?.customTitles?.gameSectionTitle || "For My Valentine ❤️"}</h1>
      <p className="text-sm text-slate-600 mb-10">Match the pairs to unlock a surprise...</p>
      <div className="relative scale-[0.85] sm:scale-100" style={{ width: 4 * 64 + 56, height: 3 * 64 + 56 }}>
        {HEART_POSITIONS.map((pos, i) => {
          const card = cards[i];
          const isFlipped = flipped.includes(i);
          const isMatched = matched.includes(card.id);
          return (
            <div key={i} style={{ position: 'absolute', left: (pos.col - 1) * 64, top: (pos.row - 1) * 64 }}>
              <motion.div onClick={() => handleFlip(i)} className="relative cursor-pointer" style={{ width: 56, height: 56, perspective: 600 }} whileTap={{ scale: 0.92 }}>
                <motion.div animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }} transition={{ duration: 0.4 }} style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}>
                  <div style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0, backgroundColor: cardColor || '#ffccd5', borderRadius: 12 }} />
                  <div style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0, transform: 'rotateY(180deg)', borderRadius: 12, overflow: 'hidden', border: `2px solid ${isMatched ? '#4ade80' : '#fda4af'}` }}>
                    {card.imageUrl
                      ? <img loading="lazy" src={optimizeCloudinaryUrl(card.imageUrl, 200)} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-rose-100 flex items-center justify-center text-2xl">{FALLBACK_EMOJIS[card.pairIndex]}</div>}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Lockscreen 4: Dodging Button ────────────────────────────────────
function DodgingLockscreen({ proposalText, onUnlock, primary, siteData }) {
  const [yesScale, setYesScale] = useState(1);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);

  const dodge = () => {
    const x = (Math.random() - 0.5) * (window.innerWidth * 0.7);
    const y = (Math.random() - 0.5) * (window.innerHeight * 0.7);
    setNoPos({ x, y });
    setYesScale(s => Math.min(s + 0.08, 2.5));
  };

  const handleYes = () => {
    setAccepted(true);
    setTimeout(onUnlock, 1800);
  };

  return (
    <motion.div className="min-h-screen flex flex-col items-center justify-center select-none" style={{ background: '#fdf2f8' }} animate={{ opacity: accepted ? 0 : 1 }} transition={{ delay: 1.4, duration: 0.4 }}>
      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-6xl mb-8">{accepted ? '🎉' : '💕'}</motion.div>
      <h1 className="text-3xl font-bold mb-12 text-center px-8" style={{ color: primary || '#e11d48', fontFamily: 'Dancing Script, cursive' }}>
        {siteData?.customTitles?.heroMainTitle || proposalText || 'Will you be my Valentine? 💕'}
      </h1>
      <div className="flex gap-8 items-center relative min-h-[80px]">
        <motion.button onClick={handleYes} className="px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl" style={{ backgroundColor: primary || '#e11d48', scale: yesScale }}>Yes! 💖</motion.button>
        <motion.button onMouseEnter={dodge} onTouchStart={dodge} animate={noPos} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="px-8 py-4 rounded-2xl bg-slate-200 text-slate-700 font-bold text-lg">No</motion.button>
      </div>
    </motion.div>
  );
}

// ── Module: Scratch Gallery ─────────────────────────────────────────
function ScratchCard({ imageUrl, caption }) {
  const canvasRef = useRef(null);
  const [scratched, setScratched] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f9a8d4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#be185d';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch Me! ✨', canvas.width / 2, canvas.height / 2);
  }, []);

  const scratch = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
    const y = (e.touches?.[0]?.clientY ?? e.clientY) - rect.top;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const transparent = [...data].filter((_, i) => i % 4 === 3 && data[i] === 0).length;
    if (transparent / (canvas.width * canvas.height) > 0.55) setScratched(true);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ width: 200, height: 200 }}>
      {imageUrl
        ? <img loading="lazy" src={optimizeCloudinaryUrl(imageUrl, 400)} alt="" className="absolute inset-0 w-full h-full object-cover" />
        : <div className="absolute inset-0 bg-rose-100 flex items-center justify-center text-5xl">💕</div>}
      {!scratched && (
        <canvas ref={canvasRef} width={200} height={200} className="absolute inset-0 touch-none cursor-crosshair"
          onMouseDown={() => { isDrawing.current = true; }}
          onMouseMove={scratch}
          onMouseUp={() => { isDrawing.current = false; }}
          onTouchStart={() => { isDrawing.current = true; }}
          onTouchMove={scratch}
          onTouchEnd={() => { isDrawing.current = false; }}
        />
      )}
      {scratched && caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-2 px-2">{caption}</div>
      )}
    </div>
  );
}

function ScratchGalleryModule({ items, primary, siteData }) {
  if (!items?.length) return null;
  return (
    <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="py-20 px-6 text-center">
      <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: primary }}>Memories</span>
      <h2 className="text-4xl font-serif mt-2 mb-12" style={{ color: primary }}>{siteData?.customTitles?.gallerySectionTitle || "Scratch to Reveal 💝"}</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {items.map((item, i) => <ScratchCard key={i} imageUrl={item.imageUrl} caption={item.caption} />)}
      </div>
    </motion.section>
  );
}

// ── Module: Milestones ──────────────────────────────────────────────
function MilestonesModule({ milestones, primary }) {
  if (!milestones?.length) return null;
  return (
    <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: primary }}>Our Journey</span>
        <h2 className="text-4xl font-serif mt-2" style={{ color: primary }}>Our Love Story 💕</h2>
      </div>
      <div className="max-w-xl mx-auto space-y-8 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5" style={{ backgroundColor: primary, opacity: 0.2 }} />
        {milestones.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: m.alignment === 'right' ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className={`flex ${m.alignment === 'right' ? 'justify-end' : 'justify-start'} relative z-10`}>
            <div className="bg-white rounded-2xl shadow-lg p-5 max-w-xs border border-rose-100">
              {m.imageUrl && <img loading="lazy" src={optimizeCloudinaryUrl(m.imageUrl, 400)} alt="" className="w-full h-32 object-cover rounded-xl mb-3" />}
              <p className="text-xs font-mono text-rose-400 mb-1">{m.date}</p>
              <p className="font-bold text-slate-800">{m.title}</p>
              {m.description && <p className="text-sm text-slate-500 mt-1">{m.description}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ── Module: Why I Love You ──────────────────────────────────────────
function WhyILoveYouModule({ reasons, primary }) {
  if (!reasons?.length) return null;
  return (
    <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: primary }}>From the heart</span>
        <h2 className="text-4xl font-serif mt-2 mb-12" style={{ color: primary }}>Why I Love You 💗</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reasons.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.03 }} className="bg-white rounded-2xl p-5 shadow-md border border-rose-100 text-left relative">
              <span className="absolute -top-3 -left-2 text-xl">💗</span>
              <p className="text-slate-700 font-serif italic leading-relaxed pl-2">{r}</p>
              <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest mt-2 block">#{i + 1}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ── Module: Date Planner ────────────────────────────────────────────
function DatePlannerModule({ activities, foods, primary, siteData }) {
  const [selActivity, setSelActivity] = useState(null);
  const [selFood, setSelFood] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const acts = activities?.length ? activities : ['Movies 🎬', 'Dinner 🍽️', 'Picnic 🌸', 'Stargazing ✨'];
  const fds = foods?.length ? foods : ['Pizza 🍕', 'Sushi 🍣', 'Chocolate 🍫', 'Ice Cream 🍦'];

  if (!activities?.length && !foods?.length) return null;

  return (
    <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl font-serif mb-12" style={{ color: primary }}>{siteData?.customTitles?.gameSectionTitle || "Let's Plan Our Date 💚"}</h2>
        <AnimatePresence mode="wait">
          {!confirmed ? (
            <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: primary }}>What shall we do?</p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {acts.map((a, i) => (
                  <button key={i} onClick={() => setSelActivity(a)}
                    className={`px-5 py-2.5 rounded-full font-semibold text-sm border-2 transition-all ${selActivity === a ? 'text-white shadow-lg' : 'bg-white border-slate-200 text-slate-700'}`}
                    style={selActivity === a ? { backgroundColor: primary, borderColor: primary } : {}}>{a}</button>
                ))}
              </div>
              <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: primary }}>What shall we eat?</p>
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {fds.map((f, i) => (
                  <button key={i} onClick={() => setSelFood(f)}
                    className={`px-5 py-2.5 rounded-full font-semibold text-sm border-2 transition-all ${selFood === f ? 'text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600'}`}
                    style={selFood === f ? { backgroundColor: primary, borderColor: primary } : {}}>{f}</button>
                ))}
              </div>
              <button onClick={() => setConfirmed(true)} disabled={!selActivity || !selFood}
                className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all ${selActivity && selFood ? 'text-white shadow-xl' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                style={selActivity && selFood ? { backgroundColor: primary } : {}}>Confirm Our Date 💚</button>
            </motion.div>
          ) : (
            <motion.div key="confirmed" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="py-10">
              <div className="text-7xl mb-6">💖</div>
              <h3 className="text-4xl font-serif mb-3" style={{ color: primary }}>It's a Date! 💖</h3>
              <p className="text-lg font-medium" style={{ color: primary }}>{selActivity} + {selFood}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

// ── Module: Virtual Gift — Explosion Reveal ─────────────────────────
function VirtualGiftModule({ giftImageUrl, giftMessage, primary }) {
  const [phase, setPhase] = useState('closed'); // closed | exploding | revealed

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
        color: [primary || "#e11d48","#f43f5e","#fb7185","#fda4af","#fbbf24","#f59e0b"][Math.floor(Math.random() * 6)],
      };
    });
    return { particles, fragments };
  });

  if (!giftImageUrl && !giftMessage) return null;

  const handleOpen = () => {
    if (phase !== 'closed') return;
    setPhase('exploding');
    setTimeout(() => setPhase('revealed'), 900);
  };

  return (
    <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="py-20 px-6 text-center relative overflow-hidden">
      <h2 className="text-4xl font-serif mb-10" style={{ color: primary }}>A Gift Just for You 🎁</h2>

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

        {/* Gift Box (closed) */}
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
              className="cursor-pointer select-none flex flex-col items-center"
            >
              <motion.div
                whileHover={{ rotate: [0, -3, 3, -3, 3, 0], transition: { duration: 0.5, repeat: Infinity } }}
                whileTap={{ scale: 0.92 }}
                className="relative w-40 h-40"
              >
                {/* Lid */}
                <div className="absolute -top-7 -left-2.5 w-[170px] h-10 rounded-t-xl z-20 shadow-md flex items-center justify-center"
                  style={{ backgroundColor: primary || '#e11d48' }}>
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-7 bg-amber-400" />
                </div>
                {/* Bow */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                  <svg width="70" height="36" viewBox="0 0 70 36" fill="none">
                    <path d="M35 24 C12 0, 5 36, 35 24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
                    <path d="M35 24 C58 0, 65 36, 35 24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
                    <circle cx="35" cy="24" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5"/>
                  </svg>
                </div>
                {/* Box Body */}
                <div className="w-40 h-32 rounded-b-2xl relative z-10 shadow-lg overflow-hidden border"
                  style={{ backgroundColor: primary || '#e11d48', borderColor: primary || '#e11d48' }}>
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-7 bg-amber-400 shadow-inner" />
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-7 bg-amber-400 shadow-inner" />
                </div>
              </motion.div>
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-8 text-xs font-semibold tracking-widest uppercase"
                style={{ color: primary }}
              >Tap to open your gift ✨</motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revealed Gift */}
        <AnimatePresence>
          {phase === 'revealed' && (
            <motion.div
              key="gift-revealed"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="max-w-sm mx-auto"
            >
              {giftImageUrl && (
                <motion.img
                  src={giftImageUrl}
                  alt="gift"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.3 }}
                  className="w-full h-64 object-cover rounded-3xl shadow-2xl mb-6"
                />
              )}
              {giftMessage && <p className="text-lg font-serif italic text-slate-700 leading-relaxed">{giftMessage}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

// ── Main Export ─────────────────────────────────────────────────────
export default function TemplateCustom({ siteData, onUnlock }) {
  const [unlocked, setUnlocked] = useState(false);
  const cm = siteData?.customModules || {};
  const colors = siteData?.themeColors?.custom || {};
  const primary = colors.primary || '#e11d48';
  const background = colors.background || '#fff0f5';
  const cardColor = colors.cardColor || '#ffccd5';

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
    if (onUnlock) onUnlock();
  }, [onUnlock]);

  // Render lockscreen based on type
  if (!unlocked) {
    const lockType = cm.lockscreenType || 'tap';
    if (lockType === 'memory') {
      return <MemoryLockscreen matchImages={siteData?.valentine?.matchImages} onUnlock={handleUnlock} primary={primary} cardColor={cardColor} siteData={siteData} />;
    }
    if (lockType === 'meter') {
      return <MeterLockscreen prompt={siteData?.lockScreenPrompt} onUnlock={handleUnlock} primary={primary} />;
    }
    if (lockType === 'dodging') {
      return <DodgingLockscreen proposalText={siteData?.proposal?.proposalText} onUnlock={handleUnlock} primary={primary} siteData={siteData} />;
    }
    // Default: tap
    return <TapLockscreen prompt={siteData?.lockScreenPrompt} onUnlock={handleUnlock} primary={primary} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      className="min-h-screen" style={{ background }}>

      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-5xl">{siteData?.coupleEmoji || '💌'}</span>
          <h1 className="text-5xl font-serif mt-4 mb-2" style={{ color: primary }}>{siteData?.customTitles?.heroMainTitle || siteData?.coupleName || 'Our Love Story'}</h1>
          {siteData?.heroDate && <p className="text-sm font-mono uppercase tracking-widest mt-2" style={{ color: primary }}>{siteData.heroDate}</p>}
          {(siteData?.customTitles?.heroSubtitle || siteData?.heroSubtitle) && <p className="text-base font-serif italic mt-4 max-w-md mx-auto text-slate-600">"{siteData.customTitles?.heroSubtitle || siteData.heroSubtitle}"</p>}
          {siteData?.loveLetterText && (
            <div className="max-w-lg mx-auto mt-8">
              <BorderGlow
                edgeSensitivity={30}
                glowColor="350 80 80"
                backgroundColor="rgba(255, 255, 255, 0.85)"
                borderRadius={24}
                glowRadius={35}
                glowIntensity={1.0}
                colors={['#f43f5e', '#ec4899', '#a855f7']}
                className="w-full text-left"
              >
                <div className="p-6">
                  <p className="font-serif italic text-slate-700 leading-relaxed whitespace-pre-wrap">{siteData.loveLetterText}</p>
                </div>
              </BorderGlow>
            </div>
          )}
        </motion.div>
      </section>

      {/* Conditional Modules */}
      {cm.showMilestones     && <MilestonesModule milestones={siteData?.milestones} primary={primary} />}
      {cm.showScratchGallery && <ScratchGalleryModule items={siteData?.valentine?.scratchMemories} primary={primary} siteData={siteData} />}
      {cm.showWhyILoveYou    && <WhyILoveYouModule reasons={siteData?.valentine?.reasons} primary={primary} />}
      {cm.showDatePlanner    && <DatePlannerModule activities={siteData?.proposal?.activities} foods={siteData?.proposal?.foods} primary={primary} siteData={siteData} />}
      {cm.showVirtualGift    && <VirtualGiftModule giftImageUrl={siteData?.gift?.bouquetUrl || siteData?.proposal?.giftImageUrl} giftMessage={siteData?.gift?.message || siteData?.proposal?.giftMessage} primary={primary} />}

      {/* Things To Do */}
      {siteData?.thingsToDo?.length > 0 && <ThingsToDoSection items={siteData.thingsToDo} themeColors={{ primary, background }} />}

      <footer className="text-center py-8 text-[10px] uppercase tracking-widest font-mono border-t" style={{ color: primary, borderColor: `${primary}30`, background }}>
        © {new Date().getFullYear()} · Made with 💕 by EverWish
      </footer>
    </motion.div>
  );
}
