import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Heart, X } from "lucide-react";
import { siteData } from "../siteData";
import ScratchPhoto from "./ScratchPhoto";

// Layout offsets for the 6 surrounding images (relative to center card)
const surroundLayout = [
  { top: "-8%",  left: "-5%",  rotate: "-rotate-3", w: "w-36 h-36", zIdx: 20 },
  { top: "-10%", right: "-4%", rotate: "rotate-2",  w: "w-40 h-40", zIdx: 20 },
  { top: "35%",  left: "-8%",  rotate: "-rotate-2", w: "w-32 h-32", zIdx: 20 },
  { top: "38%",  right: "-6%", rotate: "rotate-3",  w: "w-36 h-36", zIdx: 20 },
  { bottom: "-8%",left: "5%",  rotate: "rotate-1",  w: "w-40 h-40", zIdx: 20 },
  { bottom: "-6%",right: "5%", rotate: "-rotate-2", w: "w-32 h-32", zIdx: 20 },
];

export default function Gallery({ siteDataOverride }) {
  const { gallery } = siteDataOverride || siteData;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImg, setSelectedImg] = useState(null);

  // Theme primary – fall back to rose
  const primary = siteDataOverride?.themeColors?.primary || '#f43f5e';

  return (
    <section
      id="gallery"
      className="py-24 px-6 relative"
      style={{ background: "#fff0f5" }}
    >
      {/* Header */}
      <motion.div
        ref={ref}
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="text-rose-400 text-xs tracking-widest uppercase font-semibold">
          Memories
        </span>
        <h2 className="serif text-4xl md:text-5xl font-bold text-rose-700 mt-2">
          Our Gallery
        </h2>
        <p className="text-sm text-rose-400/70 mt-2 font-medium">
          ✦ Scratch each photo to reveal the memory
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-16 bg-rose-200" />
          <Heart size={14} fill="#fda4af" color="#fda4af" />
          <div className="h-px w-16 bg-rose-200" />
        </div>
      </motion.div>

      {/* Collage */}
      <motion.div
        className="relative mx-auto"
        style={{ maxWidth: "640px", minHeight: "520px" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Central image with scratch */}
        <motion.div
          className="relative z-10 mx-auto"
          style={{ width: "65%", aspectRatio: "1" }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="ripped-paper w-full h-full overflow-hidden shadow-2xl shadow-rose-200/60 rounded-2xl">
            <ScratchPhoto
              src={gallery.centerImage}
              alt={gallery.centerCaption}
              primary={primary}
              onClick={() => setSelectedImg({ url: gallery.centerImage, caption: gallery.centerCaption })}
            />
          </div>
          {/* Caption badge */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white border border-rose-100 rounded-full px-4 py-1 text-xs font-medium text-rose-500 shadow-md whitespace-nowrap z-30">
            {gallery.centerCaption}
          </div>
        </motion.div>

        {/* Supporting photos */}
        {gallery.supporting.map((img, i) => {
          const pos = surroundLayout[i] || {};
          return (
            <motion.div
              key={img.id}
              className={`polaroid absolute ${pos.rotate ?? ""} hover:rotate-0 transition-transform duration-300`}
              style={{
                top:    pos.top,
                left:   pos.left,
                right:  pos.right,
                bottom: pos.bottom,
                zIndex: pos.zIdx,
                width:  "auto",
              }}
              initial={{ opacity: 0, scale: 0.75, y: 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              whileHover={{ scale: 1.08, zIndex: 50 }}
            >
              <div className={`overflow-hidden rounded-xl ${pos.w ?? "w-32 h-32"}`}>
                <ScratchPhoto
                  src={img.url}
                  alt={img.caption}
                  primary={primary}
                  onClick={() => setSelectedImg({ url: img.url, caption: img.caption })}
                />
              </div>
              <p className="serif text-center text-xs text-gray-400 italic mt-1">
                {img.caption}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
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
              className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center pointer-events-auto cursor-default"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white p-3 md:p-4 pb-12 md:pb-16 rounded-sm shadow-2xl max-w-full">
                <img
                  src={selectedImg.url}
                  alt={selectedImg.caption}
                  loading="lazy"
                  className="max-w-full max-h-[65vh] object-contain rounded-sm"
                />
                <p className="serif text-center text-rose-700 italic text-base md:text-lg mt-4 font-semibold">
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
