import { useMemo } from "react";
import { motion } from "framer-motion";

const BALLOON_COLORS = [
  // Premium Pink
  { bgStart: "#ff758f", bgEnd: "#c9184a", stroke: "#a01a58", stringColor: "#ff758f" },
  // Premium Blue
  { bgStart: "#8ecae6", bgEnd: "#219ebc", stroke: "#023047", stringColor: "#219ebc" },
  // Premium Gold/Yellow
  { bgStart: "#ffe57f", bgEnd: "#ffb300", stroke: "#ff6f00", stringColor: "#ffb300" },
  // Premium Purple
  { bgStart: "#e0aaff", bgEnd: "#7b2cbf", stroke: "#3c096c", stringColor: "#7b2cbf" },
  // Premium Peach/Rose
  { bgStart: "#fbc4ab", bgEnd: "#f08080", stroke: "#da627d", stringColor: "#f08080" }
];

export default function FloatingBalloons() {
  const balloons = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const color = BALLOON_COLORS[i % BALLOON_COLORS.length];
      const startX = 5 + Math.random() * 90; // 5% to 95%
      const scale = 0.5 + Math.random() * 0.7; // 0.5 to 1.2
      const duration = 12 + Math.random() * 12; // 12s to 24s
      const delay = Math.random() * 15; // 0s to 15s
      const swayDuration = 4 + Math.random() * 4; // 4s to 8s
      const swayOffset = 15 + Math.random() * 20; // 15px to 35px
      
      return {
        id: i,
        color,
        startX,
        scale,
        duration,
        delay,
        swayDuration,
        swayOffset,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.startX}%`,
            width: 90,
            height: 145,
            originX: 0.5,
            originY: 0.5,
          }}
          initial={{ y: "120vh", scale: b.scale }}
          animate={{
            y: "-30vh",
          }}
          transition={{
            y: {
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: "linear",
            }
          }}
        >
          <motion.div
            style={{ width: "100%", height: "100%" }}
            animate={{
              x: [-b.swayOffset, b.swayOffset, -b.swayOffset],
              rotate: [-6, 6, -6]
            }}
            transition={{
              duration: b.swayDuration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg
              viewBox="0 0 100 160"
              className="w-full h-full filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.12)] opacity-85"
            >
              <defs>
                <radialGradient id={`balloon-grad-${b.id}`} cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75"/>
                  <stop offset="35%" stopColor={b.color.bgStart}/>
                  <stop offset="100%" stopColor={b.color.bgEnd}/>
                </radialGradient>
              </defs>
              {/* Balloon string */}
              <path
                d="M50,94 C46,108 54,122 50,136 C46,150 54,164 50,178"
                fill="none"
                stroke={b.color.stringColor}
                strokeWidth="1.5"
                opacity="0.6"
              />
              {/* Balloon knot */}
              <path
                d="M50,89 L44,96 L56,96 Z"
                fill={b.color.stroke}
              />
              {/* Balloon body */}
              <path
                d="M50,15 C20,15 15,40 15,60 C15,80 35,90 50,90 C65,90 85,80 85,60 C85,40 80,15 50,15 Z"
                fill={`url(#balloon-grad-${b.id})`}
                stroke={b.color.stroke}
                strokeWidth="0.5"
              />
            </svg>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
