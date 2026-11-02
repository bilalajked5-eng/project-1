#!/usr/bin/env node
/* =============================================================================
   QSC AUTOMOTIVE — static site builder (no dependencies, Node 18+)
   Generates real, independent HTML documents for every route in both languages.
   Usage:  node build.mjs          → writes ./dist
   ============================================================================= */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import maintServices from "./src/content/services-maintenance.mjs";
import paintServices from "./src/content/services-painting.mjs";
import brands from "./src/content/brands.mjs";
import UI from "./src/content/ui.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");
const business = JSON.parse(fs.readFileSync(path.join(__dirname, "src/data/business.json"), "utf8"));
const workshops = JSON.parse(fs.readFileSync(path.join(__dirname, "src/data/workshops.json"), "utf8"));
const SITE = business.domain;
const LANGS = ["en", "ar"];
const services = [...maintServices.map(s => ({ ...s, branch: "maintenance" })), ...paintServices.map(s => ({ ...s, branch: "painting" }))];

/* ---------- helpers ---------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const t = (obj, lang) => (obj && typeof obj === "object" && (lang in obj)) ? obj[lang] : obj;
const pillarSlug = (branch) => branch === "painting" ? "painting-bodywork" : "maintenance";
const serviceUrl = (lang, s) => `/${lang}/${pillarSlug(s.branch)}/${s.slug}/`;
const findService = (slug) => services.find(s => s.slug === slug);
let written = [];
function writePage(urlPath, html) {
  const file = path.join(DIST, urlPath.replace(/^\//, ""), urlPath.endsWith(".html") ? "" : "index.html");
  const target = urlPath.endsWith(".html") ? path.join(DIST, urlPath.replace(/^\//, "")) : file;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  written.push(urlPath);
}
const otherLang = (lang) => (lang === "en" ? "ar" : "en");
const altOf = (lang, pathname) => pathname.replace(`/${lang}/`, `/${otherLang(lang)}/`);

/* ---------- layout ---------- */
function head(lang, { title, desc, pathname, noindex = false, jsonld = [] }) {
  const alt = altOf(lang, pathname);
  const fonts = lang === "ar"
    ? "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap"
    : "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap";
  return `<!doctype html>
<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex,follow">' : ""}
<link rel="canonical" href="${SITE}${pathname}">
<link rel="alternate" hreflang="${lang === "en" ? "en" : "ar"}" href="${SITE}${pathname}">
<link rel="alternate" hreflang="${lang === "en" ? "ar" : "en"}" href="${SITE}${alt}">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE}${pathname}">
<meta property="og:image" content="${SITE}/assets/logo/qsc-logo.jpg">
<meta property="og:locale" content="${lang === "ar" ? "ar_SA" : "en_US"}">
<link rel="icon" href="/assets/logo/qsc-logo.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<link rel="stylesheet" href="/assets/css/main.css">
${jsonld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
</head>`;
}

function header(lang, current) {
  const N = UI.nav, C = UI.common;
  const items = [
    [`/${lang}/`, N.home], [`/${lang}/maintenance/`, N.maintenance],
    [`/${lang}/painting-bodywork/`, N.painting], [`/${lang}/car-brands/`, N.brands],
    [`/${lang}/workshops/`, N.workshops], [`/${lang}/about/`, N.about], [`/${lang}/contact/`, N.contact]
  ];
  return `
<a class="skip-link" href="#main">${t(C.skipLink, lang)}</a>
<div class="topbar"><div class="container">
  <span>${lang === "ar" ? "ورشتان متخصصتان في الرياض — صيانة · دهان وسمكرة" : "Two specialist workshops in Riyadh — Maintenance · Painting & Bodywork"}</span>
  <a href="tel:${business.mainPhone}" data-contact="phone" data-workshop="org" dir="ltr">${esc(business.mainPhoneDisplay)}</a>
</div></div>
<header class="site-header"><div class="container">
  <a class="brand" href="/${lang}/" aria-label="QSC Automotive — ${lang === "ar" ? "الرئيسية" : "home"}">
    <img src="/assets/logo/qsc-logo.jpg" alt="QSC Automotive" width="128" height="80">
  </a>
  <button class="nav-toggle" aria-expanded="false" aria-controls="nav-main" aria-label="${lang === "ar" ? "القائمة" : "Menu"}"><span></span></button>
  <nav class="nav-main" id="nav-main" aria-label="${lang === "ar" ? "التنقل الرئيسي" : "Primary"}">
    ${items.map(([href, label]) => `<a href="${href}"${current === href ? ' aria-current="page"' : ""}>${t(label, lang)}</a>`).join("\n    ")}
    <a class="lang-switch" href="${altOf(lang, current)}" lang="${otherLang(lang)}" aria-label="${t(C.langSwitchLabel, lang)}">${t(C.langSwitch, lang)}</a>
    <a class="btn btn--primary nav-cta" href="/${lang}/book-appointment/">${t(UI.nav.book, lang)}</a>
  </nav>
</div></header>`;
}

function footer(lang) {
  const N = UI.nav, C = UI.common;
  const link = (href, label) => `<a href="${href}">${t(label, lang)}</a>`;
  return `
<footer class="site-footer"><div class="container">
  <div class="footer-grid">
    <div class="footer-brand">
      <img src="/assets/logo/qsc-logo.jpg" alt="QSC Automotive" width="128" height="80">
      <p>${t(C.footerAbout, lang)}</p>
      <p dir="ltr"><a href="tel:${business.mainPhone}" data-contact="phone" data-workshop="org">${esc(business.mainPhoneDisplay)}</a></p>
      <p><a href="mailto:${business.email}">${business.email}</a></p>
    </div>
    <div><h3>${t(C.footerExplore, lang)}</h3>
      ${link(`/${lang}/maintenance/`, N.maintenance)}
      ${link(`/${lang}/painting-bodywork/`, N.painting)}
      ${link(`/${lang}/car-brands/`, N.brands)}
      ${link(`/${lang}/workshops/`, N.workshops)}
      ${link(`/${lang}/service-areas/`, N.serviceAreas)}
    </div>
    <div><h3>${t(C.footerSupport, lang)}</h3>
      ${link(`/${lang}/book-appointment/`, N.book)}
      ${link(`/${lang}/contact/`, N.contact)}
      ${link(`/${lang}/workshops/maintenance/`, workshops.maintenance.shortName)}
      ${link(`/${lang}/workshops/painting-bodywork/`, workshops.painting.shortName)}
    </div>
    <div><h3>${t(C.footerLegal, lang)}</h3>
      ${link(`/${lang}/about/`, N.about)}
      ${link(`/${lang}/guides/`, N.guides)}
      ${link(`/${lang}/projects/`, N.projects)}
      ${link(`/${lang}/privacy-policy/`, N.privacy)}
    </div>
  </div>
  <p class="stats-note">${t(C.independentNote, lang)}</p>
  <div class="footer-bottom">
    <span>© ${new Date().getFullYear()} QSC Automotive. ${t(C.rights, lang)}</span>
    <span>${lang === "ar" ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}</span>
  </div>
</div></footer>
<div class="sticky-cta" aria-hidden="false">
  <a href="tel:${business.mainPhone}" data-contact="phone" data-workshop="org">${t(C.callUs, lang)} QSC</a>
  <a class="primary" href="/${lang}/book-appointment/">${t(N.book, lang)}</a>
</div>
<script src="/assets/js/site-config.js"></script>
<script src="/assets/js/main.js" defer></script>`;
}

function page(lang, opts, bodyHtml, { pageType = "page", extraScripts = "" } = {}) {
  return `${head(lang, opts)}
<body data-page-type="${pageType}">
${header(lang, opts.navCurrent || opts.pathname)}
<main id="main">
${bodyHtml}
</main>
${footer(lang)}
${extraScripts}
</body>
</html>`;
}

function breadcrumbs(lang, trail) {
  // trail: [[url|null, label], ...] last item current
  const items = trail.map(([href, label], i) =>
    href && i < trail.length - 1
      ? `<li><a href="${href}">${esc(label)}</a></li>`
      : `<li aria-current="page">${esc(label)}</li>`).join("");
  return `<nav class="breadcrumbs" aria-label="${lang === "ar" ? "مسار التنقل" : "Breadcrumb"}"><div class="container"><ol>${items}</ol></div></nav>`;
}
function breadcrumbLd(trail) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: trail.map(([href, label], i) => ({
      "@type": "ListItem", position: i + 1, name: label,
      ...(href ? { item: SITE + href } : {})
    }))
  };
}

const ph = (label, cls = "") => `<div class="ph ${cls}" role="img" aria-label="${esc(label)}"><span>${esc(label)}</span></div>`;

function faqBlock(lang, faqs) {
  if (!faqs || !faqs.length) return "";
  return `<section class="section section--tight"><div class="container">
  <h2>${t(UI.common.faqTitle, lang)}</h2>
  <div class="faq prose">${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>
</div></section>`;
}
const faqLd = (faqs) => ({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))
});

function serviceCard(lang, s) {
  const cat = UI.categories[s.category];
  return `<article class="card">
  <span class="card-tag">${t(cat, lang)}</span>
  <h3><a href="${serviceUrl(lang, s)}" data-track-service="${s.slug}" style="color:inherit">${esc(t(s.name, lang))}</a></h3>
  <p>${esc(t(s.intro, lang).split(/(?<=[.؟!።])\s/)[0])}</p>
  <a class="card-link" href="${serviceUrl(lang, s)}" data-track-service="${s.slug}">${t(UI.common.learnMore, lang)} ${lang === "ar" ? "←" : "→"}</a>
</article>`;
}

