import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Heart, Star, MessageCircle, Mail, Share2, Eye,
  ChevronDown, Sparkles, Gift, PartyPopper, ArrowRight, Check, Loader2, X
} from 'lucide-react';
import PreviewModal from '../components/PreviewModal';
import { getStorefront } from '../api';

// ── Data ─────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '94XXXXXXXXX'; // TODO: replace with real number

const TEMPLATES = {
  valentine: [
    {
      id: 'v1', name: 'The Polaroid Love Story', price: 'Rs. 2,500',
      emoji: '📸', tag: 'Bestseller',
      desc: 'Vintage polaroid gallery with a love-letter reveal.',
      gradient: 'from-rose-400 to-pink-500',
    },
    {
      id: 'v2', name: 'The Modern Romance', price: 'Rs. 2,500',
      emoji: '💫', tag: 'Elegant',
      desc: 'Sleek, cinematic design with smooth scroll sections.',
      gradient: 'from-purple-400 to-rose-400',
    },
    {
      id: 'v3', name: 'The Valentine Experience', price: 'Rs. 3,000',
      emoji: '💝', tag: 'Interactive',
      desc: 'Interactive floating hearts, surprise gifts & confetti.',
      gradient: 'from-red-400 to-rose-500',
    },
    {
      id: 'v4', name: 'The Proposal Suite', price: 'Rs. 3,500',
      emoji: '💍', tag: 'Premium',
      desc: 'A full proposal journey — question, countdown & ring reveal.',
      gradient: 'from-rose-500 to-amber-400',
    },
  ],
  birthday: [
    {
      id: 'b1', name: 'The Unwrapping Experience', price: 'Rs. 2,500',
      emoji: '🎁', tag: 'Fun',
      desc: 'Tap to unwrap a digital birthday gift box with wishes inside.',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      id: 'b2', name: 'The Balloon Pop', price: 'Rs. 2,500',
      emoji: '🎈', tag: 'Playful',
      desc: 'Pop colourful balloons to reveal personalised messages.',
      gradient: 'from-sky-400 to-violet-500',
    },
    {
      id: 'b3', name: 'The Card Flip', price: 'Rs. 2,500',
      emoji: '🃏', tag: 'Classic',
      desc: 'Elegant flip-card gallery with a heartfelt birthday note.',
      gradient: 'from-emerald-400 to-teal-500',
    },
    {
      id: 'b4', name: 'The Surprise Party', price: 'Rs. 3,000',
      emoji: '🎉', tag: 'Immersive',
      desc: 'Full party experience with confetti, music & a wishes wall.',
      gradient: 'from-fuchsia-400 to-pink-500',
    },
  ],
};

