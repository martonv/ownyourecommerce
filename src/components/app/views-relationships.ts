import {
  badge, barList, btn, card, esc, filterBar, ICON, icon, kanban, meter, page, searchInput, seg,
  select, split, table, tabs, tiles,
} from './ui';
import {
  COMPANIES, PIPELINE_STAGES, TERRITORIES, conversations, counts, customers, fmtDate, leads,
  money, num, person, relative, shiftDay,
} from './seed';

// ---------------------------------------------------------------- support inbox

export const inbox = () => {
  const first = conversations[0];
  return `${page({
    crumbs: ['Relationships', 'Support inbox'],
    title: 'Support inbox',
    lead: 'Chat, email, SMS, phone and forms in one queue. The AI answers from your own catalog, orders and policies, and hands over the moment it should.',
    actions: `${seg('Inbox', ['Open', 'Mine', 'Waiting', 'Resolved'], 0)}${btn('Saved replies')}`,
  })}
${tiles([
  { label: 'Waiting on a human', value: String(counts.needsHuman), delta: -18.0 },
  { label: 'Handled by AI today', value: '37', delta: 24.0 },
  { label: 'Median first reply', value: '42 min', delta: -12.5 },
  { label: 'Resolved today', value: '61', delta: 8.4 },
])}
<div class="oa-split" data-ratio="1-2">
  ${card(
    `<ul class="oa-list">${conversations
      .map(
        (c, i) => `<li style="cursor:pointer" data-oa-pick="conv" data-oa-i="${i}">
  <span><span class="oa-strong">${esc(c.who)}</span><span class="oa-sub">${esc(c.channel)} · ${esc(c.subject)}</span></span>
  <span style="display:flex;align-items:center;gap:6px">${badge(c.status === 'human' ? 'Needs human' : c.status === 'ai' ? 'AI' : 'Resolved')}<span class="oa-sub">${esc(c.waiting)}</span></span>
</li>`
      )
      .join('')}</ul>`,
    { title: 'Conversations', sub: 'Across every channel' }
  )}
  ${card(
    `<div class="oa-card-body" style="display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;flex-direction:column;gap:10px">
    <div class="oa-ai-msg"><span class="oa-ai-who">${esc(first.who)} · ${esc(first.channel)}</span><div class="oa-ai-bubble"><span class="oa-untrusted">Hi, I ordered a walnut credenza two weeks ago and I need it before the 28th. Order #3039. Can you confirm?</span></div></div>
    <div class="oa-ai-msg"><span class="oa-ai-who">AI assistant</span><div class="oa-ai-bubble">Order #3039 is in production, stage 2 of 3, with a planned ship date of April 22. That clears the 28th with six days to spare. Would you like me to flag the order so you get a note the day it ships?</div></div>
    <div class="oa-ai-msg"><span class="oa-ai-who">${esc(first.who)}</span><div class="oa-ai-bubble"><span class="oa-untrusted">Yes please. Also can I add two chairs to the same delivery?</span></div></div>
    <div style="display:flex;gap:6px;align-items:center">${icon(ICON.warning, 14)}<span style="font-size:0.76rem;color:var(--oa-warn)">Adding items changes the order total, so the AI handed this to a person.</span></div>
  </div>
  <div style="border-top:1px solid var(--oa-border);padding-top:10px;display:flex;flex-direction:column;gap:8px">
    <span style="font-size:0.72rem;color:var(--oa-text-3);text-transform:uppercase;letter-spacing:0.05em">AI suggested reply</span>
    <div class="oa-ai-bubble">Happy to add them. Two Ash dining chairs at your trade price is $648 including the existing freight, and it keeps the April 22 ship date. Shall I send an updated invoice?</div>
    <div style="display:flex;gap:8px">${btn('Use suggestion', { sm: true })}${btn('Summarise thread', { sm: true, iconPath: ICON.sparkle })}${btn('Assign to me', { sm: true })}</div>
  </div>
  <div class="oa-ai-input"><textarea placeholder="Write a reply…" aria-label="Reply"></textarea>${btn('Send', { primary: true, attrs: 'data-oa-toast="Reply sent"' })}</div>
</div>`,
    { title: esc(first.subject), sub: `Assigned to ${esc(first.assignee)}`, actions: badge('Needs human', 'warn') }
  )}
</div>`;
};

// ---------------------------------------------------------------- pipeline

