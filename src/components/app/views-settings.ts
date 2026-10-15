import {
  badge, btn, card, esc, filterBar, ICON, icon, page, searchInput, select, split, table, tabs,
  tiles,
} from './ui';
import { INTEGRATIONS, TENANT, auditLog, person } from './seed';
import { LEVELS, ROLES, SENSITIVE, levelFor } from './roles';
import { GROUPS } from './nav';

// ---------------------------------------------------------------- settings index

export const settings = () => `${page({
  crumbs: ['Settings'],
  title: 'Settings',
  lead: 'Anything a business would change lives here, not in code: capacities, lead times, targets, business hours, tax, thresholds. Every change is validated, versioned and reversible.',
  actions: btn('Change history', { iconPath: ICON.clock }),
})}
<div class="oa-tiles" data-cols="3">
  ${[
    ['Commerce', 'Checkout, tax, shipping cutoff, order numbering, refund rules'],
    ['Relationships', 'Pipeline stages, SLA targets, routing and backup reps, loyalty rules'],
    ['Growth', 'Consent banner, analytics retention, sending domains, brand voice'],
    ['Operations', 'Work centres, capacities, working days, lead times, lot codes'],
    ['Workspace', 'Queues, response targets, overtime, kiosk PINs, survey windows'],
    ['Platform', 'Staff and roles, integrations, media, audit retention, backups'],
  ]
    .map(
      ([title, body]) => `<article class="oa-tile" style="gap:7px">
    <span class="oa-tile-label">${esc(title)}</span>
    <p style="font-size:0.8rem;color:var(--oa-text-2)">${esc(body)}</p>
    <span>${
      title === 'Platform'
        ? btn('Open', { sm: true, attrs: 'data-oa-go="staff"' })
        : btn('Open', { sm: true, attrs: `data-oa-toast="${esc(title)} settings are editable in your build"` })
    }</span>
  </article>`
    )
    .join('')}
</div>
${card(
  `<ul class="oa-list">${auditLog
    .map(
      (a) => `<li>
  <span><span class="oa-strong">${esc(a.what)}</span><span class="oa-sub">${esc(a.who)} · ${esc(a.when)}</span></span>
  ${a.kind === 'sensitive' ? badge('Sensitive action', 'warn') : a.kind === 'draft' ? badge('Via AI assistant', 'info') : badge('Change', 'neutral')}
</li>`
    )
    .join('')}</ul>`,
  { title: 'Recent changes', sub: 'Every write is attributed, including the ones an AI made on someone’s behalf', actions: btn('Reset to defaults', { sm: true }) }
)}`;

// ---------------------------------------------------------------- staff & roles

export const staff = () => {
  const moduleKeys = GROUPS.flatMap((g) => g.items.map((i) => ({ key: i.perm ?? i.key, label: i.label }))).slice(0, 10);
  return `${page({
    crumbs: ['Settings', 'Staff & roles'],
    title: 'Staff and roles',
    lead: 'Modules have four levels and sensitive actions are checked on their own. Hidden buttons are a courtesy; the server checks every read and every write.',
    actions: `${btn('Invite staff', { iconPath: ICON.plus })}${btn('New role', { primary: true })}`,
  })}
${tabs('Staff', ['People', 'Roles', 'Departments', 'Overrides'])}
${table({
  filters: filterBar([searchInput('Search staff'), select('Department', ['All departments', 'Sales', 'Production', 'Marketing', 'Service', 'Leadership'])]),
  columns: [{ label: 'Person' }, { label: 'Role' }, { label: 'Department' }, { label: 'Sensitive actions', kind: 'wrap' }, { label: 'Status' }, { label: '' }],
  rows: ROLES.map((r) => [
    `<span class="oa-strong">${esc(r.person.name)}</span><span class="oa-sub">${esc(r.person.title)}</span>`,
    `${esc(r.name)}${r.admin ? ` ${badge('Dept admin', 'info')}` : ''}`,
    esc(r.department),
    r.sensitive.length ? r.sensitive.map((s) => badge(s.replace(/_/g, ' '))).join(' ') : `<span class="oa-sub">None</span>`,
    badge('Active'),
    btn('Edit', { sm: true }),
  ]),
})}
${card(
  `<div class="oa-table-wrap"><table class="oa-table">
  <thead><tr><th>Module</th>${ROLES.map((r) => `<th>${esc(r.name)}</th>`).join('')}</tr></thead>
  <tbody>${moduleKeys
    .map(
      (m) => `<tr><td class="oa-strong">${esc(m.label)}</td>${ROLES.map((r) => {
        const lvl = levelFor(r, m.key);
        const tone = lvl === 0 ? 'danger' : lvl === 3 ? 'ok' : lvl === 2 ? 'info' : 'neutral';
        return `<td>${badge(LEVELS[lvl], tone as never)}</td>`;
      }).join('')}</tr>`
    )
    .join('')}</tbody>
</table></div>`,
  { title: 'Permission matrix', sub: 'A sample of the modules; the grid covers all of them', actions: btn('Export', { sm: true, attrs: 'data-oa-sensitive="export_data"' }) }
)}`;
};

