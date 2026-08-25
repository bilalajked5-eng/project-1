# Atmaal — Website

Premium enterprise website for Atmaal, a Saudi Business Process Outsourcing,
automation, financial operations and business solutions company.

React 18 · TypeScript · Tailwind CSS · Vite

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run typecheck
```

---

## Before this goes live — five handoff points

Everything below is isolated to one place on purpose. None of it requires
touching component code.

### 1. Logo artwork — `public/images/`

The wordmark files shipped here are a **redraw** of the supplied asset —
correct in colour and proportion, but not the original outlines. Replace both
files with the master artwork before launch:

| File | Used on |
|---|---|
| `atmaal-logo.svg` | light grounds (header, light sections) |
| `atmaal-logo-light.svg` | dark grounds (mobile menu, footer) |

No code change is needed — `src/components/ui/Logo.tsx` renders whatever is at
those paths, and every usage goes through it. `public/favicon.svg` is also a
redraw of the wordmark's "a".

### 2. Brand colours — `src/styles/globals.css` *(applied)*

The official palette is in place:

| Role | Value | Token |
|---|---|---|
| Primary | `#006B5B` | `--brand-500` |
| Secondary | `#92C640` | `--lime-500` |

Both live in the `BRAND TOKENS` block as RGB channel triplets, with a full
50–900 ramp derived from each. Nothing else hard-codes a brand colour, so any
future adjustment is a single edit. Convert a hex to channels:
`#006B5B` → `0 107 91`.

**One constraint worth knowing:** white text on `#92C640` measures 2.7:1 and
fails WCAG AA. The secondary therefore never sits behind white type. It carries
dark type instead (the CTA buttons on dark sections use `bg-lime-500` with
`text-ink-950`), and otherwise drives gradients, accents, data points and
glows. The hero headline gradient ends at `lime-700` rather than `lime-500` for
the same reason — at display size the tail still has to clear 3:1.

### 3. Photography — `public/images/`

`src/components/visuals/Figure.tsx` renders composed abstract artwork wherever
no `src` is supplied, so no page shows a grey box. To use real photography,
pass `src="/images/<file>.jpg"` to the `<Figure>` in question.

See `public/images/README.md` for the slot list and art direction.

### 4. Contact form endpoint — `src/components/sections/ContactForm.tsx`

`submit()` validates locally and resolves after a short delay. Replace the
marked block with a real `POST` and add a failure branch. Validation, labelling,
focus management and the live region already behave correctly.

### 5. Case studies — `src/i18n/en.ts` / `ar.ts` → `caseStudies.items`

**These are structural placeholders.** No client names, percentages or outcomes
have been invented: each `result` field carries a "pending client approval"
label and the section states this openly on the page
(`caseStudies.disclaimer`). Replace `result` with verified outcomes and remove
the disclaimer once approved. No layout changes are needed.

---

## Content provenance

Business facts are reproduced from Atmaal's existing positioning, not invented:

| Fact | Status |
|---|---|
| 8K+ trained experts · 22M calls yearly · 500M+ transactions annually | Published Atmaal metrics |
| Fourth metric tile | States the three-pillar capability model — **not** an invented statistic |
| AT / MAAL / AAMAAL brand story | Published (Automation · Maal · Aamaal) |
| Three-stage process (Alignment / Streamlining / Expansion) | Published |
| Vision and mission | Published |
| `info@atmaal.sa`, Riyadh, `careers.atmaal.sa` | Published contact details |
| Industries | Limited to sectors aligned with stated operations |
| Case-study results | **Placeholders — see handoff point 5** |

No certifications, partnerships, client names or performance percentages are
claimed anywhere in the site.

### Interior pages don't restate their own heading

Each interior page sets its title in `PageHero`, then renders shared sections
with `hideHeading` so the heading is not repeated immediately below it. When
`hideHeading` is set, the section's item headings promote from `h3` to `h2` so
the document outline stays contiguous. The audit checks both.

---

## Architecture

```
src/
  styles/globals.css      Brand tokens, base layer, motion, RTL type correction
  i18n/                   en.ts · ar.ts (typed against Content) · provider
  lib/                    cn · hooks (in-view, count-up, parallax, focus trap) · seo
  components/
    ui/                   Button · Card · Section · Counter · Icons · Logo · Reveal
    layout/               Header · Footer · MobileMenu · LanguageSwitcher · PageHero
    visuals/              HeroVisual · NetworkVisual · Figure
    sections/             The 14 composable page sections
  pages/                  Home + 6 interior pages + 404
```

Sections are content-driven and reused across pages, so a copy change in
`src/i18n/` updates everywhere it appears.

### Bilingual / RTL

`LanguageProvider` sets `lang` and `dir` on `<html>` and persists the choice.
Layout mirrors through CSS logical properties (`start`/`end`, `ps`/`pe`) rather
than duplicated rules. Arabic is an authored edition, not a literal
translation, and gets `IBM Plex Sans Arabic` plus a typography correction in
`globals.css` — Tailwind's display utilities carry negative tracking and very
tight leading tuned for Latin, which crowds Arabic glyphs.

The logo lockup is pinned `dir="ltr"` so a fixed brand asset does not mirror.

### Motion

Reveal-on-scroll uses a one-shot `IntersectionObserver` that disconnects after
firing. All motion collapses under `prefers-reduced-motion` — counters jump
straight to their final value rather than freezing at zero.

---

## Verification performed

Checked against the production build in headless Chromium across all 8 routes:

- **Contrast** — every text node measured against its resolved background,
  compositing alpha and evaluating every stop of a gradient background against
  the worst case; passes WCAG AA (4.5:1 body, 3:1 large).
- **Structure** — exactly one `<h1>` per page, no heading-level jumps, no page
  restating its own `<h1>` in a section below, no `<img>` without `alt` or that
  fails to load, no interactive element without an accessible name.
- **Responsive** — no horizontal overflow at 1440, 390 or 375px.
- **Keyboard** — skip link is the first tab stop; mobile menu opens, traps
  focus and closes on `Escape`.
- **Reduced motion** — no reveal element left hidden.
- **i18n** — the language switch flips `dir` and `lang` correctly.

Bundle: ~85 KB gzipped JS, ~9.4 KB gzipped CSS.

> Fonts load from Google Fonts. That host was blocked in the build
> environment, so local screenshots fell back to system sans — the typeface
> will render correctly in any normal deployment.
