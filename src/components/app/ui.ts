/**
 * Markup helpers for the sample admin.
 *
 * These return HTML strings rendered with `set:html`, which keeps thirty module views readable
 * instead of spread across thirty component files. Everything that could contain data goes
 * through `esc`, so a stray angle bracket in sample copy can never become markup.
 */

export const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info';

/** Maps the words used across the sample data onto the four badge tones. */
export function toneFor(value: string): Tone {
  const v = value.toLowerCase();
  if (/(^|\b)(paid|fulfilled|complete|completed|done|won|active|live|on track|received|connected|resolved|approved|sent|in stock|healthy|ok)\b/.test(v)) return 'ok';
  if (/(^|\b)(pending|waiting|at risk|scheduled|draft|planned|partial|partially received|awaiting payment|paused|away|reorder|soon|open)\b/.test(v)) return 'warn';
  if (/(^|\b)(cancelled|refunded|failed|overdue|urgent|lost|archived|blocked|out of stock|no access)\b/.test(v)) return 'danger';
  if (/(^|\b)(in progress|in production|contacted|qualified|en route|sample sent|application|invoice sent|ai|new)\b/.test(v)) return 'info';
  return 'neutral';
}

/** Sample data stores statuses lower case; labels are always shown sentence case. */
const sentence = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

export const badge = (label: string, tone: Tone = toneFor(label)) =>
  `<span class="oa-badge" data-tone="${tone}">${esc(sentence(label))}</span>`;

export const icon = (path: string, size = 16) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;

export const ICON = {
  plus: 'M12 5v14M5 12h14',
  download: 'M12 4v11m0 0l-4-4m4 4l4-4M4 19h16',
  filter: 'M4 6h16M7 12h10M10 18h4',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
  sparkle: 'M12 3l1.8 4.9L19 9.7l-5.2 1.8L12 16.4l-1.8-4.9L5 9.7l5.2-1.8zM18 15l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z',
  check: 'M4 12.5l5 5L20 6.5',
  lock: 'M6 10h12v10H6zM9 10V7a3 3 0 016 0v3',
  inbox: 'M4 5h16v11H9l-5 4z',
  chart: 'M4 19V9m6 10V5m6 14v-7',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  box: 'M4 7l8-4 8 4-8 4zM4 7v10l8 4V11M20 7v10l-8 4',
  calendar: 'M4 6h16v15H4zM4 10h16M9 3v4M15 3v4',
  tag: 'M4 12V4h8l8 8-8 8z M8 8h.01',
  bell: 'M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6zM10 20a2 2 0 004 0',
  chat: 'M4 5h16v11H9l-5 4z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c.8-4 4-6 8-6s7.2 2 8 6',
  sun: 'M12 17a5 5 0 100-10 5 5 0 000 10zM12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  moon: 'M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z',
  chevron: 'M9 5l7 7-7 7',
  back: 'M15 5l-7 7 7 7',
  panelLeft: 'M4 5h16v14H4zM10 5v14',
  external: 'M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5',
  warning: 'M12 4l9 16H3zM12 10v4M12 17v.5',
  shield: 'M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6zM9 12l2 2 4-4',
  refresh: 'M20 11A8 8 0 006.3 6.3L4 8.5M4 13a8 8 0 0013.7 4.7L20 15.5M4 4v4.5h4.5M20 20v-4.5h-4.5',
};

// ---------------------------------------------------------------- layout

export function page(opts: {
  crumbs: string[];
  title: string;
  lead?: string;
  actions?: string;
}) {
  const crumbs = opts.crumbs
    .map((c, i) => (i ? `<span aria-hidden="true">/</span><span>${esc(c)}</span>` : `<span>${esc(c)}</span>`))
    .join('');
  return `<div class="oa-crumbs">${crumbs}</div>
<div class="oa-head">
  <div>
    <h2>${esc(opts.title)}</h2>
    ${opts.lead ? `<p>${esc(opts.lead)}</p>` : ''}
  </div>
  ${opts.actions ? `<div class="oa-head-actions">${opts.actions}</div>` : ''}
</div>`;
}

export const btn = (label: string, opts: { primary?: boolean; iconPath?: string; attrs?: string; sm?: boolean } = {}) =>
  `<button type="button" class="oa-btn${opts.primary ? ' oa-btn-primary' : ''}${opts.sm ? ' oa-btn-sm' : ''}" ${opts.attrs ?? ''}>${opts.iconPath ? icon(opts.iconPath, 14) : ''}${esc(label)}</button>`;

export const seg = (name: string, options: string[], active = 0) =>
  `<div class="oa-seg" role="group" aria-label="${esc(name)}">${options
    .map((o, i) => `<button type="button" aria-pressed="${i === active}" data-oa-seg="${esc(name)}">${esc(o)}</button>`)
    .join('')}</div>`;

