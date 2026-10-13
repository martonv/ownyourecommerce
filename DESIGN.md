# ownyourecommerce.com: Design Spec (v2)

Direction: modern product-company aesthetic in the spirit of Attio and Linear. The look is quiet, precise and product-led. The real UI (our sample admin) does the selling, and the chrome around it gets out of the way.

**Do not copy Attio's assets, logo, illustrations or exact layouts.** Use the principles below.

Stack assumption: Next.js + React + TypeScript + Tailwind. Adapt if different.

---

## 1. Principles

1. **Product is the hero.** Show the real admin early and often, framed like a screenshot of a real app.
2. **One accent color.** Everything else is neutral. The accent marks primary actions and active states only.
3. **Hairlines, not shadows.** 1px borders define structure. Shadows are reserved for the product frame.
4. **Typography carries the design.** Large, tight headlines; small, calm body text. No decorative gradients on text.
5. **Fewer, bigger sections.** Each section has one idea, one headline and one visual. Generous vertical space.
6. **Motion is functional.** Small fades and slides on scroll, plus tab transitions. Nothing bounces or glows.

### Avoid (these read as AI-generated)
- Gradient blob backgrounds, glowing orbs, purple-to-blue gradients
- Pill badges with sparkle icons above the H1
- Emoji in headings or feature cards
- Big stat rows with no source
- Grids of 12+ identical icon cards
- Infinite logo marquees
- Every section numbered 01, 02, 03

---

## 2. Design tokens

### Color (light, default)
```css
:root {
  --bg:            #FFFFFF;
  --bg-subtle:     #F7F7F8;  /* alternating section bg, cards */
  --bg-muted:      #F0F0F2;  /* tab rails, input bg */
  --border:        #E6E6EA;  /* hairlines */
  --border-strong: #D4D4DA;
  --text:          #0E0E11;  /* headlines */
  --text-body:     #3F3F46;  /* paragraphs */
  --text-muted:    #71717A;  /* labels, captions */
  --accent:        #2F5BEA;  /* single brand accent, adjust to brand */
  --accent-hover:  #2449C8;
  --accent-soft:   #EEF2FE;  /* active tab bg, highlight chips */
  --success:       #16A34A;
  --warning:       #D97706;
  --danger:        #DC2626;
}
```

### Color (dark)
```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg:#0B0B0D; --bg-subtle:#121215; --bg-muted:#18181C;
    --border:#26262B; --border-strong:#34343A;
    --text:#F4F4F5; --text-body:#C4C4CC; --text-muted:#8A8A93;
    --accent:#5B7FFF; --accent-hover:#7A97FF; --accent-soft:#16204A;
  }
}
:root[data-theme="dark"] { /* same values as above */ }
```

### Typography
- **Font:** Inter (or Geist) for everything. Optional: Geist Mono / JetBrains Mono for numbers, SKUs and order IDs in the product UI.
- Use `font-feature-settings: "cv11", "ss01"` and `tabular-nums` on numbers.

| Token | Size / line-height | Weight | Tracking | Use |
|---|---|---|---|---|
| display | 64/68 (mobile 40/44) | 600 | -0.035em | Hero H1 only |
| h2 | 44/50 (mobile 30/36) | 600 | -0.03em | Section headlines |
| h3 | 20/28 | 600 | -0.01em | Card and tab headings |
| body-lg | 18/28 | 400 | 0 | Hero subhead, section intros |
| body | 15/24 | 400 | 0 | Default |
| small | 13/20 | 500 | 0 | Labels, captions, buttons |
| label | 13/20 | 500 | 0 | Section label above H2: `--text-muted`, sentence case, no pill or border |

Headline max width: about 18 words per line (`max-w-[20ch]` for H1, `max-w-[24ch]` for H2). Body max width: `max-w-[60ch]`.

### Spacing and layout
- Container: `max-w-[1200px]`, side padding 24px (16px under 640px).
- Section padding: 128px top and bottom desktop, 80px mobile.
- 12-column grid, 24px gutter.
- Radius: 8px buttons and inputs, 12px cards, 16px product frame.
- 4px spacing base (4, 8, 12, 16, 24, 32, 48, 64, 96, 128).

### Elevation
- Cards: `border: 1px solid var(--border)`, no shadow.
- Product frame only: `box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 24px 64px -24px rgba(16,24,40,.18)`.

---

## 3. Components

**Buttons**
- Primary: `--text` background with `--bg` text (black button in light mode), 40px height, 8px radius, 13–14px/500. The accent can be used instead if the brand needs color. Pick one and use it everywhere.
- Secondary: transparent background, 1px `--border-strong`, `--text` text.
- Text link: `--text` with a trailing arrow `→` that nudges 2px right on hover.

**Nav**
- 64px height, sticky, `--bg` at 80% opacity with `backdrop-filter: blur(12px)`, 1px bottom border that appears only after scrolling.
- Logo left, links center, two buttons right. On mobile, a hamburger opens a full-height sheet.

**Section label + headline block**
- Label (small, muted) → H2 → optional intro (body-lg, muted). Left-aligned by default. Center only the hero and the final CTA.

**Cards**
- 1px border, 12px radius, 24–32px padding, `--bg` or `--bg-subtle`.
- Optional small 20px line icon (Lucide) in `--text-muted`. Never colored icon tiles.

**Product frame (the most important component)**
- Window chrome: 36px top bar with three 10px neutral dots (not traffic-light colors) and a muted URL-style label `app.yourcompany.com`.
- 16px radius, 1px border, product shadow (above).
- Contains the live sample admin, scaled to fit. On mobile, show a cropped static screenshot with an "Open demo" button instead of the interactive version.

