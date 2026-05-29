import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Gift, Calendar } from 'lucide-react';
import ThingsToDoSection from './ThingsToDoSection';

// ── Confetti ──────────────────────────────────────────────────────
function Confetti({ active }) {
  const pieces = Array.from({ length: 80 }, (_, i) => ({
    id: i, x: Math.random() * 100,
    color: ['#f43f5e','#ec4899','#fb7185','#fbbf24','#a78bfa','#34d399','#60a5fa'][i % 7],
    delay: Math.random() * 1, duration: 1.5 + Math.random() * 1,
  }));
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <motion.div key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ y: '110vh', opacity: [1,1,0], rotate: 720, scale: [1,1.5,0.5] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{ position:'absolute', top:0, width:10, height:10, borderRadius:2, backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

// ── Section 1: Interactive Proposal Lockscreen ───────────────────
function ProposalLockscreen({ proposalText, themeColors, onAccept }) {
  const [yesScale, setYesScale] = useState(1);
  const [noPos, setNoPos]       = useState({ x: 0, y: 0 });
  const [confetti, setConfetti] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const attempts = useRef(0);

  const dodgeNo = useCallback(() => {
    attempts.current += 1;
    const maxX = window.innerWidth  * 0.7;
    const maxY = window.innerHeight * 0.7;
    const x = (Math.random() - 0.5) * maxX;
    const y = (Math.random() - 0.5) * maxY;
    setNoPos({ x, y });
    setYesScale(s => Math.min(s + 0.08, 2.5));
  }, []);

  const handleYes = () => {
    setConfetti(true);
    setAccepted(true);
    setTimeout(onAccept, 2200);
  };

  const primaryColor = themeColors?.primary || '#e11d48';
  const bgColor = themeColors?.background || '#fdf2f8';

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
      style={{ background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}d0 50%, #f0fdf4 100%)` }}
      animate={{ opacity: accepted ? 0 : 1 }}
      transition={{ delay: 1.8, duration: 0.4 }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&display=swap');
        .proposal-cursive { font-family: 'Dancing Script', cursive; }
      `}</style>
      <Confetti active={confetti} />

      {/* Floating petals bg */}
      {['🌸','💮','🌺','🌹','💐'].map((e,i) => (
        <motion.span key={i}
          className="absolute text-3xl opacity-15 pointer-events-none select-none"
          style={{ left:`${10+i*18}%`, top:`${15+i*14}%` }}
          animate={{ y:[0,-25,0], rotate:[0,20,-20,0] }}
          transition={{ duration:4+i, repeat:Infinity, delay:i*0.6 }}
        >{e}</motion.span>
      ))}

      <motion.div
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.8 }}
        className="text-center px-8 max-w-lg z-10"
      >
        {/* Dynamic lockscreen GIFs */}
        <div className="w-56 h-56 mx-auto mb-6 flex items-center justify-center overflow-hidden rounded-3xl bg-white/50 backdrop-blur-sm p-2 shadow-inner border border-white/20">
          <img 
            src={accepted ? "/celebrate.gif" : "/please.gif"} 
            alt="love-gif" 
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>

        <h1 className="proposal-cursive text-4xl sm:text-5xl leading-tight mb-12" style={{ color: primaryColor }}>
          {proposalText || 'Will you be my Valentine? 💕'}
        </h1>

        <div className="flex items-center justify-center gap-8 flex-wrap relative min-h-[80px]">
          {/* YES button */}
          <motion.button
            onClick={handleYes}
            style={{ scale: yesScale, backgroundColor: primaryColor }}
            whileHover={{ scale: yesScale * 1.05 }}
            whileTap={{ scale: yesScale * 0.95 }}
            className="text-white font-bold text-xl px-10 py-4 rounded-2xl shadow-xl shadow-rose-300/50 hover:shadow-rose-400/60 transition-shadow"
          >
            Yes! 💖
          </motion.button>

          {/* NO button – runs away */}
          <motion.button
            animate={{ x: noPos.x, y: noPos.y }}
            transition={{ type:'spring', stiffness:300, damping:20 }}
            onHoverStart={dodgeNo}
            onMouseEnter={dodgeNo}
            className="bg-slate-200 text-slate-500 font-bold text-xl px-10 py-4 rounded-2xl border-2 border-slate-300 cursor-not-allowed"
          >
            No 😢
          </motion.button>
        </div>

        {attempts.current > 2 && (
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="mt-8 text-sm text-rose-400 italic">
            The "No" button seems to disagree with itself... 😏
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Section 2: Scratch Gallery ────────────────────────────────────
function ProposalScratchCard({ imageUrl, caption, cardColor }) {
  const canvasRef   = useRef(null);
  const isDrawing   = useRef(false);
  const [scratched, setScratched] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Beautiful gradient cover
    const cardHex = cardColor || '#c084fc';
    const grad = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    grad.addColorStop(0, cardHex);
    grad.addColorStop(1, `${cardHex}dd`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch to Reveal ✨', canvas.width/2, canvas.height/2 - 10);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('A secret memory inside...', canvas.width/2, canvas.height/2 + 14);
  }, [cardColor]);

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x:(src.clientX-r.left)*(canvas.width/r.width), y:(src.clientY-r.top)*(canvas.height/r.height) };
  };

  const scratch = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI*2); ctx.fill();
    const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let t = 0;
    for (let i=3; i<data.length; i+=4) if (data[i]<128) t++;
    const p = Math.round((t/(canvas.width*canvas.height))*100);
    setPct(p);
    if (p > 55 && !scratched) setScratched(true);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-pink-100 bg-white">
      {imageUrl
        ? <img src={imageUrl} alt={caption||'memory'} className="w-full aspect-square object-cover" />
        : <div className="w-full aspect-square bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center text-5xl">💕</div>
      }
      <canvas ref={canvasRef} width={300} height={300}
        className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
        style={{ opacity: scratched ? 0 : 1, transition:'opacity 0.8s ease' }}
        onMouseDown={() => { isDrawing.current=true; }}
        onMouseMove={scratch} onMouseUp={() => { isDrawing.current=false; }}
        onMouseLeave={() => { isDrawing.current=false; }}
        onTouchStart={e => { e.preventDefault(); isDrawing.current=true; }}
        onTouchMove={e => { e.preventDefault(); scratch(e); }}
        onTouchEnd={() => { isDrawing.current=false; }}
      />
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-3">
          <p className="text-white text-xs font-medium truncate">{caption}</p>
        </div>
      )}
      {!scratched && (
        <div className="absolute top-2 right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: cardColor || '#c084fc' }}>
          {pct}%
        </div>
      )}
    </div>
  );
}

function ScratchGallery({ items, cardColor, themeColors }) {
  if (!items?.length) return null;
  return (
    <section className="py-20 px-6 relative" style={{ background: `linear-gradient(180deg, ${themeColors.background} 0%, ${themeColors.background}dd 100%)` }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: themeColors.primary }}>Our Memories</span>
          <h2 className="text-4xl font-serif mt-2 mb-3" style={{ color: themeColors.primary }}>Scratch to Reveal 💝</h2>
          <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: themeColors.primary }} />
        </motion.div>
        <div className="columns-2 sm:columns-3 gap-4 space-y-4">
          {items.map((item, i) => (
            <motion.div key={item.id || i}
              initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }}
              viewport={{ once:true }} transition={{ delay:i*0.08 }}
              className="break-inside-avoid"
            >
              <ProposalScratchCard imageUrl={item.imageUrl} caption={item.caption} cardColor={cardColor} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 3: Physical Love Letter ──────────────────────────────
function LoveLetter({ text, themeColors }) {
  if (!text) return null;
  return (
    <section className="py-20 px-6" style={{ background: `linear-gradient(180deg, #fff7f0 0%, ${themeColors.background}88 100%)` }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&display=swap'); .letter-font { font-family:'Caveat',cursive; }`}</style>
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: themeColors.primary }}>From My Heart</span>
          <h2 className="text-4xl font-serif mt-2" style={{ color: themeColors.primary }}>A Letter For You 💌</h2>
        </motion.div>
        <motion.div
          initial={{ opacity:0, rotate:-2, y:30 }}
          whileInView={{ opacity:1, rotate:-1.5, y:0 }}
          viewport={{ once:true }}
          transition={{ type:'spring', stiffness:80, damping:20 }}
          className="relative"
        >
          {/* Paper shadow layers */}
          <div className="absolute inset-0 translate-x-2 translate-y-2 bg-amber-200/30 rounded-lg" />
          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-amber-100/50 rounded-lg" />
          {/* Main letter */}
          <div className="relative bg-[#fffef0] border border-amber-200 rounded-lg px-10 py-12 shadow-xl"
            style={{ backgroundImage:'repeating-linear-gradient(transparent,transparent 31px,#fde68a55 31px,#fde68a55 32px)', backgroundSize:'100% 32px' }}>
            {/* Top wax seal decoration */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white text-lg shadow-md"
              style={{ backgroundColor: themeColors.primary }}>
              ❤️
            </div>
            <p className="letter-font text-xl text-amber-900 leading-relaxed whitespace-pre-line mt-4">
              {text}
            </p>
            <div className="text-right mt-8">
              <span className="letter-font text-amber-600 text-lg">With all my love 💕</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 4: Virtual Gift Box ───────────────────────────────────
function VirtualGiftBox({ giftImageUrl, giftMessage, themeColors }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="py-20 px-6 text-center" style={{ background: `linear-gradient(180deg, ${themeColors.background} 0%, #fff0f5 100%)` }}>
      <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: themeColors.primary }}>A Surprise For You</span>
        <h2 className="text-4xl font-serif mt-2" style={{ color: themeColors.primary }}>Your Special Gift 🎁</h2>
      </motion.div>

      <motion.div
        initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }}
        viewport={{ once:true }} transition={{ type:'spring', stiffness:100 }}
        className="inline-block cursor-pointer" onClick={() => setOpen(true)}
      >
        <motion.div
          whileHover={{ rotate:[0,-3,3,-3,3,0], transition:{ duration:0.5, repeat:Infinity } }}
          className="relative w-40 h-40 mx-auto"
        >
          {/* Lid */}
          <motion.div whileHover={{ y:-10 }} transition={{ type:'spring', stiffness:300, damping:10 }}
            className="absolute -top-7 -left-2.5 w-[170px] h-10 rounded-t-xl z-20 shadow-md flex items-center justify-center"
            style={{ transformOrigin:'bottom center', backgroundColor: themeColors.primary }}>
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-7 bg-amber-400" />
          </motion.div>
          {/* Bow */}
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <svg width="70" height="36" viewBox="0 0 70 36" fill="none">
              <path d="M35 24 C12 0, 5 36, 35 24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
              <path d="M35 24 C58 0, 65 36, 35 24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
              <circle cx="35" cy="24" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5"/>
            </svg>
          </div>
          {/* Box body */}
          <div className="w-40 h-32 rounded-b-2xl relative z-10 shadow-lg overflow-hidden border"
            style={{ backgroundColor: themeColors.primary, borderColor: themeColors.primary }}>
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-7 bg-amber-400 shadow-inner" />
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-7 bg-amber-400 shadow-inner" />
          </div>
        </motion.div>
        <p className="mt-10 text-xs font-semibold tracking-widest animate-pulse uppercase" style={{ color: themeColors.primary }}>Tap to open your gift 🎁</p>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
            <motion.div
              initial={{ scale:0.4, y:80, opacity:0 }} animate={{ scale:1, y:0, opacity:1 }}
              exit={{ scale:0.6, opacity:0 }} transition={{ type:'spring', damping:18, stiffness:90 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-rose-100 relative">
              <button onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-400 transition z-10">
                <X size={16} />
              </button>
              <div className="h-3 bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.primary}bb, ${themeColors.primary})` }} />
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: themeColors.primary }}>A Special Gift</h3>
                {giftImageUrl && (
                  <div className="w-full aspect-square rounded-2xl overflow-hidden mb-5 bg-rose-50">
                    <img src={giftImageUrl} alt="gift" className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-slate-700 font-serif italic text-lg leading-relaxed">
                  {giftMessage || 'You deserve all the love in the world 💖'}
                </p>
                <div className="mt-6 flex justify-center gap-1">
                  {['💕','🌹','💖','✨','💗'].map((e,i) => (
                    <motion.span key={i} animate={{ y:[0,-6,0] }} transition={{ duration:1.2, repeat:Infinity, delay:i*0.15 }} className="text-lg">{e}</motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Section 5: Date Planner ───────────────────────────────────────
function DatePlanner({ activities, foods, themeColors }) {
  const [selActivity, setSelActivity] = useState(null);
  const [selFood, setSelFood]         = useState(null);
  const [confirmed, setConfirmed]     = useState(false);
  const [confetti, setConfetti]       = useState(false);

  const acts  = activities?.length ? activities : ['Movies 🎬','Dinner 🍽️','Picnic 🌸','Stargazing ✨'];
  const fds   = foods?.length      ? foods      : ['Pizza 🍕','Sushi 🍣','Chocolate 🍫','Ice Cream 🍦'];

  const handleConfirm = () => {
    if (!selActivity || !selFood) return;
    setConfetti(true);
    setTimeout(() => setConfirmed(true), 400);
  };

  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: `linear-gradient(180deg, #f0fdf4 0%, ${themeColors.background} 100%)` }}>
      <Confetti active={confetti} />
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="mb-12">
          <Calendar className="mx-auto mb-3" size={32} style={{ color: themeColors.primary }} />
          <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: themeColors.primary }}>Plan Together</span>
          <h2 className="text-4xl font-serif mt-2" style={{ color: themeColors.primary }}>Let's Plan Our Date 💚</h2>
          <div className="w-16 h-0.5 mx-auto mt-4" style={{ backgroundColor: themeColors.primary }} />
        </motion.div>

        <AnimatePresence mode="wait">
          {!confirmed ? (
            <motion.div key="planner" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, scale:0.9 }}>
              {/* Activities */}
              <div className="mb-8">
                <p className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: themeColors.primary }}>What shall we do?</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {acts.map((a,i) => (
                    <motion.button key={i}
                      onClick={() => setSelActivity(a)}
                      whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                      style={selActivity===a ? { backgroundColor: themeColors.primary, borderColor: themeColors.primary } : {}}
                      className={`px-5 py-2.5 rounded-full font-semibold text-sm border-2 transition-all ${
                        selActivity===a
                          ? 'text-white shadow-lg'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >{a}</motion.button>
                  ))}
                </div>
              </div>
              {/* Foods */}
              <div className="mb-10">
                <p className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: themeColors.primary }}>What shall we eat?</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {fds.map((f,i) => (
                    <motion.button key={i}
                      onClick={() => setSelFood(f)}
                      whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                      style={selFood===f ? { backgroundColor: themeColors.primary, borderColor: themeColors.primary } : {}}
                      className={`px-5 py-2.5 rounded-full font-semibold text-sm border-2 transition-all ${
                        selFood===f
                          ? 'text-white shadow-lg'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                      }`}
                    >{f}</motion.button>
                  ))}
                </div>
              </div>
              <motion.button
                onClick={handleConfirm}
                disabled={!selActivity || !selFood}
                style={selActivity && selFood ? { backgroundColor: themeColors.primary } : {}}
                whileHover={selActivity && selFood ? { scale:1.05 } : {}}
                whileTap={selActivity && selFood ? { scale:0.95 } : {}}
                className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all ${
                  selActivity && selFood
                    ? 'text-white shadow-xl cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >Confirm Our Date 💚</motion.button>
            </motion.div>
          ) : (
            <motion.div key="confirmed"
              initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }}
              transition={{ type:'spring', stiffness:200, damping:15 }}
              className="py-10"
            >
              <motion.div animate={{ scale:[1,1.2,1] }} transition={{ duration:1.5, repeat:Infinity }}>
                <div className="text-7xl mb-6">💖</div>
              </motion.div>
              <h3 className="text-4xl font-serif mb-4" style={{ color: themeColors.primary }}>It's a Date! 💖</h3>
              <p className="text-lg font-medium mb-2" style={{ color: themeColors.primary }}>
                {selActivity} <span className="text-slate-400">+</span> {selFood}
              </p>
              <p className="text-sm italic" style={{ color: themeColors.primary }}>Can't wait for our perfect date together ✨</p>
              <div className="flex justify-center gap-2 mt-8">
                {['💕','🌿','💚','✨','💗'].map((e,i) => (
                  <motion.span key={i} animate={{ y:[0,-8,0] }} transition={{ duration:1.2, repeat:Infinity, delay:i*0.2 }} className="text-2xl">{e}</motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Main Export ───────────────────────────────────────────────────
export default function TemplateProposal({ siteData, onUnlock }) {
  const [unlocked, setUnlocked] = useState(false);
  const p = siteData?.proposal || {};
  const themeColors = siteData?.themeColors?.proposal || {
    primary: '#e11d48',
    background: '#fdf2f8',
    cardColor: '#c084fc'
  };

  if (!unlocked) {
    return (
      <ProposalLockscreen
        proposalText={p.proposalText || 'Will you be my Valentine? 💕'}
        themeColors={themeColors}
        onAccept={() => {
          setUnlocked(true);
          if (onUnlock) onUnlock();
        }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8 }}
      className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,500&display=swap');
        .proposal-root h1, .proposal-root h2, .proposal-root h3 {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
      <div className="proposal-root">
        <ScratchGallery items={p.scratchGallery} cardColor={themeColors.cardColor} themeColors={themeColors} />
        <LoveLetter text={p.loveLetter} themeColors={themeColors} />
        <VirtualGiftBox giftImageUrl={p.giftImageUrl} giftMessage={p.giftMessage} themeColors={themeColors} />
        <DatePlanner activities={p.activities} foods={p.foods} themeColors={themeColors} />
        <ThingsToDoSection items={siteData.thingsToDo} themeColors={themeColors} />
        <footer className="text-center py-8 text-[10px] uppercase tracking-widest text-rose-300 font-mono border-t border-rose-100"
          style={{ background: themeColors.background }}>
          © {new Date().getFullYear()} · Made with 💕 by EverWish
        </footer>
      </div>
    </motion.div>
  );
}
