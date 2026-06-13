import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Footer({ siteDataOverride }) {
  const coupleName = siteDataOverride?.coupleName || "Always & Forever";

  return (
    <footer
      className="py-16 px-6 text-center relative z-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart size={40} fill="white" color="white" className="drop-shadow-md opacity-90" />
        </motion.div>

        <h2 className="serif text-3xl md:text-4xl font-bold text-white drop-shadow-md">
          {coupleName}
        </h2>

        <p className="text-white/80 text-sm font-light tracking-widest uppercase drop-shadow-sm">
          Always & Forever
        </p>

        <div className="mt-4 flex items-center gap-2 text-white/50">
          <div className="h-px w-12 bg-white/40" />
          <span className="text-white/70 text-xs tracking-widest drop-shadow-sm">made with 💕</span>
          <div className="h-px w-12 bg-white/40" />
        </div>

        <div className="mt-8 text-[9px] text-white/40 uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} · Made By EverWish
        </div>
      </motion.div>
    </footer>
  );
}