export const tabs = (name: string, options: string[], active = 0) =>
  `<div class="oa-tabs" role="tablist" aria-label="${esc(name)}">${options
    .map((o, i) => `<button type="button" role="tab" aria-selected="${i === active}" data-oa-tab="${esc(name)}">${esc(o)}</button>`)
    .join('')}</div>`;

export const card = (body: string, head?: { title: string; sub?: string; actions?: string }) =>
  `<section class="oa-card">${
    head
      ? `<div class="oa-card-head"><div><h3>${esc(head.title)}</h3>${head.sub ? `<p>${esc(head.sub)}</p>` : ''}</div>${head.actions ?? ''}</div>`
      : ''
  }${body}</section>`;

export const split = (left: string, right: string, ratio?: '2-1' | '1-2') =>
  `<div class="oa-split"${ratio ? ` data-ratio="${ratio}"` : ''}>${left}${right}</div>`;

// ---------------------------------------------------------------- tiles + charts

export interface Tile {
  label: string;
  value: string;
  delta?: number;
  note?: string;
  spark?: number[];
}

export function tiles(list: Tile[], cols = 4) {
  return `<div class="oa-tiles" data-cols="${cols}">${list
    .map(
      (t) => `<article class="oa-tile">
  <span class="oa-tile-label">${esc(t.label)}</span>
  <span class="oa-tile-value">${esc(t.value)}</span>
  <span class="oa-tile-foot">
    ${t.delta !== undefined ? `<span class="oa-delta" data-dir="${t.delta >= 0 ? 'up' : 'down'}">${t.delta >= 0 ? '▲' : '▼'} ${Math.abs(t.delta).toFixed(1)}%</span>` : `<span class="oa-delta">${esc(t.note ?? '')}</span>`}
    ${t.spark ? spark(t.spark) : ''}
  </span>
</article>`
    )
    .join('')}</div>`;
}

export function spark(values: number[]) {
  const w = 76;
  const h = 22;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => `${((i / (values.length - 1)) * w).toFixed(1)},${(h - ((v - min) / span) * (h - 3) - 1.5).toFixed(1)}`)
    .join(' ');
  return `<svg class="oa-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline class="oa-line" points="${pts}"/></svg>`;
}