**Tabs (product walkthrough)**
- Horizontal tab rail on desktop: text tabs with an underline indicator that slides between tabs (200ms). Mobile: horizontal scroll chips.
- Layout per tab: left column (4/12) with h3, body and 3–4 points as a plain list with check icons in `--text-muted`. Right column (8/12) shows the product frame focused on that module.
- Optional autoplay that advances every 6s until the user interacts, with a thin progress bar under the active tab.

**Comparison table**
- Two value columns plus a label column. Header row sticky on scroll. Rows separated by hairlines.
- "Own Your eCommerce" column gets an `--accent-soft` background and a 1px accent top border. No red X or green check emoji. Use plain text.

**FAQ**
- Accordion with hairline dividers, a `+` icon rotating to `×`, and 200ms height animation. Two-column layout on desktop: H2 left (sticky), accordion right.

**Form**
- Inputs: 40px height, `--bg-muted` background, 1px transparent border becoming `--accent` on focus with a 3px `--accent-soft` ring.
- Tool checkboxes styled as toggle chips.

---

## 4. Page layout, section by section

Maps to COPY.md section numbers.

**Nav:** see components.

**1. Hero**
- Centered text: label → H1 (display) → subhead (body-lg, muted, `max-w-[56ch]`) → buttons (primary + secondary) → microcopy (small, muted).
- 64px below the buttons, a full-width product frame (max 1100px) showing the sample admin dashboard. It should overlap into the next section by about 120px, with the next section's `--bg-subtle` starting behind it.
- Background: plain `--bg`. Optional: a very faint 1px dot grid (`--border` at 50% opacity) masked with a radial fade around the headline. Nothing else.
- Stack strip below the frame: small muted text with tool names separated by `·`.

**2. Problem**
- `--bg-subtle` section. Label + H2 left-aligned. Three cards in a row (stack on mobile).
- Inside each card, a tiny UI fragment illustrates the pain: three mismatched stock numbers (12 / 9 / 7) in mono, a deal card showing "Closed won" next to an order badge reading "Stuck in production", and a failed sync log line in red. Build these in HTML/CSS, not as images.
- Closing line centered below, body-lg.

**3. Solution**
- `--bg`. Two-column: copy left (5/12), diagram right (7/12).
- Diagram: "Before" shows 4 boxes connected by dashed lines with small warning dots. "After" shows the same modules as segments around one solid "One database" core. A toggle switches Before/After, defaulting to After. Use SVG with `--border` lines and `--accent` for the core.
- Flow strip full-width underneath: 6 small steps with chevrons between them, in mono text.

**4. Product walkthrough**
- `--bg-subtle`. Label + H2 left. Tabs component (see above) wired to the existing demo so each tab opens that module.
- Caption under the frame: "Runs on sample data" plus an "Open full demo →" link.

**5. Proof / 5b. Team**
- `--bg`. One large case card: left side has the big metric (display size, tabular-nums), right side has the quote (body-lg) and attribution with a 40px avatar.
- If showing the team version (5b): founder photo (real, square, 12px radius, grayscale optional) left, bio right. No stock photos.

**6. Own vs. rent**
- `--bg-subtle`. Label + H2 + intro left, comparison table full width below.

**7. How it works**
- `--bg`. Four steps in a horizontal row on desktop (vertical timeline on mobile), connected by a 1px line. Each step: small muted "Step 1" label, h3, body. Step 1 gets an accent dot and a "Free" chip in `--accent-soft`.

**8. Also built in**
- `--bg`, tight section (80px padding). Two-column plain list with small check icons. No cards.

**9. Pricing**
- `--bg-subtle`. A single centered card (max 640px): H2, body, three rows (label left, value right, hairline dividers), primary button full width.

**10. FAQ:** two-column layout as described in components.

**11. Final CTA + form**
- `--bg`. Centered H2 + body, then the form in a bordered card (max 560px). Optionally show a faint product-frame fragment behind it at 40% opacity, fading out.

**Footer:** `--bg-subtle`, top hairline, 4 columns, small text, muted.

---

## 5. Motion

- Scroll reveal: elements fade in from `opacity:0; translateY(8px)` over 400ms ease-out, staggered 60ms within a group. Run once per element.
- Tab change: product frame crossfades over 200ms.
- Hero product frame: on load, it rises 16px and fades in over 600ms after the text.
- Hover on cards: border shifts to `--border-strong`. No lift or scale.
- Respect `prefers-reduced-motion`: disable all transforms and autoplay.

---

## 6. Responsive

- Breakpoints: 640 / 768 / 1024 / 1280.
- Under 1024px, two-column sections stack (copy first, visual second).
- No horizontal page scroll at 375px. Tables become stacked cards under 640px.
- Interactive demo is desktop-only (≥1024px). Smaller screens get a static screenshot plus a button to open the demo in its own page.

---

## 7. Accessibility

- WCAG 2.2 AA contrast for all text, including muted text on `--bg-subtle`.
- Tabs use proper `role="tablist"`/`tab`/`tabpanel` with arrow-key navigation.
- Accordion uses `button` + `aria-expanded`.
- Visible focus rings: 2px `--accent` outline with 2px offset.
- Keep the skip link.

---

## 8. Implementation checklist

- [ ] Replace all copy with COPY.md. Hide any section with an unfilled `[TODO]`.
- [ ] Remove the stat row, growth-stack grid, capability grid, logo marquee and 6-step process.
- [ ] Add tokens to globals / Tailwind theme; remove old colors and gradients.
- [ ] Build the product frame component and move the demo into the hero and tabs.
- [ ] Build the problem-card UI fragments and the before/after diagram in HTML/SVG.
- [ ] Add dark mode via tokens.
- [ ] Test at 375, 768, 1024 and 1440px, in light and dark mode, and with reduced motion.
