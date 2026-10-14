import {
  badge, barList, btn, card, columns, esc, filterBar, funnel, ICON, icon, meter, page, searchInput,
  seg, select, spark, split, swatches, table, tabs, tiles, toneFor, trend,
} from './ui';
import {
  COLORS, GROUPS_LIST, auditLog, conversations, counts, customers, discounts, draftOrders,
  fmtDate, lowStock, money, notifications, num, orders, productBySku, products, relative,
  trafficMonths, unfulfilled,
} from './seed';

const sparkOf = (n: number, seed: number) =>
  Array.from({ length: 12 }, (_, i) => 40 + Math.sin((i + seed) * 0.9) * 14 + ((i * seed) % 11) + n * 0);

// ---------------------------------------------------------------- dashboard

export const dashboard = () => {
  const revenue = trafficMonths.map((m) => ({ label: m.label, value: m.revenue }));
  return `${page({
    crumbs: ['Northwind Supply Co.'],
    title: 'Today at a glance',
    lead: 'Everything below reads from the same records your team works in. Nothing is a copy or an export.',
    actions: `${seg('Range', ['Today', '7 days', '30 days', '12 months'], 1)}${btn('Customize', { iconPath: ICON.panelLeft })}`,
  })}
${tiles([
  { label: 'Revenue, 30 days', value: money(trafficMonths.at(-1)!.revenue), delta: 12.4, spark: sparkOf(1, 2) },
  { label: 'Orders to fulfil', value: String(counts.toFulfill), delta: -6.2, spark: sparkOf(2, 5) },
  { label: 'Low stock items', value: String(counts.lowStock), delta: 18.0, spark: sparkOf(3, 7) },
  { label: 'Conversations waiting', value: String(counts.needsHuman), delta: -22.5, spark: sparkOf(4, 3) },
])}
${split(
  card(`<div class="oa-card-body">${trend(revenue)}</div>`, {
    title: 'Revenue',
    sub: 'Last 13 months, all channels',
    actions: seg('Revenue view', ['Chart', 'Table'], 0),
  }),
  card(
    `<ul class="oa-list">${orders
      .slice(0, 6)
      .map(
        (o) => `<li>
  <span><span class="oa-strong">#${o.id}</span><span class="oa-sub">${esc(o.customer)} · ${esc(relative(o.placed))}</span></span>
  <span style="display:flex;align-items:center;gap:8px">${badge(o.status === 'production' ? 'In production' : o.status)}<span class="oa-strong">${money(o.total)}</span></span>
</li>`
      )
      .join('')}</ul>`,
    { title: 'Latest orders', actions: btn('Open orders', { sm: true, attrs: 'data-oa-go="orders"' }) }
  ),
  '2-1'
)}
${split(
  card(
    `<div class="oa-card-body">${barList(
      lowStock.slice(0, 6).map((p) => ({ name: p.name, value: p.reorder - p.available, display: `${p.available} left` }))
    )}</div>`,
    { title: 'Reorder soon', sub: 'Below reorder point', actions: btn('Purchasing', { sm: true, attrs: 'data-oa-go="purchasing"' }) }
  ),
  card(
    `<ul class="oa-list">${auditLog
      .map(
        (a) => `<li>
  <span><span class="oa-strong">${esc(a.what)}</span><span class="oa-sub">${esc(a.who)} · ${esc(a.when)}</span></span>
  ${a.kind === 'sensitive' ? badge('Sensitive', 'warn') : a.kind === 'draft' ? badge('AI draft', 'info') : ''}
</li>`
      )
      .join('')}</ul>`,
    { title: 'Audit log', sub: 'Who changed what, including actions taken via the AI assistant' }
  )
)}`;
};

// ---------------------------------------------------------------- orders

