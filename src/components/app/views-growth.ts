import {
  badge, barList, btn, card, columns, esc, filterBar, funnel, ICON, icon, meter, page, searchInput,
  seg, select, split, table, tabs, tiles, trend,
} from './ui';
import {
  FUNNEL, SEARCH_TERMS, SOURCES, campaigns, fmtDate, money, num, pct, products, shiftDay,
  trafficMonths,
} from './seed';

// ---------------------------------------------------------------- marketing

export const marketing = () => `${page({
  crumbs: ['Growth', 'Marketing'],
  title: 'Marketing',
  lead: 'Channels, campaigns and scheduled sales in one place, reading from the same orders the rest of the business runs on.',
  actions: `${btn('UTM builder', { iconPath: ICON.external })}${btn('New campaign', { primary: true, iconPath: ICON.plus })}`,
})}
${tiles([
  { label: 'Ad spend, 30 days', value: money(18400), delta: 6.2 },
  { label: 'Attributed revenue', value: money(96200), delta: 17.4 },
  { label: 'Blended ROAS', value: '5.2×', delta: 9.8 },
  { label: 'New customers', value: num(412), delta: 12.1 },
])}
${split(
  card(`<div class="oa-card-body">${columns(trafficMonths.slice(-8).map((m) => ({ label: m.label, value: m.revenue })))}</div>`, {
    title: 'Revenue by month',
    actions: seg('Attribution', ['Last click', 'Linear'], 0),
  }),
  card(
    `<ul class="oa-list">
  <li><span>Google Ads</span>${badge('Connected', 'ok')}</li>
  <li><span>Merchant Center</span>${badge('Feed healthy', 'ok')}</li>
  <li><span>Meta Ads</span>${badge('Connected', 'ok')}</li>
  <li><span>TikTok Shop</span>${badge('Not connected', 'warn')}</li>
  <li><span>Pinterest</span>${badge('Not connected', 'warn')}</li>
</ul>`,
    { title: 'Channels', actions: btn('Manage', { sm: true, attrs: 'data-oa-go="integrations"' }) }
  ),
  '2-1'
)}
${table({
  filters: filterBar([searchInput('Search sales'), select('Status', ['Any status', 'Scheduled', 'Running', 'Finished'])]),
  columns: [{ label: 'Scheduled sale' }, { label: 'Applies to', kind: 'wrap' }, { label: 'Discount' }, { label: 'Starts' }, { label: 'Ends' }, { label: 'Stacks with groups' }, { label: 'Status' }],
  rows: [
    ['Spring dining', 'Collection: Dining', '15%', shiftDay(2), shiftDay(16), 'No', 'Scheduled'],
    ['Walnut clearance', '12 products', '30%', shiftDay(-4), shiftDay(6), 'No', 'Running'],
    ['Trade sample credit', 'Group: Trade tier 2', '$150 credit', shiftDay(-30), shiftDay(60), 'Yes', 'Running'],
  ].map((r) => [
    `<span class="oa-strong">${esc(r[0] as string)}</span>`,
    esc(r[1] as string),
    esc(r[2] as string),
    esc(fmtDate(r[3] as Date)),
    esc(fmtDate(r[4] as Date)),
    badge(r[5] as string, r[5] === 'Yes' ? 'info' : 'neutral'),
    badge(r[6] as string),
  ]),
})}`;

// ---------------------------------------------------------------- email

export const email = () => `${page({
  crumbs: ['Growth', 'Email & SMS'],
  title: 'Email and SMS',
  lead: 'Campaigns, flows and audiences built on your own customer records, with consent and unsubscribes handled in the same place.',
  actions: `${btn('Audiences')}${btn('New campaign', { primary: true, iconPath: ICON.plus, attrs: 'data-oa-sensitive="send_campaigns"' })}`,
})}
${tiles([
  { label: 'Sent, 30 days', value: num(84200), delta: 5.1 },
  { label: 'Open rate', value: '41.8%', delta: 2.2 },
  { label: 'Click rate', value: '6.4%', delta: -0.8 },
  { label: 'Revenue from email', value: money(62800), delta: 19.6 },
])}
${tabs('Email', ['Campaigns', 'Flows', 'Audiences', 'Templates', 'Consent'])}
${table({
  filters: filterBar([searchInput('Search campaigns'), select('Channel', ['All', 'Email', 'SMS']), select('Status', ['Any status', 'Live', 'Sent', 'Scheduled', 'Draft'])]),
  columns: [
    { label: 'Name', kind: 'wrap' }, { label: 'Type' }, { label: 'Channel' }, { label: 'Sent', kind: 'num' },
    { label: 'Open', kind: 'num' }, { label: 'Click', kind: 'num' }, { label: 'Revenue', kind: 'num' }, { label: 'Status' },
  ],
  rows: campaigns.map((c) => [
    `<span class="oa-strong">${esc(c.name)}</span>`,
    badge(c.type, c.type === 'Flow' ? 'info' : 'neutral'),
    esc(c.channel),
    num(c.sent),
    pct(c.open),
    pct(c.click),
    money(c.revenue),
    badge(c.status),
  ]),
})}
${card(
  `<div class="oa-card-body" style="display:flex;gap:14px;flex-wrap:wrap;align-items:center">
  <div style="flex:1 1 280px">
    <p style="font-size:0.84rem;font-weight:600;margin-bottom:4px">Block-based email builder with an AI editor</p>
    <p style="font-size:0.78rem;color:var(--oa-text-2)">Split view: a live preview on one side, an AI chat that accepts image attachments on the other. Themes, colours, fonts, buttons, spacing and the compliance footer render to inline email-safe HTML.</p>
  </div>
  ${btn('Open email editor', { primary: true, iconPath: ICON.sparkle, attrs: 'data-oa-drawer="ai-editor" data-oa-id="email"' })}
