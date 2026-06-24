import { useEffect, useRef } from 'react';

/**
 * DotField — Interactive canvas dot grid with cursor bulge, glow and sparkle effects.
 *
 * Props:
 *  dotRadius       – base dot radius in px                (default 1.5)
 *  dotSpacing      – grid spacing in px                   (default 18)
 *  cursorRadius    – influence radius in px               (default 400)
 *  cursorForce     – max displacement factor              (default 0.2)
 *  bulgeOnly       – if true dots only push outward       (default true)
 *  bulgeStrength   – max bulge displacement px            (default 25)
 *  glowRadius      – radius for glow circle               (default 200)
 *  sparkle         – enable sparkle flecks                (default true)
 *  gradientFrom    – radial gradient inner colour         (default 'rgba(255,105,180,0.4)')
 *  gradientTo      – radial gradient outer colour         (default 'rgba(255,182,193,0.2)')
 *  glowColor       – colour of the cursor glow blob       (default '#FFE4E1')
 */
export default function DotField({
  dotRadius     = 1.5,
  dotSpacing    = 18,
  cursorRadius  = 400,
  cursorForce   = 0.2,
  bulgeOnly     = true,
  bulgeStrength = 25,
  glowRadius    = 200,
  sparkle       = true,
  gradientFrom  = 'rgba(255, 105, 180, 0.4)',
  gradientTo    = 'rgba(255, 182, 193, 0.2)',
  glowColor     = '#FFE4E1',
}) {
  const canvasRef = useRef(null);
  const mouse     = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef(null);
  const sparkles  = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    // Resize canvas to fill its parent
    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Seed sparkles
    function seedSparkles() {
      sparkles.current = Array.from({ length: 60 }, () => ({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height,
        r:    Math.random() * 1.2 + 0.3,
        life: Math.random(),
        speed: Math.random() * 0.005 + 0.002,
      }));
    }
    seedSparkles();

    // Mouse/touch tracking
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const client = e.touches ? e.touches[0] : e;
      mouse.current.x = client.clientX - rect.left;
      mouse.current.y = client.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchmove', onMove, { passive: true });
    canvas.addEventListener('mouseleave', onLeave);

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const mx = mouse.current.x;
      const my = mouse.current.y;

      // --- Cursor glow blob ---
      if (mx > 0) {
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, glowRadius);
        grd.addColorStop(0, gradientFrom);
        grd.addColorStop(1, gradientTo);
        ctx.beginPath();
        ctx.arc(mx, my, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // --- Dot grid ---
      const cols = Math.ceil(W / dotSpacing) + 1;
      const rows = Math.ceil(H / dotSpacing) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let bx = c * dotSpacing;
          let by = r * dotSpacing;

          const dx   = bx - mx;
          const dy   = by - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let px = bx;
          let py = by;
          let alpha = 0.35;
          let radius = dotRadius;

          if (dist < cursorRadius && dist > 0) {
            const norm  = dist / cursorRadius;
            const power = (1 - norm) * (1 - norm);

            if (bulgeOnly) {
              const push  = power * bulgeStrength;
              const angle = Math.atan2(dy, dx);
              px += Math.cos(angle) * push;
              py += Math.sin(angle) * push;
            } else {
              const pull = power * cursorForce * cursorRadius;
              px -= (dx / dist) * pull;
              py -= (dy / dist) * pull;
            }
            alpha  = 0.35 + power * 0.65;
            radius = dotRadius + power * 1.5;
          }

          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,160,200,${alpha})`;
          ctx.fill();
        }
      }

      // --- Sparkles ---
      if (sparkle) {
        sparkles.current.forEach((s) => {
          s.life += s.speed;
          if (s.life > 1) {
            s.life  = 0;
            s.x     = Math.random() * W;
            s.y     = Math.random() * H;
          }
          const fadeAlpha = Math.sin(s.life * Math.PI) * 0.7;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,200,220,${fadeAlpha})`;
          ctx.fill();
        });
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('touchmove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [dotRadius, dotSpacing, cursorRadius, cursorForce, bulgeOnly, bulgeStrength, glowRadius, sparkle, gradientFrom, gradientTo, glowColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