export const ordersView = () => `${page({
  crumbs: ['Commerce', 'Orders'],
  title: 'Orders',
  lead: 'Web, wholesale, marketplace and phone orders in one queue, with stock and production status beside each one.',
  actions: `${btn('Export CSV', { iconPath: ICON.download, attrs: 'data-oa-sensitive="export_data"' })}${btn('Create order', { primary: true, iconPath: ICON.plus })}`,
})}
${tabs('Orders', ['All', `Unfulfilled (${counts.toFulfill})`, 'Unpaid', 'In production', 'Cancelled'])}
${table({
  filters: filterBar([
    searchInput('Search number, name or email'),
    select('Channel', ['All channels', 'Web', 'Wholesale', 'Marketplace', 'Phone']),
    select('Payment', ['Any payment', 'Paid', 'Pending', 'Refunded']),
    btn('More filters', { sm: true, iconPath: ICON.filter }),
  ]),
  columns: [
    { label: 'Order' }, { label: 'Customer' }, { label: 'Items', kind: 'wrap' },
    { label: 'Total', kind: 'num' }, { label: 'Payment' }, { label: 'Status' }, { label: '' },
  ],
  rows: orders.slice(0, 14).map((o) => {
    const p = productBySku(o.sku);
    return [
      `<span class="oa-mono">#${o.id}</span>`,
      `<span class="oa-strong">${esc(o.customer)}</span><span class="oa-sub">${esc(o.channel)} · ${esc(relative(o.placed))}</span>`,
      `${o.qty} × ${esc(p.name)}`,
      money(o.total),
      badge(o.pay),
      badge(o.status === 'production' ? 'In production' : o.status === 'ready' ? 'Ready to ship' : o.status),
      o.status === 'unfulfilled'
        ? btn('Fulfil', { sm: true, attrs: `data-oa-toast="Order #${o.id} fulfilled and stock deducted"` })
        : btn('View', { sm: true, attrs: `data-oa-drawer="order" data-oa-id="${o.id}"` }),
    ];
  }),
  foot: `Showing 14 of ${orders.length} orders`,
})}`;

// ---------------------------------------------------------------- drafts

export const drafts = () => `${page({
  crumbs: ['Commerce', 'Draft orders'],
  title: 'Draft orders',
  lead: 'Build an order for a phone or quote customer. Group pricing applies automatically, and an invoice link turns it into a real order once it is paid.',
  actions: btn('New draft', { primary: true, iconPath: ICON.plus }),
})}
${table({
  filters: filterBar([searchInput('Search customer'), select('Status', ['Any status', 'Draft', 'Invoice sent', 'Awaiting payment'])]),
  columns: [
    { label: 'Draft' }, { label: 'Customer' }, { label: 'Price group' }, { label: 'Owner' },
    { label: 'Items', kind: 'num' }, { label: 'Total', kind: 'num' }, { label: 'Status' }, { label: 'Updated' },
  ],
  rows: draftOrders.map((d) => [
    `<span class="oa-mono">${esc(d.id)}</span>`,
    `<span class="oa-strong">${esc(d.customer)}</span>`,
    badge(d.group, 'info'),
    esc(d.owner),
    String(d.items),
    money(d.total),
    badge(d.status),
    esc(fmtDate(d.updated)),
  ]),
})}`;

// ---------------------------------------------------------------- products

export const productsView = () => `${page({
  crumbs: ['Commerce', 'Products'],
  title: 'Products',
  lead: 'One catalog behind the storefront, wholesale price sheets, production and purchasing.',
  actions: `${btn('Import')}${btn('Add product', { primary: true, iconPath: ICON.plus })}`,
})}
${tabs('Products', ['All', 'Active', 'Draft', 'Collections', 'Reviews'])}
${table({
  filters: filterBar([searchInput('Search products'), select('Type', ['All types', 'Tables', 'Seating', 'Storage']), select('Stock', ['Any stock', 'In stock', 'Low', 'Out of stock'])]),
  columns: [
    { label: 'Product', kind: 'wrap' }, { label: 'SKU' }, { label: 'Colours' }, { label: 'Variants', kind: 'num' },
    { label: 'Price', kind: 'num' }, { label: 'Margin', kind: 'num' }, { label: 'Available', kind: 'num' }, { label: 'Status' },
  ],
  rows: products.slice(0, 14).map((p) => [
    `<span class="oa-strong">${esc(p.name)}</span><span class="oa-sub">${esc(p.warehouse)} warehouse · ${num(p.sold90)} sold in 90 days</span>`,
    `<span class="oa-mono">${esc(p.sku)}</span>`,
    swatches(COLORS.filter((c) => p.colors.includes(c.name)).map((c) => c.hex)),
    String(p.variants),
    money(p.price),
    `${Math.round(((p.price - p.cost) / p.price) * 100)}%`,
    p.available < p.reorder ? `<span style="color:var(--oa-warn);font-weight:600">${p.available}</span>` : String(p.available),
    badge(p.status === 'active' ? 'Active' : 'Draft'),
  ]),
  foot: `Showing 14 of ${products.length} products`,
})}`;

// ---------------------------------------------------------------- customers

export const customersView = () => `${page({
  crumbs: ['Commerce', 'Customers'],
  title: 'Customers',
  lead: 'Every chat, email, form, review and order against one record, so nobody has to open three tabs to answer a question.',
  actions: `${btn('Export CSV', { iconPath: ICON.download, attrs: 'data-oa-sensitive="export_data"' })}${btn('Add customer', { primary: true, iconPath: ICON.plus })}`,
})}
${tiles(
  [
    { label: 'Customers', value: num(2041), delta: 4.1 },
    { label: 'Repeat rate', value: '38.2%', delta: 2.6 },
    { label: 'Average lifetime value', value: money(1840), delta: 7.3 },
    { label: 'In a price group', value: num(158), note: '4 groups' },
  ],
  4
)}
${table({
  filters: filterBar([searchInput('Search name or email'), select('Group', ['All groups', ...GROUPS_LIST.map((g) => g.name)]), select('State', ['All states', 'CA', 'TX', 'NY'])]),
  columns: [
    { label: 'Customer', kind: 'wrap' }, { label: 'Group' }, { label: 'State' },
    { label: 'Orders', kind: 'num' }, { label: 'Lifetime value', kind: 'num' }, { label: 'Last order' }, { label: 'Tags' },
  ],
  rows: customers.slice(0, 12).map((c) => [
    `<span class="oa-strong">${esc(c.name)}</span><span class="oa-sub">${esc(c.email)}</span>`,
    badge(c.group, c.group === 'Standard' ? 'neutral' : 'info'),
    esc(c.state),
    String(c.orders),
    money(c.ltv),
    esc(fmtDate(c.last)),
    c.tags.map((t) => badge(t)).join(' '),
  ]),
})}`;

// ---------------------------------------------------------------- groups

export const groups = () => `${page({
  crumbs: ['Commerce', 'Groups & price sheets'],
  title: 'Customer groups and price sheets',
  lead: 'One pricing resolver decides what a customer pays, and the cart, checkout, draft orders and the quick order pad all ask it the same question.',
  actions: `${btn('Copy from group')}${btn('New group', { primary: true, iconPath: ICON.plus, attrs: 'data-oa-sensitive="pricing"' })}`,
})}
${split(
  table({
    columns: [{ label: 'Group' }, { label: 'Rule', kind: 'wrap' }, { label: 'Members', kind: 'num' }, { label: 'Price sheets', kind: 'num' }, { label: '' }],
    rows: GROUPS_LIST.map((g) => [
      `<span class="oa-strong">${esc(g.name)}</span>`,
      esc(g.rule),
      num(g.members),
      String(g.sheets),
      btn('Edit', { sm: true, attrs: 'data-oa-sensitive="pricing"' }),
    ]),
  }),
  card(
    `<div class="oa-card-body" style="display:flex;flex-direction:column;gap:10px">
  <p style="font-size:0.8rem;color:var(--oa-text-2)">Group prices are never shown publicly, and a product can opt out of letting a storewide sale undercut its group price.</p>
  <ul class="oa-list" style="border:1px solid var(--oa-border);border-radius:var(--oa-r)">
    <li><span>Show group discount percentage publicly</span>${badge('Off', 'ok')}</li>
    <li><span>Storewide sales can beat group price</span>${badge('Per product', 'info')}</li>
    <li><span>Version history</span><span class="oa-sub">14 revisions</span></li>
  </ul>
  ${btn('Open price sheet editor', { attrs: 'data-oa-sensitive="pricing"' })}
</div>`,
    { title: 'How pricing resolves' }
  ),
  '2-1'
)}`;

// ---------------------------------------------------------------- discounts

export const discountsView = () => `${page({
  crumbs: ['Commerce', 'Discounts & sales'],
  title: 'Discounts and scheduled sales',
  lead: 'Bulk select to activate, pause or archive. A code that has been used can only be archived, never deleted, so reporting stays honest.',
  actions: `${btn('Schedule a sale', { iconPath: ICON.calendar })}${btn('New discount', { primary: true, iconPath: ICON.plus, attrs: 'data-oa-sensitive="discounts"' })}`,
})}
${table({
  filters: filterBar([searchInput('Search code'), select('Status', ['Any status', 'Active', 'Scheduled', 'Paused', 'Archived']), btn('Bulk edit', { sm: true })]),
  columns: [
    { label: 'Code' }, { label: 'Type' }, { label: 'Value' }, { label: 'Used', kind: 'num' }, { label: 'Ends' }, { label: 'Status' }, { label: '' },
  ],
  rows: discounts.map((d) => [
    `<span class="oa-mono oa-strong">${esc(d.code)}</span>`,
    esc(d.type),
    esc(d.value),
    num(d.used),
    esc(fmtDate(d.ends)),
    badge(d.status),
    d.used > 0 && d.status !== 'Archived'
      ? btn('Archive', { sm: true, attrs: `data-oa-toast="${esc(d.code)} archived" data-oa-sensitive="discounts"` })
      : btn('Edit', { sm: true, attrs: 'data-oa-sensitive="discounts"' }),
  ]),
})}`;

// ---------------------------------------------------------------- affiliates

export const affiliates = () => `${page({
  crumbs: ['Commerce', 'Affiliates'],
  title: 'Affiliate program',
  lead: 'Applications, personal links and codes, click and order attribution, and commission owed on orders that were not returned.',
  actions: btn('Export commissions', { iconPath: ICON.download, attrs: 'data-oa-sensitive="export_data"' }),
})}
${tiles([
  { label: 'Active affiliates', value: '46', delta: 9.2 },
  { label: 'Clicks, 30 days', value: num(12840), delta: 14.8 },
  { label: 'Attributed revenue', value: money(68400), delta: 21.3 },
  { label: 'Commission owed', value: money(6840), note: 'Next payout Apr 30' },
])}
${table({
  filters: filterBar([searchInput('Search affiliate'), select('Status', ['All', 'Active', 'Pending review', 'Rejected'])]),
  columns: [
    { label: 'Affiliate' }, { label: 'Code' }, { label: 'Clicks', kind: 'num' }, { label: 'Orders', kind: 'num' },
    { label: 'Revenue', kind: 'num' }, { label: 'Commission', kind: 'num' }, { label: 'Status' }, { label: '' },
  ],
  rows: customers.slice(0, 8).map((c, i) => {
    const clicks = 240 + i * 317;
    const ords = 4 + i * 3;
    const rev = ords * 740;
    return [
      `<span class="oa-strong">${esc(c.name)}</span><span class="oa-sub">${esc(c.email)}</span>`,
      `<span class="oa-mono">${esc(c.name.split(' ')[0].toUpperCase())}10</span>`,
      num(clicks),
      String(ords),
      money(rev),
      money(Math.round(rev * 0.1)),
      badge(i === 2 ? 'Pending review' : 'Active'),
      i === 2
        ? btn('Review', { sm: true, primary: true, attrs: 'data-oa-sensitive="approve_applications"' })
        : btn('View', { sm: true }),
    ];
  }),
})}`;
