import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const GLIDE = { type: 'spring', stiffness: 120, damping: 20 } as const;

/**
 * A pointer that glides to [data-demo-target="..."] inside the frame and clicks.
 * Coordinates are measured against the unscaled 1200x750 layer, so the CSS transform
 * on the frame does not have to be accounted for anywhere else.
 */
export default function FakeCursor({
  target,
  clicks,
  layerRef,
  scale,
  resting,
}: {
  target: string | null;
  clicks: number;
  layerRef: React.RefObject<HTMLDivElement | null>;
  scale: number;
  resting: { x: number; y: number };
}) {
  const [point, setPoint] = useState(resting);
  const [ripple, setRipple] = useState(0);
  const pressed = useRef(0);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    if (!target) {
      setPoint(resting);
      return;
    }
    const el = layer.querySelector<HTMLElement>(`[data-demo-target="${target}"]`);
    if (!el) return;
    const a = el.getBoundingClientRect();
    const b = layer.getBoundingClientRect();
    setPoint({
      x: (a.left - b.left) / scale + a.width / scale / 2,
      y: (a.top - b.top) / scale + a.height / scale / 2,
    });
  }, [target, scale, layerRef, resting]);

  useEffect(() => {
    if (clicks === pressed.current) return;
    pressed.current = clicks;
    setRipple(clicks);
  }, [clicks]);

  return (
    <motion.div className="hd-cursor" animate={{ x: point.x, y: point.y }} transition={GLIDE} aria-hidden="true">
      <AnimatePresence>
        {ripple > 0 && (
          <motion.span
            key={ripple}
            className="hd-ripple"
            initial={{ scale: 0.3, opacity: 0.2 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        animate={{ scale: ripple === pressed.current && ripple > 0 ? [1, 0.85, 1] : 1 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <path
          d="M4 2.5l10.5 6.2-4.6 1-2.2 4.4z"
          fill="#fff"
          stroke="rgba(9,9,11,0.55)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}
