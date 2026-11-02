# QSC Phase 1 — QA Report (build of 2026-11-02)

## Automated checks — `node qa-check.mjs` (PASSED)

- 116 HTML documents built; 109 indexable pages in sitemap (54 EN + 54 AR + gateway).
- **4,704 internal links** resolved against the built file tree — 0 broken.
- **460 asset references** verified on disk — 0 missing.
- Every `/en/` page is `lang="en" dir="ltr"`, every `/ar/` page `lang="ar" dir="rtl"`.
- Self-referencing canonical verified on all 108 localized pages.
- Reciprocal hreflang pair verified on all localized pages; language-pair file exists for each.
- `<title>` present and unique within each language; meta description ≥30 chars on all pages.
- Sitemap contains no noindex page; guides/projects/privacy (noindex until approved) excluded.

## Rendered checks — Playwright/Chromium against a local server (PASSED)

Screenshots at 1440px and 390px: gateway, EN+AR homepages, EN service page
(engine-repair), AR service page (fast-painting), brand page (Mercedes-Benz),
EN booking, AR workshops hub, AR mobile booking.
- Zero JavaScript console/page errors on all tested pages.
- RTL layout correct (nav order, breadcrumbs, panels, arrows, `dir="ltr"` phone numbers).
- Mobile: drawer nav, sticky call/book bar, single-column grids render correctly.
- Booking page: WhatsApp buttons correctly render the honest "pending activation" state;
  submit with endpoint unset re-shows the integration-pending notice (no fake success).

## Accessibility measures implemented (manual code-level review)

Skip link · landmark structure (header/nav/main/footer) · one H1 per page · labeled
form fields with inline error messages + `aria-live` status region · native `<details>`
FAQ · `:focus-visible` rings · `prefers-reduced-motion` · touch targets ≥44px on CTAs ·
contrast: body slate-on-white 7.4:1, dark-section text ≥ 4.6:1, titanium excluded from
small text. **Not yet run:** screen-reader session (NVDA/VoiceOver) and axe-core sweep
on the final hosted URL — do both at staging.

## Honestly not tested / out of scope in this environment

- **Core Web Vitals field data** — cannot exist pre-launch. Architecture favors them
  (no frameworks, ~16KB CSS, 3 small deferred JS files, fonts swapped, placeholder
  frames reserve space → no CLS), but numbers must be measured on real hosting.
- **Live legacy site crawl** (`qscco.sa/qsc6/`) — outbound network was unavailable in the
  build environment; redirect map is seeded but must be completed from a real crawl.
- **Form delivery** — endpoint pending; integration contract documented.
- **Real devices** — tested in Chromium only; verify Safari/iOS at staging.

## Known pending items (by design, not defects)

Branch addresses/phones/WhatsApp/map pins · booking endpoint · analytics IDs ·
vector logo · photography (placeholders labeled) · privacy legal sign-off ·
guides/projects real entries (templates ship noindex).
