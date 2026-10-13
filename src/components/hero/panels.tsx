import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react';
import type { HeroState } from './state';

export const SPRING = { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 } as const;
export const EASE = [0.22, 1, 0.36, 1] as const;
const FADE = { duration: 0.22, ease: EASE } as const;

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

/* Rows are positioned with transforms rather than flow, so inserting one moves nothing
   in layout terms and the demo contributes no layout shift. Heights match hero-demo.css. */
const ORDER_ROW = 58;
const LINE_ROW = 44;

/** Counts without re-rendering React every frame. */
function Counter({ value, format = money, duration = 0.9 }: { value: number; format?: (n: number) => string; duration?: number }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => format(v));
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration, ease: EASE });
    return () => controls.stop();
  }, [value, duration, mv]);

  return <motion.span className="hd-tnum">{text}</motion.span>;
}

function Typewriter({ text, speed = 25 }: { text: string; speed?: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setShown(0);
    const id = window.setInterval(() => {
      setShown((n) => {
        if (n >= text.length) {
          window.clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);
  return <span>{text.slice(0, shown)}</span>;
}

const NAV = ['Dashboard', 'Orders', 'Inventory', 'Production', 'Customers', 'Marketing', 'Inbox', 'Internal'];
const ACTIVE: Record<HeroState['module'], string> = {
  dashboard: 'Dashboard',
  production: 'Production',
  crm: 'Customers',
};

export function Sidebar({ module }: { module: HeroState['module'] }) {
  const active = ACTIVE[module];
  return (
    <aside className="hd-rail">
      <span className="hd-brand">
        <span className="hd-mark">J</span>Juniper Workshop
      </span>
      <ul>
        {NAV.map((item) => (
          <li key={item} className={item === active ? 'is-on' : undefined}>
            {item === active && <motion.span layoutId="hd-pill" className="hd-pill" transition={SPRING} />}
            <span className="hd-nav-label">{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function DashboardPanel({ state }: { state: HeroState }) {
  const kpis = [
    { label: 'Revenue today', node: <Counter value={state.revenue} /> },
    { label: 'Orders to fulfill', node: <Counter value={state.toFulfill} format={(n) => String(Math.round(n))} duration={0.4} /> },
    { label: 'Low stock', node: <Counter value={state.lowStock} format={(n) => String(Math.round(n))} duration={0.4} />, pulse: state.lowStockPulse },
    { label: 'Jobs in production', node: <Counter value={state.jobCount} format={(n) => String(Math.round(n))} duration={0.4} /> },
  ];

  return (
    <div className="hd-panel">
      <div className="hd-head">
        <div>
          <strong>Good afternoon</strong>
          <span>Here's the workshop at a glance.</span>
        </div>
      </div>

      <div className="hd-kpis">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            className="hd-kpi"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...FADE, delay: i * 0.055 }}
          >
            <span className="hd-kpi-label">
              {k.label}
              {k.pulse && (
                <motion.i
                  className="hd-dot-warn"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.9] }}
                  transition={{ duration: 0.9, ease: EASE }}
                />
              )}
            </span>
            <span className="hd-kpi-value">{k.node}</span>
          </motion.div>
        ))}
      </div>

      <div className="hd-split">
        <div className="hd-card">
          <div className="hd-card-head">
            <span>Recent orders</span>
            <span className="hd-meta">Today</span>
          </div>
          <ul className="hd-orders hd-rows">
            <AnimatePresence initial={false}>
              {state.orders.slice(0, 5).map((o, i) => (
                <motion.li
                  key={o.id}
                  initial={{ opacity: 0, y: i * ORDER_ROW - 8 }}
                  animate={{
                    opacity: 1,
                    y: i * ORDER_ROW,
                    backgroundColor: o.fresh ? ['rgba(22,163,74,0.10)', 'rgba(22,163,74,0)'] : 'rgba(22,163,74,0)',
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ opacity: FADE, y: SPRING, backgroundColor: { duration: 1.2, ease: EASE } }}
                >
                  <span className="hd-stack">
                    <span className="hd-strong">{o.customer}</span>
                    <span className="hd-sub">
                      #{o.id} · {o.items}
                    </span>
                  </span>
                  <span className="hd-row-end">
                    <span className="hd-tnum hd-total">{o.total}</span>
                    <span className={`hd-chip is-${o.tone}`}>{o.status}</span>
                    {o.status === 'New' && (
                      <span className="hd-btn" data-demo-target="create-wo">
                        Create work order
                      </span>
                    )}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        <div className="hd-card">
          <div className="hd-card-head">
            <span>Activity</span>
            <span className="hd-meta">Today</span>
          </div>
          <ul className="hd-activity hd-rows">
            <AnimatePresence initial={false}>
              {state.activity.slice(0, 5).map((a, i) => (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, y: i * LINE_ROW - 6 }}
                  animate={{ opacity: 1, y: i * LINE_ROW }}
                  transition={{ y: SPRING, opacity: FADE }}
                >
                  {a.text}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </div>
  );
}

const STAGES = ['Planned', 'In progress', 'Quality check', 'Done'];

export function ProductionPanel({ state }: { state: HeroState }) {
  return (
    <div className="hd-panel">
      <div className="hd-head">
        <div>
          <strong>Production</strong>
          <span>Work orders driven by web and wholesale demand.</span>
        </div>
      </div>

      <div className="hd-board">
        {STAGES.map((stage, i) => (
          <div className="hd-col" key={stage}>
            <div className="hd-col-head">
              <span>{stage}</span>
              <span className="hd-count">{state.jobs.filter((j) => j.stage === i).length}</span>
            </div>
            <div className="hd-col-body">
              {state.jobs
                .filter((j) => j.stage === i)
                .map((j) => (
                  <motion.div
                    key={j.id}
                    layoutId={`hd-job-${j.id}`}
                    className="hd-job"
                    initial={j.fresh ? { opacity: 0, y: -8 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ layout: SPRING, ...FADE }}
                  >
                    <span className="hd-sub hd-mono">{j.id}</span>
                    <span className="hd-strong">{j.title}</span>
                    {j.forOrder && <span className="hd-chip is-info">Order #{j.forOrder}</span>}
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomerPanel({ state }: { state: HeroState }) {
  return (
    <div className="hd-panel">
      <div className="hd-head">
        <div>
          <strong>Harbor Hotel Group</strong>
          <span>Wholesale · Net 30 · Hospitality</span>
        </div>
      </div>

      <div className="hd-kpis hd-kpis-2">
        <div className="hd-kpi">
          <span className="hd-kpi-label">Lifetime value</span>
          <span className="hd-kpi-value">
            <Counter value={state.lifetime} />
          </span>
        </div>
        <div className="hd-kpi">
          <span className="hd-kpi-label">Orders</span>
          <span className="hd-kpi-value">
            <Counter value={state.timeline.length + 3} format={(n) => String(Math.round(n))} duration={0.4} />
          </span>
        </div>
      </div>

      <div className="hd-card hd-grow">
        <div className="hd-card-head">
          <span>Timeline</span>
          <span className="hd-meta">Most recent first</span>
        </div>
        <ul className="hd-activity hd-rows">
          <AnimatePresence initial={false}>
            {state.timeline.map((t, i) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, y: i * LINE_ROW - 6 }}
                animate={{ opacity: 1, y: i * LINE_ROW }}
                transition={{ y: SPRING, opacity: FADE }}
              >
                {t.typed ? <Typewriter text={t.text} /> : t.text}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