</div>`,
  { title: 'Email editor' }
)}`;

// ---------------------------------------------------------------- web analytics

export const webAnalytics = () => `${page({
  crumbs: ['Growth', 'Website analytics'],
  title: 'Website analytics',
  lead: 'First-party and privacy-first. No IP addresses are stored, Do Not Track and Global Privacy Control are respected, and without consent it counts anonymously with no identifiers at all.',
  actions: `${seg('Range', ['7 days', '30 days', '12 months'], 1)}${btn('Real time', { iconPath: ICON.refresh })}`,
})}
${tiles([
  { label: 'Visitors', value: num(53420), delta: 8.4, spark: trafficMonths.map((m) => m.visitors) },
  { label: 'Sessions', value: num(73720), delta: 7.1 },
  { label: 'Engaged time', value: '2m 14s', delta: 4.0 },
  { label: 'Bounce', value: '38.2%', delta: -3.1 },
  { label: 'Conversion', value: '3.62%', delta: 0.4 },
], 5)}
${card(`<div class="oa-card-body">${trend(trafficMonths.map((m) => ({ label: m.label, value: m.visitors })))}</div>`, {
  title: 'Visitors',
  sub: '13 months',
  actions: seg('Metric', ['Visitors', 'Sessions', 'Orders'], 0),
})}
${split(
  card(`<div class="oa-card-body">${barList(SOURCES.map((s) => ({ name: s.name, value: s.visits, display: `${num(s.visits)} · ${s.share}%` })))}</div>`, {
    title: 'Sources',
    sub: 'Including traffic arriving from AI assistants',
  }),
  card(`<div class="oa-card-body">${funnel(FUNNEL)}</div>`, { title: 'Shopping funnel', actions: btn('Build a funnel', { sm: true }) })
)}
${split(
  table({
    columns: [{ label: 'Search term' }, { label: 'Searches', kind: 'num' }, { label: 'Result' }],
    rows: SEARCH_TERMS.map((t) => [
      `<span class="oa-strong">${esc(t.term)}</span>`,
      num(t.count),
      t.zero ? badge('No results', 'danger') : badge('Has results', 'ok'),
    ]),
  }),
  card(
    `<ul class="oa-list">
  <li><span>Add to cart</span><span class="oa-strong">${num(9120)}</span></li>
  <li><span>Colour or size picked</span><span class="oa-strong">${num(21400)}</span></li>
  <li><span>Chat opened</span><span class="oa-strong">${num(3280)}</span></li>
  <li><span>Swatch tool used</span><span class="oa-strong">${num(1940)}</span></li>
  <li><span>Spec sheet downloaded</span><span class="oa-strong">${num(860)}</span></li>
  <li><span>Phone number clicked</span><span class="oa-strong">${num(410)}</span></li>
</ul>`,
    { title: 'Interactions', sub: '30 days' }
  )
)}`;

// ---------------------------------------------------------------- sales analytics

export const salesAnalytics = () => `${page({
  crumbs: ['Growth', 'Sales analytics'],
  title: 'Sales analytics',
  lead: 'Revenue, orders and repeat behaviour from the order table itself, not a nightly export that is already stale.',
  actions: `${btn('View as table')}${btn('TV mode', { iconPath: ICON.external })}`,
})}
${tiles([
  { label: 'Revenue, 30 days', value: money(312400), delta: 14.2, spark: trafficMonths.map((m) => m.revenue) },
  { label: 'Orders', value: num(1964), delta: 9.7 },
  { label: 'Average order value', value: money(159), delta: 4.1 },
  { label: 'Repeat revenue share', value: '41.6%', delta: 2.8 },
])}
${split(
  card(`<div class="oa-card-body">${trend(trafficMonths.map((m) => ({ label: m.label, value: m.revenue })))}</div>`, { title: 'Revenue' }),
  card(
    `<div class="oa-card-body">${barList(
      products.slice(0, 7).map((p) => ({ name: p.name, value: p.sold90 * p.price, display: money(p.sold90 * p.price) }))
    )}</div>`,
    { title: 'Top products', sub: 'Last 90 days' }
  ),
  '2-1'
)}
${split(
  card(
    `<div class="oa-card-body" style="display:flex;flex-direction:column;gap:8px">
  <p style="font-size:0.78rem;color:var(--oa-text-2)">Each row is a cohort of customers who first bought in that month. Each column is how much of them came back later.</p>
  <div class="oa-heat">${Array.from({ length: 65 }, (_, i) => {
    const row = Math.floor(i / 13);
    const col = i % 13;
    const v = col === 0 ? 1 : Math.max(0.06, 0.52 - col * 0.045 + (row % 3) * 0.04);
    return `<i style="opacity:${col > 12 - row ? 0.06 : v.toFixed(2)}"></i>`;
  }).join('')}</div>
