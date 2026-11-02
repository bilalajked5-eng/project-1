# QSC Automotive — Bilingual Multi-Page Website (Phase 1: HTML)

Premium bilingual (AR/EN) static website for QSC Automotive, Riyadh — two specialist
workshops (Maintenance; Painting & Bodywork / Fast Painting), 26 approved services,
16 approved brand hubs, built as real pre-rendered HTML for ordinary hosting, with a
WordPress migration planned for phase 2 (see `docs/WORDPRESS_MIGRATION_PLAN.md`).

## Quick start

```bash
node build.mjs        # generates ./dist (116 HTML documents + sitemap + robots)
node qa-check.mjs     # validates every internal link, hreflang pair, canonical, sitemap
npx serve dist        # or: python3 -m http.server 8000 --directory dist
```

Requires Node 18+. No npm dependencies.

> The site uses root-absolute URLs (`/en/…`, `/assets/…`), so preview it through a
> local web server, not `file://`. Deploy `dist/` to the web root of qscco.sa.

## Project layout

```
build.mjs                     Static site generator (all templates live here)
qa-check.mjs                  Route/link/SEO QA (run before every deploy)
src/
  data/business.json          Approved company facts, trust stats, org contact
  data/workshops.json         The TWO facilities; null = PENDING_CLIENT field
  content/services-*.mjs      26 services, unique bilingual copy (15 maint + 11 paint)
  content/brands.mjs          16 brand hubs, unique bilingual copy
  content/ui.mjs              Shared localized UI strings
  styles/main.css             Design tokens + full component system
  scripts/site-config.js      RUNTIME config (phones, WhatsApp, maps, form endpoint, GA4)
  scripts/main.js             Nav, contact wiring, analytics events
  scripts/booking.js          Booking form (never fakes success)
public/assets/logo/           Supplied logo (vector master still requested from client)
dist/                         Generated deployable output (committed for review)
docs/                         Brand system, SEO maps, QA report, migration plans, shot list
```

## Going live — the 7 values the client must supply

Edit these, rebuild, redeploy:

1. **Two branch addresses + map links** → `src/data/workshops.json` (`address`, `hours`)
   and `src/scripts/site-config.js` (`mapUrl` per workshop).
2. **Branch phone + WhatsApp numbers** → `site-config.js` (`workshops.*.phone/whatsapp`).
3. **Booking endpoint** (serverless/CRM HTTPS URL) → `site-config.js` (`bookingEndpoint`).
   Until set, the form shows an explicit "integration pending" state — it never fakes success.
   Integration contract: `docs/INTEGRATION_AND_SECRETS_SETUP.md`.
4. **Analytics IDs** → `site-config.js` (`ga4MeasurementId` or `gtmContainerId`).
5. **Vector logo** → replace `public/assets/logo/qsc-logo.jpg` (keep filename or update refs).
6. **Photography** → per `docs/ASSET_SHOT_LIST.md`; replace `.ph` placeholder blocks.
7. **Privacy policy legal sign-off** → then remove `noindex` from the privacy template
   in `build.mjs` and add it to the sitemap list.

## Honesty rules baked into the build

- No fabricated addresses, phone routing, prices, turnaround times, ratings or testimonials.
- Trust figures (4,500 m² / 400 technicians / 10,250 clients / 50 daily) are shown
  company-wide only, labeled, never split per branch.
- Fast Painting = the painting facility (one of exactly two sites), never a third address.
- Guides / Projects hubs ship as `noindex` templates until real approved entries exist;
  they are excluded from `sitemap.xml`.
- Independent-specialist disclaimer appears on brand pages, the brands hub and the footer.
