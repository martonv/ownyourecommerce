import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from 'motion/react';
import ProductFrame from './ProductFrame';
import FakeCursor from './FakeCursor';
import { useScript } from './useScript';
import { CustomerPanel, DashboardPanel, EASE, ProductionPanel, Sidebar } from './panels';
import { finalState, initialState, steps, type HeroState } from './state';
import './hero-demo.css';

/** Design canvas. Everything is laid out at this size and scaled to fit. */
const W = 1200;
const H = 750;
const RESTING_CURSOR = { x: W - 120, y: H - 90 };

function Panels({ state }: { state: HeroState }) {
  return (
    <div className="hd-stage">
      <AnimatePresence initial={false}>
        <motion.div
          key={state.module}
          className="hd-panel-slot"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          {state.module === 'dashboard' && <DashboardPanel state={state} />}
          {state.module === 'production' && <ProductionPanel state={state} />}
          {state.module === 'crm' && <CustomerPanel state={state} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function HeroDemo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  /** starts static so the server render and the first client frame agree */
  const [animated, setAnimated] = useState(false);
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();
  const inView = useInView(wrapRef, { amount: 0.4 });

  // scale the fixed canvas to the container
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // only animate on a wide screen, with motion allowed
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setAnimated(mq.matches && !reduced);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [reduced]);

  // pause in a background tab
  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const playing = animated && inView && visible;
  const { state, opacity } = useScript<HeroState>(initialState, steps, playing, { holdMs: 2500, fadeMs: 600 });
  const shown = animated ? state : finalState;

  return (
    <motion.div
      className="hd-root"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
    >
      <ProductFrame>
        <div className="hd-scale" ref={wrapRef}>
          <div
            className="hd-layer"
            ref={layerRef}
            style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }}
          >
            <MotionConfig transition={animated ? undefined : { duration: 0 }}>
              <div className="hd-app">
                <Sidebar module={shown.module} />
                <motion.div
                  className="hd-main"
                  animate={{ opacity: animated ? opacity : 1 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <Panels state={shown} />
                </motion.div>
              </div>
              {animated && (
                <FakeCursor
                  target={shown.cursorTarget}
                  clicks={shown.cursorClicks}
                  layerRef={layerRef}
                  scale={scale}
                  resting={RESTING_CURSOR}
                />
              )}
            </MotionConfig>
          </div>
        </div>
      </ProductFrame>
    </motion.div>
  );
}