function workshopSummaryCard(lang, wid) {
  const w = workshops[wid];
  const C = UI.common;
  const url = `/${lang}/workshops/${w.slug}/`;
  const pending = String(t(w.address, lang)).startsWith("PENDING");
  return `<article class="workshop-card">
  ${ph(lang === "ar" ? `الصورة قيد التجهيز — ${t(w.shortName, lang)}` : `PHOTO PENDING — QSC ${t(w.shortName, "en").toUpperCase()} WORKSHOP`)}
  <div class="workshop-body">
    <h3>${esc(t(w.name, lang))}</h3>
    <p>${esc(t(w.role, lang))}</p>
    <ul class="workshop-meta">
      <li><span class="k">${lang === "ar" ? "العنوان" : "Address"}</span><span>${pending ? t(C.addressPending, lang) : esc(t(w.address, lang))}</span></li>
      <li><span class="k">${lang === "ar" ? "الهاتف" : "Phone"}</span><span>${w.phone ? esc(w.phone) : `${t(C.phonePendingBranch, lang)} <a href="tel:${business.mainPhone}" dir="ltr" data-contact="phone" data-workshop="org">${esc(business.mainPhoneDisplay)}</a>`}</span></li>
      <li><span class="k">${lang === "ar" ? "الدوام" : "Hours"}</span><span>${w.hours ? esc(w.hours) : t(C.hoursPending, lang)}</span></li>
    </ul>
    <div class="actions">
      <a class="btn btn--dark btn--sm" href="${url}" data-track-workshop="${wid}">${t(C.viewWorkshop, lang)}</a>
      <a class="btn btn--ghost btn--sm" data-contact="map" data-workshop="${wid}" href="#">${t(C.getDirections, lang)}</a>
    </div>
  </div>
</article>`;
}

function ctaGroup(lang, wid, { service = "", brand = "" } = {}) {
  const C = UI.common;
  const label = wid === "painting" ? t(C.paintCta, lang) : t(C.maintCta, lang);
  const q = new URLSearchParams({ workshop: wid, ...(service ? { service } : {}), ...(brand ? { brand } : {}) });
  return `<div class="actions">
  <a class="btn btn--primary" href="/${lang}/book-appointment/?${q.toString()}">${label}</a>
  <a class="btn btn--dark" data-contact="phone" data-workshop="${wid}" data-service="${esc(service)}" href="tel:${business.mainPhone}">${t(C.callUs, lang)} — ${t(workshops[wid].shortName, lang)}</a>
  <a class="btn btn--ghost" data-contact="whatsapp" data-workshop="${wid}" data-service="${esc(service)}" data-brand="${esc(brand)}" href="#">${t(C.whatsapp, lang)}</a>
</div>`;
}

function statsStrip(lang) {
  return `<section class="section section--dark"><div class="container">
  <span class="eyebrow">${lang === "ar" ? "لماذا QSC" : "WHY QSC"}</span>
  <h2>${t(UI.common.trustHeading, lang)}</h2>
  <div class="stats">
    ${business.trustStats.map(s => `<div class="stat"><strong>${esc(lang === "ar" ? s.valueAr : s.value)}</strong><span>${esc(t(s.unit, lang))}</span></div>`).join("")}
  </div>
  <p class="stats-note">${esc(t(business.trustStatsNote, lang))}</p>
</div></section>`;
}

function processSection(lang, dark = false) {
  const C = UI.common;
  return `<section class="section ${dark ? "section--dark" : "section--cloud"}"><div class="container">
  <span class="eyebrow">${lang === "ar" ? "رحلتك معنا" : "YOUR JOURNEY"}</span>
  <h2>${t(C.processHeading, lang)}</h2>
  <div class="steps">
    ${t(C.process, lang).map(([h, p]) => `<div class="step"><div><h3>${esc(h)}</h3><p>${esc(p)}</p></div></div>`).join("")}
  </div>
</div></section>`;
}

/* =============================================================================
   PAGES
   ============================================================================= */