const TESTIMONIALS = [
  {
    name: 'Maleesha R.',
    avatar: '👩',
    rating: 5,
    text: 'I gifted my boyfriend the Proposal Suite and he was absolutely speechless! Every detail was perfect. EverWish made it magical.',
    tag: 'Proposal Suite',
  },
  {
    name: 'Kavindu S.',
    avatar: '👨',
    rating: 5,
    text: 'The Balloon Pop birthday page for my best friend had everyone at the party screaming with joy. Worth every rupee!',
    tag: 'Balloon Pop',
  },
  {
    name: 'Anuki P.',
    avatar: '👩‍🦱',
    rating: 5,
    text: 'Setup was so fast and the support was amazing. My partner cried happy tears — mission accomplished 😭❤️',
    tag: 'Polaroid Love Story',
  },
  {
    name: 'Tharindu M.',
    avatar: '🧑',
    rating: 5,
    text: 'A completely unique gift idea. I\'ve used EverWish twice now and will definitely keep coming back for every occasion!',
    tag: 'The Unwrapping',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────
function waLink(templateName) {
  const msg = encodeURIComponent(`Hello! I'd like to purchase the *${templateName}* template on EverWish. 😊`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

// ── Animation variants ────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' } }),
};

// ── Section wrapper with scroll-reveal ───────────────────────────────
function Section({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ── Template Card ─────────────────────────────────────────────────────
function TemplateCard({ tpl, index, onPreview }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.15}
      className="group relative flex flex-col bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl overflow-hidden shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-rose-200/40 hover:-translate-y-2 transition-all duration-300 h-full"
    >
      {/* Thumbnail */}
      <div className={`relative h-44 bg-gradient-to-br ${tpl.gradient} flex items-center justify-center overflow-hidden shrink-0`}>
        <span className="text-7xl select-none drop-shadow-lg group-hover:scale-110 transition-transform duration-500">{tpl.emoji}</span>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
        {/* Tag badge */}
        <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/40 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
          {tpl.tag}
        </span>
        {/* Preview overlay on hover */}
        <button
          onClick={() => onPreview(tpl.id)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          <Eye size={28} className="text-white drop-shadow" />
          <span className="text-white text-xs font-bold uppercase tracking-widest">Live Preview</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base mb-1 leading-snug">{tpl.name}</h3>
          <p className="text-slate-500 text-xs mb-4 leading-relaxed">{tpl.desc}</p>
        </div>
        <div className="flex flex-col gap-3 mt-auto pt-2">
          <div className="flex items-center justify-between border-t border-slate-100/50 pt-3">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Price</span>
            <span className="text-rose-600 font-extrabold text-lg">{tpl.price}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Preview button */}
            <button
              onClick={() => onPreview(tpl.id)}
              className="flex items-center justify-center gap-1 bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50/20 text-slate-700 hover:text-rose-600 text-xs font-bold py-2.5 rounded-2xl shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Live Preview"
            >
              <Eye size={13} />
              Preview
            </button>
            {/* Buy Now button */}
            <a
              href={waLink(tpl.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold py-2.5 rounded-2xl shadow-md shadow-rose-400/20 transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle size={13} strokeWidth={2.5} />
              Buy Now
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Stars ─────────────────────────────────────────────────────────────
function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────
export default function Storefront() {
  const [activeTab, setActiveTab]     = useState('valentine');
  const [preview, setPreview]         = useState({ isOpen: false, templateId: null });
  const [storefrontData, setStorefrontData] = useState({ templates: [], testimonials: [] });
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState(null);
  const shopRef = useRef(null);

  useEffect(() => {
    getStorefront().then(res => {
      if (res.data) setStorefrontData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const openPreview  = (id) => setPreview({ isOpen: true,  templateId: id });
  const closePreview = ()   => setPreview({ isOpen: false, templateId: null });

  const scrollToShop = () => shopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 font-sans overflow-x-hidden">

      {/* ── Floating decorative blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-rose-200/30 blur-[100px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-pink-200/30 blur-[100px]" />
      </div>

      {/* ════════════════════════════════
           NAV
      ════════════════════════════════ */}
      <nav className="sticky top-0 z-40 bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EverWish Logo" className="w-9 h-9 rounded-2xl object-cover shadow-lg shadow-rose-400/25" />
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">EverWish</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToShop}
              className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors"
            >
              Templates
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello! I have a question about EverWish.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-rose-400/30 hover:scale-105 transition-transform"
            >
              <MessageCircle size={15} />
              Get in Touch
            </a>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════
           HERO
      ════════════════════════════════ */}
      <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-rose-200/60 text-rose-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm mb-8"
        >
          <Sparkles size={13} />
          Personalised Digital Celebrations
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Gift a Moment<br />
          <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            They'll Never Forget
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Beautiful, interactive digital celebration pages — customised for your
          loved one and delivered in hours. Valentines, birthdays, proposals & more.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={scrollToShop}
            className="group flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-rose-400/30 hover:scale-105 transition-all text-base"
          >
            <Gift size={18} />
            Browse Templates
            <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to know more about EverWish.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/80 text-slate-700 font-bold px-8 py-4 rounded-2xl shadow-md hover:scale-105 hover:bg-white/80 transition-all text-base"
          >
            <MessageCircle size={18} className="text-green-500" />
            Chat on WhatsApp
          </a>
        </motion.div>

        {/* Trust pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-12 text-sm text-slate-500"
        >
          {['✅ Delivered in 24 hrs', '💬 WhatsApp Support', '🔒 Private & Secure', '🎨 Fully Customised'].map(t => (
            <span key={t} className="bg-white/60 backdrop-blur-sm border border-white/70 px-4 py-2 rounded-full shadow-sm font-medium">{t}</span>
          ))}
        </motion.div>
      </section>

      {/* ════════════════════════════════
           TEMPLATE SHOWCASE
      ════════════════════════════════ */}
      <section ref={shopRef} className="max-w-6xl mx-auto px-6 py-20">
        <Section className="mb-12 text-center">
          <motion.p variants={fadeUp} className="text-rose-500 font-bold text-sm uppercase tracking-widest mb-3">The Shop</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Choose Your Template
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-slate-500 max-w-xl mx-auto">
            Every template is hand-crafted and personalised with your photos, messages, and music.
          </motion.p>
        </Section>

        {/* Tab Toggle */}
        <Section className="flex justify-center mb-10">
          <motion.div
            variants={fadeUp}
            className="inline-flex bg-white/60 backdrop-blur-xl border border-white/70 p-1.5 rounded-2xl shadow-md gap-1"
          >
            <button
              onClick={() => setActiveTab('valentine')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'valentine'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-400/30'
                  : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              <Heart size={16} fill={activeTab === 'valentine' ? 'white' : 'none'} />
              Valentine & Proposal
            </button>
            <button
              onClick={() => setActiveTab('birthday')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'birthday'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-400/30'
                  : 'text-slate-500 hover:text-amber-600'
              }`}
            >
              <PartyPopper size={16} />
              Birthday
            </button>
          </motion.div>
        </Section>

        {/* Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-rose-500">
            <Loader2 className="animate-spin w-10 h-10 mb-4" />
            <p className="font-medium text-slate-600">Loading templates...</p>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {storefrontData.templates?.filter(t => t.category === activeTab).map((tpl, i) => (
              <TemplateCard key={tpl.id} tpl={tpl} index={i} onPreview={openPreview} />
            ))}
          </motion.div>
        )}

        {/* Pricing note */}
        <Section className="mt-10 text-center">
          <motion.div
            variants={fadeUp}
            className="inline-flex flex-col sm:flex-row items-center gap-3 bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl px-8 py-4 shadow-sm text-sm text-slate-600"
          >
            <Check size={16} className="text-emerald-500" />
            <span>All prices include <strong className="text-slate-900">custom content setup, photos, music & 1 month of hosting</strong>.</span>
          </motion.div>
        </Section>
      </section>

      {/* ════════════════════════════════
           HOW IT WORKS
      ════════════════════════════════ */}
      <section className="bg-white/40 backdrop-blur-sm border-y border-white/60 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <Section className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-rose-500 font-bold text-sm uppercase tracking-widest mb-3">Simple Process</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl font-extrabold text-slate-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Ready in 3 Steps
            </motion.h2>
          </Section>
          <Section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', icon: '💬', title: 'Contact Us', desc: 'Drop us a WhatsApp message and choose your favourite template.' },
                { step: '02', icon: '📝', title: 'Share Details', desc: 'Send us photos, names, dates, and a personal message.' },
                { step: '03', icon: '🚀', title: 'Share & Wow', desc: 'Receive a private link within 24 hrs. Share and watch them smile!' },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  custom={i * 0.15}
                  className="relative bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl p-7 shadow-md text-center"
                >
                  <span className="absolute -top-4 left-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-black px-3 py-1 rounded-full shadow">{item.step}</span>
                  <div className="text-5xl mb-4 mt-2">{item.icon}</div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ════════════════════════════════
           TESTIMONIALS
      ════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Section className="text-center mb-14">
          <motion.p variants={fadeUp} className="text-rose-500 font-bold text-sm uppercase tracking-widest mb-3">Reviews</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-extrabold text-slate-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Loved by Customers
          </motion.h2>
        </Section>
        <Section>
          {loading ? (
            <div className="py-12 flex justify-center text-rose-500">
              <Loader2 className="animate-spin w-8 h-8" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {storefrontData.testimonials?.map((t, i) => (
                <motion.div
                  key={t.name || i}
                  variants={fadeUp}
                  custom={i * 0.1}
                  className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
                >
                  <Stars count={t.rating || 5} />
                  <p className="text-slate-700 text-sm leading-relaxed flex-1">"{t.text}"</p>
                  
                  {t.screenshotUrl && (
                    <button
                      onClick={() => setSelectedProof(t.screenshotUrl)}
                      className="mt-1 flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-100 text-[11px] font-bold px-3 py-1.5 rounded-xl transition shadow-sm hover:scale-[1.03] active:scale-[0.98] w-fit"
                    >
                      <Eye size={12} />
                      View Chat Proof
                    </button>
                  )}

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100 mt-auto">
                    <span className="text-2xl">{t.avatar}</span>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-xs text-rose-500 font-semibold">{t.templateName || t.tag}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Section>
      </section>

      {/* ════════════════════════════════
           CTA BANNER
      ════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <Section>
          <motion.div
            variants={fadeUp}
            className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2.5rem] p-12 md:p-16 text-center shadow-2xl shadow-rose-400/30"
          >
            {/* Decorative blobs inside banner */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-pink-300/20 blur-3xl" />

            <div className="relative z-10">
              <p className="text-pink-100 text-sm font-bold uppercase tracking-widest mb-4">Ready to Surprise Someone?</p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Create Their Perfect<br />Digital Celebration
              </h2>
              <p className="text-pink-100 max-w-lg mx-auto mb-10 text-base">
                Starting from Rs. 2,500 · Delivered in 24 hours · Private link just for them.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like to order a personalised EverWish page 🎉")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 bg-white text-rose-600 font-extrabold px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform text-base"
                >
                  <MessageCircle size={18} className="text-green-500" />
                  Order on WhatsApp
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  onClick={scrollToShop}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/30 transition text-base"
                >
                  View Templates
                </button>
              </div>
            </div>
          </motion.div>
        </Section>
      </section>

      {/* ════════════════════════════════
           FOOTER
      ════════════════════════════════ */}
      <footer className="bg-white/40 backdrop-blur-sm border-t border-white/60">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EverWish Logo" className="w-9 h-9 rounded-2xl object-cover shadow" />
            <div>
              <p className="font-extrabold text-slate-900 leading-none">EverWish</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Digital Celebrations</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-slate-500">
            <a href={`mailto:everwish@gmail.com`} className="flex items-center gap-1.5 hover:text-rose-600 transition-colors font-medium">
              <Mail size={15} /> everwish@gmail.com
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-green-600 transition-colors font-medium"
            >
              <MessageCircle size={15} /> WhatsApp Us
            </a>
            <a
              href="https://instagram.com/everwish.lk"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-rose-500 transition-colors font-medium"
            >
              <Share2 size={15} /> @everwish.lk
            </a>
          </div>

          <p className="text-xs text-slate-400">© {new Date().getFullYear()} EverWish · Made with ❤️ in Sri Lanka</p>
        </div>
      </footer>

      {/* ── Testimonial Proof Lightbox Modal ── */}
      <AnimatePresence>
        {selectedProof && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProof(null)}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-lg w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-3 shadow-2xl overflow-hidden cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProof(null)}
                className="absolute top-5 right-5 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition hover:scale-105"
              >
                <X size={16} />
              </button>

              {/* Image Container */}
              <div className="relative rounded-[1.6rem] overflow-hidden max-h-[80vh] bg-slate-950 flex justify-center">
                <img 
                  src={selectedProof} 
                  alt="Customer Chat Proof" 
                  className="w-full object-contain max-h-[75vh]" 
                />
              </div>
              <div className="text-center py-3 text-xs font-semibold text-slate-300">
                💬 Direct Customer Feedback Screenshot (Verified Proof)
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Preview Modal ── */}
      <PreviewModal
        isOpen={preview.isOpen}
        templateId={preview.templateId}
        whatsappNumber={WHATSAPP_NUMBER}
        onClose={closePreview}
      />
    </div>
  );
}
