import {
  badge, barList, btn, card, esc, filterBar, ICON, icon, kanban, meter, page, searchInput, seg,
  select, split, table, tabs, tiles,
} from './ui';
import {
  KPIS, TEAMS, TICKET_QUEUES, chatChannels, chatMessages, counts, fmtDate, goals, num, person,
  projects, punches, shiftDay, tickets, TODAY,
} from './seed';

// ---------------------------------------------------------------- tickets

export const ticketsView = () => `${page({
  crumbs: ['Workspace', 'Tickets'],
  title: 'Internal tickets',
  lead: 'A request raised on the shop floor gets a queue, a priority and the work order it belongs to, without anyone triaging the list by hand.',
  actions: `${seg('Tickets view', ['List', 'Board'], 0)}${btn('Raise a ticket', { primary: true, iconPath: ICON.plus })}`,
})}
${tiles([
  { label: 'Open tickets', value: String(counts.openTickets), delta: -8.0 },
  { label: 'Breaching target', value: '2', delta: -33.0 },
  { label: 'Median response', value: '34 min', delta: -14.0 },
  { label: 'Closed this week', value: '19', delta: 12.0 },
])}
${table({
  filters: filterBar([
    searchInput('Search tickets'),
    select('Queue', ['All queues', ...TICKET_QUEUES]),
    select('Priority', ['Any priority', 'Urgent', 'High', 'Normal', 'Low']),
    btn('Bulk edit', { sm: true }),
  ]),
  columns: [
    { label: 'Ticket' }, { label: 'Title', kind: 'wrap' }, { label: 'Queue' }, { label: 'Priority' },
    { label: 'Assignee' }, { label: 'Due' }, { label: 'Status' },
  ],
  rows: tickets.map((t) => [
    `<span class="oa-mono">${esc(t.id)}</span>`,
    `<span class="oa-strong">${esc(t.title)}</span><span class="oa-sub">Raised ${esc(fmtDate(t.raised))}</span>`,
    badge(t.queue),
    badge(t.priority, t.priority === 'Urgent' ? 'danger' : t.priority === 'High' ? 'warn' : 'neutral'),
    esc(t.assignee),
    esc(fmtDate(t.due)),
    badge(t.status),
  ]),
})}
${kanban(
  [
    { key: 'Open', label: 'Open' },
    { key: 'In progress', label: 'In progress' },
    { key: 'Waiting', label: 'Waiting' },
    { key: 'Done', label: 'Done' },
  ],
  tickets.map((t) => ({ id: t.id, col: t.status, title: t.title, meta: `${t.id} · ${t.assignee.split(' ')[0]}`, right: badge(t.priority, t.priority === 'Urgent' ? 'danger' : 'neutral') }))
)}`;

// ---------------------------------------------------------------- projects

export const projectsView = () => `${page({
  crumbs: ['Workspace', 'Projects'],
  title: 'Projects',
  lead: 'Milestones, linked tickets and a timeline you can drag to reschedule. Health is a judgement call someone makes, not a number we invent.',
  actions: `${btn('From template')}${btn('New project', { primary: true, iconPath: ICON.plus })}`,
})}
${table({
  columns: [
    { label: 'Project', kind: 'wrap' }, { label: 'Lead' }, { label: 'Progress' }, { label: 'Tickets', kind: 'num' },
    { label: 'Due' }, { label: 'Health' },
  ],
  rows: projects.map((p) => [
    `<span class="oa-strong">${esc(p.name)}</span>`,
    esc(p.lead),
    `<span style="display:flex;align-items:center;gap:8px">${meter(p.progress)}<span class="oa-sub">${p.progress}%</span></span>`,
    String(p.tickets),
    esc(fmtDate(p.due)),
    badge(p.health),
  ]),
})}
${card(
  `<div class="oa-card-body" style="display:flex;flex-direction:column;gap:8px">
  ${projects
    .map((p, i) => {
      const left = 4 + i * 6;
      const width = 22 + (p.progress / 100) * 36;
      return `<div style="display:grid;grid-template-columns:150px minmax(0,1fr);gap:10px;align-items:center;font-size:0.78rem">
      <span>${esc(p.name)}</span>
      <span style="position:relative;height:20px;background:var(--oa-surface-2);border-radius:5px">
        <span style="position:absolute;left:${left}%;width:${width}%;top:3px;bottom:3px;border-radius:4px;background:var(--oa-accent-strong);opacity:${p.health === 'At risk' ? 0.55 : 1}"></span>
      </span>
    </div>`;
    })
    .join('')}
</div>`,
  { title: 'Timeline', sub: 'Drag a bar to reschedule' }
)}`;

// ---------------------------------------------------------------- calendar

