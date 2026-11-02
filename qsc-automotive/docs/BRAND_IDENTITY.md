# QSC Automotive — Brand & Design System (as implemented)

**Direction:** Quiet Luxury × Precision Engineering × Modern Editorial Design.
The logo (blue Q-wrench symbol, titanium SC letterforms, AUTOMOTIVE wordmark) is used
as supplied — never redrawn. A vector master (SVG/AI/EPS) is still requested; the JPEG
is a temporary production reference displayed on white panels so its background never clashes.

## Color tokens (locked — defined in `src/styles/main.css`)

| Token | Hex | Implemented use |
|---|---|---|
| `--qsc-blue` | #2178BF | Primary CTA, links, eyebrows, focus, stat rules — used sparingly |
| `--blue-hover` | #155D99 | Hover/active on blue interactive elements |
| `--graphite` | #141A20 | Body/headline text, dark buttons |
| `--night-navy` | #101D2A | Hero, dark sections, footer, top bar |
| `--titanium` | #969698 | Breadcrumb dividers, decorative only — never small body text |
| `--slate` | #4B5662 | Secondary text on light surfaces (AA on white/cloud) |
| `--platinum` | #E7EAED | 1px borders, dividers, card outlines |
| `--cloud` | #F7F9FB | Alternating section background |
| `--white` | #FFFFFF | Main canvas |

No gold anywhere (prototype gold rejected). Dark sections use near-white text ≥ #aebcc7
for AA contrast; titanium is never used below 1rem text.

## Typography

- **EN:** Manrope 400/500/600/700/800. Hero `clamp(2.4rem → 4.5rem)`, H1 to 3.3rem,
  body 17px/1.7. Negative tracking −0.02em on display sizes only.
- **AR:** IBM Plex Sans Arabic 400/500/600/700, line-height 1.85, letter-spacing forced
  to 0 on headings and eyebrows (never negative tracking on Arabic).
- `font-display: swap` via Google Fonts; Arabic pages load Arabic family + a reduced
  Manrope subset for Latin numerals/brand names.

## Layout & components

- Container 1320px, fluid gutters `clamp(16→40px)`, 8px spacing rhythm, radius 8/14px.
- Transitions 220ms; `prefers-reduced-motion` honored; focus rings 2px blue, offset 3px.
- Components implemented: top utility bar · sticky header + accessible mobile drawer ·
  editorial hero · page hero · breadcrumbs (RTL-aware separator) · two-workshop choice
  panels · service cards with category tags · typographic 16-brand grid · trust-stats
  strip (dark) · numbered process steps · FAQ accordions (native `<details>`) ·
  split layout with sticky booking panel · workshop cards with pending-state metadata ·
  three-channel CTA group with branch routing · validated booking form with honest
  integration-pending state · placeholder photo frames (labeled, obviously not real
  evidence) · night-navy footer · mobile sticky call/book bar · language gateway · 404.

## RTL

`<html lang="ar" dir="rtl">` + CSS logical properties throughout (`inset-inline-start`,
`margin-inline`, `border-inline-start`…). Arrows in link text flip per language in
templates. Breadcrumb separator flips. Phone numbers are wrapped in `dir="ltr"`.

## Imagery policy

Two photographic worlds (maintenance = diagnostic/mechanical precision; painting =
surface/finish craft). Until client photography arrives, every image slot is a `.ph`
frame with a visible "PHOTO PENDING" label in the page language — placeholders are
never presented as real premises, staff or completed work. Shot list: `ASSET_SHOT_LIST.md`.
