import { motion, useReducedMotion } from "framer-motion";

const decorItems = [
  { emoji: "🌸", size: "text-4xl", top: "8%",  left: "4%",  delay: 0,   duration: 5 },
  { emoji: "💕", size: "text-3xl", top: "22%", right: "5%", delay: 0.8, duration: 6 },
  { emoji: "✨", size: "text-2xl", top: "55%", left: "3%",  delay: 1.5, duration: 4.5 },
  { emoji: "🌹", size: "text-4xl", top: "72%", right: "4%", delay: 0.4, duration: 5.5 },
  { emoji: "💫", size: "text-3xl", top: "40%", left: "2%",  delay: 2,   duration: 7 },
  { emoji: "🌷", size: "text-2xl", top: "88%", left: "6%",  delay: 1,   duration: 5 },
];

export default function FloatingDecor() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null; // Gracefully disable complex background loops if reduced motion is requested
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {decorItems.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute select-none ${item.size} opacity-30`}
          style={{
            top: item.top,
            left: item.left ?? undefined,
            right: item.right ?? undefined,
            willChange: "transform",
          }}
          animate={{ y: [0, -22, 0] }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