/* ---------- Language gateway / ---------- */
function gatewayPage() {
  const jsonld = [{
    "@context": "https://schema.org", "@type": "Organization",
    name: "QSC Automotive", url: SITE, logo: SITE + "/assets/logo/qsc-logo.jpg",
    telephone: business.mainPhone, email: business.email,
    address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" }
  }];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>QSC Automotive — اختر اللغة | Choose Language</title>
<meta name="description" content="QSC Automotive, Riyadh — specialist maintenance and painting & bodywork for luxury vehicles. اختر اللغة للمتابعة. Choose your language to continue.">
<link rel="canonical" href="${SITE}/">
<link rel="alternate" hreflang="en" href="${SITE}/en/">
<link rel="alternate" hreflang="ar" href="${SITE}/ar/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta property="og:title" content="QSC Automotive">
<meta property="og:description" content="Precision care for exceptional cars — Riyadh.">
<meta property="og:image" content="${SITE}/assets/logo/qsc-logo.jpg">
<link rel="icon" href="/assets/logo/qsc-logo.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600&family=Manrope:wght@400;600;700;800&display=swap">
<link rel="stylesheet" href="/assets/css/main.css">
${jsonld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("")}
</head>
<body>
<main class="gateway">
  <div class="gateway-inner">
    <div class="gateway-logo"><img src="/assets/logo/qsc-logo.jpg" alt="QSC Automotive" width="256" height="160"></div>
    <h1><span lang="ar" dir="rtl">عناية دقيقة بسيارتك الاستثنائية</span><br>Precision Care for Exceptional Cars</h1>
    <p class="sub"><span lang="ar" dir="rtl">ورشتان متخصصتان في الرياض — الصيانة · الدهان والسمكرة</span><br>Two specialist workshops in Riyadh — Maintenance · Painting &amp; Bodywork</p>
    <nav class="gateway-choices" aria-label="Language selection — اختيار اللغة">
      <a class="gateway-choice" href="/ar/" lang="ar" dir="rtl"><strong>العربية</strong><span>تابع إلى الموقع العربي</span></a>
      <a class="gateway-choice" href="/en/" lang="en"><strong>English</strong><span>Continue to the English site</span></a>
    </nav>
  </div>
  <p class="gateway-foot">QSC Automotive · Riyadh, Saudi Arabia · <a href="tel:${business.mainPhone}" style="color:inherit" dir="ltr">${esc(business.mainPhoneDisplay)}</a></p>
</main>
</body>
</html>`;
}

/* ---------- Homepage ---------- */
function homePage(lang) {
  const ar = lang === "ar";
  const C = UI.common;
  const featured = ["engine-repair", "diagnostics", "suspension", "car-painting", "dent-repair", "paint-matching"].map(findService);
  const title = ar
    ? "QSC Automotive — صيانة ودهان السيارات الفاخرة في الرياض"
    : "QSC Automotive — Luxury Car Maintenance, Painting & Bodywork in Riyadh";
  const desc = ar
    ? "ورشتان متخصصتان في الرياض للسيارات الفاخرة وعالية الأداء: صيانة ميكانيكية وكهربائية متخصصة، ودهان وسمكرة احترافيان. احجز عبر الهاتف أو واتساب أو النموذج."
    : "Two specialist workshops in Riyadh for luxury and performance vehicles: dedicated mechanical & electrical maintenance, and professional painting & bodywork. Book by phone, WhatsApp or form.";
  const jsonld = [{
    "@context": "https://schema.org", "@type": "Organization",
    name: "QSC Automotive", url: SITE + `/${lang}/`, logo: SITE + "/assets/logo/qsc-logo.jpg",
    telephone: business.mainPhone, email: business.email,
    address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
    sameAs: []
  }];
  const body = `
<section class="hero"><div class="container">
  <span class="eyebrow">QSC AUTOMOTIVE · ${ar ? "الرياض" : "RIYADH"}</span>
  <h1>${ar ? "عناية دقيقة بسيارتك الاستثنائية." : "Precision Care for Exceptional Cars."}</h1>
  <p>${ar
    ? "صيانة متخصصة ودهان وسمكرة احترافيان للسيارات الفاخرة وعالية الأداء في الرياض — في ورشتين متخصصتين تحت هوية QSC واحدة."
    : "Specialized maintenance and professional painting & bodywork for luxury and performance vehicles in Riyadh — across two dedicated workshops under one QSC standard."}</p>
  <div class="actions">
    <a class="btn btn--primary" href="/${lang}/book-appointment/">${t(UI.nav.book, lang)}</a>
    <a class="btn btn--ghost-light" href="/${lang}/workshops/">${ar ? "استكشف الورشتين" : "Explore Our Workshops"}</a>
  </div>
</div></section>

<section class="section"><div class="container">
  <span class="eyebrow">${ar ? "تجربتان متخصصتان" : "TWO SPECIALIZED EXPERIENCES"}</span>
  <h2>${ar ? "اختر الورشة المناسبة لسيارتك" : "Choose the right workshop for your car"}</h2>
  <p class="lead">${ar
    ? "لكل حاجة منشأتها المتخصصة وعنوانها المستقل: الصيانة الميكانيكية والفنية في ورشة الصيانة، والدهان والسمكرة في ورشة الدهان السريع."
    : "Each need has its own dedicated facility at its own location: mechanical and technical care at the maintenance workshop, and paint & body at the Fast Painting facility."}</p>
  <div class="grid grid--2">
    <article class="choice">
      <div class="choice-media">${ph(ar ? "الصورة قيد التجهيز — ورشة الصيانة" : "PHOTO PENDING — QSC MAINTENANCE HERO")}</div>
      <div class="choice-body">
        <span class="eyebrow">01 — ${ar ? "الصيانة" : "MAINTENANCE"}</span>
        <h3>${ar ? "الصيانة الميكانيكية والعناية الفنية" : "Maintenance & Technical Care"}</h3>
        <p class="lead" style="font-size:1rem">${ar
          ? "المحركات وناقل الحركة والكهرباء والفحص الحاسوبي والتعليق والتكييف والصيانة الدورية — 15 خدمة متخصصة."
          : "Engines, transmissions, electrical systems, diagnostics, suspension, AC and scheduled care — 15 specialist services."}</p>
        <div class="actions"><a class="btn btn--dark" href="/${lang}/maintenance/" data-track-workshop="maintenance">${ar ? "استكشف الصيانة" : "Explore Maintenance"}</a></div>
      </div>
    </article>
    <article class="choice">
      <div class="choice-media">${ph(ar ? "الصورة قيد التجهيز — ورشة الدهان" : "PHOTO PENDING — QSC PAINTING HERO")}</div>
      <div class="choice-body">
        <span class="eyebrow">02 — ${ar ? "الدهان والسمكرة" : "PAINTING & BODYWORK"}</span>
        <h3>${ar ? "الدهان والسمكرة / الدهان السريع" : "Painting & Bodywork / Fast Painting"}</h3>
        <p class="lead" style="font-size:1rem">${ar
          ? "الدهان الاحترافي وإصلاح الصدمات والخدوش ومطابقة الألوان وقياس الشاصي — 11 خدمة في منشأة الدهان المستقلة."
          : "Professional painting, dent and scratch repair, color matching and chassis work — 11 services at the dedicated painting facility."}</p>
        <div class="actions"><a class="btn btn--dark" href="/${lang}/painting-bodywork/" data-track-workshop="painting">${ar ? "استكشف الدهان" : "Explore Painting"}</a></div>
      </div>
    </article>
  </div>
</div></section>

<section class="section section--cloud"><div class="container">
  <span class="eyebrow">${ar ? "خدمات مختارة" : "CURATED SERVICES"}</span>
  <h2>${ar ? "أكثر ما يطلبه عملاؤنا" : "What owners come to us for"}</h2>
  <div class="grid grid--3">${featured.map(s => serviceCard(lang, s)).join("")}</div>
  <div class="actions">
    <a class="btn btn--dark" href="/${lang}/maintenance/">${ar ? "جميع خدمات الصيانة (15)" : "All maintenance services (15)"}</a>
    <a class="btn btn--ghost" href="/${lang}/painting-bodywork/">${ar ? "جميع خدمات الدهان (11)" : "All painting services (11)"}</a>
  </div>
</div></section>

<section class="section"><div class="container">
  <span class="eyebrow">${ar ? "ماركات السيارات" : "VEHICLE BRANDS"}</span>
  <h2>${ar ? "عناية متخصصة بعلامات السيارات الفاخرة" : "Specialist care across luxury marques"}</h2>
  <p class="lead">${t(C.independentNote, lang)}</p>
  <div class="brand-grid">
    ${brands.map(b => `<a class="brand-chip" href="/${lang}/car-brands/${b.slug}/">${esc(t(b.name, lang))}</a>`).join("")}
  </div>
</div></section>

${statsStrip(lang)}
${processSection(lang)}

<section class="section"><div class="container">
  <span class="eyebrow">${ar ? "موقعانا" : "OUR LOCATIONS"}</span>
  <h2>${ar ? "ورشتان، عنوانان، معيار واحد" : "Two workshops, two addresses, one standard"}</h2>
  <div class="grid grid--2">
    ${workshopSummaryCard(lang, "maintenance")}
    ${workshopSummaryCard(lang, "painting")}
  </div>
</div></section>

<section class="section section--dark"><div class="container center">
  <h2>${ar ? "جاهز لمناقشة حالة سيارتك؟" : "Ready to discuss your vehicle?"}</h2>
  <p class="lead" style="margin-inline:auto">${ar
    ? "اتصل بنا أو أرسل طلب موعد — يرد عليك فريق الورشة المناسبة."
    : "Call us or send an appointment request — the right workshop's team gets back to you."}</p>
  <div class="actions" style="justify-content:center">
    <a class="btn btn--primary" href="/${lang}/book-appointment/">${t(UI.nav.book, lang)}</a>
    <a class="btn btn--ghost-light" data-contact="phone" data-workshop="org" href="tel:${business.mainPhone}">${t(C.callUs, lang)} <span dir="ltr">${esc(business.mainPhoneDisplay)}</span></a>
  </div>
</div></section>`;
  return page(lang, { title, desc, pathname: `/${lang}/`, navCurrent: `/${lang}/`, jsonld }, body, { pageType: "home" });
}

/* ---------- Pillar pages ---------- */
function pillarPage(lang, branch) {
  const ar = lang === "ar";
  const isPaint = branch === "painting";
  const slug = pillarSlug(branch);
  const list = services.filter(s => s.branch === branch);
  const w = workshops[branch];
  const title = isPaint
    ? (ar ? "الدهان والسمكرة للسيارات الفاخرة في الرياض | QSC Automotive" : "Luxury Car Painting & Bodywork in Riyadh | QSC Automotive")
    : (ar ? "صيانة السيارات الفاخرة في الرياض | QSC Automotive" : "Luxury Car Maintenance in Riyadh | QSC Automotive");
  const desc = isPaint
    ? (ar ? "منشأة QSC المتخصصة للدهان والسمكرة في الرياض: دهان احترافي وإصلاح الصدمات والخدوش ومطابقة الألوان وقياس الشاصي — 11 خدمة معتمدة وتقييم بالصور." : "QSC's dedicated painting & bodywork facility in Riyadh: professional painting, dent & scratch repair, paint matching and chassis work — 11 services with photo assessment.")
    : (ar ? "ورشة QSC للصيانة في الرياض: ميكانيكا وكهرباء وفحص حاسوبي وتعليق وتكييف وصيانة دورية للسيارات الفاخرة — 15 خدمة متخصصة بمسار حجز واضح." : "QSC's maintenance workshop in Riyadh: mechanical, electrical, diagnostics, suspension, AC and scheduled care for luxury vehicles — 15 specialist services with a clear booking path.");
  const trail = [[`/${lang}/`, t(UI.common.breadcrumbHome, lang)], [null, t(isPaint ? UI.nav.painting : UI.nav.maintenance, lang)]];
  const cats = isPaint ? ["painting", "bodywork", "restoration"] : ["mechanical", "electrical", "chassis", "routine", "logistics"];
  const catSections = cats.map(cat => {
    const items = list.filter(s => s.category === cat);
    if (!items.length) return "";
    return `<h3 style="margin-top:44px">${t(UI.categories[cat], lang)}</h3>
<div class="grid grid--3" style="margin-top:18px">${items.map(s => serviceCard(lang, s)).join("")}</div>`;
  }).join("");
  const body = `
<section class="page-hero"><div class="container">
  <span class="eyebrow">${isPaint ? (ar ? "ورشة الدهان والسمكرة — الدهان السريع" : "PAINTING & BODYWORK — FAST PAINTING FACILITY") : (ar ? "ورشة الصيانة" : "MAINTENANCE WORKSHOP")}</span>
  <h1>${isPaint ? (ar ? "الدهان والسمكرة بمعيار السيارة الفاخرة" : "Painting & bodywork to a luxury standard") : (ar ? "صيانة هندسية للسيارات الفاخرة" : "Engineering-led care for luxury vehicles")}</h1>
  <p>${isPaint
    ? (ar ? "من خدش موقف إلى إصلاح حادث كامل: تُقيَّم كل حالة — غالبًا من الصور أولًا — ثم تُنفَّذ في منشأة QSC المتخصصة للدهان." : "From a parking scratch to full collision repair: every case is assessed — usually from photos first — then executed at QSC's dedicated painting facility.")
    : (ar ? "التشخيص قبل الإصلاح، والشرح قبل العمل: هكذا تتعامل ورشة الصيانة مع كل سيارة، من الفحص الدوري إلى إصلاح المحركات." : "Diagnosis before repair, explanation before work: that is how the maintenance workshop treats every car, from scheduled service to engine repair.")}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container">
  <span class="eyebrow">${ar ? "دليل الخدمات" : "SERVICE DIRECTORY"}</span>
  <h2>${ar ? (isPaint ? "جميع خدمات الدهان والسمكرة" : "جميع خدمات الصيانة") : (isPaint ? "All painting & bodywork services" : "All maintenance services")}</h2>
  ${catSections}
</div></section>
<section class="section section--cloud"><div class="container">
  <div class="split">
    <div>
      <span class="eyebrow">${ar ? "الموقع" : "THE FACILITY"}</span>
      <h2>${esc(t(w.name, lang))}</h2>
      <p class="lead">${esc(t(w.role, lang))}</p>
      ${ph(ar ? `الصورة قيد التجهيز — ${t(w.shortName, lang)}` : `PHOTO PENDING — ${t(w.shortName, "en").toUpperCase()} FACILITY`, "")}
      <div class="actions">
        <a class="btn btn--dark" href="/${lang}/workshops/${w.slug}/">${t(UI.common.viewWorkshop, lang)}</a>
      </div>
    </div>
    <aside class="panel">
      <h3>${isPaint ? (ar ? "أرسل صور الضرر" : "Send damage photos") : (ar ? "احجز فحصًا وتشخيصًا" : "Book a diagnostic visit")}</h3>
      <p class="contact-line">${isPaint
        ? (ar ? "صور واضحة في ضوء النهار تكفي لتقييم مبدئي قبل أي زيارة." : "Clear daylight photos are enough for an initial assessment before any visit.")
        : (ar ? "صف العرض — متى يحدث وكيف يبدو — ودع الورشة تحدد السبب." : "Describe the symptom — when it happens and what it feels like — and let the workshop find the cause.")}</p>
      ${ctaGroup(lang, branch)}
    </aside>
  </div>
</div></section>
${processSection(lang, true)}`;
  return page(lang, {
    title, desc, pathname: `/${lang}/${slug}/`, navCurrent: `/${lang}/${slug}/`,
    jsonld: [breadcrumbLd(trail.map(([h, l]) => [h, l]))]
  }, body, { pageType: "pillar" });
}

/* ---------- Service pages ---------- */
function servicePage(lang, s) {
  const ar = lang === "ar";
  const isPaint = s.branch === "painting";
  const w = workshops[s.branch];
  const pathname = serviceUrl(lang, s);
  const pillarUrl = `/${lang}/${pillarSlug(s.branch)}/`;
  const trail = [
    [`/${lang}/`, t(UI.common.breadcrumbHome, lang)],
    [pillarUrl, t(isPaint ? UI.nav.painting : UI.nav.maintenance, lang)],
    [null, t(s.name, lang)]
  ];
  const related = (s.related || []).map(findService).filter(Boolean).slice(0, 4);
  const faqs = t(s.faqs, lang);
  const jsonld = [
    breadcrumbLd(trail),
    {
      "@context": "https://schema.org", "@type": "Service",
      name: t(s.name, "en"), serviceType: t(s.name, "en"),
      provider: { "@type": "Organization", name: "QSC Automotive", telephone: business.mainPhone },
      areaServed: { "@type": "City", name: "Riyadh" },
      url: SITE + pathname
    },
    faqLd(faqs)
  ];
  const body = `
<section class="page-hero"><div class="container">
  <span class="eyebrow">${isPaint ? (ar ? "الدهان والسمكرة" : "PAINTING & BODYWORK") : (ar ? "الصيانة" : "MAINTENANCE")} · ${t(UI.categories[s.category], lang)}</span>
  <h1>${esc(t(s.name, lang))}${ar ? " في الرياض" : " in Riyadh"}</h1>
  <p>${esc(t(s.metaDesc, lang))}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container split">
  <div class="prose">
    <p class="lead">${esc(t(s.intro, lang))}</p>
    ${ph(ar ? `الصورة قيد التجهيز — ${t(s.name, lang)}` : `PHOTO PENDING — ${t(s.name, "en").toUpperCase()}`, "ph--light")}
    <h2 style="margin-top:40px">${t(UI.common.whoNeeds, lang)}</h2>
    <ul>${t(s.symptoms, lang).map(x => `<li>${esc(x)}</li>`).join("")}</ul>
    <h2 style="margin-top:40px">${t(UI.common.whatWeDo, lang)}</h2>
    <div class="steps">${t(s.scope, lang).map(x => `<div class="step"><p style="margin:0">${esc(x)}</p></div>`).join("")}</div>
  </div>
  <aside class="panel">
    <span class="eyebrow">${t(UI.common.handledAt, lang)}</span>
    <h3>${esc(t(w.name, lang))}</h3>
    <p class="contact-line">${esc(t(w.role, lang))}</p>
    ${ctaGroup(lang, s.branch, { service: s.slug })}
    <p class="contact-line"><a href="/${lang}/workshops/${w.slug}/">${t(UI.common.viewWorkshop, lang)} ${ar ? "←" : "→"}</a></p>
  </aside>
</div></section>
${faqBlock(lang, faqs)}
<section class="section section--cloud"><div class="container">
  <h2>${t(UI.common.relatedServices, lang)}</h2>
  <div class="grid grid--4">${related.map(r => serviceCard(lang, r)).join("")}</div>
</div></section>`;
  return page(lang, { title: t(s.metaTitle, lang), desc: t(s.metaDesc, lang), pathname, navCurrent: pillarUrl, jsonld }, body, { pageType: "service" });
}

/* ---------- Brands hub & brand pages ---------- */
function brandsHub(lang) {
  const ar = lang === "ar";
  const pathname = `/${lang}/car-brands/`;
  const trail = [[`/${lang}/`, t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.brands, lang)]];
  const title = ar ? "ماركات السيارات التي نخدمها في الرياض | QSC Automotive" : "Luxury Car Brands We Service in Riyadh | QSC Automotive";
  const desc = ar
    ? "من مرسيدس وBMW وبورشه إلى فيراري ورولز-رويس: تعرف على خدمات QSC المستقلة لـ16 علامة فاخرة في الرياض — صيانة ودهان وسمكرة."
    : "From Mercedes-Benz, BMW and Porsche to Ferrari and Rolls-Royce: QSC's independent services for 16 luxury marques in Riyadh — maintenance, painting and bodywork.";
  const body = `
<section class="page-hero"><div class="container">
  <span class="eyebrow">${ar ? "دليل الماركات" : "BRAND DIRECTORY"}</span>
  <h1>${ar ? "ابدأ من ماركة سيارتك" : "Start from your car's marque"}</h1>
  <p>${ar
    ? "تعرف على كيفية تعامل QSC مع علامتك: الخدمات الأنسب، والورشة الصحيحة لكل عمل، وطريقة الحجز — بصفتها ورشة متخصصة مستقلة."
    : "See how QSC approaches your marque: the services that matter most for it, the right workshop for each job, and how to book — as an independent specialist."}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container">
  <div class="grid grid--4">
    ${brands.map(b => `<article class="card">
      <h3><a href="/${lang}/car-brands/${b.slug}/" style="color:inherit">${esc(t(b.name, lang))}</a></h3>
      <p>${esc(t(b.intro, lang).split(/(?<=[.؟!،—])\s/).slice(0, 1).join(" ")).slice(0, 170)}…</p>
      <a class="card-link" href="/${lang}/car-brands/${b.slug}/">${t(UI.common.learnMore, lang)} ${ar ? "←" : "→"}</a>
    </article>`).join("")}
  </div>
  <div class="notice notice--muted">${t(UI.common.independentNote, lang)}</div>
</div></section>`;
  return page(lang, { title, desc, pathname, navCurrent: pathname, jsonld: [breadcrumbLd(trail)] }, body, { pageType: "brands-hub" });
}

function brandPage(lang, b) {
  const ar = lang === "ar";
  const pathname = `/${lang}/car-brands/${b.slug}/`;
  const trail = [
    [`/${lang}/`, t(UI.common.breadcrumbHome, lang)],
    [`/${lang}/car-brands/`, t(UI.nav.brands, lang)],
    [null, t(b.name, lang)]
  ];
  const maint = b.maintenanceFocus.map(findService).filter(Boolean);
  const paint = b.paintingFocus.map(findService).filter(Boolean);
  const faqs = t(b.faq, lang);
  const body = `
<section class="page-hero"><div class="container">
  <span class="eyebrow">${ar ? "ماركة السيارة" : "VEHICLE BRAND"}</span>
  <h1>${ar ? `خدمات ${t(b.name, ar ? "ar" : "en")} في الرياض` : `${t(b.name, "en")} services in Riyadh`}</h1>
  <p>${esc(t(b.metaDesc, lang))}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container">
  <p class="lead prose">${esc(t(b.intro, lang))}</p>
  ${ph(ar ? `الصورة قيد التجهيز — أعمال ${t(b.name, lang)}` : `PHOTO PENDING — ${t(b.name, "en").toUpperCase()} WORK AT QSC`, "ph--light")}
  <div class="notice notice--muted">${t(UI.common.independentNote, lang)}</div>
</div></section>
<section class="section section--cloud"><div class="container">
  <span class="eyebrow">${ar ? "ورشة الصيانة" : "AT THE MAINTENANCE WORKSHOP"}</span>
  <h2>${ar ? `صيانة ${t(b.name, lang)}` : `${t(b.name, "en")} maintenance`}</h2>
  <div class="grid grid--3">${maint.slice(0, 6).map(s => serviceCard(lang, s)).join("")}</div>
</div></section>
<section class="section"><div class="container">
  <span class="eyebrow">${ar ? "ورشة الدهان والسمكرة" : "AT THE PAINTING & BODYWORK FACILITY"}</span>
  <h2>${ar ? `دهان وسمكرة ${t(b.name, lang)}` : `${t(b.name, "en")} paint & body`}</h2>
  <div class="grid grid--4">${paint.slice(0, 4).map(s => serviceCard(lang, s)).join("")}</div>
</div></section>
${faqBlock(lang, faqs)}
<section class="section section--dark"><div class="container center">
  <h2>${ar ? `احجز خدمة لسيارتك ${t(b.name, lang)}` : `Book service for your ${t(b.name, "en")}`}</h2>
  <div class="actions" style="justify-content:center">
    <a class="btn btn--primary" href="/${lang}/book-appointment/?brand=${encodeURIComponent(t(b.name, "en"))}">${t(UI.common.bookForBrand, lang)} ${esc(t(b.name, lang))}</a>
    <a class="btn btn--ghost-light" data-contact="phone" data-workshop="org" data-brand="${esc(t(b.name, "en"))}" href="tel:${business.mainPhone}">${t(UI.common.callUs, lang)} QSC</a>
  </div>
</div></section>`;
  return page(lang, {
    title: t(b.metaTitle, lang), desc: t(b.metaDesc, lang), pathname, navCurrent: `/${lang}/car-brands/`,
    jsonld: [breadcrumbLd(trail), faqLd(faqs)]
  }, body, { pageType: "brand" });
}

/* ---------- Workshops hub & detail ---------- */
function workshopsHub(lang) {
  const ar = lang === "ar";
  const pathname = `/${lang}/workshops/`;
  const trail = [[`/${lang}/`, t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.workshops, lang)]];
  const title = ar ? "ورشتا QSC في الرياض — الصيانة والدهان | QSC Automotive" : "QSC's Two Workshops in Riyadh — Maintenance & Painting | QSC";
  const desc = ar
    ? "منشأتان متخصصتان بعنوانين مستقلين في الرياض: ورشة الصيانة الميكانيكية والفنية، وورشة الدهان والسمكرة (الدهان السريع). تعرف على كل موقع وطريقة الوصول والحجز."
    : "Two dedicated facilities at two separate Riyadh addresses: the mechanical & technical maintenance workshop, and the painting & bodywork (Fast Painting) workshop. Find each location, directions and booking.";
  const body = `
<section class="page-hero"><div class="container">
  <span class="eyebrow">${ar ? "منشآتنا" : "OUR FACILITIES"}</span>
  <h1>${ar ? "ورشتان متخصصتان، معيار QSC واحد" : "Two specialist workshops, one QSC standard"}</h1>
  <p>${ar
    ? "كل منشأة مكرسة لمجالها بالكامل — فريقها ومعداتها ومساحتها لعمل واحد تتقنه. اختر الورشة المناسبة لحاجة سيارتك."
    : "Each facility is wholly dedicated to its discipline — its team, equipment and space serve one kind of work done well. Choose the workshop your car needs."}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container">
  <div class="grid grid--2">
    ${workshopSummaryCard(lang, "maintenance")}
    ${workshopSummaryCard(lang, "painting")}
  </div>
  <div class="notice notice--muted">${ar
    ? "العناوين الدقيقة ومواقع الخرائط وأرقام الفروع قيد التأكيد النهائي من QSC — وحتى اكتماله يصلك الرقم الرئيسي بالفريق الصحيح."
    : "Exact street addresses, map pins and branch lines are in final confirmation with QSC — until then, the main line connects you to the right team."}</div>
</div></section>
${processSection(lang)}`;
  return page(lang, { title, desc, pathname, navCurrent: pathname, jsonld: [breadcrumbLd(trail)] }, body, { pageType: "workshops-hub" });
}

function workshopPage(lang, wid) {
  const ar = lang === "ar";
  const w = workshops[wid];
  const isPaint = wid === "painting";
  const pathname = `/${lang}/workshops/${w.slug}/`;
  const trail = [
    [`/${lang}/`, t(UI.common.breadcrumbHome, lang)],
    [`/${lang}/workshops/`, t(UI.nav.workshops, lang)],
    [null, t(w.shortName, lang)]
  ];
  const list = services.filter(s => s.branch === wid).slice(0, 6);
  const title = isPaint
    ? (ar ? "ورشة QSC للدهان والسمكرة (الدهان السريع) — الرياض" : "QSC Painting & Bodywork Workshop (Fast Painting) — Riyadh")
    : (ar ? "ورشة QSC للصيانة — الرياض" : "QSC Maintenance Workshop — Riyadh");
  const desc = ar
    ? `${t(w.role, "ar")} تعرف على الموقع وطرق التواصل والحجز.`
    : `${t(w.role, "en")} Find the location, contact options and booking path.`;
  const pendingAddr = String(t(w.address, lang)).startsWith("PENDING");
  const body = `
<section class="page-hero"><div class="container">
  <span class="eyebrow">${ar ? "ملف الورشة" : "WORKSHOP PROFILE"}</span>
  <h1>${esc(t(w.name, lang))}</h1>
  <p>${esc(t(w.role, lang))}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container split">
  <div>
    ${ph(ar ? `الصورة قيد التجهيز — ${t(w.shortName, lang)}` : `PHOTO PENDING — QSC ${t(w.shortName, "en").toUpperCase()} EXTERIOR`)}
    <h2 style="margin-top:36px">${ar ? "ماذا يحدث هنا" : "What happens here"}</h2>
    <p class="lead">${isPaint
      ? (ar ? "هذه هي منشأة QSC الثانية، المكرسة بالكامل للدهان والسمكرة، وتعمل باسم «الدهان السريع». كل أعمال الدهان وإصلاح الهيكل ومطابقة الألوان وقياس الشاصي تُنفَّذ هنا — وتبدأ غالبًا بتقييم من الصور." : "This is QSC's second facility, wholly dedicated to paint and body and operating as the Fast Painting workshop. All painting, body repair, color matching and chassis measurement happens here — usually starting with a photo assessment.")
      : (ar ? "هذه منشأة QSC الأولى، المكرسة للصيانة الميكانيكية والكهربائية والفحص الحاسوبي والعناية الدورية. تبدأ كل زيارة بالتشخيص وتنتهي بتقرير موثق." : "This is QSC's first facility, dedicated to mechanical and electrical repair, diagnostics and scheduled care. Every visit starts with diagnosis and ends with a documented report.")}</p>
    <h2 style="margin-top:36px">${ar ? "أبرز الخدمات" : "Key services"}</h2>
    <div class="grid grid--3" style="margin-top:18px">${list.map(s => serviceCard(lang, s)).join("")}</div>
    <div class="actions"><a class="btn btn--dark" href="/${lang}/${pillarSlug(wid)}/">${ar ? "جميع خدمات هذه الورشة" : "All services at this workshop"}</a></div>
  </div>
  <aside class="panel">
    <h3>${ar ? "الموقع والتواصل" : "Location & contact"}</h3>
    <ul class="workshop-meta">
      <li><span class="k">${ar ? "العنوان" : "Address"}</span><span>${pendingAddr ? t(UI.common.addressPending, lang) : esc(t(w.address, lang))}</span></li>
      <li><span class="k">${ar ? "الهاتف" : "Phone"}</span><span>${w.phone ? esc(w.phone) : `${t(UI.common.phonePendingBranch, lang)} <span dir="ltr">${esc(business.mainPhoneDisplay)}</span>`}</span></li>
      <li><span class="k">${ar ? "الدوام" : "Hours"}</span><span>${w.hours ? esc(w.hours) : esc(t(business.hoursLegacy, lang))}</span></li>
    </ul>
    ${ctaGroup(lang, wid)}
    <a class="btn btn--ghost" data-contact="map" data-workshop="${wid}" href="#">${t(UI.common.getDirections, lang)}</a>
  </aside>
</div></section>
${statsStrip(lang)}`;
  return page(lang, { title, desc, pathname, navCurrent: `/${lang}/workshops/`, jsonld: [breadcrumbLd(trail)] }, body, { pageType: "workshop" });
}

/* ---------- Service areas ---------- */
function serviceAreasHub(lang) {
  const ar = lang === "ar";
  const pathname = `/${lang}/service-areas/`;
  const trail = [[`/${lang}/`, t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.serviceAreas, lang)]];
  const title = ar ? "مناطق الخدمة | QSC Automotive" : "Service Areas | QSC Automotive";
  const desc = ar
    ? "تخدم QSC عملاءها من منشأتيها في الرياض. تعرف على نطاق الخدمة وإمكانية استلام السيارة من خارج المدينة — بتأكيد فردي لكل حالة."
    : "QSC serves customers from its two Riyadh facilities. See the service area and how vehicle pickup from outside the city works — confirmed individually per case.";
  const body = `
<section class="page-hero"><div class="container">
  <span class="eyebrow">${ar ? "نطاق الخدمة" : "SERVICE COVERAGE"}</span>
  <h1>${ar ? "أين تخدم QSC عملاءها؟" : "Where QSC serves its customers"}</h1>
  <p>${ar
    ? "منشأتا QSC في الرياض، وتخدمان المدينة أولًا. أي خدمة خارجها — كاستلام السيارة — تُؤكَّد لكل حالة قبل الالتزام، ولا تُنشأ صفحات لمدن لا تتوفر فيها الخدمة فعلًا."
    : "QSC's facilities are in Riyadh and serve the city first. Anything beyond it — such as vehicle pickup — is confirmed per case before commitment, and no city pages exist where service is not genuinely available."}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container">
  <div class="grid grid--2">
    <article class="card">
      <span class="card-tag">${ar ? "المنطقة الرئيسية" : "PRIMARY AREA"}</span>
      <h3><a href="/${lang}/service-areas/riyadh/" style="color:inherit">${ar ? "الرياض" : "Riyadh"}</a></h3>
      <p>${ar ? "ورشتا الصيانة والدهان كلتاهما في الرياض — زيارات مباشرة وحجز بالهاتف أو واتساب أو النموذج." : "Both the maintenance and painting workshops are in Riyadh — walk-in by appointment, booked by phone, WhatsApp or form."}</p>
      <a class="card-link" href="/${lang}/service-areas/riyadh/">${t(UI.common.learnMore, lang)} ${ar ? "←" : "→"}</a>
    </article>
    <article class="card">
      <span class="card-tag">${ar ? "خارج الرياض" : "OUTSIDE RIYADH"}</span>
      <h3>${ar ? "استفسار الاستلام والتسليم" : "Pickup & delivery inquiry"}</h3>
      <p>${ar ? "إن كنت خارج الرياض فاستفسر عن إمكانية استلام سيارتك — يؤكد الفريق التوفر والترتيبات لحالتك قبل أي التزام." : "If you are outside Riyadh, ask about vehicle collection — the team confirms availability and arrangements for your case before any commitment."}</p>
      <a class="card-link" href="/${lang}/maintenance/pickup-delivery/">${t(UI.common.learnMore, lang)} ${ar ? "←" : "→"}</a>
    </article>
  </div>
</div></section>`;
  return page(lang, { title, desc, pathname, navCurrent: pathname, jsonld: [breadcrumbLd(trail)] }, body, { pageType: "service-areas" });
}

function riyadhPage(lang) {
  const ar = lang === "ar";
  const pathname = `/${lang}/service-areas/riyadh/`;
  const trail = [
    [`/${lang}/`, t(UI.common.breadcrumbHome, lang)],
    [`/${lang}/service-areas/`, t(UI.nav.serviceAreas, lang)],
    [null, ar ? "الرياض" : "Riyadh"]
  ];
  const title = ar ? "صيانة ودهان السيارات الفاخرة في الرياض | QSC Automotive" : "Luxury Car Service in Riyadh | QSC Automotive";
  const desc = ar
    ? "QSC في الرياض: ورشة صيانة متخصصة وورشة دهان وسمكرة مستقلة للسيارات الفاخرة. 26 خدمة و16 علامة مدعومة وحجز بثلاث قنوات."
    : "QSC in Riyadh: a dedicated maintenance workshop and a separate painting & bodywork facility for luxury vehicles. 26 services, 16 supported marques, three booking channels.";
  const body = `
<section class="page-hero"><div class="container">
  <span class="eyebrow">${ar ? "منطقة الخدمة" : "SERVICE AREA"}</span>
  <h1>${ar ? "QSC في الرياض" : "QSC in Riyadh"}</h1>
  <p>${ar
    ? "الرياض هي موطن QSC وسوقها الأول: منشأتان متخصصتان تخدمان ملاك السيارات الفاخرة وعالية الأداء في أنحاء المدينة."
    : "Riyadh is QSC's home and primary market: two specialist facilities serving owners of luxury and performance vehicles across the city."}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container">
  <div class="grid grid--2">
    ${workshopSummaryCard(lang, "maintenance")}
    ${workshopSummaryCard(lang, "painting")}
  </div>
</div></section>
<section class="section section--cloud"><div class="container">
  <h2>${ar ? "الخدمات الأكثر طلبًا في الرياض" : "Most requested services in Riyadh"}</h2>
  <div class="grid grid--3">${["ac-repair", "suspension", "engine-repair", "car-painting", "dent-repair", "periodic-maintenance"].map(sl => serviceCard(lang, findService(sl))).join("")}</div>
</div></section>
${statsStrip(lang)}`;
  return page(lang, { title, desc, pathname, navCurrent: `/${lang}/service-areas/`, jsonld: [breadcrumbLd(trail)] }, body, { pageType: "service-area" });
}

/* ---------- About ---------- */
function aboutPage(lang) {
  const ar = lang === "ar";
  const pathname = `/${lang}/about/`;
  const trail = [[`/${lang}/`, t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.about, lang)]];
  const title = ar ? "عن QSC Automotive — من نحن" : "About QSC Automotive";
  const desc = ar
    ? "QSC Automotive: شركة سعودية متخصصة بالعناية بالسيارات الفاخرة في الرياض عبر منشأتين — صيانة متخصصة ودهان وسمكرة. تعرف على نهجنا وأرقامنا."
    : "QSC Automotive: a Saudi specialist in luxury-vehicle care operating two Riyadh facilities — dedicated maintenance, and painting & bodywork. Our approach, in plain terms.";
  const body = `
<section class="page-hero"><div class="container">
  <span class="eyebrow">${ar ? "من نحن" : "ABOUT QSC"}</span>
  <h1>${ar ? "عناية بالسيارات مبنية على التخصص" : "Automotive care built on specialization"}</h1>
  <p>${ar
    ? "خلاصة QSC في قرار واحد: لا تضع الصيانة والدهان في مبنى واحد. لكل حرفة منشأتها وفريقها ومعداتها — وهوية QSC تجمعهما بمعيار واحد."
    : "QSC's essence is one decision: do not put maintenance and painting in the same building. Each craft gets its own facility, team and equipment — unified by one QSC standard."}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container prose">
  <p class="lead">${ar
    ? "تخدم QSC Automotive ملاك السيارات الفاخرة وعالية الأداء في الرياض. يقوم نهجنا على ثلاثة مبادئ: الفحص قبل الإصلاح، والشرح قبل العمل، والتوثيق بعد الإنجاز. لا وعود لا نستطيع الوفاء بها، ولا أعمال لا تحتاجها السيارة."
    : "QSC Automotive serves owners of luxury and performance vehicles in Riyadh. The approach rests on three principles: assessment before repair, explanation before work, and documentation after completion. No promises we cannot keep, and no work the car does not need."}</p>
  <p>${ar
    ? "الورشة الأولى مكرسة للصيانة الميكانيكية والكهربائية والفحص الحاسوبي، والثانية — ورشة الدهان السريع — مكرسة بالكامل للدهان والسمكرة. هذا الفصل ليس تفصيلًا تنظيميًا: الغبار عدو الدهان، والدهان لا مكان له قرب أعمال الميكانيكا، وكل فريق يتقن مجاله لأنه لا يفعل سواه."
    : "The first workshop is dedicated to mechanical and electrical maintenance and diagnostics; the second — the Fast Painting workshop — entirely to paint and body. That separation is not an organizational detail: dust is the enemy of paint, paint has no place near mechanical work, and each team masters its craft because it does nothing else."}</p>
  ${ph(ar ? "الصورة قيد التجهيز — فريق ومنشآت QSC" : "PHOTO PENDING — QSC TEAM & FACILITIES", "ph--light")}
</div></section>
${statsStrip(lang)}
${processSection(lang)}
<section class="section"><div class="container center">
  <h2>${ar ? "تعرّف على الورشتين" : "Meet the two workshops"}</h2>
  <div class="actions" style="justify-content:center">
    <a class="btn btn--dark" href="/${lang}/workshops/maintenance/">${t(workshops.maintenance.shortName, lang)}</a>
    <a class="btn btn--dark" href="/${lang}/workshops/painting-bodywork/">${t(workshops.painting.shortName, lang)}</a>
    <a class="btn btn--primary" href="/${lang}/book-appointment/">${t(UI.nav.book, lang)}</a>
  </div>
</div></section>`;
  return page(lang, { title, desc, pathname, navCurrent: pathname, jsonld: [breadcrumbLd(trail)] }, body, { pageType: "about" });
}

/* ---------- Contact ---------- */
function contactPage(lang) {
  const ar = lang === "ar";
  const pathname = `/${lang}/contact/`;
  const trail = [[`/${lang}/`, t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.contact, lang)]];
  const title = ar ? "اتصل بـ QSC Automotive — الرياض" : "Contact QSC Automotive — Riyadh";
  const desc = ar
    ? "تواصل مع QSC في الرياض: هاتف وبريد وورشتان — الصيانة والدهان والسمكرة. اختر الورشة الصحيحة لحاجتك واحجز موعدك."
    : "Reach QSC in Riyadh: phone, email and two workshops — maintenance, and painting & bodywork. Choose the right workshop for your need and book.";
  const body = `
<section class="page-hero"><div class="container">
  <span class="eyebrow">${ar ? "التواصل والمواقع" : "CONTACT & LOCATIONS"}</span>
  <h1>${ar ? "تواصل مع QSC" : "Contact QSC Automotive"}</h1>
  <p>${ar ? "أسرع طريق هو الهاتف؛ وللاستفسارات المفصلة استخدم نموذج الحجز أو البريد." : "The fastest route is the phone; for detailed inquiries use the booking form or email."}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container split">
  <div>
    <h2>${ar ? "أي ورشة تناسب حاجتك؟" : "Which workshop do you need?"}</h2>
    <p class="lead">${ar
      ? "محرك، قير، كهرباء، تكييف، فحص أو صيانة دورية → ورشة الصيانة. دهان، صدمة، خدش، سمكرة أو حادث → ورشة الدهان والسمكرة."
      : "Engine, gearbox, electrical, AC, diagnostics or scheduled service → the maintenance workshop. Paint, dent, scratch, body or accident damage → the painting & bodywork workshop."}</p>
    <div class="grid grid--2">
      ${workshopSummaryCard(lang, "maintenance")}
      ${workshopSummaryCard(lang, "painting")}
    </div>
  </div>
  <aside class="panel">
    <h3>${ar ? "قنوات التواصل" : "Direct channels"}</h3>
    <ul class="workshop-meta">
      <li><span class="k">${ar ? "الهاتف" : "Phone"}</span><span><a href="tel:${business.mainPhone}" data-contact="phone" data-workshop="org" dir="ltr">${esc(business.mainPhoneDisplay)}</a></span></li>
      <li><span class="k">${ar ? "البريد" : "Email"}</span><span><a href="mailto:${business.email}">${business.email}</a></span></li>
      <li><span class="k">${ar ? "الدوام" : "Hours"}</span><span>${esc(t(business.hoursLegacy, lang))}</span></li>
    </ul>
    <a class="btn btn--primary" href="/${lang}/book-appointment/">${t(UI.nav.book, lang)}</a>
    <a class="btn btn--ghost" data-contact="whatsapp" data-workshop="maintenance" href="#">${t(UI.common.whatsapp, lang)}</a>
    <p class="contact-line">${esc(t(business.mainPhoneNote, lang))}</p>
  </aside>
</div></section>`;
  return page(lang, { title, desc, pathname, navCurrent: pathname, jsonld: [breadcrumbLd(trail)] }, body, { pageType: "contact" });
}

/* ---------- Booking ---------- */
function bookingPage(lang) {
  const ar = lang === "ar";
  const pathname = `/${lang}/book-appointment/`;
  const trail = [[`/${lang}/`, t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.book, lang)]];
  const title = ar ? "احجز موعدًا — QSC Automotive الرياض" : "Book an Appointment — QSC Automotive Riyadh";
  const desc = ar
    ? "اطلب موعدًا في ورشة QSC المناسبة: اختر الورشة والخدمة وسيارتك، أو تواصل مباشرة بالهاتف أو واتساب."
    : "Request an appointment at the right QSC workshop: choose the workshop, service and your vehicle, or reach the team directly by phone or WhatsApp.";
  const svcOptions = (branch) => services.filter(s => s.branch === branch)
    .map(s => `<option value="${s.slug}">${esc(t(s.name, lang))}</option>`).join("");
  const body = `
<section class="page-hero"><div class="container">
  <span class="eyebrow">${ar ? "طلب موعد" : "APPOINTMENT REQUEST"}</span>
  <h1>${ar ? "احجز موعدًا في الورشة" : "Request a workshop appointment"}</h1>
  <p>${ar
    ? "هذا طلب موعد وليس حجزًا مؤكدًا: يراجع الفريق التفاصيل ويتواصل معك للتأكيد. وللتواصل الفوري استخدم الهاتف."
    : "This is an appointment request, not a confirmed reservation: the team reviews your details and contacts you to confirm. For immediate contact, call."}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container split">
  <div>
    <form id="booking-form" novalidate>
      <div class="form-grid">
        <div class="field">
          <label for="bf-name">${ar ? "الاسم الكامل" : "Full name"} *</label>
          <input id="bf-name" name="name" required maxlength="100" autocomplete="name">
          <span class="error-msg"></span>
        </div>
        <div class="field">
          <label for="bf-phone">${ar ? "رقم الجوال" : "Mobile number"} *</label>
          <input id="bf-phone" name="phone" required type="tel" inputmode="tel" dir="ltr" placeholder="+9665XXXXXXXX" autocomplete="tel">
          <span class="hint">${ar ? "يفضل رقم سعودي، وتُقبل الأرقام الدولية" : "Saudi numbers preferred; international numbers accepted"}</span>
          <span class="error-msg"></span>
        </div>
        <div class="field">
          <label for="bf-workshop">${ar ? "الورشة / نوع العمل" : "Workshop / type of work"} *</label>
          <select id="bf-workshop" name="workshop" required>
            <option value="">${ar ? "اختر الورشة" : "Choose a workshop"}</option>
            <option value="maintenance">${t(workshops.maintenance.shortName, lang)}</option>
            <option value="painting">${t(workshops.painting.shortName, lang)}</option>
          </select>
          <span class="error-msg"></span>
        </div>
        <div class="field">
          <label for="bf-service">${ar ? "الخدمة المطلوبة" : "Service needed"} *</label>
          <select id="bf-service" name="service" required>
            <option value="">${ar ? "اختر الخدمة" : "Select a service"}</option>
            <optgroup label="${t(workshops.maintenance.shortName, lang)}">${svcOptions("maintenance")}</optgroup>
            <optgroup label="${t(workshops.painting.shortName, lang)}">${svcOptions("painting")}</optgroup>
          </select>
          <span class="error-msg"></span>
        </div>
        <div class="field">
          <label for="bf-brand">${ar ? "ماركة السيارة" : "Car make"} *</label>
          <select id="bf-brand" name="brand" required>
            <option value="">${ar ? "اختر الماركة" : "Select make"}</option>
            ${brands.map(b => `<option value="${esc(t(b.name, "en"))}">${esc(t(b.name, lang))}</option>`).join("")}
            <option value="Other">${ar ? "أخرى" : "Other"}</option>
          </select>
          <span class="error-msg"></span>
        </div>
        <div class="field">
          <label for="bf-model">${ar ? "الطراز والسنة" : "Model & year"}</label>
          <input id="bf-model" name="model" maxlength="60" placeholder="${ar ? "مثال: S 500 — 2022" : "e.g. S 500 — 2022"}">
        </div>
        <div class="field field--full">
          <label for="bf-message">${ar ? "صف المشكلة أو العمل المطلوب" : "Describe the issue or work needed"}</label>
          <textarea id="bf-message" name="message" maxlength="1500"></textarea>
        </div>
        <div class="field">
          <label for="bf-photos">${ar ? "صور الضرر (للدهان والسمكرة)" : "Damage photos (painting & body)"}</label>
          <input id="bf-photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp,image/heic" multiple>
          <span class="hint">${ar ? "حتى 6 صور، 8MB لكل صورة — JPG / PNG / WebP / HEIC" : "Up to 6 photos, 8MB each — JPG / PNG / WebP / HEIC"}</span>
          <span class="error-msg">${ar ? "تحقق من عدد الصور وصيغتها وحجمها" : "Check file count, type and size"}</span>
        </div>
        <div class="field">
          <label for="bf-date">${ar ? "التاريخ المفضل (اختياري)" : "Preferred date (optional)"}</label>
          <input id="bf-date" name="preferred_date" type="date">
        </div>
        <div class="field">
          <label for="bf-contactpref">${ar ? "طريقة التواصل المفضلة" : "Preferred contact method"}</label>
          <select id="bf-contactpref" name="contact_method">
            <option value="phone">${ar ? "اتصال هاتفي" : "Phone call"}</option>
            <option value="whatsapp">${ar ? "واتساب" : "WhatsApp"}</option>
          </select>
        </div>
      </div>
      <label class="checkline" style="margin-top:20px">
        <input type="checkbox" name="consent" required>
        <span>${ar
          ? "أوافق على تواصل QSC معي بخصوص هذا الطلب وعلى معالجة بياناتي وفق سياسة الخصوصية."
          : "I agree to be contacted by QSC about this request and to my details being handled per the privacy policy."} <a href="/${lang}/privacy-policy/">${t(UI.nav.privacy, lang)}</a></span>
      </label>
      <span class="error-msg"></span>
      <div class="actions">
        <button type="submit" class="btn btn--primary">${ar ? "إرسال طلب الموعد" : "Send appointment request"}</button>
      </div>
      <div id="form-status" class="form-status" aria-live="polite"></div>
    </form>
  </div>
  <aside class="panel">
    <h3>${ar ? "تفضل التواصل المباشر؟" : "Prefer to talk directly?"}</h3>
    <p class="contact-line">${ar ? "الهاتف وواتساب يصلانك بالفريق مباشرة أثناء ساعات العمل." : "Phone and WhatsApp reach the team directly during working hours."}</p>
    <a class="btn btn--dark" data-contact="phone" data-workshop="org" href="tel:${business.mainPhone}">${t(UI.common.callUs, lang)} <span dir="ltr">${esc(business.mainPhoneDisplay)}</span></a>
    <a class="btn btn--ghost" data-contact="whatsapp" data-workshop="maintenance" href="#">${t(UI.common.whatsapp, lang)} — ${t(workshops.maintenance.shortName, lang)}</a>
    <a class="btn btn--ghost" data-contact="whatsapp" data-workshop="painting" href="#">${t(UI.common.whatsapp, lang)} — ${t(workshops.painting.shortName, lang)}</a>
    <h3 style="margin-top:28px">${ar ? "ماذا بعد الإرسال؟" : "What happens next?"}</h3>
    <div class="steps">
      ${t(UI.common.process, lang).map(([h]) => `<div class="step"><p style="margin:0">${esc(h)}</p></div>`).join("")}
    </div>
  </aside>
</div></section>`;
  return page(lang, { title, desc, pathname, navCurrent: pathname, jsonld: [breadcrumbLd(trail)] }, body,
    { pageType: "booking", extraScripts: `<script src="/assets/js/booking.js" defer></script>` });
}

/* ---------- Guides & Projects hubs (launch state: templates live, entries pending) ---------- */
function guidesHub(lang) {
  const ar = lang === "ar";
  const pathname = `/${lang}/guides/`;
  const trail = [[`/${lang}/`, t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.guides, lang)]];
  const body = `
<section class="page-hero"><div class="container">
  <span class="eyebrow">${ar ? "أدلة ومعلومات" : "GUIDES & INSIGHTS"}</span>
  <h1>${ar ? "أدلة عملية من ورشة حقيقية" : "Practical guides from a real workshop"}</h1>
  <p>${ar
    ? "ستُنشر هنا مقالات تعتمد على خبرة الورشة الفعلية — لا محتوى عامًا. القسم قيد الإعداد وتُنشر الأدلة بعد اعتماد محتواها."
    : "Articles grounded in the workshop's actual experience will be published here — no generic filler. The section is in preparation; guides go live once their content is approved."}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container">
  <div class="notice notice--muted">${ar
    ? "لم تُنشر أدلة بعد. حتى ذلك الحين، صفحات الخدمات تجيب عن أكثر الأسئلة شيوعًا:"
    : "No guides are published yet. Until then, the service pages answer the most common questions:"}</div>
  <div class="grid grid--3">${["cooling-system", "scratch-repair", "diagnostics"].map(sl => serviceCard(lang, findService(sl))).join("")}</div>
</div></section>`;
  return page(lang, {
    title: ar ? "أدلة ومقالات | QSC Automotive" : "Guides & Insights | QSC Automotive",
    desc: ar ? "أدلة عملية للعناية بالسيارات الفاخرة من فريق QSC — قيد الإعداد." : "Practical luxury-car care guides from the QSC team — in preparation.",
    pathname, navCurrent: pathname, noindex: true, jsonld: [breadcrumbLd(trail)]
  }, body, { pageType: "guides" });
}

function projectsHub(lang) {
  const ar = lang === "ar";
  const pathname = `/${lang}/projects/`;
  const trail = [[`/${lang}/`, t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.projects, lang)]];
  const body = `
<section class="page-hero"><div class="container">
  <span class="eyebrow">${ar ? "أعمالنا" : "OUR WORK"}</span>
  <h1>${ar ? "مشاريع موثقة، بإذن أصحابها" : "Documented projects, with owners' consent"}</h1>
  <p>${ar
    ? "سيعرض هذا القسم أعمالًا حقيقية — الحالة الأولى، خطوات العمل، والنتيجة قبل/بعد — ولا يُنشر أي مشروع دون صور حقيقية وموافقة موثقة من العميل."
    : "This section will show real jobs — the initial condition, the process, and before/after results — and no project is published without genuine photography and documented customer consent."}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container">
  <div class="notice notice--muted">${ar
    ? "جاري توثيق أول مجموعة مشاريع مع عملائنا. حتى نشرها يمكنك طلب أمثلة ذات صلة بحالتك عند التقييم."
    : "The first set of projects is being documented with our customers. Until they are published, you can ask to see relevant examples during your assessment."}</div>
  <div class="grid grid--3">
    ${[1, 2, 3].map(i => `<div class="card">${ph(ar ? "مشروع قيد التوثيق" : "PROJECT PENDING — REAL BEFORE/AFTER", "ph--light")}<p style="margin-top:14px">${ar ? "يُنشر بعد اكتمال التوثيق والموافقة." : "Published once documentation and consent are complete."}</p></div>`).join("")}
  </div>
</div></section>`;
  return page(lang, {
    title: ar ? "أعمالنا ومشاريعنا | QSC Automotive" : "Our Work & Projects | QSC Automotive",
    desc: ar ? "مشاريع QSC الموثقة قبل/بعد — قيد الإعداد بانتظار الصور والموافقات." : "QSC's documented before/after projects — in preparation pending photography and consents.",
    pathname, navCurrent: pathname, noindex: true, jsonld: [breadcrumbLd(trail)]
  }, body, { pageType: "projects" });
}

/* ---------- Privacy ---------- */
function privacyPage(lang) {
  const ar = lang === "ar";
  const pathname = `/${lang}/privacy-policy/`;
  const trail = [[`/${lang}/`, t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.privacy, lang)]];
  const body = `
<section class="page-hero"><div class="container">
  <h1>${ar ? "سياسة الخصوصية" : "Privacy Policy"}</h1>
  <p>${ar ? "كيف تتعامل QSC مع بياناتك عند التواصل والحجز." : "How QSC handles your details when you contact or book."}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container prose">
  <div class="notice">${ar
    ? "مسودة بانتظار المراجعة القانونية: يُستكمل هذا النص ويُعتمد من المستشار القانوني لـQSC وفق نظام حماية البيانات الشخصية السعودي قبل الإطلاق."
    : "Draft pending legal review: this text is to be completed and approved by QSC's legal counsel under the Saudi Personal Data Protection Law before launch."}</div>
  <h2>${ar ? "ما الذي نجمعه" : "What we collect"}</h2>
  <p>${ar
    ? "عند طلب موعد نجمع ما تقدمه لنا فقط: الاسم ورقم الجوال وبيانات السيارة ووصف الحالة وأي صور ترفقها، لغرض وحيد هو الرد على طلبك وتقديم الخدمة."
    : "When you request an appointment we collect only what you give us: your name, mobile number, vehicle details, a description of the issue and any photos you attach — for the single purpose of responding to your request and providing the service."}</p>
  <h2>${ar ? "كيف نستخدمه" : "How it is used"}</h2>
  <p>${ar
    ? "تصل بياناتك إلى فريق الورشة المعنية لمعالجة طلبك. لا نبيع البيانات ولا نشاركها مع أطراف تسويقية، ولا تُستخدم صور سيارتك في أي عرض عام دون موافقتك الموثقة."
    : "Your details go to the relevant workshop team to process your request. We do not sell data or share it with marketing parties, and photos of your vehicle are never used in any public material without your documented consent."}</p>
  <h2>${ar ? "التحليلات" : "Analytics"}</h2>
  <p>${ar
    ? "تُستخدم أدوات قياس مجمّعة لفهم استخدام الموقع (مثل النقر على زر الاتصال). لا تُسجَّل بيانات النماذج الشخصية ولا محتوى الصور في التحليلات."
    : "Aggregate measurement tools help us understand site usage (for example, taps on the call button). Personal form data and photo contents are never logged to analytics."}</p>
  <h2>${ar ? "تواصل معنا" : "Contact"}</h2>
  <p>${ar ? "لأي استفسار عن بياناتك راسلنا على " : "For any question about your data, email "}<a href="mailto:${business.email}">${business.email}</a>.</p>
</div></section>`;
  return page(lang, {
    title: ar ? "سياسة الخصوصية | QSC Automotive" : "Privacy Policy | QSC Automotive",
    desc: ar ? "سياسة خصوصية QSC Automotive — مسودة بانتظار الاعتماد القانوني." : "QSC Automotive privacy policy — draft pending legal approval.",
    pathname, navCurrent: pathname, noindex: true, jsonld: [breadcrumbLd(trail)]
  }, body, { pageType: "privacy" });
}

/* ---------- 404 ---------- */
function notFoundPage() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found — QSC Automotive</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600&family=Manrope:wght@400;700;800&display=swap">
<link rel="stylesheet" href="/assets/css/main.css">
<link rel="icon" href="/assets/logo/qsc-logo.jpg">
</head>
<body>
<main class="gateway">
  <div class="gateway-inner">
    <div class="gateway-logo"><img src="/assets/logo/qsc-logo.jpg" alt="QSC Automotive" width="200" height="125"></div>
    <h1>Page not found<br><span lang="ar" dir="rtl">الصفحة غير موجودة</span></h1>
    <p class="sub">The page you were looking for does not exist or has moved.<br><span lang="ar" dir="rtl">الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</span></p>
    <nav class="gateway-choices">
      <a class="gateway-choice" href="/ar/" lang="ar" dir="rtl"><strong>العربية</strong><span>الصفحة الرئيسية</span></a>
      <a class="gateway-choice" href="/en/"><strong>English</strong><span>Go to homepage</span></a>
    </nav>
  </div>
</main>
</body>
</html>`;
}

