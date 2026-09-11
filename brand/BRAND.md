# oye logo: implementation brief

This folder contains the final "oye." wordmark (short for Own Your eCommerce). Use these files as-is. Do not recreate the logo with live text, a web font, or a different typeface.

## What the logo is

A lowercase, text-only wordmark reading `oye.` set in Manrope ExtraBold (800) with tight letter-spacing (-0.07em) and the font's built-in kerning. The letters are black (or white on dark backgrounds) and the period is green. The period is square, which is how Manrope draws it; do not replace it with a circle. Everything has been converted to vector outlines, so it renders identically everywhere with no font loading.

The aspect ratio is about 2.17:1 (viewBox `0 0 3446 1590`). The bottom of the viewBox includes the descender of the "y"; the baseline sits at about 70% of the height.

The SVG contains two paths: the letters, and the period. Keep them separate so the colors can be controlled independently.

## Files

| File | Use it for |
|---|---|
| `Logo.astro` | Default choice for the Astro site (header, footer). Letters inherit `currentColor`; the period reads the `--oye-dot` CSS variable. |
| `Logo.tsx` | Same component for React / Next.js projects. |
| `oye-logo.svg` | Inline usage where the letters should follow CSS `color` (only works when inlined). |
| `oye-logo-black.svg` | Black letters, `#16A34A` period. For `<img>` tags on light backgrounds, docs, invoices, dashboards. |
| `oye-logo-white.svg` | White letters, `#22C55E` period. For `<img>` tags on dark backgrounds. |
| `oye-logo-black.png` / `oye-logo-white.png` | 1200px wide, transparent background. For places that reject SVG (email clients, some social tools). |
| `oye-icon.svg` | Modern browser favicon (white letters, green period, black rounded square). |
| `favicon.ico` | Legacy favicon (16, 32, 48px). |
| `apple-touch-icon.png` | 180×180 iOS home screen icon (square; iOS applies its own mask). |
| `oye-icon-192.png` / `oye-icon-512.png` | Web app manifest icons and social avatars. |

## Colors

| Token | Hex | Where |
|---|---|---|
| Ink (light mode) | `#000000` | Letters on light backgrounds |
| Ink (dark mode) | `#FFFFFF` | Letters on dark backgrounds |
| Dot (light mode) | `#16A34A` | Period on light backgrounds |
| Dot (dark mode) | `#22C55E` | Period on dark backgrounds (brighter so it holds up against black) |

The components handle theming through CSS. Set the variable once in the global stylesheet, matching however the site already toggles dark mode:

```css
:root { --oye-dot: #16A34A; }

@media (prefers-color-scheme: dark) {
  :root { --oye-dot: #22C55E; }
}

/* If the site uses a class or data attribute instead, mirror it, e.g.: */
/* [data-theme="dark"] { --oye-dot: #22C55E; } */
```

The letters use `currentColor`, so they follow whatever `color` the parent element has. The green period is the only color in the logo. Do not recolor the letters, apply gradients, shadows, or outlines, or make the period any color other than the two greens above. If the green is later adopted as the site's accent color, that is fine, but the logo keeps these exact values.

## Sizing and spacing

Size the logo by height and let width follow (`width: auto`). Recommended heights: 24–32px in a site header, 20–24px in a footer, never below 16px. Keep clear space around the logo equal to at least half its rendered height on every side. Never stretch, skew, rotate, re-space the letters, move the period, or crop the descender of the "y".

## Alignment note

Because the viewBox includes the "y" descender, the logo can look slightly high when vertically centered in a navbar with `align-items: center`. If it looks off next to nav links, nudge it down 1–2px with `transform: translateY(1px)`.

## Snippets

Header usage in Astro:

```astro
---
import Logo from "../components/Logo.astro";
---
<a href="/" aria-label="oye home" class="logo-link">
  <Logo height={28} />
</a>
```

Favicon tags for the `<head>` (place the icon files in `/public`):

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/oye-icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

Web app manifest icons:

```json
"icons": [
  { "src": "/oye-icon-192.png", "sizes": "192x192", "type": "image/png" },
  { "src": "/oye-icon-512.png", "sizes": "512x512", "type": "image/png" }
]
```

## If live text is ever unavoidable

Only when an SVG truly cannot be used (for example, a plain-text email signature), approximate it with `font-family: 'Manrope', sans-serif; font-weight: 800; letter-spacing: -0.07em;` and the text `oye` followed by a `.` wrapped in a span colored `#16A34A`. Treat this as a fallback, not the logo.
