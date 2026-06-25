import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Heart, X } from "lucide-react";
import { siteData } from "../siteData";
import { optimizeCloudinaryUrl } from "../utils/imageHelpers";

// Pre-defined random rotations for a playful polaroid look
const ROTATIONS = [
  "-rotate-2", "rotate-2", "-rotate-1", "rotate-3", "-rotate-3", "rotate-1"
];

// ── Gallery Scratch Card ──────────────────────────────────────
function GalleryScratchCard({ photo, i, inView, setSelectedImg }) {
  const rotationClass = ROTATIONS[i % ROTATIONS.length];
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [scratched, setScratched] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Gradient matching polaroid aesthetic
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#f1f5f9');
    grad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Subtle noise pattern overlay
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for(let j=0; j<40; j++) {
      ctx.beginPath();
      ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*2 + 1, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch ✨', canvas.width/2, canvas.height/2 - 5);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('to reveal', canvas.width/2, canvas.height/2 + 18);
  }, []);

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
    ctx.beginPath(); ctx.arc(x, y, 35, 0, Math.PI*2); ctx.fill();
    
    const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let t = 0;
    for (let j=3; j<data.length; j+=4) if (data[j]<128) t++;
    const p = Math.round((t/(canvas.width*canvas.height))*100);
    setPct(p);
    if (p > 50 && !scratched) setScratched(true);
  };

  return (
    <motion.div
      className={`polaroid cursor-pointer transform ${rotationClass} hover:rotate-0 hover:z-20 transition-all duration-300`}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="w-full aspect-[4/3] overflow-hidden bg-slate-100 relative" onClick={() => scratched && setSelectedImg(photo)}>
        <img loading="lazy" 
          src={optimizeCloudinaryUrl(photo.url, 600)} 
          alt={photo.caption} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <canvas ref={canvasRef} width={400} height={300} // 4:3 aspect ratio
          className={`absolute inset-0 w-full h-full touch-none ${scratched ? 'pointer-events-none' : 'cursor-crosshair'}`}
          style={{ opacity: scratched ? 0 : 1, transition:'opacity 0.8s ease' }}
          onMouseDown={(e) => { e.stopPropagation(); isDrawing.current=true; }}
          onMouseMove={(e) => { e.stopPropagation(); scratch(e); }} 
          onMouseUp={(e) => { e.stopPropagation(); isDrawing.current=false; }}
          onMouseLeave={(e) => { e.stopPropagation(); isDrawing.current=false; }}
          onTouchStart={(e) => { e.stopPropagation(); e.preventDefault(); isDrawing.current=true; }}
          onTouchMove={(e) => { e.stopPropagation(); e.preventDefault(); scratch(e); }}
          onTouchEnd={(e) => { e.stopPropagation(); isDrawing.current=false; }}
        />
        {!scratched && (
          <div className="absolute top-2 right-2 text-slate-500 bg-white/80 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {pct}%
          </div>
        )}
      </div>
      <div className="mt-4 text-center">
        <p className="serif text-lg font-medium text-slate-800 tracking-wide">
          {photo.caption}
        </p>
      </div>
    </motion.div>
  );
}

export default function Gallery({ siteDataOverride }) {
  const data = siteDataOverride || siteData;
  const { gallery, customTitles } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImg, setSelectedImg] = useState(null);

  // Combine center image with supporting images for the grid
  const allPhotos = [];
  if (gallery.centerImage) {
    allPhotos.push({
      id: "center-img",
      url: gallery.centerImage,
      caption: gallery.centerCaption || "",
    });
  }
  if (gallery.supporting && gallery.supporting.length > 0) {
    allPhotos.push(...gallery.supporting);
  }

  return (
    <section
      id="gallery"
      className="py-24 px-6 relative z-10 overflow-hidden"
    >
      {/* Header */}
      <motion.div
        ref={ref}
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="text-white/80 text-xs tracking-widest uppercase font-semibold drop-shadow-md">
          Memories
        </span>
        <h2 className="serif text-4xl md:text-5xl font-bold text-white mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          {customTitles?.gallerySectionTitle || "Our Memories"}
        </h2>
        <p className="text-sm text-white/80 mt-2 font-medium drop-shadow-md">
          Tap a photo to relive the moment
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-16 bg-white/40" />
          <Heart size={14} fill="white" color="white" className="opacity-80" />
          <div className="h-px w-16 bg-white/40" />
        </div>
      </motion.div>

      {/* Polaroid Grid */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {allPhotos.map((photo, i) => (
            <GalleryScratchCard key={photo.id || i} photo={photo} i={i} inView={inView} setSelectedImg={setSelectedImg} />
          ))}
        </motion.div>
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 z-50 cursor-pointer"
              onClick={() => setSelectedImg(null)}
              aria-label="Close image viewer"
            >
              <X size={24} />
            </button>

            <motion.div
              className="relative max-w-5xl w-full flex flex-col items-center justify-center pointer-events-auto cursor-default"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white p-3 md:p-4 pb-12 md:pb-16 rounded-sm shadow-2xl max-w-full inline-block">
                <img
                  src={optimizeCloudinaryUrl(selectedImg.url, 1200)}
                  alt={selectedImg.caption}
                  loading="lazy"
                  className="max-w-full max-h-[75vh] object-contain"
                />
                <p className="serif text-center text-slate-800 italic text-xl md:text-2xl mt-6 font-medium">
                  {selectedImg.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
