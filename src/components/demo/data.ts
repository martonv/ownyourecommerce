// Sample data for the interactive admin demo. The business and people are fictional.
export const business = 'Juniper Workshop';

export const money = (n: number) => `$${n.toLocaleString('en-US')}`;

export const products = [
  { sku: 'OAK-TBL-72', name: 'Oak dining table, 72"', price: 1890, wh: 'WH1', bin: 'A-04-2', available: 12, reorder: 10 },
  { sku: 'ASH-CHR-01', name: 'Ash dining chair', price: 360, wh: 'WH1', bin: 'A-09-1', available: 6, reorder: 12 },
  { sku: 'LIN-BNC-48', name: 'Linen bench, 48"', price: 640, wh: 'WH1', bin: 'B-11-1', available: 3, reorder: 8 },
  { sku: 'WAL-SHF-36', name: 'Walnut wall shelf, 36"', price: 280, wh: 'WH2', bin: 'C-02-4', available: 30, reorder: 15 },
  { sku: 'BRS-HDL-S', name: 'Brass handle set', price: 48, wh: 'WH2', bin: 'D-07-3', available: 220, reorder: 120 },
];

export const productName = (sku: string) => products.find((p) => p.sku === sku)?.name ?? sku;

export type OrderStatus = 'unfulfilled' | 'fulfilled' | 'production';

export const orders: {
  id: string;
  customer: string;
  sku: string;
  qty: number;
  total: number;
  status: OrderStatus;
  channel: 'Web' | 'Wholesale';
  when: string;
  today: boolean;
}[] = [
  { id: '3041', customer: 'Sarah Chen', sku: 'OAK-TBL-72', qty: 1, total: 1890, status: 'unfulfilled', channel: 'Web', when: 'Today, 2:42 pm', today: true },
  { id: '3040', customer: 'Marcus Johnson', sku: 'ASH-CHR-01', qty: 2, total: 720, status: 'unfulfilled', channel: 'Web', when: 'Today, 1:18 pm', today: true },
  { id: '3039', customer: 'Harbor Hotel Group', sku: 'ASH-CHR-01', qty: 40, total: 14400, status: 'production', channel: 'Wholesale', when: 'Today, 11:04 am', today: true },
  { id: '3038', customer: 'Emma Rodriguez', sku: 'WAL-SHF-36', qty: 1, total: 280, status: 'fulfilled', channel: 'Web', when: 'Yesterday', today: false },
  { id: '3037', customer: 'Olivia Bennett', sku: 'LIN-BNC-48', qty: 2, total: 1280, status: 'fulfilled', channel: 'Web', when: 'Yesterday', today: false },
];

export const statusLabel: Record<OrderStatus, string> = {
  unfulfilled: 'Unfulfilled',
  fulfilled: 'Fulfilled',
  production: 'In production',
};

export const stages = ['Planned', 'In progress', 'Quality check', 'Done'];

export const workOrders = [
  { id: 'WO-1183', sku: 'ASH-CHR-01', qty: 40, forOrder: '3039', stage: 0, due: 'Oct 2' },
  { id: 'WO-1182', sku: 'OAK-TBL-72', qty: 6, forOrder: '', stage: 1, due: 'Sep 18' },
  { id: 'WO-1181', sku: 'LIN-BNC-48', qty: 12, forOrder: '', stage: 1, due: 'Sep 16' },
  { id: 'WO-1179', sku: 'WAL-SHF-36', qty: 24, forOrder: '', stage: 2, due: 'Sep 12' },
];

// Bill of materials for WO-1183 (40 ash chairs).
export const materials = [
  { name: 'Ash lumber, 4/4', need: '120 bd ft', have: '164 bd ft', ok: true },
  { name: 'Seat webbing', need: '40', have: '52', ok: true },
  { name: 'Hardwax oil', need: '2 gal', have: '1.5 gal', ok: false, note: 'PO-2294 arrives Sep 15' },
];

export const dealStages = ['Lead', 'Qualified', 'Proposal', 'Won'];

export const deals = [
  { id: 'D-21', company: 'Cedar Coffee Roasters', contact: 'Priya Natarajan', value: 8200, stage: 0 },
  { id: 'D-19', company: 'Maple Street Studios', contact: 'Tom Alvarez', value: 3600, stage: 1 },
  { id: 'D-17', company: 'Lakeside Dental Group', contact: 'Aisha Grant', value: 11500, stage: 2 },
  { id: 'D-14', company: 'Harbor Hotel Group', contact: 'Dana Whitfield', value: 14400, stage: 3 },
];

export const contacts = [
  {
    id: 'dana',
    name: 'Dana Whitfield',
    company: 'Harbor Hotel Group',
    segment: 'Wholesale',
    lifetime: 38600,
    orders: 4,
    tags: ['Net 30', 'Hospitality'],
    timeline: [
      { when: 'Today', text: 'Placed order #3039: 40 ash dining chairs' },
      { when: 'Sep 2', text: 'Accepted proposal for lobby and restaurant seating' },
      { when: 'Aug 27', text: 'Site visit with the facilities team' },
    ],
  },
  {
    id: 'sarah',
    name: 'Sarah Chen',
    company: 'Retail customer',
    segment: 'Retail',
    lifetime: 3130,
    orders: 3,
    tags: ['VIP', 'Newsletter'],
    timeline: [
      { when: 'Today', text: 'Placed order #3041: oak dining table' },
      { when: 'Jul 14', text: 'Left a 5-star review for the walnut shelf' },
      { when: 'Jun 30', text: 'Opened the summer collection email' },
    ],
  },
  {
    id: 'priya',
    name: 'Priya Natarajan',
    company: 'Cedar Coffee Roasters',
    segment: 'Lead',
    lifetime: 0,
    orders: 0,
    tags: ['Cafe fit-out'],
    timeline: [
      { when: 'Yesterday', text: 'Requested a quote for 12 tables and 48 chairs' },
      { when: 'Sep 5', text: 'Downloaded the wholesale catalog' },
    ],
  },
];