export const calendar = () => {
  const start = new Date(TODAY);
  start.setDate(1);
  const pad = (start.getDay() + 6) % 7;
  const cells = Array.from({ length: 35 }, (_, i) => i - pad + 1);
  const items: Record<number, { label: string; kind: string }[]> = {
    8: [{ label: 'Ops standup', kind: 'meeting' }],
    13: [{ label: 'WO-1184 due', kind: 'production' }, { label: 'Priya PTO', kind: 'timeoff' }],
    16: [{ label: 'Trade preview', kind: 'event' }],
    18: [{ label: 'J-773 install', kind: 'service' }],
    22: [{ label: 'Catalog shoot', kind: 'milestone' }],
    27: [{ label: 'Quarter close', kind: 'milestone' }],
  };
  return `${page({
    crumbs: ['Workspace', 'Calendar'],
    title: 'Calendar',
    lead: 'Meetings, time off, ticket due dates and milestones, plus read-only layers from production and field service that respect what you are allowed to see.',
    actions: `${seg('Calendar view', ['Month', 'Week', 'Agenda'], 0)}${btn('Subscribe (ICS)', { iconPath: ICON.external })}`,
  })}
${card(
  `<div class="oa-card-body">
  <div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;margin-bottom:6px">
    ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => `<span style="font-size:0.68rem;color:var(--oa-text-3);text-transform:uppercase;letter-spacing:0.05em">${d}</span>`).join('')}
  </div>
  <div class="oa-cal">${cells
    .map((n) => {
      if (n < 1 || n > 30) return `<div class="oa-cal-day" style="opacity:0.35"></div>`;
      const evts = items[n] ?? [];
      const today = n === TODAY.getDate();
      return `<div class="oa-cal-day">
      <span class="oa-cal-num"${today ? ' style="color:var(--oa-accent-strong);font-weight:700"' : ''}>${n}</span>
      ${evts.map((e) => `<span class="oa-cal-chip" data-stage="${e.kind === 'timeoff' ? 'Complete' : e.kind === 'service' ? 'In progress' : 'Planned'}">${esc(e.label)}</span>`).join('')}
    </div>`;
    })
    .join('')}</div>
</div>`,
  { title: 'April 2026', actions: `<span style="display:flex;gap:6px">${btn('Today', { sm: true })}${btn('New event', { sm: true, primary: true })}</span>` }
)}`;
};

// ---------------------------------------------------------------- goals

export const goalsView = () => `${page({
  crumbs: ['Workspace', 'Goals & KPIs'],
  title: 'Goals and KPIs',
  lead: 'Quarterly objectives with key results, weekly check-ins and a grade at the end. KPIs are computed from live data where we can, entered by hand where we cannot.',
  actions: `${btn('Weekly check-in', { iconPath: ICON.check })}${btn('New objective', { primary: true, iconPath: ICON.plus })}`,
})}
${tiles(KPIS.map((k) => ({ label: k.name, value: k.value, delta: k.trend, note: `Target ${k.target}` })))}
${table({
  columns: [{ label: 'Objective', kind: 'wrap' }, { label: 'Owner' }, { label: 'Key results', kind: 'num' }, { label: 'Progress' }, { label: 'Grade' }],
  rows: goals.map((g) => [
    `<span class="oa-strong">${esc(g.objective)}</span>`,
    esc(g.owner),
    String(g.krs),
    `<span style="display:flex;align-items:center;gap:8px">${meter(g.progress)}<span class="oa-sub">${g.progress}%</span></span>`,
    badge(g.grade),
  ]),
})}
${split(
  card(
    `<div class="oa-card-body" style="display:flex;flex-direction:column;gap:10px">
  <p style="font-size:0.78rem;color:var(--oa-text-2)">Results are only shown for groups of three or more, and overlapping groups that would give away an individual are hidden too.</p>
  ${barList([
    { name: 'I have what I need to do my job', value: 82, display: '8.2 / 10' },
    { name: 'I know what is expected of me', value: 88, display: '8.8 / 10' },
    { name: 'Handovers between teams work', value: 61, display: '6.1 / 10' },
    { name: 'I would recommend working here', value: 79, display: '7.9 / 10' },
  ])}
</div>`,
    { title: 'Quarterly feedback', sub: 'Anonymous · 34 of 38 responded', actions: btn('Build a survey', { sm: true }) }
  ),
  card(
    `<ul class="oa-list">
  <li><span>Handover friction between sales and production</span>${btn('Make a ticket', { sm: true, attrs: 'data-oa-go="tickets" data-oa-toast="Ticket raised from the survey"' })}</li>
  <li><span>Shop floor tablets are slow</span>${badge('Ticket T-312', 'info')}</li>
  <li><span>More notice on rush orders</span>${badge('In progress', 'info')}</li>
</ul>`,
    { title: 'Action items', sub: 'Raised from the last survey' }
  )
)}`;

// ---------------------------------------------------------------- time clock