</div>`,
    { title: 'Cohort retention' }
  ),
  card(
    `<ul class="oa-list">
  <li><span>First-time customers</span><span class="oa-strong">${num(1148)}</span></li>
  <li><span>Repeat customers</span><span class="oa-strong">${num(816)}</span></li>
  <li><span>Wholesale share of revenue</span><span class="oa-strong">31.4%</span></li>
  <li><span>Refund rate</span><span class="oa-strong">1.8%</span></li>
  <li><span>Discount share of revenue</span><span class="oa-strong">7.2%</span></li>
</ul>`,
    { title: 'Mix' }
  )
)}`;

// ---------------------------------------------------------------- content

export const content = () => `${page({
  crumbs: ['Growth', 'Content & blog'],
  title: 'Content',
  lead: 'Pages, posts and the homepage banners, with drafts, scheduling, revisions and a revert that actually works.',
  actions: `${btn('Media library')}${btn('New post', { primary: true, iconPath: ICON.plus })}`,
})}
${tabs('Content', ['Posts', 'Pages', 'Homepage banners', 'Media', 'SEO'])}
${table({
  filters: filterBar([searchInput('Search content'), select('Status', ['Any status', 'Published', 'Draft', 'Scheduled'])]),
  columns: [{ label: 'Title', kind: 'wrap' }, { label: 'Type' }, { label: 'Author' }, { label: 'Updated' }, { label: 'Revisions', kind: 'num' }, { label: 'Status' }, { label: '' }],
  rows: [
    ['How to measure a dining space', 'Guide', 'Elise Tran', shiftDay(-2), 14, 'Published'],
    ['Inside the finishing room', 'Photo essay', 'Elise Tran', shiftDay(-9), 6, 'Published'],
    ['Spring collection preview', 'Feature', 'Elise Tran', shiftDay(1), 3, 'Scheduled'],
    ['Trade program', 'Page', 'Marcus Oyelaran', shiftDay(-21), 9, 'Published'],
    ['Care and warranty', 'Policy', 'Dana Whitfield', shiftDay(-60), 4, 'Published'],
    ['Choosing a wood species', 'Standard', 'Elise Tran', shiftDay(-1), 2, 'Draft'],
  ].map((r) => [
    `<span class="oa-strong">${esc(r[0] as string)}</span>`,
    esc(r[1] as string),
    esc(r[2] as string),
    esc(fmtDate(r[3] as Date)),
    String(r[4]),
    badge(r[5] as string),
    btn('AI edit', { sm: true, iconPath: ICON.sparkle, attrs: 'data-oa-drawer="ai-editor" data-oa-id="blog"' }),
  ]),
})}
${split(
  card(
    `<div class="oa-card-body" style="display:flex;flex-direction:column;gap:9px">
  <p style="font-size:0.78rem;color:var(--oa-text-2)">Three editors, each a live preview beside an AI chat that takes image attachments.</p>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    ${btn('Page editor', { iconPath: ICON.sparkle, attrs: 'data-oa-drawer="ai-editor" data-oa-id="page"' })}
    ${btn('Blog editor', { iconPath: ICON.sparkle, attrs: 'data-oa-drawer="ai-editor" data-oa-id="blog"' })}
    ${btn('Email editor', { iconPath: ICON.sparkle, attrs: 'data-oa-drawer="ai-editor" data-oa-id="email"' })}
  </div>
</div>`,
    { title: 'AI editors' }
  ),
  card(
    `<ul class="oa-list">
  <li><span>Banned phrases</span><span class="oa-sub">"game changer", em dashes</span></li>
  <li><span>Tone</span><span class="oa-sub">Plain, concrete, no hype</span></li>
  <li><span>Product naming</span><span class="oa-sub">Material first, then type</span></li>
  <li><span>Links</span><span class="oa-sub">Only to pages that exist</span></li>
  <li><span>Policy checker</span>${badge('Blocks publish on failure', 'ok')}</li>
</ul>`,
    { title: 'Brand voice rules', sub: 'Applied to every AI output' }
  )
)}`;
