import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';

// Dynamic particle/mesh representing a butterfly or animated element
function Butterfly({ delay, speed, startPosition }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Simple hardware-friendly rotation and float math instead of heavy trigonometry/physics
    meshRef.current.position.y = startPosition[1] + Math.sin(time * speed + delay) * 0.5;
    meshRef.current.position.x = startPosition[0] + Math.cos(time * speed * 0.5 + delay) * 0.25;
    meshRef.current.rotation.z = Math.sin(time * 10 + delay) * 0.2; // wing flapping animation
  });

  return (
    <mesh ref={meshRef} position={startPosition}>
      <coneGeometry args={[0.15, 0.4, 3]} /> {/* Low-polygon geometry for mobile optimization */}
      <meshBasicMaterial color="#fda4af" transparent opacity={0.6} />
    </mesh>
  );
}

export default function ThreePerformanceCanvas() {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Gracefully disable WebGL canvas completely if OS reduced motion is active to save resources
  if (shouldReduceMotion) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0005] to-[#1a0010] z-0" />
    );
  }

  // Dynamic degradation: 3 butterflies on mobile, 15 on high-end desktop
  const butterflyCount = isMobile ? 3 : 15;

  const butterflies = useMemo(() => {
    return Array.from({ length: butterflyCount }).map((_, i) => ({
      id: i,
      delay: Math.random() * 10,
      speed: 0.8 + Math.random() * 1.2,
      startPosition: [
        (Math.random() - 0.5) * 6, // x
        (Math.random() - 0.5) * 4, // y
        (Math.random() - 0.5) * 2  // z
      ]
    }));
  }, [butterflyCount]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        // STRICTLY restrict the Canvas device pixel ratio on mobile (1.0 to 1.5) to avoid drawing excess pixels on high-DPI displays
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }} // Disable MSAA antialiasing on mobile for significant GPU fillrate improvements
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        {butterflies.map((b) => (
          <Butterfly
            key={b.id}
            delay={b.delay}
            speed={b.speed}
            startPosition={b.startPosition}
          />
        ))}
      </Canvas>
    </div>
  );
}