export const timeclock = () => `${page({
  crumbs: ['Workspace', 'Time clock'],
  title: 'Time clock',
  lead: 'Punch in from a phone or a shop floor tablet in kiosk mode. A missed punch is fixed by request, with an approval and an audit entry, never by quietly editing the record.',
  actions: `${btn('Kiosk mode', { iconPath: ICON.external })}${btn('Payroll CSV', { iconPath: ICON.download, attrs: 'data-oa-sensitive="export_data"' })}`,
})}
${split(
  card(
    `<div class="oa-card-body" style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
  <div style="flex:1 1 200px">
    <p style="font-size:0.72rem;color:var(--oa-text-3);text-transform:uppercase;letter-spacing:0.05em">Your shift</p>
    <p style="font-size:1.5rem;font-weight:650;letter-spacing:-0.02em" data-oa-clock-time>3h 42m</p>
    <p style="font-size:0.78rem;color:var(--oa-text-2)" data-oa-clock-meta>Clocked in at 7:38 am · Shop floor</p>
  </div>
  <div style="display:flex;gap:8px;align-items:center">
    <span class="oa-badge" data-tone="ok" data-oa-clock-chip>On the clock</span>
    ${btn('Start break', { sm: true })}
    ${btn('Clock out', { primary: true, attrs: 'data-oa-clock-toggle data-oa-in="true"' })}
  </div>
</div>`,
    { title: 'Now' }
  ),
  card(
    `<ul class="oa-list">
  <li><span>Overtime after</span><span class="oa-strong">40 h / week</span></li>
  <li><span>Break reminder</span><span class="oa-strong">After 5 h</span></li>
  <li><span>Kiosk PIN length</span><span class="oa-strong">4</span></li>
  <li><span>Fix-a-punch needs approval</span>${badge('Yes', 'ok')}</li>
</ul>`,
    { title: 'Rules', actions: btn('Edit', { sm: true }) }
  )
)}
${table({
  filters: filterBar([searchInput('Search person'), select('Team', ['All teams', 'Shop floor', 'Finishing', 'Pack']), select('Period', ['This week', 'Last week', 'This month'])]),
  columns: [{ label: 'Person' }, { label: 'Team' }, { label: 'In' }, { label: 'Out' }, { label: 'Hours', kind: 'num' }, { label: 'Flag' }, { label: '' }],
  rows: punches.map((p) => [
    `<span class="oa-strong">${esc(p.who)}</span>`,
    esc(p.team),
    esc(p.in),
    esc(p.out),
    esc(p.hours),
    p.flag ? badge(p.flag, p.flag === 'Overtime' ? 'info' : 'warn') : '',
    p.flag === 'Missed break' ? btn('Review', { sm: true }) : '',
  ]),
})}`;

// ---------------------------------------------------------------- teams

export const teams = () => `${page({
  crumbs: ['Workspace', 'Teams'],
  title: 'Teams',
  lead: 'Only a department manager or a super admin can change a team, and a manager can only add people from their own department.',
  actions: btn('New team', { primary: true, iconPath: ICON.plus }),
})}
${table({
  columns: [{ label: 'Team' }, { label: 'Department' }, { label: 'Manager' }, { label: 'People', kind: 'num' }, { label: '' }],
  rows: TEAMS.map((t) => [
    `<span class="oa-strong">${esc(t.name)}</span>`,
    badge(t.dept),
    esc(t.manager),
    String(t.people),
    btn('Manage', { sm: true, attrs: 'data-oa-go="staff"' }),
  ]),
})}
${card(
  `<div class="oa-chat" style="height:320px">
  <div class="oa-chat-rail">${chatChannels
    .map(
      (c, i) => `<button type="button" aria-pressed="${i === 1}" data-oa-pick="channel"># ${esc(c.name)}${c.unread ? `<span class="oa-count">${c.unread}</span>` : ''}</button>`
    )
    .join('')}</div>
  <div class="oa-chat-main">
    <div class="oa-chat-msgs">${chatMessages
      .map(
        (m) => `<div class="oa-msg" data-me="${m.me}">
      <span class="oa-avatar" aria-hidden="true">${esc(m.who.split(' ').map((p) => p[0]).slice(0, 2).join(''))}</span>
      <span class="oa-msg-body"><span class="oa-msg-who">${esc(m.who)} · ${esc(m.when)}</span><span class="oa-msg-text">${esc(m.text)}</span></span>
    </div>`
      )
      .join('')}</div>
    <div style="padding:10px;border-top:1px solid var(--oa-border)" class="oa-ai-input">
      <textarea placeholder="Message #shop-floor" aria-label="Message"></textarea>${btn('Send', { primary: true, attrs: 'data-oa-toast="Message sent to #shop-floor"' })}
    </div>
  </div>
</div>`,
  { title: 'Team chat', sub: 'Channels, DMs, mentions and threads, live over SSE', actions: badge('3 unread', 'info') }
)}`;