/* =============================================================================
   BUILD
   ============================================================================= */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

/* assets */
fs.mkdirSync(path.join(DIST, "assets/css"), { recursive: true });
fs.mkdirSync(path.join(DIST, "assets/js"), { recursive: true });
fs.mkdirSync(path.join(DIST, "assets/logo"), { recursive: true });
fs.copyFileSync(path.join(__dirname, "src/styles/main.css"), path.join(DIST, "assets/css/main.css"));
for (const f of ["site-config.js", "main.js", "booking.js"]) {
  fs.copyFileSync(path.join(__dirname, "src/scripts", f), path.join(DIST, "assets/js", f));
}
fs.copyFileSync(path.join(__dirname, "public/assets/logo/qsc-logo.jpg"), path.join(DIST, "assets/logo/qsc-logo.jpg"));

/* pages */
writePage("/index.html", gatewayPage());
writePage("/404.html", notFoundPage());

const indexable = []; // [path, langPairs]
for (const lang of LANGS) {
  writePage(`/${lang}/`, homePage(lang)); indexable.push(`/${lang}/`);
  for (const branch of ["maintenance", "painting"]) {
    writePage(`/${lang}/${pillarSlug(branch)}/`, pillarPage(lang, branch));
    indexable.push(`/${lang}/${pillarSlug(branch)}/`);
  }
  for (const s of services) {
    writePage(serviceUrl(lang, s), servicePage(lang, s));
    indexable.push(serviceUrl(lang, s));
  }
  writePage(`/${lang}/car-brands/`, brandsHub(lang)); indexable.push(`/${lang}/car-brands/`);
  for (const b of brands) {
    writePage(`/${lang}/car-brands/${b.slug}/`, brandPage(lang, b));
    indexable.push(`/${lang}/car-brands/${b.slug}/`);
  }
  writePage(`/${lang}/workshops/`, workshopsHub(lang)); indexable.push(`/${lang}/workshops/`);
  writePage(`/${lang}/workshops/maintenance/`, workshopPage(lang, "maintenance")); indexable.push(`/${lang}/workshops/maintenance/`);
  writePage(`/${lang}/workshops/painting-bodywork/`, workshopPage(lang, "painting")); indexable.push(`/${lang}/workshops/painting-bodywork/`);
  writePage(`/${lang}/service-areas/`, serviceAreasHub(lang)); indexable.push(`/${lang}/service-areas/`);
  writePage(`/${lang}/service-areas/riyadh/`, riyadhPage(lang)); indexable.push(`/${lang}/service-areas/riyadh/`);
  writePage(`/${lang}/about/`, aboutPage(lang)); indexable.push(`/${lang}/about/`);
  writePage(`/${lang}/contact/`, contactPage(lang)); indexable.push(`/${lang}/contact/`);
  writePage(`/${lang}/book-appointment/`, bookingPage(lang)); indexable.push(`/${lang}/book-appointment/`);
  // Templates live but noindex until real entries are approved — excluded from sitemap:
  writePage(`/${lang}/guides/`, guidesHub(lang));
  writePage(`/${lang}/projects/`, projectsHub(lang));
  writePage(`/${lang}/privacy-policy/`, privacyPage(lang));
}

/* sitemap.xml — indexable canonical pages only, with hreflang alternates */
const today = new Date().toISOString().slice(0, 10);
const enPages = indexable.filter(p => p.startsWith("/en/"));
const smUrl = (p) => {
  const arP = p.replace("/en/", "/ar/");
  return `  <url>
    <loc>${SITE}${p}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${p}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE}${arP}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>
  </url>
  <url>
    <loc>${SITE}${arP}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${p}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE}${arP}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>
  </url>`;
};
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${SITE}/</loc><lastmod>${today}</lastmod></url>
${enPages.map(smUrl).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);

fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

console.log(`Built ${written.length} HTML documents + sitemap.xml + robots.txt into dist/`);
console.log(`Indexable pages in sitemap: ${enPages.length * 2 + 1}`);
