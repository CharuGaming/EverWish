import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart } from "lucide-react";
import { siteData } from "../siteData";

function MilestoneCard({ milestone, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = milestone.alignment === "left";

  return (
    <div
      ref={ref}
      className={`relative flex w-full items-center md:justify-center mb-16 md:mb-24 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-col`}
    >
      {/* Content side - Glassmorphic */}
      <motion.div
        className={`md:w-5/12 w-full pl-12 md:pl-0 ${
          isLeft ? "md:pr-10 md:text-right" : "md:pl-10 md:text-left"
        }`}
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
      >
        <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.25)] ${isLeft ? 'ml-auto' : 'mr-auto'} max-w-sm`}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-white/80 mb-1 drop-shadow-md">
            {milestone.date}
          </span>
          <h3 className="serif text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-md">
            {milestone.title}
          </h3>
          <p className="text-white/90 leading-relaxed text-sm md:text-base drop-shadow-sm">
            {milestone.description}
          </p>
        </div>
      </motion.div>

      {/* Center dot */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
        <motion.div
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/40 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 280, damping: 15, delay: 0.2 }}
        >
          <Heart size={14} fill="white" color="white" />
        </motion.div>
      </div>

      {/* Mobile dot */}
      <div className="absolute left-4 top-2 flex md:hidden z-10">
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/40 flex items-center justify-center shadow-md">
          <Heart size={10} fill="white" color="white" />
        </div>
      </div>

      {/* Image / polaroid side */}
      <motion.div
        className={`md:w-5/12 w-full mt-6 md:mt-0 pl-12 md:pl-0 ${
          isLeft ? "md:pl-10" : "md:pr-10"
        } flex ${isLeft ? "md:justify-start" : "md:justify-end"}`}
        initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
      >
        <motion.div
          className={`polaroid bg-white p-2 pb-6 ${milestone.rotate} hover:rotate-0 transition-transform duration-300 drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]`}
          whileHover={{ scale: 1.04, zIndex: 10 }}
          style={{ maxWidth: "220px", borderRadius: "4px" }}
        >
          <img
            src={milestone.imageUrl}
            alt={milestone.title}
            loading="lazy"
            className="w-44 h-44 object-cover block"
          />
          <p className="serif text-center text-xs text-gray-800 font-medium italic mt-2">
            {milestone.title}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LoveMap({ siteDataOverride }) {
  const data = siteDataOverride || siteData;
  const { milestones, customTitles } = data;
  const headerRef = useRef(null);
  const inView = useInView(headerRef, { once: true });

  return (
    <section
      id="timeline"
      className="relative py-24 px-4 overflow-hidden z-10"
    >
      {/* Section header */}
      <motion.div
        ref={headerRef}
        className="text-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="text-white/80 text-xs tracking-widest uppercase font-semibold drop-shadow-md">
          Our Journey
        </span>
        <h2 className="serif text-4xl md:text-5xl font-bold text-white mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          {customTitles?.gameSectionTitle || "Milestones of Us"}
        </h2>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-16 bg-white/40" />
          <Heart size={14} fill="white" color="white" className="opacity-80" />
          <div className="h-px w-16 bg-white/40" />
        </div>
      </motion.div>

      {/* Timeline container */}
      <div className="relative max-w-4xl mx-auto">
        {/* Dashed center line - updated to white */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-white/30 -translate-x-1/2" />

        {milestones.map((milestone, i) => (
          <MilestoneCard key={milestone.id} milestone={milestone} index={i} />
        ))}
      </div>
    </section>
  );
}