export const pipeline = () => `${page({
  crumbs: ['Relationships', 'Pipeline'],
  title: 'Pipeline',
  lead: 'Drag a card to move a deal. Sample requests need a manager before anything ships, and every lead is attributed to the rep who owns its territory.',
  actions: `${seg('Pipeline view', ['Board', 'Table', 'Forecast'], 0)}${btn('Add lead', { primary: true, iconPath: ICON.plus })}`,
})}
${tiles([
  { label: 'Open pipeline', value: money(leads.reduce((s, l) => s + l.value, 0)), delta: 11.2 },
  { label: 'Deals in play', value: String(leads.length), delta: 6.0 },
  { label: 'Awaiting sample approval', value: String(leads.filter((l) => l.sampleApproval).length), note: 'Needs a manager' },
  { label: 'Won this quarter', value: money(214000), delta: 18.9 },
])}
${kanban(
  PIPELINE_STAGES.map((s) => ({ key: s, label: s })),
  leads.map((l) => ({
    id: l.id,
    col: l.stage,
    title: l.company,
    meta: `${l.owner.split(' ')[0]} · ${l.state}`,
    right: `<span class="oa-strong">${money(l.value)}</span>`,
  }))
)}
${card(
  `<ul class="oa-list">${leads
    .filter((l) => l.sampleApproval)
    .map(
      (l) => `<li>
  <span><span class="oa-strong">${esc(l.company)}</span><span class="oa-sub">Sample request raised by ${esc(l.owner)} · ${esc(l.source)}</span></span>
  <span style="display:flex;gap:6px">${btn('Decline', { sm: true })}${btn('Approve', { sm: true, primary: true, attrs: `data-oa-sensitive="approve_samples" data-oa-toast="Sample approved for ${esc(l.company)}"` })}</span>
</li>`
    )
    .join('')}</ul>`,
  { title: 'Sample requests waiting on you', sub: 'Manager approval required before a sample ships' }
)}`;

// ---------------------------------------------------------------- contacts

export const contacts = () => `${page({
  crumbs: ['Relationships', 'Contacts & companies'],
  title: 'Contacts and companies',
  lead: 'Created and de-duplicated automatically from signups, forms, orders and the leads map.',
  actions: `${btn('Import CSV')}${btn('Add contact', { primary: true, iconPath: ICON.plus })}`,
})}
${tabs('Contacts', ['Contacts', 'Companies', 'Duplicates (3)'])}
${table({
  filters: filterBar([searchInput('Search contacts'), select('Owner', ['Any owner', 'Priya Raman', 'Marcus Oyelaran', 'Tomás Herrera']), select('Source', ['Any source', 'Website form', 'Trade show', 'Referral', 'Leads map'])]),
  columns: [
    { label: 'Contact', kind: 'wrap' }, { label: 'Company' }, { label: 'Owner' }, { label: 'Source' },
    { label: 'Deals', kind: 'num' }, { label: 'Lifetime value', kind: 'num' }, { label: 'Last touch' },
  ],
  rows: leads.slice(0, 12).map((l, i) => [
    `<span class="oa-strong">${esc(l.contact)}</span><span class="oa-sub">${esc(l.contact.toLowerCase().replace(/[^a-z]+/g, '.'))}@example.com</span>`,
    esc(l.company),
    esc(l.owner),
    badge(l.source, 'info'),
    String(1 + (i % 3)),
    money(l.value),
    esc(fmtDate(l.next)),
  ]),
})}`;

// ---------------------------------------------------------------- territories

export const territories = () => `${page({
  crumbs: ['Relationships', 'Territories'],
  title: 'Sales territories',
  lead: 'Every state belongs to a rep. A new lead routes to its territory owner, falls back to their backup if they are away, and round-robins when nobody owns it.',
  actions: btn('Edit assignments', { primary: true }),
})}
${split(
  card(
    `<div class="oa-card-body" style="display:flex;flex-direction:column;gap:10px">
  <p style="font-size:0.8rem;color:var(--oa-text-2)">A tile map keeps every state the same size, so a rep covering small states is as visible as one covering large ones.</p>
  <div class="oa-heat" aria-hidden="true">${Array.from({ length: 39 }, (_, i) => {
    const t = i % 4;
    const bg = ['var(--oa-accent-strong)', 'var(--oa-info)', 'var(--oa-warn)', 'var(--oa-surface-3)'][t];
    return `<i style="background:${bg};opacity:${t === 3 ? 0.7 : 0.35 + (i % 3) * 0.25}"></i>`;
  }).join('')}</div>
  <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:0.74rem;color:var(--oa-text-3)">
    ${TERRITORIES.map((t, i) => `<span style="display:inline-flex;align-items:center;gap:5px"><i style="width:9px;height:9px;border-radius:2px;display:inline-block;background:${['var(--oa-accent-strong)', 'var(--oa-info)', 'var(--oa-warn)', 'var(--oa-surface-3)'][i]}"></i>${esc(t.rep)}</span>`).join('')}
  </div>
