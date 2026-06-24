import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Dock — macOS-style magnifying dock with Framer Motion springs.
 *
 * Props:
 *  items         – array of { icon: ReactNode, label: string, onClick: fn }
 *  panelHeight   – dock panel height in px            (default 60)
 *  baseItemSize  – normal icon size in px             (default 45)
 *  magnification – max magnified size in px           (default 70)
 *  className     – extra classes for the dock panel
 */
export default function Dock({
  items         = [],
  panelHeight   = 60,
  baseItemSize  = 45,
  magnification = 70,
  className     = '',
}) {
  const mouseX = useMotionValue(Infinity);
  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="flex justify-center w-full">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        style={{ height: panelHeight + 16 }}
        className={[
          'flex items-end gap-2 px-4 pb-2 rounded-2xl border shadow-2xl',
          className,
        ].join(' ')}
      >
        {items.map((item, i) => (
          <DockItem
            key={i}
            item={item}
            mouseX={mouseX}
            baseSize={baseItemSize}
            maxSize={magnification}
            tooltip={tooltip}
            setTooltip={setTooltip}
            index={i}
          />
        ))}
      </motion.div>
    </div>
  );
}

function DockItem({ item, mouseX, baseSize, maxSize, tooltip, setTooltip, index }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [baseSize, maxSize, baseSize]);
  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip */}
      {tooltip === index && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold bg-black/80 text-white px-2.5 py-1 rounded-lg pointer-events-none backdrop-blur-sm"
        >
          {item.label}
        </motion.div>
      )}

      <motion.button
        ref={ref}
        style={{ width, height: width }}
        onClick={item.onClick}
        onMouseEnter={() => setTooltip(index)}
        onMouseLeave={() => setTooltip(null)}
        className="flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer transition-colors backdrop-blur-sm border border-white/10 shadow-md"
        whileTap={{ scale: 0.92 }}
      >
        {item.icon}
      </motion.button>
    </div>
  );
}
