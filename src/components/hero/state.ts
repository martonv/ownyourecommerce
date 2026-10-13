import type { ScriptStep } from './useScript';

/**
 * The hero storyboard: one order ripples through every module.
 *
 * TO TWEAK TIMINGS: change the `at` values below (milliseconds from the start of the loop).
 * Steps fire in order and only once per loop. The loop then holds for `holdMs` and fades back
 * over `fadeMs` (both passed to useScript in HeroDemo.tsx).
 */

export type HeroModule = 'dashboard' | 'production' | 'crm';

export interface HeroOrder {
  id: string;
  customer: string;
  items: string;
  total: string;
  status: 'New' | 'Unfulfilled' | 'In production' | 'Fulfilled';
  tone: 'new' | 'warn' | 'info' | 'ok';
  fresh?: boolean;
}

export interface HeroJob {
  id: string;
  title: string;
  forOrder?: string;
  stage: number;
  fresh?: boolean;
}

export interface HeroState {
  module: HeroModule;
  orders: HeroOrder[];
  activity: { id: string; text: string }[];
  revenue: number;
  toFulfill: number;
  lowStock: number;
  lowStockPulse: boolean;
  jobs: HeroJob[];
  jobCount: number;
  lifetime: number;
  timeline: { id: string; text: string; typed?: boolean }[];
  cursorTarget: string | null;
  cursorClicks: number;
}

export const initialState: HeroState = {
  module: 'dashboard',
  orders: [
    { id: '3041', customer: 'Sarah Chen', items: '1 × Oak dining table, 72"', total: '$1,890', status: 'Unfulfilled', tone: 'warn' },
    { id: '3040', customer: 'Marcus Johnson', items: '2 × Ash dining chair', total: '$720', status: 'Unfulfilled', tone: 'warn' },
    { id: '3039', customer: 'Harbor Hotel Group', items: '40 × Ash dining chair', total: '$14,400', status: 'In production', tone: 'info' },
    { id: '3038', customer: 'Emma Rodriguez', items: '1 × Walnut wall shelf, 36"', total: '$280', status: 'Fulfilled', tone: 'ok' },
  ],
  activity: [
    { id: 'a1', text: 'WO-1179 moved to Quality check' },
    { id: 'a2', text: 'Harbor Hotel Group accepted a proposal' },
    { id: 'a3', text: 'PO-2291 received: 48 brass handle sets' },
  ],
  revenue: 17010,
  toFulfill: 2,
  lowStock: 2,
  lowStockPulse: false,
  jobs: [
    { id: 'WO-1183', title: '40 × Ash dining chair', forOrder: '3039', stage: 0 },
    { id: 'WO-1182', title: '6 × Oak dining table', stage: 1 },
    { id: 'WO-1181', title: '12 × Linen bench', stage: 1 },
    { id: 'WO-1179', title: '24 × Walnut wall shelf', stage: 2 },
  ],
  jobCount: 4,
  lifetime: 38600,
  timeline: [
    { id: 't1', text: 'Accepted proposal for lobby and restaurant seating' },
    { id: 't2', text: 'Site visit with the facilities team' },
  ],
  cursorTarget: null,
  cursorClicks: 0,
};

const newOrder: HeroOrder = {
  id: '3042',
  customer: 'Harbor Hotel Group',
  items: '12 × Ash dining chair',
  total: '$4,320',
  status: 'New',
  tone: 'new',
  fresh: true,
};

export const steps: ScriptStep<HeroState>[] = [
  {
    // a new order arrives at the top of the list
    at: 800,
    action: (s) => ({ ...s, orders: [newOrder, ...s.orders], toFulfill: s.toFulfill + 1 }),
  },
  {
    // revenue counts up
    at: 1400,
    action: (s) => ({ ...s, revenue: 21330 }),
  },
  {
    // the stock it consumes shows up, and low stock ticks
    at: 2200,
    action: (s) => ({
      ...s,
      activity: [{ id: 'a-stock', text: 'Ash dining chair · 6 → 0 available' }, ...s.activity],
      lowStock: 3,
      lowStockPulse: true,
    }),
  },
  { at: 2800, action: (s) => ({ ...s, lowStockPulse: false, orders: s.orders.map((o) => ({ ...o, fresh: false })) }) },
  {
    // cursor glides to the button on the new row
    at: 3200,
    action: (s) => ({ ...s, cursorTarget: 'create-wo' }),
  },
  { at: 3450, action: (s) => ({ ...s, cursorClicks: s.cursorClicks + 1 }) },
  {
    // production takes over, with the new work order in Planned
    at: 3600,
    action: (s) => ({
      ...s,
      module: 'production',
      cursorTarget: null,
      jobs: [{ id: 'WO-1184', title: '12 × Ash dining chair', forOrder: '3042', stage: 0, fresh: true }, ...s.jobs],
      jobCount: 5,
    }),
  },
  {
    // and moves across the board
    at: 4200,
    action: (s) => ({ ...s, jobs: s.jobs.map((j) => (j.id === 'WO-1184' ? { ...j, stage: 1 } : j)) }),
  },
  {
    // the customer record, with the order typed into the timeline
    at: 5400,
    action: (s) => ({
      ...s,
      module: 'crm',
      lifetime: 42920,
      timeline: [{ id: 't-new', text: 'Placed order #3042, 12 ash dining chairs', typed: true }, ...s.timeline],
    }),
  },
  {
    // back to the dashboard, books updated
    at: 7200,
    action: (s) => ({
      ...s,
      module: 'dashboard',
      activity: [{ id: 'a-inv', text: 'Invoice INV-2207 synced to QuickBooks' }, ...s.activity],
    }),
  },
  { at: 7800, action: (s) => s },
];

/** The frame the static (reduced motion, small screen) render shows. */
export const finalState: HeroState = steps.reduce((s, step) => step.action(s), {
  ...initialState,
  orders: initialState.orders.map((o) => ({ ...o })),
});