</div>`,
    { title: 'Coverage', sub: 'US tile map' }
  ),
  table({
    columns: [{ label: 'Rep' }, { label: 'States', kind: 'wrap' }, { label: 'Open', kind: 'num' }, { label: 'Won', kind: 'num' }],
    rows: TERRITORIES.map((t) => [
      `<span class="oa-strong">${esc(t.rep)}</span>`,
      t.states.map((s) => badge(s)).join(' '),
      String(t.open),
      String(t.won),
    ]),
  })
)}
${card(
  `<div class="oa-card-body">${barList(
    TERRITORIES.map((t) => ({ name: t.rep, value: t.open + t.won, display: `${t.open} open · ${t.won} won` }))
  )}</div>`,
  { title: 'Leads by owner' }
)}`;

// ---------------------------------------------------------------- loyalty

export const loyalty = () => `${page({
  crumbs: ['Relationships', 'Loyalty & rewards'],
  title: 'Loyalty and rewards',
  lead: 'Points per dollar, tiers and a rewards catalog. Every rule lives in settings, not in code, so you change them without us.',
  actions: btn('Edit rules', { primary: true }),
})}
${tiles([
  { label: 'Members', value: num(1284), delta: 6.8 },
  { label: 'Points issued, 30 days', value: num(412000), delta: 11.1 },
  { label: 'Redemption rate', value: '24.6%', delta: 3.2 },
  { label: 'Repeat rate, members', value: '58.4%', note: 'vs 29.1% non-members' },
], 4)}
${split(
  table({
    columns: [{ label: 'Tier' }, { label: 'Threshold', kind: 'num' }, { label: 'Members', kind: 'num' }, { label: 'Perks', kind: 'wrap' }],
    rows: [
      ['Bronze', '0 pts', num(842), 'Free swatches'],
      ['Silver', '2,500 pts', num(318), 'Free freight over $500'],
      ['Gold', '8,000 pts', num(104), 'Free freight, early access, 5% back'],
      ['Trade', 'By invitation', num(20), 'Net 30, dedicated rep, sample credit'],
    ].map((r) => [`<span class="oa-strong">${esc(r[0])}</span>`, esc(r[1]), esc(r[2]), esc(r[3])]),
  }),
  card(
    `<ul class="oa-list">
  <li><span>Points per dollar</span><span class="oa-strong">2</span></li>
  <li><span>Points per review with photo</span><span class="oa-strong">150</span></li>
  <li><span>Referral bonus</span><span class="oa-strong">500</span></li>
  <li><span>Points expire after</span><span class="oa-strong">18 months</span></li>
  <li><span>Birthday bonus</span><span class="oa-strong">250</span></li>
</ul>`,
    { title: 'Earning rules', actions: btn('Edit', { sm: true }) }
  )
)}`;

// ---------------------------------------------------------------- events

export const events = () => `${page({
  crumbs: ['Relationships', 'Events & tickets'],
  title: 'Events and ticketing',
  lead: 'Event pages, ticket types and QR tickets emailed to buyers, with a scanner page that validates a code at the door.',
  actions: `${btn('Open scanner', { iconPath: ICON.shield })}${btn('New event', { primary: true, iconPath: ICON.plus })}`,
})}
${table({
  columns: [
    { label: 'Event', kind: 'wrap' }, { label: 'When' }, { label: 'Venue' }, { label: 'Sold', kind: 'num' },
    { label: 'Capacity', kind: 'num' }, { label: 'Revenue', kind: 'num' }, { label: 'Status' },
  ],
  rows: [
    ['Spring trade preview', shiftDay(12), 'Portland showroom', 148, 200, 7400, 'On sale'],
    ['Workshop: finishing basics', shiftDay(26), 'Main plant', 32, 40, 960, 'On sale'],
    ['Designer breakfast', shiftDay(-6), 'Seattle studio', 64, 64, 0, 'Complete'],
    ['Contract buyer tour', shiftDay(48), 'Main plant', 11, 30, 0, 'Draft'],
  ].map((r) => [
    `<span class="oa-strong">${esc(r[0] as string)}</span>`,
    esc(fmtDate(r[1] as Date)),
    esc(r[2] as string),
    num(r[3] as number),
    num(r[4] as number),
    money(r[5] as number),
    badge(r[6] as string),
  ]),
})}
${card(
  `<div class="oa-card-body" style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
  <div style="width:84px;height:84px;border-radius:var(--oa-r);background:var(--oa-surface-2);display:grid;place-items:center;color:var(--oa-text-3)">${icon(ICON.shield, 28)}</div>
  <div style="flex:1 1 220px">
    <p style="font-size:0.84rem;font-weight:600">Check-in scanner</p>
    <p style="font-size:0.78rem;color:var(--oa-text-2)">Point a phone at a ticket QR code. Valid codes check the holder in, used codes say when and where they were scanned, and refunded tickets are refused.</p>
  </div>
  ${btn('Launch scanner', { primary: true })}
</div>`,
  { title: 'At the door' }
)}`;
