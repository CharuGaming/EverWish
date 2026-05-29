import { useEffect, useRef } from "react";

// Heart sizes and colours for variety
const HEARTS = ["❤️", "🩷", "💕", "💗", "💖"];
const MAX_HEARTS = 20;

export default function CursorTrail() {
  const containerRef = useRef(null);
  const heartsRef = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });
  const lastSpawn = useRef(0);

  useEffect(() => {
    const container = containerRef.current;

    function spawnHeart(x, y) {
      const el = document.createElement("div");
      const emoji = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      const size = 14 + Math.random() * 14;           // 14–28 px
      const angle = (Math.random() - 0.5) * 40;       // slight spread
      const drift = (Math.random() - 0.5) * 30;       // horizontal drift

      el.textContent = emoji;
      el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${size}px;
        line-height: 1;
        pointer-events: none;
        user-select: none;
        z-index: 99999;
        transform: translate(-50%, -50%) rotate(${angle}deg);
        transition: none;
        will-change: transform, opacity;
      `;
      container.appendChild(el);

      // Animate via Web Animations API
      const anim = el.animate(
        [
          { opacity: 1, transform: `translate(calc(-50% + ${drift * 0}px), -50%) scale(1) rotate(${angle}deg)` },
          { opacity: 0, transform: `translate(calc(-50% + ${drift}px), calc(-50% - 55px)) scale(0.4) rotate(${angle + 20}deg)` },
        ],
        { duration: 700 + Math.random() * 400, easing: "ease-out", fill: "forwards" }
      );

      anim.onfinish = () => {
        el.remove();
        heartsRef.current = heartsRef.current.filter((h) => h !== el);
      };

      heartsRef.current.push(el);

      // Trim if too many
      if (heartsRef.current.length > MAX_HEARTS) {
        const old = heartsRef.current.shift();
        old?.remove();
      }
    }

    function onMouseMove(e) {
      const now = Date.now();
      // Throttle: spawn every ~40 ms so it feels like a trail, not a flood
      if (now - lastSpawn.current < 40) return;
      lastSpawn.current = now;
      spawnHeart(e.clientX, e.clientY);
    }

    // Touch support
    function onTouchMove(e) {
      const now = Date.now();
      if (now - lastSpawn.current < 50) return;
      lastSpawn.current = now;
      const t = e.touches[0];
      spawnHeart(t.clientX, t.clientY);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      // clean up any leftover hearts
      heartsRef.current.forEach((el) => el.remove());
      heartsRef.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99999 }}
    />
  );
}
