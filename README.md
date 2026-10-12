# Projects World — Website

Bilingual (English / Arabic) corporate website for Projects World, a Riyadh
furniture supply, interior design and project furnishing company established
in 2012.

React 18 · TypeScript · Tailwind CSS · Vite · static prerendering

```bash
npm install
npm run dev          # http://localhost:5173 — shows [NEEDS] content markers
npm run build        # typecheck, client build, SSR build, prerender to dist/
npm run preview      # serve dist/ on :4173
npm run audit:site   # a11y/layout audit against the preview server
```

## How it is built

- **Every route is prerendered** to static HTML (`scripts/prerender.mjs`) with
  its own `<html lang/dir>`, title, description, canonical, hreflang pair,
  Open Graph tags and JSON-LD (Organization + FurnitureStore, WebSite,
  BreadcrumbList, Service, FAQPage, CreativeWork). The client hydrates on top.
- **English at `/…`, Arabic at `/ar/…`.** Arabic is a full RTL layout (logical
  properties throughout, mirrored arrows, Noto Naskh Arabic + IBM Plex Sans
  Arabic), not translated text in an LTR frame. The language switch keeps
  you on the equivalent page.
- **Existing URLs are kept verbatim**: `/about/`, `/contact/`,
  `/our-projects/`, `/our-process/`, the five service slugs,
  `/projects/ecza/`, `/projects/private-palace-2/`,
  `/projects/private-residential-project-5/`, `/brands/{slug}/`,
  `/privacy-policy/`, `/terms-conditions/`.
- **Redirects** (`src/routes.ts`) are written as 301s to `dist/_redirects`
  (Netlify / Cloudflare Pages) and `dist/.htaccess` (Apache), e.g.
  `/gallery/` and `/en/Projects` → `/our-projects/`.
- `dist/sitemap.xml` (with `xhtml:link` hreflang alternates) and
  `dist/robots.txt` are generated on build.

### Where things live

| What | File |
|---|---|
| Company facts (NAP, hours, phones, WhatsApp) | `src/content/company.ts` |
| Services and sector pages | `src/content/services.ts` |
| Projects and case studies | `src/content/projects.ts` |
| Brand directory | `src/content/brands.ts` |
| Site-wide image slots | `src/content/media.ts` |
| Interface and page copy (EN + AR) | `src/i18n/ui.ts` |
| Design tokens | `tailwind.config.ts`, `src/styles/globals.css` |

### Design and images

The layout follows the structure of the agreed reference (fsakcontracting.com):
contact top bar, sticky header with a quote button, photo hero with a quick
quote form, overlapping stats card, brand slider, icon service cards, a dark
sectors band, process cards, project tiles, a dark "why choose" band, FAQ,
a CTA banner and a four-column footer with a floating WhatsApp button.
Palette: charcoal + gold (`tailwind.config.ts`); type: Archivo + Inter
(Cairo + IBM Plex Sans Arabic in Arabic).

General imagery (hero, services, section photos) uses licensed Unsplash
photos via `src/content/stock.ts`. Project case studies deliberately do
**not** use stock photos; they show an art-directed illustration until real
project photos are supplied. If any photo fails to load, the illustration
renders in its place, so a page never shows a broken image. To use your
own photo anywhere, set `src`, `width`, `height` on that slot.

### Forms and tracking

- Set `VITE_FORM_ENDPOINT` (see `.env.example`) to any JSON form backend or
  CRM webhook. Without it, the form opens a pre-filled email to
  info@projects-world.com, so no inquiry is lost.
- Spam protection: hidden honeypot field + minimum time-to-submit.
- Set `VITE_GTM_ID` to load Google Tag Manager. Events pushed to `dataLayer`:
  `generate_lead`, `click_to_call`, `whatsapp_click`, `email_click`,
  `cta_click`.

## Before launch: content the team must supply or confirm

Development builds show these as dashed **[NEEDS]** boxes on the relevant
pages; production builds simply omit the missing fields.

**Assets**
1. Original Projects World logo files (dark and light) → `src/components/ui/Logo.tsx`. The current name plate is a neutral stand-in, not a redesign. Also `public/favicon.svg` and `public/images/projects-world-logo.png`.
2. Social share image `public/images/og-projects-world.jpg` (1200×630).
3. Official brand logos for the directory (`logo` field in `brands.ts`).
4. Photography for every project, the hero, About (team/office) and service pages.

**Facts to confirm**
5. WhatsApp is active on +966 50 082 8018.
6. Arabic spelling of the founder's name (شادي صلاحية) and of the street name (شارع وادي الأرطاوي).
7. Brand origins and specialities in `brands.ts` (drawn from general knowledge of each maker), the slugs for brands without a known existing URL, and whether the current site uses other brand slugs. The current About page suggests a larger brand count than the 16 listed.
8. That the Portuguese makers (CM Cadeiras, Domkapa, Laskasas) are current partners, as the Furniture Design & Supply copy mentions Portuguese upholstery and seating.
9. The current Arabic URL structure, if any, so old Arabic URLs can be redirected to `/ar/…`.
10. Social profile URLs (`company.social`).

**Content gaps**
11. Almousa Offices: location, year, scope, design direction, photos, client approval.
12. Nesma Infrastructure & Technology: location, year, scope, photos; whether this page should cover the Nesma HQ project.
13. ECZA: brands or furniture lines used, if publishable.
14. Private Residence: city.
15. 3D visualisation page: selected renders, labelled as visualisations.
16. A named hospitality project and a named turnkey project.
17. Styling & Furnishing: the exact scope offered (accessories, rugs, art, soft furnishings).
18. The founder's message in full and an approved portrait.
19. Privacy Policy and Terms text, migrated verbatim from the current site (EN + AR).
20. Arabic names in the client roster (e.g. Saudi Commission for Health headquarters, Al Taawun).
