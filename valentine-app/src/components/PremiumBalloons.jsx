import { motion, useReducedMotion } from 'framer-motion';

// Premium aesthetic balloons: soft pastel gradients, varied durations, and natural swaying.
const BALLOONS = [
  { id: 1, left: '10%', scale: 0.9, duration: 18, delay: 0, xSway: 30, gradient: 'url(#grad1)' },
  { id: 2, left: '25%', scale: 0.65, duration: 24, delay: 4, xSway: -25, gradient: 'url(#grad2)' },
  { id: 3, left: '45%', scale: 1.1, duration: 15, delay: 2, xSway: 20, gradient: 'url(#grad3)' },
  { id: 4, left: '65%', scale: 0.8, duration: 20, delay: 7, xSway: -35, gradient: 'url(#grad1)' },
  { id: 5, left: '85%', scale: 0.95, duration: 17, delay: 1, xSway: 40, gradient: 'url(#grad2)' },
  { id: 6, left: '55%', scale: 0.7, duration: 22, delay: 8, xSway: -20, gradient: 'url(#grad3)' },
  { id: 7, left: '75%', scale: 0.85, duration: 19, delay: 5, xSway: 25, gradient: 'url(#grad1)' },
];

export default function PremiumBalloons() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (shouldReduceMotion) {
    return null; // Gracefully disable if reduced motion is requested
  }

  // Filter to just 3 balloons on mobile to save performance
  const activeBalloons = isMobile ? BALLOONS.slice(0, 3) : BALLOONS;

  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {/* SVG Definitions for Gradients */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 200, 210, 0.85)" />
            <stop offset="100%" stopColor="rgba(255, 140, 170, 0.5)" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 225, 185, 0.85)" />
            <stop offset="100%" stopColor="rgba(255, 175, 115, 0.5)" />
          </linearGradient>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(210, 225, 255, 0.85)" />
            <stop offset="100%" stopColor="rgba(140, 175, 255, 0.5)" />
          </linearGradient>
          <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>
      </svg>

      {activeBalloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute bottom-[-200px]"
          style={{ left: b.left, width: 80, height: 100, willChange: 'transform' }}
          initial={{ y: 0, x: 0 }}
          animate={{
            y: ["10vh", "-120vh"],
            x: [0, b.xSway, -b.xSway, b.xSway / 2, 0]
          }}
          transition={{
            y: { duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'linear' },
            x: { duration: b.duration * 0.8, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          {/* Glassmorphic Balloon SVG Container */}
          <div 
            style={{ 
              transform: `scale(${b.scale})`, 
              filter: 'drop-shadow(0px 15px 25px rgba(0,0,0,0.2))' 
            }}
          >
            <svg viewBox="0 0 100 160" width="100%" height="100%" className="overflow-visible">
              {/* Balloon Body with backdrop-filter illusion */}
              <path
                d="M50 0 C 80 0, 95 30, 95 65 C 95 100, 60 120, 50 125 C 40 120, 5 100, 5 65 C 5 30, 20 0, 50 0 Z"
                fill={b.gradient}
              />
              {/* Elegant Glass Reflection / Shine */}
              <path
                d="M 25 20 C 40 10, 60 15, 70 30 C 75 40, 70 55, 60 65 C 45 80, 20 65, 15 45 C 10 25, 15 25, 25 20 Z"
                fill="url(#shine)"
                opacity="0.4"
                transform="rotate(-20 50 50) scale(0.65) translate(10, 10)"
              />
              {/* Balloon Tie */}
              <path d="M45 125 L55 125 L60 135 L40 135 Z" fill={b.gradient} />
              {/* Elegant Curved String */}
              <path
                d="M50 135 Q 35 155, 50 180 T 50 230"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
