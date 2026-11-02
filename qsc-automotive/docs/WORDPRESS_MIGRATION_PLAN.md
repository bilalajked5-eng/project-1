# QSC — Phase 2 WordPress Migration Plan

Goal: move to WordPress **without changing a single public URL** and without content loss.
Phase 1's structured data files are the migration payload — nothing lives only in HTML.

## Content model mapping

| Phase-1 source | WordPress structure | Key fields (ACF or native) |
|---|---|---|
| `services-*.mjs` (26 entries) | CPT `service` | slug (locked), branch (maintenance/painting), category taxonomy, intro, symptoms[], scope[], faqs[], related[] (relationship), metaTitle/metaDesc per language |
| `brands.mjs` (16 entries) | CPT `vehicle_brand` | slug (locked), intro, maintenanceFocus[] / paintingFocus[] (relationships to `service`), faq[], meta fields |
| `workshops.json` (2 entries) | CPT `workshop` | name, role, address, map URL, phone, whatsapp, hours — single source for all branch routing |
| Guides / Projects | CPT `guide`, CPT `project` | templates already define section order; projects require consent flag + real media before publish |
| `business.json` | Options page | trust stats (company-wide only), main phone, email, hours |
| `ui.mjs` | Theme translations (`.po`) or options | all interface strings already keyed |
| `site-config.js` | Options page / env | bookingEndpoint, analytics IDs — secrets stay server-side |

## Multilingual

- Use Polylang or WPML with **directory URLs** `/en/` and `/ar/` (identical slugs both
  languages, as now). Root `/` stays a custom language-gateway template with
  `x-default` hreflang; plugin-generated hreflang must match phase 1's reciprocal pairs.
- Arabic templates are RTL variants of the same theme (phase-1 CSS already uses logical
  properties — port it as the theme stylesheet).

## Templates to port (1:1 from `build.mjs` functions)

gateway · front-page (per language) · pillar archive (×2) · single-service ·
brands archive · single-brand · workshops archive · single-workshop · service-areas ·
page (about/contact/privacy) · booking (form template) · guides/projects archives · 404.

## SEO-safe cutover checklist

1. Freeze phase-1 sitemap; export list of all 109 indexable URLs.
2. Build WP on staging (noindex) with identical permalinks; diff staging vs phase-1 URLs — zero mismatches allowed.
3. Port metadata per page (stored in content files — no scraping needed).
4. Re-implement the redirect map (`SEO_MIGRATION_MAP.csv`) at server level; verify legacy `/qsc6/` 301s survive the move.
5. Verify hreflang, canonicals, schema parity (crawl both and diff head sections).
6. Launch; resubmit sitemap in Search Console; monitor coverage + 404 report for 4 weeks.
7. Keep phase-1 `dist/` archived as rollback.
