import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#ef4444', '#f43f5e', '#fb7185', '#fda4af', '#f472b6'];

function HeartParticle({ id, x, y, scale, rotation, color, duration, delay }) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0, 
        x: 0, 
        y: 0, 
        rotate: 0 
      }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        scale: [0, scale * 1.5, scale], 
        x: x, 
        y: y, 
        rotate: rotation 
      }}
      transition={{ 
        duration: duration, 
        delay: delay, 
        ease: "easeOut",
        times: [0, 0.2, 0.7, 1]
      }}
      className="absolute top-1/2 left-1/2 -ml-3 -mt-3 pointer-events-none"
      style={{ color: color }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    </motion.div>
  );
}

export default function HeartBurst({ show }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (show) {
      // Generate 40 particles with random trajectories
      const newParticles = Array.from({ length: 40 }).map((_, i) => {
        // Random angle from 0 to 360 degrees
        const angle = Math.random() * Math.PI * 2;
        // Random distance from center (between 100px and 600px, depending on viewport)
        const distance = 150 + Math.random() * Math.min(window.innerWidth, window.innerHeight) * 0.8;
        
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          scale: 0.5 + Math.random() * 1.5,
          rotation: (Math.random() - 0.5) * 180,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          duration: 1.2 + Math.random() * 0.5,
          delay: Math.random() * 0.1
        };
      });
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <HeartParticle key={p.id} {...p} />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
