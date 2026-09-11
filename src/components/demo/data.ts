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

export const channels = [
  { id: 'gmc', name: 'Google Merchant Center', detail: 'Feed synced from live stock · 5 products approved', connected: true },
  { id: 'gads', name: 'Google Ads', detail: 'Enhanced conversions on', connected: true },
  { id: 'meta', name: 'Meta Pixel + Conversions API', detail: 'Server events matched: 96%', connected: true },
  { id: 'metashops', name: 'Instagram and Facebook Shops', detail: 'Catalog synced from live stock · 5 products', connected: true },
  { id: 'tiktokshop', name: 'TikTok Shop', detail: 'Not connected', connected: false },
  { id: 'tiktok', name: 'TikTok Pixel + Events API', detail: 'Not connected', connected: false },
  { id: 'pinterest', name: 'Pinterest tag', detail: 'Not connected', connected: false },
];

export const experiment = {
  name: 'Product page button: "Add to cart" vs "Buy now, ships in 2 days"',
  days: 14,
  variants: [
    { label: 'A · Add to cart', rate: 3.1 },
    { label: 'B · Buy now, ships in 2 days', rate: 3.6 },
  ],
  lift: '+16% orders',
  confidence: '97% confidence',
};

export const seoChecks = [
  { label: 'Product structured data', ok: true, fixed: '' },
  { label: 'FAQ and review schema', ok: true, fixed: '' },
  { label: 'llms.txt for AI assistants', ok: true, fixed: '' },
  { label: 'Merchant feed matches the site', ok: true, fixed: '' },
  { label: '2 products missing meta descriptions', ok: false, fixed: 'Meta descriptions written for 2 products' },
  { label: '3 images missing alt text', ok: false, fixed: 'Alt text written for 3 images' },
];

// What the AI copywriter knows about each product.
export const copyFacts: Record<string, { short: string; material: string; detail: string; lead: string }> = {
  'OAK-TBL-72': { short: 'oak dining table', material: 'solid white oak', detail: 'It seats eight and is finished in hardwax oil.', lead: '2 weeks' },
  'ASH-CHR-01': { short: 'ash dining chair', material: 'solid ash', detail: 'The back is steam-bent and the seat is hand-woven.', lead: '10 days' },
  'LIN-BNC-48': { short: 'linen bench', material: 'white oak and Belgian linen', detail: 'The cushion is upholstered by hand, with a removable cover.', lead: '3 weeks' },
  'WAL-SHF-36': { short: 'walnut wall shelf', material: 'black walnut', detail: 'A hidden steel bracket holds up to 60 lb.', lead: '1 week' },
  'BRS-HDL-S': { short: 'brass handle set', material: 'solid brass', detail: 'It is unlacquered, so it develops a warm patina.', lead: '3 days' },
};

// 'human' needs someone on the team; 'ai' was resolved by the AI assistant.
export type ConversationStatus = 'human' | 'ai' | 'resolved';

export const conversations: {
  id: string;
  name: string;
  channel: 'Chat' | 'SMS' | 'Email';
  status: ConversationStatus;
  preview: string;
  context: string;
  messages: { from: 'customer' | 'ai' | 'agent'; text: string }[];
  suggestion: string;
}[] = [
  {
    id: 'tom',
    name: 'Tom Alvarez',
    channel: 'Chat',
    status: 'human',
    preview: 'Can we get net 30 terms?',
    context: 'CRM: Maple Street Studios · deal D-19, Qualified · $3,600',
    messages: [
      { from: 'customer', text: "We're furnishing a new studio. Can we get net 30 terms on a $3,600 order?" },
      { from: 'ai', text: "Payment terms are set by our wholesale team, so I've passed this to them with your deal details. Someone will reply here shortly." },
    ],
    suggestion: "Hi Tom, happy to set up net 30 for Maple Street Studios. I'll send the paperwork today, and your order can go into production as soon as it's signed.",
  },
  {
    id: 'grace',
    name: 'Grace Kim',
    channel: 'Chat',
    status: 'ai',
    preview: 'Will the oak table arrive by Friday?',
    context: 'Viewing: Oak dining table, 72" · 12 in stock at WH1',
    messages: [
      { from: 'customer', text: "If I order the oak table today, will it arrive by Friday? I'm in Austin." },
      { from: 'ai', text: 'Yes. We have 12 in stock at our main warehouse, so an order placed today ships tomorrow, and FedEx Ground to Austin takes 2 days.' },
      { from: 'customer', text: 'Perfect, ordering now.' },
    ],
    suggestion: 'Thanks, Grace! Your table will be packed today. Reply here any time if you need anything.',
  },
  {
    id: 'emma',
    name: 'Emma Rodriguez',
    channel: 'SMS',
    status: 'ai',
    preview: 'Where is my order?',
    context: 'Order #3038 · Walnut wall shelf · shipped via UPS',
    messages: [
      { from: 'customer', text: 'Hi, where is my order?' },
      { from: 'ai', text: 'Order #3038 shipped yesterday with UPS and is due Thursday. I just texted you the tracking link.' },
    ],
    suggestion: 'Hi Emma, your shelf is on its way and due Thursday. Let us know how you like it!',
  },
];
