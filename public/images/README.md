# Image assets

`src/components/visuals/Figure.tsx` renders composed abstract artwork wherever
no `src` is given, so every page is presentable before photography arrives.
To use a real image, pass `src="/images/<file>"` to that `<Figure>`.

## Slots

| Where | Component | Suggested file | Ratio |
|---|---|---|---|
| Intro — "The Powerhouse…" | `sections/Intro.tsx` | `riyadh-skyline.jpg` | 16:10 |
| About | `sections/About.tsx` | `operations-centre.jpg` | 4:5 |
| Careers | `sections/Careers.tsx` | `team.jpg` | 5:4 |
| Case studies ×3 | `sections/CaseStudies.tsx` | `case-1..3.jpg` | 16:9 |

Also needed:

- `atmaal-logo.svg` — official wordmark (see `src/components/ui/Logo.tsx`)
- `og-atmaal.jpg` — 1200×630 social share card, referenced from `index.html`
- `apple-touch-icon.png` — 180×180

## Art direction

Saudi business environments, modern offices, technology and financial
operations, data, enterprise interiors, the Riyadh skyline. Premium corporate
photography, combined with abstract technology graphics.

**Not** generic stock — no handshakes, no posed boardroom smiles.

## Technical

- Export at 2× the display size, then compress; prefer `.webp` with a `.jpg`
  fallback if the CDN does not negotiate formats.
- `Figure` lazy-loads by default. Pass `priority` for anything above the fold.
- Always pass a descriptive `alt`; it is a required prop.
