import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Footer({ siteDataOverride }) {
  const coupleName = siteDataOverride?.coupleName || "Always & Forever";

  return (
    <footer
      className="py-16 px-6 text-center"
      style={{ background: "linear-gradient(160deg, #fce7f3 0%, #fff0f5 100%)" }}
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
          <Heart size={40} fill="#e11d48" color="#e11d48" />
        </motion.div>

        <h2 className="serif text-3xl md:text-4xl font-bold text-rose-700">
          {coupleName}
        </h2>

        <p className="text-rose-400/70 text-sm font-light tracking-widest uppercase">
          Always & Forever
        </p>

        <div className="mt-4 flex items-center gap-2 text-rose-200">
          <div className="h-px w-12 bg-rose-200" />
          <span className="text-rose-300 text-xs tracking-widest">made with 💕</span>
          <div className="h-px w-12 bg-rose-200" />
        </div>

        <div className="mt-8 text-[9px] text-rose-300/60 uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} · Made By EverWish
        </div>
      </motion.div>
    </footer>
  );
}