// ---------------------------------------------------------------- integrations

export const integrations = () => `${page({
  crumbs: ['Settings', 'Integrations'],
  title: 'Integrations',
  lead: 'Which keys are set, never what they are. A key that is missing degrades the feature gracefully instead of breaking the page.',
  actions: btn('Add integration', { primary: true, iconPath: ICON.plus }),
})}
${card(
  `<ul class="oa-list">${INTEGRATIONS.map(
    (i) => `<li>
  <span><span class="oa-strong">${esc(i.name)}</span><span class="oa-sub">${esc(i.area)} · ${esc(i.note)}</span></span>
  <span style="display:flex;gap:8px;align-items:center">${badge(i.set ? 'Key set' : 'Not set', i.set ? 'ok' : 'warn')}${btn(i.set ? 'Rotate' : 'Add key', { sm: true })}</span>
</li>`
  ).join('')}</ul>`,
  { title: 'Connections' }
)}
${card(
  `<div class="oa-card-body" style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap">
  ${icon(ICON.warning, 20)}
  <div style="flex:1 1 300px">
    <p style="font-size:0.84rem;font-weight:600">AI is running in limited mode</p>
    <p style="font-size:0.78rem;color:var(--oa-text-2)">No model key is set, so the assistant and the three editors answer from keyword rules and templates and say so on every reply. Add a key and the same tools run against the real model. Nothing else about the app changes.</p>
  </div>
</div>`,
  { title: 'AI status' }
)}`;

// ---------------------------------------------------------------- style guide

export const styleguide = () => {
  const tone = ['neutral', 'ok', 'warn', 'danger', 'info'] as const;
  return `${page({
    crumbs: ['Settings', 'Style guide'],
    title: 'Style guide',
    lead: 'Generated from the design tokens, so this page cannot drift from the app. Change a token and every screen and this page move together.',
    actions: btn('Copy tokens', { attrs: 'data-oa-toast="Tokens copied"' }),
  })}
${split(
  card(
    `<div class="oa-card-body" style="display:flex;flex-direction:column;gap:12px">
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px">
    ${[
      ['Surface', 'var(--oa-surface)'],
      ['Surface 2', 'var(--oa-surface-2)'],
      ['Border', 'var(--oa-border)'],
      ['Text', 'var(--oa-text)'],
      ['Accent', 'var(--oa-accent-strong)'],
      ['Info', 'var(--oa-info)'],
      ['Warn', 'var(--oa-warn)'],
      ['Danger', 'var(--oa-danger)'],
    ]
      .map(
        ([name, v]) => `<div style="display:flex;flex-direction:column;gap:4px">
      <span style="height:38px;border-radius:var(--oa-r);background:${v};border:1px solid var(--oa-border)"></span>
      <span style="font-size:0.68rem;color:var(--oa-text-3)">${esc(name)}</span>
    </div>`
      )
      .join('')}
  </div>
</div>`,
    { title: 'Colour' }
  ),
  card(
    `<div class="oa-card-body" style="display:flex;flex-direction:column;gap:9px">
  <span style="font-size:1.4rem;font-weight:650;letter-spacing:-0.02em">Display 28 / 650</span>
  <span style="font-size:1.05rem;font-weight:600">Heading 17 / 600</span>
  <span style="font-size:0.86rem;font-weight:600">Subheading 14 / 600</span>
  <span style="font-size:0.8rem">Body 13 / 400. The quick brown fox jumps over the lazy dog.</span>
  <span class="oa-mono">Mono 12 · NW-1042 · $1,890.00</span>
</div>`,
    { title: 'Type' }
  )
)}
${split(
  card(
    `<div class="oa-card-body" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
  ${btn('Primary', { primary: true })}${btn('Secondary')}${btn('Small', { sm: true })}${btn('With icon', { iconPath: ICON.plus })}
  ${tone.map((t) => badge(t === 'neutral' ? 'Neutral' : t === 'ok' ? 'Success' : t === 'warn' ? 'Warning' : t === 'danger' ? 'Danger' : 'Info', t)).join(' ')}
</div>`,
    { title: 'Controls' }
  ),
  card(
    `<div class="oa-card-body" style="display:flex;flex-direction:column;gap:8px;font-size:0.8rem">
  <p style="color:var(--oa-text-2)">Contrast is checked at build: body text clears 4.5:1 against its surface in both themes, and the accent is only used for text at its strong variant.</p>
  <ul class="oa-list" style="border:1px solid var(--oa-border);border-radius:var(--oa-r)">
    <li><span>Focus ring</span><span class="oa-sub">2px accent, 2px offset</span></li>
    <li><span>Radius scale</span><span class="oa-sub">8 / 12 / 16</span></li>
    <li><span>Motion</span><span class="oa-sub">Disabled under reduced motion</span></li>
    <li><span>Minimum target</span><span class="oa-sub">24px, 44px on touch</span></li>
  </ul>
</div>`,
    { title: 'Accessibility' }
  )
)}`;
};
