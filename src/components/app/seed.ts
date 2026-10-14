/**
 * Deterministic sample data for the demo admin.
 *
 * Planned tables: tenants, products, variants, collections, inventory_levels, customers,
 * customer_groups, price_sheets, orders, order_lines, draft_orders, discounts, leads, contacts,
 * companies, conversations, campaigns, events_web, components, suppliers, purchase_orders,
 * batches, service_jobs, tickets, projects, goals, punches, chat_messages, audit_log.
 *
 * Nothing here touches a network or a clock, so every render is identical: the data is generated
 * from a seeded PRNG and a fixed "today", which is what keeps screenshots and demos repeatable.
 */

export const TENANT = {
  id: 'tnt_northwind',
  name: 'Northwind Supply Co.',
  initials: 'N',
  domain: 'northwindsupply.example.com',
};

/** mulberry32: small, fast, and identical in every browser and on the server. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r = rng(20260413);
const pick = <T>(list: T[]) => list[Math.floor(r() * list.length)];
const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));

/** Fixed "today" so relative dates never drift. */
export const TODAY = new Date('2026-04-13T09:20:00');

const DAY = 86400000;
export const shiftDay = (days: number) => new Date(TODAY.getTime() + days * DAY);

export const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export const money2 = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
export const num = (n: number) => n.toLocaleString('en-US');
export const pct = (n: number) => `${n.toFixed(1)}%`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmtDate = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
export const fmtDateTime = (d: Date) =>
  `${fmtDate(d)}, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

/** "Today, 2:42 pm" style, relative to the fixed TODAY. */
export function relative(d: Date) {
  const days = Math.round((TODAY.getTime() - d.getTime()) / DAY);
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  if (days <= 0) return `Today, ${time}`;
  if (days === 1) return `Yesterday, ${time}`;
  if (days < 7) return `${days} days ago`;
  return fmtDate(d);
}

// ---------------------------------------------------------------- people

const FIRST = ['Sarah', 'Marcus', 'Emma', 'Olivia', 'Noah', 'Grace', 'Leo', 'Ava', 'Mia', 'Ravi', 'Jonas', 'Priya', 'Tomás', 'Alice', 'Dana', 'Elise', 'Ray', 'Hana', 'Owen', 'Beatriz', 'Felix', 'Nora', 'Caleb', 'Ines'];
const LAST = ['Chen', 'Johnson', 'Rodriguez', 'Bennett', 'Patel', 'Kim', 'Martins', 'Brooks', 'Laurent', 'Okafor', 'Beck', 'Raman', 'Herrera', 'Nowak', 'Whitfield', 'Tran', 'Okonkwo', 'Sato', 'Gallagher', 'Costa', 'Weiss', 'Lindqvist', 'Mbeki', 'Duarte'];

export const person = (i: number) => `${FIRST[i % FIRST.length]} ${LAST[(i * 7) % LAST.length]}`;
export const initialsOf = (name: string) =>
  name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
/** Reserved domain, so nothing here can reach a real inbox. */
export const emailOf = (name: string) => `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`;

export const COMPANIES = [
  'Harbor Hotel Group', 'Cedar & Pine Interiors', 'Meridian Workspaces', 'Brightfield Hospitality',
  'Union Row Developments', 'Kestrel Contract Furnishing', 'Lakeside Resorts', 'Atlas Office Fitout',
  'Hollow Creek Lodge', 'Tidewater Restaurants', 'Northgate Student Living', 'Ember & Oak Cafés',
];

// ---------------------------------------------------------------- catalog

const MATERIALS = ['Oak', 'Ash', 'Walnut', 'Maple', 'Birch', 'Cherry'];
const TYPES = [
  { name: 'dining table', lo: 1200, hi: 2400 },
  { name: 'dining chair', lo: 240, hi: 480 },
  { name: 'wall shelf', lo: 180, hi: 420 },
  { name: 'linen bench', lo: 520, hi: 980 },
  { name: 'side table', lo: 280, hi: 640 },
  { name: 'bar stool', lo: 260, hi: 520 },
  { name: 'desk', lo: 900, hi: 1800 },
  { name: 'credenza', lo: 1100, hi: 2200 },
  { name: 'bookcase', lo: 700, hi: 1500 },
  { name: 'nightstand', lo: 320, hi: 680 },
];
const SIZES = ['48"', '60"', '72"', '84"'];
export const COLORS = [
  { name: 'Natural', hex: '#d8c3a5' },
  { name: 'Smoke', hex: '#8a8d91' },
  { name: 'Espresso', hex: '#4a3728' },
  { name: 'Ink', hex: '#2b2f36' },
  { name: 'Clay', hex: '#b2705a' },
];

export interface Product {
  sku: string;
  name: string;
  type: string;
  price: number;
  cost: number;
  available: number;
  committed: number;
  reorder: number;
  warehouse: string;
  variants: number;
  status: 'active' | 'draft' | 'archived';
  colors: string[];
  sold90: number;
}

const WAREHOUSES = ['Main', 'Overflow', 'East dock'];

export const products: Product[] = Array.from({ length: 48 }, (_, i) => {
  const type = TYPES[i % TYPES.length];
  const material = MATERIALS[(i * 3) % MATERIALS.length];
  const needsSize = /table|desk|shelf|bench|credenza|bookcase/.test(type.name);
  const name = `${material} ${type.name}${needsSize ? `, ${SIZES[i % SIZES.length]}` : ''}`;
  const price = Math.round((type.lo + r() * (type.hi - type.lo)) / 10) * 10;
  const reorder = int(6, 28);
  return {
    sku: `NW-${String(1000 + i * 7)}`,
    name,
    type: type.name,
    price,
    cost: Math.round(price * (0.38 + r() * 0.14)),
    available: int(0, 90),
    committed: int(0, 24),
    reorder,
    warehouse: WAREHOUSES[i % WAREHOUSES.length],
    variants: needsSize ? int(4, 12) : int(2, 5),
    status: i % 17 === 0 ? 'draft' : 'active',
    colors: COLORS.slice(0, 2 + (i % 4)).map((c) => c.name),
    sold90: int(4, 260),
  };
});

export const productBySku = (sku: string) => products.find((p) => p.sku === sku)!;
export const lowStock = products.filter((p) => p.available < p.reorder);

// ---------------------------------------------------------------- orders

export type OrderStatus = 'unfulfilled' | 'production' | 'ready' | 'fulfilled' | 'cancelled';
export type PayStatus = 'paid' | 'pending' | 'refunded' | 'partial';

export interface Order {
  id: number;
  customer: string;
  company?: string;
  channel: 'Web' | 'Wholesale' | 'Marketplace' | 'Phone';
  placed: Date;
  sku: string;
  qty: number;
  total: number;
  status: OrderStatus;
  pay: PayStatus;
  state: string;
}

const STATES = ['CA', 'TX', 'NY', 'WA', 'IL', 'FL', 'CO', 'MA', 'GA', 'OR', 'MN', 'AZ'];
const CHANNELS: Order['channel'][] = ['Web', 'Web', 'Web', 'Wholesale', 'Marketplace', 'Phone'];
const ORDER_STATUSES: OrderStatus[] = ['unfulfilled', 'unfulfilled', 'production', 'ready', 'fulfilled', 'fulfilled', 'fulfilled'];

export const orders: Order[] = Array.from({ length: 26 }, (_, i) => {
  const product = products[int(0, products.length - 1)];
  const channel = CHANNELS[i % CHANNELS.length];
  const qty = channel === 'Wholesale' ? int(12, 60) : int(1, 4);
  const status = i < 2 ? 'unfulfilled' : i === 2 ? 'production' : ORDER_STATUSES[i % ORDER_STATUSES.length];
  return {
    id: 3041 - i,
    customer: channel === 'Wholesale' ? COMPANIES[i % COMPANIES.length] : person(i),
    company: channel === 'Wholesale' ? COMPANIES[i % COMPANIES.length] : undefined,
    channel,
    placed: new Date(TODAY.getTime() - i * DAY * 0.42 - int(0, 8) * 3600000),
    sku: product.sku,
    qty,
    total: product.price * qty,
    status,
    pay: status === 'cancelled' ? 'refunded' : channel === 'Wholesale' && i % 3 === 0 ? 'pending' : 'paid',
    state: STATES[i % STATES.length],
  };
});

export const unfulfilled = orders.filter((o) => o.status === 'unfulfilled');

export const draftOrders = Array.from({ length: 8 }, (_, i) => ({
  id: `D-${420 + i}`,
  customer: COMPANIES[(i * 5) % COMPANIES.length],
  owner: person(i + 3),
  items: int(2, 9),
  total: int(1800, 26000),
  status: (['Draft', 'Invoice sent', 'Awaiting payment', 'Draft'] as const)[i % 4],
  group: (['Trade tier 2', 'Hospitality', 'Standard', 'Trade tier 1'] as const)[i % 4],
  updated: shiftDay(-int(0, 9)),
}));

// ---------------------------------------------------------------- customers

export const GROUPS_LIST = [
  { key: 'standard', name: 'Standard', members: 1842, rule: 'List price', sheets: 0 },
  { key: 'trade1', name: 'Trade tier 1', members: 96, rule: '15% off list', sheets: 1 },
  { key: 'trade2', name: 'Trade tier 2', members: 38, rule: '22% off list', sheets: 2 },
  { key: 'hospitality', name: 'Hospitality', members: 24, rule: 'Per-product price sheet', sheets: 3 },
];

export const customers = Array.from({ length: 22 }, (_, i) => {
  const isCompany = i % 3 === 0;
  const name = isCompany ? COMPANIES[i % COMPANIES.length] : person(i + 2);
  const ordersCount = int(1, 38);
  return {
    name,
    email: emailOf(isCompany ? name.split(' ')[0] + '.buying' : name),
    group: isCompany ? GROUPS_LIST[1 + (i % 3)].name : 'Standard',
    orders: ordersCount,
    ltv: ordersCount * int(380, 2400),
    state: STATES[i % STATES.length],
    last: shiftDay(-int(0, 120)),
    tags: isCompany ? ['wholesale', 'net-30'] : i % 4 === 0 ? ['repeat'] : [],
  };
});

// ---------------------------------------------------------------- CRM

export const PIPELINE_STAGES = ['New', 'Contacted', 'Qualified', 'Sample sent', 'Application', 'Won'];

export const leads = Array.from({ length: 18 }, (_, i) => ({
  id: `L-${3200 + i}`,
  company: COMPANIES[i % COMPANIES.length],
  contact: person(i + 5),
  stage: PIPELINE_STAGES[i % PIPELINE_STAGES.length],
  value: int(4, 92) * 1000,
  owner: ['Priya Raman', 'Marcus Oyelaran', 'Tomás Herrera'][i % 3],
  state: STATES[(i * 3) % STATES.length],
  source: ['Website form', 'Trade show', 'Referral', 'Leads map', 'Affiliate'][i % 5],
  next: shiftDay(int(-2, 14)),
  sampleApproval: i % 7 === 3,
}));

export const TERRITORIES = [
  { rep: 'Priya Raman', states: ['CA', 'OR', 'WA', 'NV', 'AZ'], open: 11, won: 4 },
  { rep: 'Marcus Oyelaran', states: ['TX', 'CO', 'NM', 'OK', 'KS'], open: 8, won: 6 },
  { rep: 'Tomás Herrera', states: ['NY', 'MA', 'NJ', 'CT', 'PA'], open: 14, won: 3 },
  { rep: 'Unassigned', states: ['FL', 'GA', 'IL', 'MN'], open: 5, won: 0 },
];

export const conversations = Array.from({ length: 10 }, (_, i) => {
  const channel = (['Chat', 'Email', 'SMS', 'Form', 'Phone'] as const)[i % 5];
  const name = person(i + 1);
  return {
    id: `C-${900 + i}`,
    who: name,
    channel,
    subject: [
      'Where is order #3039?',
      'Can I change the finish before it ships?',
      'Do you deliver to a loading dock?',
      'Trade pricing for 40 chairs',
      'Damaged panel on arrival',
      'Lead time on walnut credenza',
      'Invoice copy for accounts',
      'Swatch request',
      'Cancel one line of my order',
      'Bulk quote for 12 rooms',
    ][i],
    status: (['human', 'ai', 'resolved', 'ai', 'human'] as const)[i % 5],
    waiting: `${int(2, 58)}m`,
    assignee: i % 3 === 0 ? 'Tomás Herrera' : i % 3 === 1 ? 'AI assistant' : 'Unassigned',
  };
});

// ---------------------------------------------------------------- growth

export const campaigns = Array.from({ length: 9 }, (_, i) => {
  const sent = int(1800, 24000);
  const opened = Math.round(sent * (0.28 + r() * 0.3));
  const clicked = Math.round(opened * (0.08 + r() * 0.22));
  return {
    name: [
      'Spring dining refresh', 'Back in stock: walnut', 'Trade program invite', 'Abandoned cart · 4h',
      'Post-purchase care guide', 'Win-back · 120 days', 'New collection preview', 'Warehouse clearance',
      'Loyalty tier upgrade',
    ][i],
    type: (['Campaign', 'Flow', 'Campaign', 'Flow', 'Flow', 'Flow', 'Campaign', 'Campaign', 'Flow'] as const)[i],
    channel: (['Email', 'Email', 'Email', 'Email', 'Email', 'SMS', 'Email', 'SMS', 'Email'] as const)[i],
    status: (['Sent', 'Live', 'Draft', 'Live', 'Live', 'Live', 'Scheduled', 'Sent', 'Live'] as const)[i],
    sent,
    open: (opened / sent) * 100,
    click: (clicked / sent) * 100,
    revenue: clicked * int(40, 180),
  };
});

export const discounts = Array.from({ length: 8 }, (_, i) => ({
  code: ['SPRING15', 'TRADE22', 'WELCOME10', 'FREIGHTFREE', 'BUNDLE3', 'LOYAL20', 'SAMPLE0', 'CLEAR30'][i],
  type: (['Percent', 'Percent', 'Percent', 'Shipping', 'Bundle', 'Percent', 'Fixed', 'Percent'] as const)[i],
  value: ['15%', '22%', '10%', 'Free', '3 for 2', '20%', '$0', '30%'][i],
  used: [412, 38, 1290, 221, 64, 97, 15, 540][i],
  status: (['Active', 'Active', 'Active', 'Scheduled', 'Active', 'Paused', 'Archived', 'Active'] as const)[i],
  ends: shiftDay(int(5, 90)),
}));

/** 13 months of traffic, with a seasonal shape so the charts look like a real business. */
export const trafficMonths = Array.from({ length: 13 }, (_, i) => {
  const month = (TODAY.getMonth() - 12 + i + 24) % 12;
  const season = 1 + 0.35 * Math.sin(((month - 2) / 12) * Math.PI * 2);
  const visitors = Math.round((9000 + i * 320) * season * (0.94 + r() * 0.12));
  return {
    label: MONTHS[month],
    visitors,
    sessions: Math.round(visitors * 1.38),
    orders: Math.round(visitors * (0.016 + r() * 0.008)),
    revenue: Math.round(visitors * (0.016 + r() * 0.008) * int(380, 620)),
  };
});

export const SOURCES = [
  { name: 'Organic search', visits: 18420, share: 34 },
  { name: 'Direct', visits: 11280, share: 21 },
  { name: 'Paid search', visits: 7940, share: 15 },
  { name: 'Email', visits: 5310, share: 10 },
  { name: 'Organic social', visits: 4120, share: 8 },
  { name: 'AI assistants', visits: 2980, share: 6 },
  { name: 'Referral', visits: 1840, share: 3 },
  { name: 'Affiliate', visits: 1520, share: 3 },
];

export const SEARCH_TERMS = [
  { term: 'walnut dining table', count: 412, zero: false },
  { term: 'bar stool counter height', count: 288, zero: false },
  { term: 'outdoor bench', count: 164, zero: true },
  { term: 'oak credenza 72', count: 141, zero: false },
  { term: 'swatch kit', count: 119, zero: false },
  { term: 'standing desk', count: 96, zero: true },
];

export const FUNNEL = [
  { step: 'Sessions', value: 54210 },
  { step: 'Product viewed', value: 28940 },
  { step: 'Added to cart', value: 9120 },
  { step: 'Checkout started', value: 4380 },
  { step: 'Purchased', value: 1964 },
];

// ---------------------------------------------------------------- operations

export const components = Array.from({ length: 12 }, (_, i) => {
  const onHand = int(0, 400);
  const lead = int(3, 28);
  return {
    sku: `CMP-${200 + i * 3}`,
    name: ['White oak board, 8/4', 'Ash board, 4/4', 'Walnut veneer sheet', 'Steel leg set, black', 'Brass pull, 4in',
      'Matte topcoat, 5gal', 'Danish oil, 1gal', 'Felt pad sheet', 'Dowel pin, 10mm', 'Wood glue, 5gal',
      'Linen webbing, 50m', 'Shipping blanket'][i],
    onHand,
    lead,
    safety: int(20, 90),
    supplier: ['Timberline Mills', 'Northforge Metals', 'Cascade Finishes', 'Atlas Hardware'][i % 4],
    unit: ['bd ft', 'bd ft', 'sheet', 'set', 'ea', 'gal', 'gal', 'sheet', 'ea', 'gal', 'm', 'ea'][i],
  };
});

export const purchaseOrders = Array.from({ length: 7 }, (_, i) => ({
  id: `PO-${1180 + i}`,
  supplier: ['Timberline Mills', 'Northforge Metals', 'Cascade Finishes', 'Atlas Hardware'][i % 4],
  lines: int(2, 11),
  total: int(1200, 24000),
  status: (['Draft', 'Sent', 'Partially received', 'Received', 'Sent', 'Draft', 'Received'] as const)[i],
  due: shiftDay(int(-4, 26)),
}));

export const WORK_CENTERS = ['Mill', 'Joinery', 'Finishing', 'Assembly', 'Pack'];

export const batches = Array.from({ length: 14 }, (_, i) => {
  const product = products[(i * 5) % products.length];
  return {
    id: `WO-${1180 + i}`,
    product: product.name,
    sku: product.sku,
    qty: int(6, 48),
    center: WORK_CENTERS[i % WORK_CENTERS.length],
    stage: (['Planned', 'In progress', 'In progress', 'Complete'] as const)[i % 4],
    start: shiftDay(i - 5),
    days: int(1, 4),
    forOrder: i % 4 === 0 ? 3041 - i : undefined,
  };
});

export const serviceJobs = Array.from({ length: 10 }, (_, i) => ({
  id: `J-${770 + i}`,
  client: COMPANIES[(i * 2) % COMPANIES.length],
  type: ['Install', 'Repair', 'Site survey', 'Warranty', 'Install'][i % 5],
  tech: ['Ray Okonkwo', 'Hana Sato', 'Owen Gallagher'][i % 3],
  when: shiftDay(int(-3, 12)),
  status: (['Scheduled', 'En route', 'In progress', 'Complete', 'Scheduled'] as const)[i % 5],
  value: int(400, 7800),
  state: STATES[(i * 4) % STATES.length],
}));

// ---------------------------------------------------------------- workspace

export const TEAMS = [
  { name: 'Sales', manager: 'Marcus Oyelaran', people: 7, dept: 'Sales' },
  { name: 'Support', manager: 'Marcus Oyelaran', people: 4, dept: 'Sales' },
  { name: 'Shop floor', manager: 'Alice Nowak', people: 12, dept: 'Production' },
  { name: 'Finishing', manager: 'Alice Nowak', people: 5, dept: 'Production' },
  { name: 'Growth', manager: 'Elise Tran', people: 4, dept: 'Marketing' },
  { name: 'Field service', manager: 'Dana Whitfield', people: 6, dept: 'Service' },
];

export const TICKET_QUEUES = ['Facilities', 'IT', 'Production', 'People', 'Finance'];

export const tickets = Array.from({ length: 16 }, (_, i) => ({
  id: `T-${300 + i}`,
  title: [
    'Dust extraction on saw 2 is weak', 'New laptop for incoming rep', 'Forklift annual inspection due',
    'Add Priya to the trade pricing sheet', 'Label printer offline at pack bench', 'Expense policy question',
    'Request: second monitor', 'Air compressor leaking', 'Update emergency contact list',
    'Wholesale invoice template wrong logo', 'Spare blades running low', 'Access to analytics dashboard',
    'Breakroom fridge not cooling', 'Onboard new finisher', 'Shipping scale needs calibration',
    'VPN drops on the shop tablet',
  ][i],
  queue: TICKET_QUEUES[i % TICKET_QUEUES.length],
  priority: (['Urgent', 'High', 'Normal', 'Normal', 'Low'] as const)[i % 5],
  status: (['Open', 'In progress', 'Waiting', 'Open', 'Done'] as const)[i % 5],
  assignee: person(i + 4),
  due: shiftDay(int(-2, 12)),
  raised: shiftDay(-int(0, 14)),
}));

export const projects = Array.from({ length: 6 }, (_, i) => ({
  name: ['Trade portal launch', 'Warehouse relabelling', 'Spring catalog shoot', 'ERP data migration',
    'Finishing line upgrade', 'Service app rollout'][i],
  lead: ['Elise Tran', 'Alice Nowak', 'Elise Tran', 'Dana Whitfield', 'Alice Nowak', 'Dana Whitfield'][i],
  progress: [72, 38, 91, 24, 55, 12][i],
  health: (['On track', 'At risk', 'On track', 'At risk', 'On track', 'On track'] as const)[i],
  due: shiftDay([18, 44, 6, 90, 60, 120][i]),
  tickets: int(3, 18),
}));

export const goals = [
  { objective: 'Wholesale becomes a third of revenue', owner: 'Marcus Oyelaran', progress: 64, grade: 'On track', krs: 3 },
  { objective: 'Cut order-to-ship to 9 days', owner: 'Alice Nowak', progress: 41, grade: 'At risk', krs: 4 },
  { objective: 'Email drives 15% of revenue', owner: 'Elise Tran', progress: 78, grade: 'On track', krs: 3 },
  { objective: 'Zero overselling incidents', owner: 'Dana Whitfield', progress: 92, grade: 'On track', krs: 2 },
];

export const KPIS = [
  { name: 'Order to ship', value: '11.4 days', target: '9 days', trend: -8 },
  { name: 'On-time delivery', value: '94.2%', target: '97%', trend: 3 },
  { name: 'First reply time', value: '42 min', target: '30 min', trend: -12 },
  { name: 'Stockout incidents', value: '2', target: '0', trend: -60 },
];

export const punches = Array.from({ length: 8 }, (_, i) => ({
  who: person(i + 6),
  in: `${6 + (i % 3)}:${String(int(0, 5))}${int(0, 9)} am`,
  out: i < 5 ? '—' : `${3 + (i % 3)}:${int(1, 5)}${int(0, 9)} pm`,
  hours: i < 5 ? `${(2 + r() * 4).toFixed(1)}` : `${(7.5 + r()).toFixed(1)}`,
  team: ['Shop floor', 'Finishing', 'Shop floor', 'Pack'][i % 4],
  flag: i === 3 ? 'Missed break' : i === 6 ? 'Overtime' : '',
}));

export const chatChannels = [
  { name: 'general', unread: 0, people: 34 },
  { name: 'shop-floor', unread: 3, people: 17 },
  { name: 'sales', unread: 0, people: 11 },
  { name: 'growth', unread: 2, people: 5 },
  { name: 'incidents', unread: 0, people: 9 },
];

export const chatMessages = [
  { who: 'Alice Nowak', text: 'Saw 2 is back up, dust extraction fixed. WO-1184 can start.', when: '9:02 am', me: false },
  { who: 'Jonas Beck', text: 'Finishing bay is clear from 11, I can take it.', when: '9:05 am', me: false },
  { who: 'You', text: 'Nice. I will move the Harbor order forward a day.', when: '9:11 am', me: true },
  { who: 'Priya Raman', text: 'Harbor wants to add 8 more chairs to #3039 if we can still hit the date.', when: '9:18 am', me: false },
];

export const notifications = [
  { text: 'Harbor Hotel Group replied in the support inbox', when: '4m', kind: 'inbox' },
  { text: 'WO-1182 finished in Finishing', when: '22m', kind: 'production' },
  { text: 'Sample request from Kestrel needs your approval', when: '1h', kind: 'approval' },
  { text: '3 components dropped below their reorder point', when: '2h', kind: 'inventory' },
  { text: 'Spring dining refresh finished sending', when: '5h', kind: 'email' },
];

export const auditLog = [
  { who: 'AI assistant (as Dana Whitfield)', what: 'Drafted purchase order PO-1186', when: 'Today, 9:14 am', kind: 'draft' },
  { who: 'Marcus Oyelaran', what: 'Approved sample request for Kestrel Contract Furnishing', when: 'Today, 8:51 am', kind: 'approve' },
  { who: 'Elise Tran', what: 'Scheduled campaign "New collection preview"', when: 'Yesterday, 4:32 pm', kind: 'schedule' },
  { who: 'Alice Nowak', what: 'Changed Finishing daily capacity 40 → 48 units', when: 'Yesterday, 2:10 pm', kind: 'settings' },
  { who: 'Tomás Herrera', what: 'Refunded $280 on order #3012', when: 'Apr 11, 11:04 am', kind: 'sensitive' },
];

export const INTEGRATIONS = [
  { name: 'Anthropic Claude', area: 'AI', set: false, note: 'Not set — AI features run in limited mode' },
  { name: 'Supabase', area: 'Database & auth', set: true, note: 'Connected' },
  { name: 'Cloudflare R2', area: 'Media storage', set: true, note: 'Connected' },
  { name: 'Helcim', area: 'Payments', set: true, note: 'Connected' },
  { name: 'ShipStation', area: 'Shipping', set: true, note: 'Connected' },
  { name: 'QuickBooks', area: 'Accounting', set: true, note: 'Syncing nightly' },
  { name: 'Google Merchant Center', area: 'Ads', set: true, note: 'Feed healthy' },
  { name: 'Cloudflare Turnstile', area: 'Bot protection', set: false, note: 'Not set' },
];

export const counts = {
  toFulfill: unfulfilled.length,
  needsHuman: conversations.filter((c) => c.status === 'human').length,
  lowStock: lowStock.length,
  openTickets: tickets.filter((t) => t.status !== 'Done').length,
  revenueToday: orders
    .filter((o) => Math.round((TODAY.getTime() - o.placed.getTime()) / DAY) === 0)
    .reduce((s, o) => s + o.total, 0),
};
