import {
  badge, barList, btn, card, esc, filterBar, ICON, icon, kanban, meter, page, searchInput, seg,
  select, split, table, tabs, tiles,
} from './ui';
import {
  WORK_CENTERS, batches, components, fmtDate, lowStock, money, num, products, purchaseOrders,
  serviceJobs, shiftDay, TODAY,
} from './seed';

// ---------------------------------------------------------------- inventory

export const inventory = () => `${page({
  crumbs: ['Operations', 'Inventory'],
  title: 'Inventory',
  lead: 'Finished goods and components in one place, with days of cover worked out from real demand rather than a guess.',
  actions: `${btn('Adjust stock')}${btn('Cycle count', { primary: true, iconPath: ICON.check })}`,
})}
${tiles([
  { label: 'Stock on hand', value: money(842000), delta: 3.2 },
  { label: 'Below reorder point', value: String(lowStock.length), delta: 18.0 },
  { label: 'Committed to orders', value: num(412), note: 'units' },
  { label: 'Days of cover, median', value: '34', delta: -6.0 },
])}
${tabs('Inventory', ['Finished goods', 'Components', 'Adjustments', 'Warehouses'])}
${table({
  filters: filterBar([
    searchInput('Search SKU or name'),
    select('Warehouse', ['All warehouses', 'Main', 'Overflow', 'East dock']),
    select('Status', ['Any status', 'In stock', 'Reorder', 'Out of stock']),
  ]),
  columns: [
    { label: 'Item', kind: 'wrap' }, { label: 'SKU' }, { label: 'Warehouse' }, { label: 'Available', kind: 'num' },
    { label: 'Committed', kind: 'num' }, { label: 'Reorder at', kind: 'num' }, { label: 'Days cover', kind: 'num' },
    { label: 'Status' }, { label: '' },
  ],
  rows: products.slice(0, 14).map((p) => {
    const cover = Math.max(1, Math.round((p.available / Math.max(1, p.sold90)) * 90));
    const low = p.available < p.reorder;
    return [
      `<span class="oa-strong">${esc(p.name)}</span><span class="oa-sub">Aisle ${1 + (p.sold90 % 9)} · Bin ${String.fromCharCode(65 + (p.sold90 % 6))}${1 + (p.sold90 % 20)}</span>`,
      `<span class="oa-mono">${esc(p.sku)}</span>`,
      esc(p.warehouse),
      String(p.available),
      String(p.committed),
      String(p.reorder),
      String(cover),
      badge(p.available === 0 ? 'Out of stock' : low ? 'Reorder' : 'In stock'),
      low ? btn('Receive', { sm: true, attrs: `data-oa-toast="Received stock for ${esc(p.sku)}"` }) : btn('Count', { sm: true }),
    ];
  }),
  foot: `Showing 14 of ${products.length} items`,
})}`;

// ---------------------------------------------------------------- purchasing

export const purchasing = () => `${page({
  crumbs: ['Operations', 'Purchasing'],
  title: 'Purchasing',
  lead: 'Components are watched against their lead time and safety days, so a purchase order is drafted before the shop floor runs out.',
  actions: `${btn('Draft from suggestions', { iconPath: ICON.sparkle })}${btn('New purchase order', { primary: true, iconPath: ICON.plus })}`,
})}
${split(
  table({
    columns: [
      { label: 'Component', kind: 'wrap' }, { label: 'On hand', kind: 'num' }, { label: 'Lead time', kind: 'num' },
      { label: 'Safety days', kind: 'num' }, { label: 'Supplier' }, { label: 'Action' },
    ],
    rows: components.map((c) => {
      const urgent = c.onHand < c.safety;
      const soon = !urgent && c.onHand < c.safety * 2;
      return [
        `<span class="oa-strong">${esc(c.name)}</span><span class="oa-sub">${esc(c.sku)} · ${esc(c.unit)}</span>`,
        num(c.onHand),
        `${c.lead} d`,
        String(c.safety),
        esc(c.supplier),
        urgent ? badge('Order now', 'danger') : soon ? badge('Order soon', 'warn') : badge('OK', 'ok'),
      ];
    }),
  }),
  card(
    `<ul class="oa-list">${purchaseOrders
      .map(
        (p) => `<li>
  <span><span class="oa-strong">${esc(p.id)}</span><span class="oa-sub">${esc(p.supplier)} · ${p.lines} lines · due ${esc(fmtDate(p.due))}</span></span>
  <span style="display:flex;align-items:center;gap:8px">${badge(p.status)}<span class="oa-strong">${money(p.total)}</span></span>
</li>`
      )
      .join('')}</ul>`,
    { title: 'Purchase orders', actions: btn('Receive', { sm: true }) }
  ),
  '2-1'
)}`;

// ---------------------------------------------------------------- production