/** Line chart with a filled area and month labels. */
export function trend(points: { label: string; value: number }[], height = 180) {
  const w = 620;
  const padL = 8;
  const padB = 18;
  const max = Math.max(...points.map((p) => p.value)) * 1.08;
  const stepX = (w - padL * 2) / (points.length - 1);
  const y = (v: number) => height - padB - (v / max) * (height - padB - 10);
  const line = points.map((p, i) => `${(padL + i * stepX).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${padL},${height - padB} ${line} ${(padL + (points.length - 1) * stepX).toFixed(1)},${height - padB}`;
  const grid = [0.25, 0.5, 0.75, 1]
    .map((f) => `<line class="oa-grid-line" x1="${padL}" x2="${w - padL}" y1="${y(max * f).toFixed(1)}" y2="${y(max * f).toFixed(1)}"/>`)
    .join('');
  const labels = points
    .map((p, i) =>
      i % 2 === 0
        ? `<text class="oa-axis" x="${(padL + i * stepX).toFixed(1)}" y="${height - 4}" text-anchor="middle">${esc(p.label)}</text>`
        : ''
    )
    .join('');
  return `<svg class="oa-chart" viewBox="0 0 ${w} ${height}" role="img" aria-label="Trend chart">${grid}<polygon class="oa-area" points="${area}"/><polyline class="oa-line" points="${line}"/>${labels}</svg>`;
}

/** Column chart. */
export function columns(points: { label: string; value: number }[], height = 180) {
  const w = 620;
  const padB = 18;
  const max = Math.max(...points.map((p) => p.value)) * 1.08;
  const slot = w / points.length;
  const bw = Math.min(26, slot * 0.6);
  return `<svg class="oa-chart" viewBox="0 0 ${w} ${height}" role="img" aria-label="Column chart">${points
    .map((p, i) => {
      const h = (p.value / max) * (height - padB - 8);
      const x = i * slot + (slot - bw) / 2;
      return `<rect class="oa-bar" x="${x.toFixed(1)}" y="${(height - padB - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="3"/><text class="oa-axis" x="${(i * slot + slot / 2).toFixed(1)}" y="${height - 4}" text-anchor="middle">${esc(p.label)}</text>`;
    })
    .join('')}</svg>`;
}

export function barList(rows: { name: string; value: number; display?: string }[]) {
  const max = Math.max(...rows.map((r) => r.value));
  return `<ul class="oa-barlist">${rows
    .map(
      (r) => `<li><i class="oa-barfill" style="width:${((r.value / max) * 100).toFixed(1)}%"></i><span>${esc(r.name)}</span><span class="oa-num">${esc(r.display ?? r.value.toLocaleString('en-US'))}</span></li>`
    )
    .join('')}</ul>`;
}

export function funnel(steps: { step: string; value: number }[]) {
  const top = steps[0].value;
  return `<ul class="oa-funnel">${steps
    .map((s, i) => {
      const share = (s.value / top) * 100;
      const prev = i ? (s.value / steps[i - 1].value) * 100 : 100;
      return `<li><span>${esc(s.step)}</span><span class="oa-fbar" style="width:${share.toFixed(1)}%"></span><span class="oa-fmeta">${s.value.toLocaleString('en-US')} · ${prev.toFixed(0)}%</span></li>`;
    })
    .join('')}</ul>`;
}

// ---------------------------------------------------------------- tables

export interface Column {
  label: string;
  /** 'num' right-aligns and uses tabular figures; 'wrap' lets long text wrap. */
  kind?: 'num' | 'wrap';
}

export function table(opts: {
  columns: Column[];
  rows: string[][];
  filters?: string;
  foot?: string;
  empty?: { title: string; body: string };
}) {
  if (!opts.rows.length) {
    return card(
      `${opts.filters ? `<div class="oa-filters">${opts.filters}</div>` : ''}${emptyState(opts.empty?.title ?? 'Nothing here yet', opts.empty?.body ?? 'When there is, it will show up here.')}`
    );
  }
  const head = opts.columns
    .map((c) => `<th${c.kind === 'num' ? ' class="oa-num"' : ''}>${esc(c.label)}</th>`)
    .join('');
  const body = opts.rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell, i) => {
            const kind = opts.columns[i]?.kind;
            return `<td${kind === 'num' ? ' class="oa-num"' : kind === 'wrap' ? ' class="oa-wrap"' : ''}>${cell}</td>`;
          })
          .join('')}</tr>`
    )
    .join('');
  return card(
    `${opts.filters ? `<div class="oa-filters">${opts.filters}</div>` : ''}
<div class="oa-table-wrap"><table class="oa-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>
<div class="oa-foot"><span>${opts.foot ?? `Showing ${opts.rows.length} of ${opts.rows.length}`}</span><span class="oa-pager">${btn('Previous', { sm: true, attrs: 'disabled' })}${
    opts.foot
      ? btn('Next', { sm: true, attrs: 'data-oa-toast="The demo loads one page of sample data"' })
      : btn('Next', { sm: true, attrs: 'disabled' })
  }</span></div>`
  );
}

export const filterBar = (parts: string[]) => parts.join('');
export const searchInput = (placeholder: string) =>
  `<input type="search" class="oa-input" placeholder="${esc(placeholder)}" aria-label="${esc(placeholder)}">`;
export const select = (label: string, options: string[]) =>
  `<select class="oa-select" aria-label="${esc(label)}">${options.map((o) => `<option>${esc(o)}</option>`).join('')}</select>`;

export const emptyState = (title: string, body: string) =>
  `<div class="oa-empty">${icon(ICON.inbox, 26)}<h4>${esc(title)}</h4><p>${esc(body)}</p></div>`;

// ---------------------------------------------------------------- kanban

export function kanban(
  columnsIn: { key: string; label: string }[],
  cards: { col: string; title: string; meta?: string; right?: string; id: string }[]
) {
  return `<div class="oa-kb">${columnsIn
    .map((c) => {
      const mine = cards.filter((k) => k.col === c.key);
      return `<div class="oa-kb-col" data-oa-kb-col="${esc(c.key)}">
  <div class="oa-kb-head"><span>${esc(c.label)}</span><span>${mine.length}</span></div>
  <div class="oa-kb-list">${mine
    .map(
      (k) => `<article class="oa-kb-card" draggable="true" data-oa-kb-card="${esc(k.id)}">
    <span class="oa-kb-title">${esc(k.title)}</span>
    <span class="oa-kb-meta"><span>${esc(k.meta ?? '')}</span>${k.right ?? ''}</span>
  </article>`
    )
    .join('')}</div>
</div>`;
    })
    .join('')}</div>`;
}

export const meter = (pctValue: number) =>
  `<span class="oa-meter" role="img" aria-label="${pctValue}% complete"><i style="width:${Math.max(0, Math.min(100, pctValue))}%"></i></span>`;

export const swatches = (hexes: string[]) =>
  `<span class="oa-swatches">${hexes.map((h) => `<i class="oa-swatch" style="background:${esc(h)}"></i>`).join('')}</span>`;
