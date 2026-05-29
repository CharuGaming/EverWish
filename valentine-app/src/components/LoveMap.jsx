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
      {/* Content side */}
      <motion.div
        className={`md:w-5/12 w-full pl-12 md:pl-0 ${
          isLeft ? "md:pr-10 md:text-right" : "md:pl-10 md:text-left"
        }`}
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
      >
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-rose-400 mb-1">
          {milestone.date}
        </span>
        <h3 className="serif text-2xl md:text-3xl font-bold text-rose-700 mb-2">
          {milestone.title}
        </h3>
        <p className="text-gray-500 leading-relaxed text-sm md:text-base max-w-xs">
          {milestone.description}
        </p>
      </motion.div>

      {/* Center dot */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
        <motion.div
          className="w-10 h-10 rounded-full bg-white border-4 border-rose-300 flex items-center justify-center shadow-lg"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 280, damping: 15, delay: 0.2 }}
        >
          <Heart size={14} fill="#e11d48" color="#e11d48" />
        </motion.div>
      </div>

      {/* Mobile dot */}
      <div className="absolute left-4 top-2 flex md:hidden z-10">
        <div className="w-8 h-8 rounded-full bg-white border-4 border-rose-300 flex items-center justify-center shadow">
          <Heart size={10} fill="#e11d48" color="#e11d48" />
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
          className={`polaroid ${milestone.rotate} hover:rotate-0 transition-transform duration-300`}
          whileHover={{ scale: 1.04, zIndex: 10 }}
          style={{ maxWidth: "220px" }}
        >
          <img
            src={milestone.imageUrl}
            alt={milestone.title}
            loading="lazy"
            className="w-44 h-44 object-cover block"
          />
          <p className="serif text-center text-xs text-gray-400 italic mt-2">
            {milestone.title}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LoveMap({ siteDataOverride }) {
  const { milestones } = siteDataOverride || siteData;
  const headerRef = useRef(null);
  const inView = useInView(headerRef, { once: true });

  return (
    <section
      id="timeline"
      className="relative py-24 px-4"
      style={{ background: "linear-gradient(180deg, #fce7f3 0%, #fff0f5 100%)" }}
    >
      {/* Section header */}
      <motion.div
        ref={headerRef}
        className="text-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="text-rose-400 text-xs tracking-widest uppercase font-semibold">
          Our Journey
        </span>
        <h2 className="serif text-4xl md:text-5xl font-bold text-rose-700 mt-2">
          Milestones of Us
        </h2>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-16 bg-rose-200" />
          <Heart size={14} fill="#fda4af" color="#fda4af" />
          <div className="h-px w-16 bg-rose-200" />
        </div>
      </motion.div>

      {/* Timeline container */}
      <div className="relative max-w-4xl mx-auto">
        {/* Dashed center line */}
        <div className="timeline-line" />

        {milestones.map((milestone, i) => (
          <MilestoneCard key={milestone.id} milestone={milestone} index={i} />
        ))}
      </div>
    </section>
  );
}