export const production = () => {
  // A fortnight of columns, Monday first, with batches dropped on their start day.
  const start = new Date(TODAY);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  return `${page({
    crumbs: ['Operations', 'Production'],
    title: 'Production',
    lead: 'Work orders come from real demand, materials are checked before a date is promised, and the calendar below is drag and drop.',
    actions: `${seg('Production view', ['Calendar', 'Board', 'List'], 0)}${btn('New work order', { primary: true, iconPath: ICON.plus })}`,
  })}
${tiles([
  { label: 'Open work orders', value: String(batches.filter((b) => b.stage !== 'Complete').length), delta: -4.0 },
  { label: 'Units scheduled, 14 days', value: num(batches.reduce((s, b) => s + b.qty, 0)), delta: 8.2 },
  { label: 'Capacity used', value: '82%', note: 'Finishing is the constraint' },
  { label: 'Late work orders', value: '1', delta: -50.0 },
])}
${card(
  `<div class="oa-card-body">
  <div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;margin-bottom:6px">
    ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => `<span style="font-size:0.68rem;color:var(--oa-text-3);text-transform:uppercase;letter-spacing:0.05em">${d}</span>`).join('')}
  </div>
  <div class="oa-cal">${days
    .map((d) => {
      const mine = batches.filter((b) => sameDay(b.start, d));
      const today = sameDay(d, TODAY);
      return `<div class="oa-cal-day" data-oa-cal-day="${d.toISOString().slice(0, 10)}">
      <span class="oa-cal-num"${today ? ' style="color:var(--oa-accent-strong);font-weight:700"' : ''}>${d.getDate()}</span>
      ${mine
        .map(
          (b) => `<span class="oa-cal-chip" draggable="true" data-oa-cal-chip="${esc(b.id)}" data-stage="${esc(b.stage)}" title="${esc(b.id)} · ${esc(b.product)}">${esc(b.id)} · ${b.qty}</span>`
        )
        .join('')}
    </div>`;
    })
    .join('')}</div>
</div>`,
  { title: 'Production calendar', sub: 'Drag a work order to reschedule it', actions: btn('Capacity settings', { sm: true, attrs: 'data-oa-go="settings"' }) }
)}
${kanban(
  [
    { key: 'Planned', label: 'Planned' },
    { key: 'In progress', label: 'In progress' },
    { key: 'Complete', label: 'Complete' },
  ],
  batches.map((b) => ({
    id: b.id,
    col: b.stage,
    title: `${b.id} · ${b.product}`,
    meta: `${b.center} · ${b.qty} units`,
    right: b.forOrder ? badge(`#${b.forOrder}`, 'info') : badge('To stock'),
  }))
)}
${split(
  table({
    columns: [{ label: 'Work centre' }, { label: 'Daily capacity', kind: 'num' }, { label: 'Scheduled', kind: 'num' }, { label: 'Load' }],
    rows: WORK_CENTERS.map((c, i) => {
      const cap = [60, 48, 40, 52, 80][i];
      const used = [41, 44, 38, 30, 46][i];
      return [
        `<span class="oa-strong">${esc(c)}</span>`,
        String(cap),
        String(used),
        meter(Math.round((used / cap) * 100)),
      ];
    }),
  }),
  card(
    `<ul class="oa-list">
  <li><span>Working days</span><span class="oa-sub">Mon to Fri</span></li>
  <li><span>Shift length</span><span class="oa-sub">8 hours</span></li>
  <li><span>Lot code format</span><span class="oa-mono">NW-YYMMDD-###</span></li>
  <li><span>Minimum batch, finishing</span><span class="oa-strong">12</span></li>
  <li><span>Material check before promising</span>${badge('Required', 'ok')}</li>
</ul>`,
    { title: 'Settings that drive the plan', sub: 'Editable, with change history', actions: btn('Edit', { sm: true }) }
  )
)}`;
};

// ---------------------------------------------------------------- field service

export const service = () => `${page({
  crumbs: ['Operations', 'Field service'],
  title: 'Field service',
  lead: 'Requests, quotes, jobs and visits with crew scheduling, timesheets and a client portal page for every job.',
  actions: `${btn('Price book')}${btn('New job', { primary: true, iconPath: ICON.plus })}`,
})}
${tiles([
  { label: 'Jobs this week', value: String(serviceJobs.length), delta: 11.0 },
  { label: 'Unscheduled requests', value: '4', delta: -20.0 },
  { label: 'Invoiced, 30 days', value: money(48600), delta: 7.8 },
  { label: 'Deposits outstanding', value: money(5200), note: '3 jobs' },
])}
${tabs('Service', ['Jobs', 'Requests', 'Quotes', 'Schedule', 'Invoices', 'Timesheets'])}
${table({
  filters: filterBar([searchInput('Search client or job'), select('Technician', ['Any technician', 'Ray Okonkwo', 'Hana Sato', 'Owen Gallagher']), select('Status', ['Any status', 'Scheduled', 'En route', 'In progress', 'Complete'])]),
  columns: [
    { label: 'Job' }, { label: 'Client', kind: 'wrap' }, { label: 'Type' }, { label: 'Technician' },
    { label: 'When' }, { label: 'State' }, { label: 'Value', kind: 'num' }, { label: 'Status' }, { label: '' },
  ],
  rows: serviceJobs.map((j) => [
    `<span class="oa-mono">${esc(j.id)}</span>`,
    `<span class="oa-strong">${esc(j.client)}</span>`,
    esc(j.type),
    esc(j.tech),
    esc(fmtDate(j.when)),
    esc(j.state),
    money(j.value),
    badge(j.status),
    btn('Portal', { sm: true, iconPath: ICON.external }),
  ]),
})}
${card(
  `<div class="oa-card-body" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
  ${icon(ICON.warning, 20)}
  <div style="flex:1 1 260px">
    <p style="font-size:0.82rem;font-weight:600">Weather delay on J-773</p>
    <p style="font-size:0.78rem;color:var(--oa-text-2)">High winds forecast for the install window. Rescheduling moves the crew, notifies the client and keeps the deposit in place.</p>
  </div>
  ${btn('Reschedule crew', { attrs: 'data-oa-toast="J-773 moved to Apr 18, client notified"' })}
</div>`,
  { title: 'Needs a decision' }
)}`;
