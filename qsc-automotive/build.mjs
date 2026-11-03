#!/usr/bin/env node
/* =============================================================================
   QSC AUTOMOTIVE — static site builder V2 (no dependencies, Node 18+)
   English site at the ROOT (/), Arabic under /ar/ — no language gateway.
   Language switch lives in the header and maps to the equivalent page.
   Usage:  node build.mjs          → writes ./dist
   ============================================================================= */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import maintServices from "./src/content/services-maintenance.mjs";
import paintServices from "./src/content/services-painting.mjs";
import extraMaint from "./src/content/services-extra-maintenance.mjs";
import extraPaint from "./src/content/services-extra-painting.mjs";
import pageFaqs from "./src/content/page-faqs.mjs";
import brands from "./src/content/brands.mjs";
import brandsExtra from "./src/content/brands-extra.mjs";
import { IMG_BASE, LOGO_BASE, IMAGES, BRAND_LOGOS } from "./src/data/images.mjs";
import UI from "./src/content/ui.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");
const business = JSON.parse(fs.readFileSync(path.join(__dirname, "src/data/business.json"), "utf8"));
const workshops = JSON.parse(fs.readFileSync(path.join(__dirname, "src/data/workshops.json"), "utf8"));
const SITE = business.domain;
const LANGS = ["en", "ar"];
const EXTRA = { ...extraMaint, ...extraPaint };
const services = [...maintServices.map(s => ({ ...s, branch: "maintenance" })), ...paintServices.map(s => ({ ...s, branch: "painting" }))];

/* ---------- helpers ---------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const t = (obj, lang) => (obj && typeof obj === "object" && (lang in obj)) ? obj[lang] : obj;
const base = (lang) => (lang === "en" ? "" : "/ar");
const P = (lang, sub) => base(lang) + sub;             // sub always starts with "/"
const pillarSlug = (branch) => branch === "painting" ? "painting-bodywork" : "maintenance";
const serviceUrl = (lang, s) => P(lang, `/${pillarSlug(s.branch)}/${s.slug}/`);
const findService = (slug) => services.find(s => s.slug === slug);
const otherLang = (lang) => (lang === "en" ? "ar" : "en");
const altOf = (lang, pathname) => lang === "en" ? "/ar" + pathname : pathname.replace(/^\/ar/, "") || "/";

let written = [];
function writePage(urlPath, html) {
  const target = urlPath.endsWith(".html")
    ? path.join(DIST, urlPath.replace(/^\//, ""))
    : path.join(DIST, urlPath.replace(/^\//, ""), "index.html");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  written.push(urlPath);
}

/* ---------- layout ---------- */
function head(lang, { title, desc, pathname, noindex = false, jsonld = [] }) {
  const enPath = lang === "en" ? pathname : altOf(lang, pathname);
  const arPath = lang === "ar" ? pathname : altOf(lang, pathname);
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
<link rel="alternate" hreflang="en" href="${SITE}${enPath}">
<link rel="alternate" hreflang="ar" href="${SITE}${arPath}">
<link rel="alternate" hreflang="x-default" href="${SITE}${enPath}">
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
    [P(lang, "/"), N.home], [P(lang, "/maintenance/"), N.maintenance],
    [P(lang, "/painting-bodywork/"), N.painting], [P(lang, "/car-brands/"), N.brands],
    [P(lang, "/workshops/"), N.workshops], [P(lang, "/about/"), N.about], [P(lang, "/contact/"), N.contact]
  ];
  return `
<a class="skip-link" href="#main">${t(C.skipLink, lang)}</a>
<div class="topbar"><div class="container">
  <span>${lang === "ar" ? "ورشتان متخصصتان في الرياض — صيانة · دهان وسمكرة" : "Two specialist workshops in Riyadh — Maintenance · Painting & Bodywork"}</span>
  <span class="tb-links">
    <a href="tel:${workshops.maintenance.phone}" data-contact="phone" data-workshop="maintenance" dir="ltr">${esc(workshops.maintenance.phoneDisplay)}</a>
    <a href="tel:${workshops.painting.phone}" data-contact="phone" data-workshop="painting" dir="ltr">${esc(workshops.painting.phoneDisplay)}</a>
  </span>
</div></div>
<header class="site-header"><div class="container">
  <a class="brand" href="${P(lang, "/")}" aria-label="QSC Automotive — ${lang === "ar" ? "الرئيسية" : "home"}">
    <img src="/assets/logo/qsc-logo.jpg" alt="QSC Automotive" width="128" height="80">
  </a>
  <button class="nav-toggle" aria-expanded="false" aria-controls="nav-main" aria-label="${lang === "ar" ? "القائمة" : "Menu"}"><span></span></button>
  <nav class="nav-main" id="nav-main" aria-label="${lang === "ar" ? "التنقل الرئيسي" : "Primary"}">
    ${items.map(([href, label]) => `<a href="${href}"${current === href ? ' aria-current="page"' : ""}>${t(label, lang)}</a>`).join("\n    ")}
    <a class="lang-switch" href="${altOf(lang, current)}" lang="${otherLang(lang)}" aria-label="${t(C.langSwitchLabel, lang)}">${t(C.langSwitch, lang)}</a>
    <a class="btn btn--primary nav-cta" href="${P(lang, "/book-appointment/")}">${t(UI.nav.book, lang)}</a>
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
      <p dir="ltr"><a href="tel:${business.mainPhone}" data-contact="phone" data-workshop="maintenance">${esc(business.mainPhoneDisplay)}</a></p>
      <p><a href="mailto:${business.email}">${business.email}</a></p>
    </div>
    <div><h3>${t(C.footerExplore, lang)}</h3>
      ${link(P(lang, "/maintenance/"), N.maintenance)}
      ${link(P(lang, "/painting-bodywork/"), N.painting)}
      ${link(P(lang, "/car-brands/"), N.brands)}
      ${link(P(lang, "/workshops/"), N.workshops)}
      ${link(P(lang, "/service-areas/"), N.serviceAreas)}
    </div>
    <div><h3>${t(C.footerSupport, lang)}</h3>
      ${link(P(lang, "/book-appointment/"), N.book)}
      ${link(P(lang, "/contact/"), N.contact)}
      ${link(P(lang, "/workshops/maintenance/"), workshops.maintenance.shortName)}
      ${link(P(lang, "/workshops/painting-bodywork/"), workshops.painting.shortName)}
    </div>
    <div><h3>${t(C.footerLegal, lang)}</h3>
      ${link(P(lang, "/about/"), N.about)}
      ${link(P(lang, "/guides/"), N.guides)}
      ${link(P(lang, "/projects/"), N.projects)}
      ${link(P(lang, "/privacy-policy/"), N.privacy)}
    </div>
  </div>
  <p class="stats-note">${t(C.independentNote, lang)}</p>
  <div class="footer-bottom">
    <span>© ${new Date().getFullYear()} QSC Automotive. ${t(C.rights, lang)}</span>
    <span>${lang === "ar" ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}</span>
  </div>
</div></footer>
<div class="sticky-cta" aria-hidden="false">
  <a href="tel:${business.mainPhone}" data-contact="phone" data-workshop="maintenance">${t(C.callUs, lang)} QSC</a>
  <a class="primary" href="${P(lang, "/book-appointment/")}">${t(N.book, lang)}</a>
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
const img = (file, alt, cls = "media--ratio") => `<div class="media ${cls}"><img src="${IMG_BASE}${file}" alt="${esc(alt)}" loading="lazy" decoding="async"></div>`;
const logoImg = (slug, name, lazy = true) => {
  const l = BRAND_LOGOS[slug];
  if (!l) return `<span class="logo-fallback">${esc(name)}</span>`;
  return `<img src="${LOGO_BASE}${l.file}.png" alt="${esc(name)} logo"${lazy ? ' loading="lazy"' : ""} decoding="async" data-fb="${esc(l.mono)}" onerror="this.outerHTML='<span class=&quot;logo-fallback&quot;>'+this.dataset.fb+'</span>'">`;
};
const pageHeroBg = () => `<div class="ph-bg" style="background-image:url('${IMG_BASE}${IMAGES.pageHero}')" aria-hidden="true"></div>`;
function brandMarquee(lang) {
  const item = (b, hide) => `<a href="${P(lang, `/car-brands/${b.slug}/`)}"${hide ? ' tabindex="-1" aria-hidden="true"' : ""} title="${esc(t(b.name, lang))}">${logoImg(b.slug, t(b.name, "en"))}</a>`;
  return `<div class="marquee" aria-label="${lang === "ar" ? "العلامات التي نخدمها" : "Brands we service"}">
  <div class="marquee-track">${brands.map(b => item(b, false)).join("")}${brands.map(b => item(b, true)).join("")}</div>
</div>`;
}

function faqBlock(lang, faqs, { cloud = false, title = null } = {}) {
  if (!faqs || !faqs.length) return "";
  return `<section class="section section--tight${cloud ? " section--cloud" : ""}"><div class="container">
  <span class="eyebrow">FAQ</span>
  <h2>${title || t(UI.common.faqTitle, lang)}</h2>
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
  const url = P(lang, `/workshops/${w.slug}/`);
  return `<article class="workshop-card">
  ${img(wid === "painting" ? IMAGES.workshopPainting : IMAGES.workshopMaintenance, lang === "ar" ? t(w.shortName, "ar") : `QSC ${t(w.shortName, "en")} workshop`, "")}
  <div class="workshop-body">
    <h3>${esc(t(w.name, lang))}</h3>
    <p>${esc(t(w.role, lang))}</p>
    <ul class="workshop-meta">
      <li><span class="k">${lang === "ar" ? "العنوان" : "Address"}</span><span>${esc(t(w.address, lang))}</span></li>
      <li><span class="k">${lang === "ar" ? "الهاتف" : "Phone"}</span><span><a href="tel:${w.phone}" data-contact="phone" data-workshop="${wid}" dir="ltr">${esc(w.phoneDisplay)}</a></span></li>
      <li><span class="k">${lang === "ar" ? "الدوام" : "Hours"}</span><span>${esc(t(w.hours, lang))}</span></li>
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
  <a class="btn btn--primary" href="${P(lang, "/book-appointment/")}?${q.toString()}">${label}</a>
  <a class="btn btn--dark" data-contact="phone" data-workshop="${wid}" data-service="${esc(service)}" href="tel:${workshops[wid].phone}">${t(C.callUs, lang)} — ${t(workshops[wid].shortName, lang)}</a>
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

/* ---------- Inquiry form (hero + contact band variants) ---------- */
function quickForm(lang, formId) {
  const ar = lang === "ar";
  const svcOptions = (branch) => services.filter(s => s.branch === branch)
    .map(s => `<option value="${s.slug}">${esc(t(s.name, lang))}</option>`).join("");
  return `<form class="hero-form qsc-form" data-form="${formId}" novalidate aria-label="${ar ? "طلب موعد سريع" : "Quick appointment request"}">
  <h2>${ar ? "اطلب موعدك الآن" : "Request your appointment"}</h2>
  <p class="sub">${ar ? "يرد عليك فريق الورشة المناسبة للتأكيد — الطلب ليس حجزًا مؤكدًا." : "The right workshop's team replies to confirm — a request, not a confirmed booking."}</p>
  <div class="form-grid">
    <div class="field"><label for="${formId}-name">${ar ? "الاسم" : "Name"} *</label>
      <input id="${formId}-name" name="name" required maxlength="100" autocomplete="name"><span class="error-msg"></span></div>
    <div class="field"><label for="${formId}-phone">${ar ? "رقم الجوال" : "Mobile"} *</label>
      <input id="${formId}-phone" name="phone" required type="tel" inputmode="tel" dir="ltr" placeholder="+9665XXXXXXXX" autocomplete="tel"><span class="error-msg"></span></div>
    <div class="field"><label for="${formId}-workshop">${ar ? "نوع العمل" : "Type of work"} *</label>
      <select id="${formId}-workshop" name="workshop" required>
        <option value="">${ar ? "اختر" : "Choose"}</option>
        <option value="maintenance">${t(workshops.maintenance.shortName, lang)}</option>
        <option value="painting">${t(workshops.painting.shortName, lang)}</option>
      </select><span class="error-msg"></span></div>
    <div class="field"><label for="${formId}-service">${ar ? "الخدمة" : "Service"}</label>
      <select id="${formId}-service" name="service">
        <option value="">${ar ? "اختر الخدمة (اختياري)" : "Select service (optional)"}</option>
        <optgroup label="${t(workshops.maintenance.shortName, lang)}">${svcOptions("maintenance")}</optgroup>
        <optgroup label="${t(workshops.painting.shortName, lang)}">${svcOptions("painting")}</optgroup>
      </select></div>
  </div>
  <button type="submit" class="btn btn--primary">${ar ? "إرسال طلب الموعد" : "Send appointment request"}</button>
  <div class="form-status" aria-live="polite"></div>
  <div class="microtrust">
    <span>✓ ${ar ? "رد خلال ساعات العمل" : "Reply within working hours"}</span>
    <span>✓ ${ar ? "الفحص قبل أي التزام" : "Assessment before any commitment"}</span>
  </div>
</form>`;
}

function contactBand(lang, formId) {
  const ar = lang === "ar";
  return `<section class="section contact-band" id="contact-band"><div class="container split">
  <div>
    <span class="eyebrow">${ar ? "تواصل معنا" : "GET IN TOUCH"}</span>
    <h2>${ar ? "سيارتك تستحق جوابًا اليوم" : "Your car deserves an answer today"}</h2>
    <p class="lead">${ar
      ? "أرسل الطلب وسيتواصل فريق الورشة المناسبة للتأكيد، أو اختر القناة الأسرع لك مباشرة."
      : "Send the request and the right workshop's team contacts you to confirm — or pick the channel that suits you best."}</p>
    <ul class="ways">
      <li><strong>${ar ? "الصيانة" : "Maintenance"}</strong><a href="tel:${workshops.maintenance.phone}" data-contact="phone" data-workshop="maintenance" dir="ltr">${esc(workshops.maintenance.phoneDisplay)}</a></li>
      <li><strong>${ar ? "الدهان" : "Painting"}</strong><a href="tel:${workshops.painting.phone}" data-contact="phone" data-workshop="painting" dir="ltr">${esc(workshops.painting.phoneDisplay)}</a></li>
      <li><strong>${ar ? "واتساب" : "WhatsApp"}</strong><a data-contact="whatsapp" data-workshop="maintenance" href="#">${ar ? "ابدأ محادثة" : "Start a chat"}</a></li>
      <li><strong>${ar ? "البريد" : "Email"}</strong><a href="mailto:${business.email}">${business.email}</a></li>
    </ul>
  </div>
  ${quickForm(lang, formId)}
</div></section>`;
}

/* =============================================================================
   PAGES
   ============================================================================= */

/* ---------- Homepage ---------- */
function homePage(lang) {
  const ar = lang === "ar";
  const C = UI.common;
  const featured = ["engine-repair", "diagnostics", "suspension", "car-painting", "dent-repair", "paint-matching"].map(findService);
  const pathname = P(lang, "/");
  const title = ar
    ? "QSC Automotive — صيانة ودهان السيارات الفاخرة في الرياض"
    : "QSC Automotive — Luxury Car Maintenance, Painting & Bodywork in Riyadh";
  const desc = ar
    ? "ورشتان متخصصتان في الرياض للسيارات الفاخرة وعالية الأداء: صيانة ميكانيكية وكهربائية متخصصة، ودهان وسمكرة احترافيان. احجز عبر الهاتف أو واتساب أو النموذج."
    : "Two specialist workshops in Riyadh for luxury and performance vehicles: dedicated mechanical & electrical maintenance, and professional painting & bodywork. Book by phone, WhatsApp or form.";
  const homeFaqs = t(pageFaqs.home, lang);
  const jsonld = [{
    "@context": "https://schema.org", "@type": "AutomotiveBusiness",
    name: "QSC Automotive", url: SITE + pathname, logo: SITE + "/assets/logo/qsc-logo.jpg",
    telephone: business.mainPhone, email: business.email,
    address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
    areaServed: { "@type": "City", name: "Riyadh" }
  }, faqLd(homeFaqs)];
  const body = `
<section class="hero hero--form">
<div class="hero-slides" aria-hidden="true">
  ${IMAGES.heroSlides.map((f, i) => `<div class="hero-slide${i === 0 ? " active" : ""}"><img src="${IMG_BASE}${f}" alt=""${i === 0 ? "" : ' loading="lazy"'} decoding="async"></div>`).join("")}
</div>
<div class="container">
  <div>
    <span class="eyebrow">QSC AUTOMOTIVE · ${ar ? "الرياض" : "RIYADH"}</span>
    <h1>${ar ? "عناية دقيقة بسيارتك الاستثنائية." : "Precision Care for Exceptional Cars."}</h1>
    <p>${ar
      ? "صيانة متخصصة ودهان وسمكرة احترافيان للسيارات الفاخرة وعالية الأداء في الرياض — في ورشتين متخصصتين تحت معيار QSC واحد: الفحص قبل الإصلاح، والشرح قبل العمل، والتوثيق بعد الإنجاز."
      : "Specialized maintenance and professional painting & bodywork for luxury and performance vehicles in Riyadh — two dedicated workshops under one QSC standard: assessment before repair, explanation before work, documentation after completion."}</p>
    <div class="actions">
      <a class="btn btn--ghost-light" href="${P(lang, "/maintenance/")}">${ar ? "خدمات الصيانة" : "Maintenance Services"}</a>
      <a class="btn btn--ghost-light" href="${P(lang, "/painting-bodywork/")}">${ar ? "الدهان والسمكرة" : "Painting & Bodywork"}</a>
    </div>
    <div class="hero-badges">
      ${business.trustStats.map(s => `<div class="hero-badge"><strong>${esc(ar ? s.valueAr : s.value)}</strong><span>${esc(t(s.unit, lang))}</span></div>`).join("")}
    </div>
  </div>
  ${quickForm(lang, "hero")}
</div></section>

<section class="section"><div class="container">
  <span class="eyebrow">${ar ? "تجربتان متخصصتان" : "TWO SPECIALIZED EXPERIENCES"}</span>
  <h2>${ar ? "اختر الورشة المناسبة لسيارتك" : "Choose the right workshop for your car"}</h2>
  <p class="lead">${ar
    ? "لكل حاجة منشأتها المتخصصة وعنوانها المستقل: الصيانة الميكانيكية والفنية في ورشة الصيانة، والدهان والسمكرة في ورشة الدهان السريع. هذا الفصل ليس تفصيلًا تنظيميًا — فالغبار عدو الدهان، والدهان لا مكان له قرب أعمال الميكانيكا، وكل فريق يتقن مجاله لأنه لا يعمل في سواه."
    : "Each need has its own dedicated facility at its own location: mechanical and technical care at the maintenance workshop, and paint & body at the Fast Painting facility. That separation is not an organizational detail — dust is the enemy of paint, paint has no place near mechanical work, and each team masters its craft because it does nothing else."}</p>
  <div class="grid grid--2">
    <article class="choice">
      <div class="choice-media">${img(IMAGES.choiceMaintenance, ar ? "ورشة QSC للصيانة" : "QSC maintenance workshop", "")}</div>
      <div class="choice-body">
        <span class="choice-num">01</span>
        <span class="eyebrow">${ar ? "الصيانة" : "MAINTENANCE"}</span>
        <h3>${ar ? "الصيانة الميكانيكية والعناية الفنية" : "Maintenance & Technical Care"}</h3>
        <p class="lead" style="font-size:1rem">${ar
          ? "المحركات وناقل الحركة والكهرباء والفحص الحاسوبي والتعليق والتكييف والصيانة الدورية — 15 خدمة متخصصة بمنهج التشخيص أولًا."
          : "Engines, transmissions, electrical systems, diagnostics, suspension, AC and scheduled care — 15 specialist services, diagnosis-first."}</p>
        <div class="actions"><a class="btn btn--dark" href="${P(lang, "/maintenance/")}" data-track-workshop="maintenance">${ar ? "استكشف الصيانة" : "Explore Maintenance"}</a></div>
      </div>
    </article>
    <article class="choice">
      <div class="choice-media">${img(IMAGES.choicePainting, ar ? "ورشة QSC للدهان والسمكرة" : "QSC painting & bodywork workshop", "")}</div>
      <div class="choice-body">
        <span class="choice-num">02</span>
        <span class="eyebrow">${ar ? "الدهان والسمكرة" : "PAINTING & BODYWORK"}</span>
        <h3>${ar ? "الدهان والسمكرة / الدهان السريع" : "Painting & Bodywork / Fast Painting"}</h3>
        <p class="lead" style="font-size:1rem">${ar
          ? "الدهان الاحترافي وإصلاح الصدمات والخدوش ومطابقة الألوان وقياس الشاصي — 11 خدمة في منشأة الدهان المستقلة، وتقييم مبدئي من الصور."
          : "Professional painting, dent and scratch repair, color matching and chassis work — 11 services at the dedicated painting facility, with photo-first assessment."}</p>
        <div class="actions"><a class="btn btn--dark" href="${P(lang, "/painting-bodywork/")}" data-track-workshop="painting">${ar ? "استكشف الدهان" : "Explore Painting"}</a></div>
      </div>
    </article>
  </div>
</div></section>

<section class="section section--cloud"><div class="container">
  <div class="section-head">
    <div>
      <span class="eyebrow">${ar ? "خدمات مختارة" : "CURATED SERVICES"}</span>
      <h2>${ar ? "أكثر ما يطلبه عملاؤنا" : "What owners come to us for"}</h2>
    </div>
    <a class="more" href="${P(lang, "/maintenance/")}">${ar ? "جميع الخدمات ←" : "All services →"}</a>
  </div>
  <div class="grid grid--3">${featured.map(s => serviceCard(lang, s)).join("")}</div>
  <div class="actions">
    <a class="btn btn--dark" href="${P(lang, "/maintenance/")}">${ar ? "جميع خدمات الصيانة (15)" : "All maintenance services (15)"}</a>
    <a class="btn btn--ghost" href="${P(lang, "/painting-bodywork/")}">${ar ? "جميع خدمات الدهان (11)" : "All painting services (11)"}</a>
  </div>
</div></section>

<section class="section"><div class="container">
  <span class="eyebrow">${ar ? "ماركات السيارات" : "VEHICLE BRANDS"}</span>
  <h2>${ar ? "عناية متخصصة بعلامات السيارات الفاخرة" : "Specialist care across luxury marques"}</h2>
  <p class="lead">${t(C.independentNote, lang)}</p>
</div>
${brandMarquee(lang)}
<div class="container">
  <div class="actions" style="justify-content:center">
    <a class="btn btn--ghost" href="${P(lang, "/car-brands/")}">${ar ? "جميع الماركات (16) ←" : "All 16 brands →"}</a>
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

<section class="section section--cloud"><div class="container prose">
  <span class="eyebrow">${ar ? "لماذا الرياض تثق بـ QSC" : "WHY RIYADH TRUSTS QSC"}</span>
  <h2>${ar ? "عناية بالسيارات الفاخرة مبنية على الوضوح" : "Luxury car care built on clarity"}</h2>
  <p class="lead">${ar
    ? "تملك سيارة فاخرة في الرياض يعني مواجهة سؤالين متكررين: من يفهم هذه السيارة فعلًا؟ ومن يقول لي الحقيقة عن حالتها؟ بُنيت QSC Automotive للإجابة عن الاثنين. في ورشة الصيانة يبدأ كل شيء بالتشخيص: قراءة أنظمة السيارة والتحقق الفعلي من كل نتيجة قبل أي توصية. وفي ورشة الدهان السريع يبدأ كل شيء بالتقييم: صور الضرر تنال قراءة محترفة وخيارات واقعية قبل أن تتحرك السيارة من مكانها."
    : "Owning a luxury car in Riyadh means facing two recurring questions: who genuinely understands this car, and who will tell me the truth about its condition? QSC Automotive was built to answer both. At the maintenance workshop, everything starts with diagnosis — reading the car's systems and physically verifying every finding before any recommendation. At the Fast Painting workshop, everything starts with assessment — damage photos get a professional read and realistic options before the car moves anywhere."}</p>
  <p>${ar
    ? "النتيجة طريقة عمل يلمسها العميل في كل زيارة: نطاق مكتوب قبل العمل، وأسعار تتبع الفحص لا العكس، وتوثيق يحمي سجل سيارتك وقيمتها. ومع 16 علامة فاخرة مدعومة و26 خدمة متخصصة عبر المنشأتين، تجد سيارتك — من مرسيدس الاستخدام اليومي إلى فيراري نهاية الأسبوع — الفريق الذي يعرفها."
    : "The result is a way of working owners feel on every visit: a written scope before work, prices that follow assessment rather than precede it, and documentation that protects your car's history and value. With 16 luxury marques supported and 26 specialist services across the two facilities, your car — from a daily-driven Mercedes to a weekend Ferrari — finds the team that knows it."}</p>
</div></section>

${faqBlock(lang, homeFaqs)}
${contactBand(lang, "footer")}`;
  return page(lang, { title, desc, pathname, navCurrent: pathname, jsonld }, body,
    { pageType: "home", extraScripts: `<script src="/assets/js/booking.js" defer></script>` });
}

/* ---------- Pillar pages ---------- */
function pillarPage(lang, branch) {
  const ar = lang === "ar";
  const isPaint = branch === "painting";
  const slug = pillarSlug(branch);
  const pathname = P(lang, `/${slug}/`);
  const list = services.filter(s => s.branch === branch);
  const w = workshops[branch];
  const title = isPaint
    ? (ar ? "الدهان والسمكرة للسيارات الفاخرة في الرياض | QSC Automotive" : "Luxury Car Painting & Bodywork in Riyadh | QSC Automotive")
    : (ar ? "صيانة السيارات الفاخرة في الرياض | QSC Automotive" : "Luxury Car Maintenance in Riyadh | QSC Automotive");
  const desc = isPaint
    ? (ar ? "منشأة QSC المتخصصة للدهان والسمكرة في الرياض: دهان احترافي وإصلاح الصدمات والخدوش ومطابقة الألوان وقياس الشاصي — 11 خدمة معتمدة وتقييم بالصور." : "QSC's dedicated painting & bodywork facility in Riyadh: professional painting, dent & scratch repair, paint matching and chassis work — 11 services with photo assessment.")
    : (ar ? "ورشة QSC للصيانة في الرياض: ميكانيكا وكهرباء وفحص حاسوبي وتعليق وتكييف وصيانة دورية للسيارات الفاخرة — 15 خدمة متخصصة بمسار حجز واضح." : "QSC's maintenance workshop in Riyadh: mechanical, electrical, diagnostics, suspension, AC and scheduled care for luxury vehicles — 15 specialist services with a clear booking path.");
  const trail = [[P(lang, "/"), t(UI.common.breadcrumbHome, lang)], [null, t(isPaint ? UI.nav.painting : UI.nav.maintenance, lang)]];
  const cats = isPaint ? ["painting", "bodywork", "restoration"] : ["mechanical", "electrical", "chassis", "routine", "logistics"];
  const catSections = cats.map(cat => {
    const items = list.filter(s => s.category === cat);
    if (!items.length) return "";
    return `<h3 style="margin-top:44px">${t(UI.categories[cat], lang)}</h3>
<div class="grid grid--3" style="margin-top:18px">${items.map(s => serviceCard(lang, s)).join("")}</div>`;
  }).join("");
  const pillarFaqs = t(isPaint ? pageFaqs.painting : pageFaqs.maintenance, lang);
  const introCopy = isPaint
    ? (ar
      ? "يصل معظم عملاء الدهان وفي أذهانهم سؤال واحد: ما حجم هذا الضرر حقًا؟ بُنيت منشأة الدهان السريع للإجابة عنه بسرعة وأمانة. أرسل صور الضرر عبر واتساب أو النموذج فيرد فريق الدهان بقراءة مبدئية — تلميع أم إصلاح موضعي أم عمل على الجزء أم نطاق أشمل — ثم تُؤكَّد القراءة فعليًا عند وصول السيارة. وكل ما يلي ذلك، من تحضير السطح إلى مطابقة اللون إلى التشطيب النهائي، يجري في منشأة مكرسة للدهان وحده: غرف رش مضبوطة ومختبر ألوان ومعدات قياس شاصي بعيدًا عن غبار الأعمال الميكانيكية."
      : "Most painting customers arrive with one question in mind: how bad is this damage, really? The Fast Painting facility was built to answer that question quickly and honestly. Send photos of the damage by WhatsApp or through the form and the painting team replies with an initial read — polish, localized repair, panel work or a fuller scope — then confirms it physically when the car arrives. Everything that follows, from surface preparation to color matching to final finishing, happens in a facility dedicated to paint alone: controlled spray booths, a color lab and chassis-measurement equipment, far from the dust of mechanical work.")
    : (ar
      ? "تتعامل ورشة الصيانة مع السيارة الفاخرة كمنظومة هندسية لا كقائمة قطع. كل زيارة تبدأ بالتشخيص — قراءة أنظمة السيارة، والتحقق الفعلي من كل نتيجة، وتجربة طريق تعيد إنتاج الشكوى — وتنتهي بتقرير مكتوب ونطاق عمل لا يُنفَّذ إلا بموافقتك. خمس عشرة خدمة متخصصة تغطي الميكانيكا والكهرباء والفحص الحاسوبي والتعليق والعناية الدورية، وكلها مضبوطة على ظروف الرياض: الحرارة التي تجهد التبريد والتكييف، والغبار الذي يبلي التعليق، والزحام الذي يشيخ ناقل الحركة."
      : "The maintenance workshop treats a luxury car as an engineered system, not a parts list. Every visit begins with diagnosis — reading the car's systems, physically verifying each finding, and road-testing to reproduce the complaint — and ends with a written report and a scope of work that proceeds only on your approval. Fifteen specialist services cover mechanical, electrical, diagnostics, suspension and scheduled care, all tuned to Riyadh's conditions: the heat that strains cooling and AC, the dust that wears suspension, and the traffic that ages transmissions.");
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
  <span class="eyebrow">${isPaint ? (ar ? "ورشة الدهان والسمكرة — الدهان السريع" : "PAINTING & BODYWORK — FAST PAINTING FACILITY") : (ar ? "ورشة الصيانة" : "MAINTENANCE WORKSHOP")}</span>
  <h1>${isPaint ? (ar ? "الدهان والسمكرة بمعيار السيارة الفاخرة" : "Painting & bodywork to a luxury standard") : (ar ? "صيانة هندسية للسيارات الفاخرة" : "Engineering-led care for luxury vehicles")}</h1>
  <p>${isPaint
    ? (ar ? "من خدش موقف إلى إصلاح حادث كامل: تُقيَّم كل حالة — غالبًا من الصور أولًا — ثم تُنفَّذ في منشأة QSC المتخصصة للدهان." : "From a parking scratch to full collision repair: every case is assessed — usually from photos first — then executed at QSC's dedicated painting facility.")
    : (ar ? "التشخيص قبل الإصلاح، والشرح قبل العمل: هكذا تتعامل ورشة الصيانة مع كل سيارة، من الفحص الدوري إلى إصلاح المحركات." : "Diagnosis before repair, explanation before work: that is how the maintenance workshop treats every car, from scheduled service to engine repair.")}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container prose">
  <p class="lead">${introCopy}</p>
</div></section>
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
      ${img(isPaint ? IMAGES.pillarPainting : IMAGES.pillarMaintenance, ar ? t(w.shortName, "ar") : `${t(w.shortName, "en")} facility`)}
      <div class="actions">
        <a class="btn btn--dark" href="${P(lang, `/workshops/${w.slug}/`)}">${t(UI.common.viewWorkshop, lang)}</a>
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
${processSection(lang, true)}
${faqBlock(lang, pillarFaqs)}`;
  return page(lang, {
    title, desc, pathname, navCurrent: pathname,
    jsonld: [breadcrumbLd(trail), faqLd(pillarFaqs)]
  }, body, { pageType: "pillar" });
}

/* ---------- Service pages (expanded, ~1000 words each) ---------- */
function servicePage(lang, s) {
  const ar = lang === "ar";
  const isPaint = s.branch === "painting";
  const w = workshops[s.branch];
  const pathname = serviceUrl(lang, s);
  const pillarUrl = P(lang, `/${pillarSlug(s.branch)}/`);
  const trail = [
    [P(lang, "/"), t(UI.common.breadcrumbHome, lang)],
    [pillarUrl, t(isPaint ? UI.nav.painting : UI.nav.maintenance, lang)],
    [null, t(s.name, lang)]
  ];
  const related = (s.related || []).map(findService).filter(Boolean).slice(0, 4);
  const extra = EXTRA[s.slug] ? EXTRA[s.slug][lang] : null;
  const faqs = [...t(s.faqs, lang), ...(extra && extra.extraFaq ? [extra.extraFaq] : [])];
  const jsonld = [
    breadcrumbLd(trail),
    {
      "@context": "https://schema.org", "@type": "Service",
      name: t(s.name, "en"), serviceType: t(s.name, "en"),
      provider: { "@type": "AutomotiveBusiness", name: "QSC Automotive", telephone: w.phone },
      areaServed: { "@type": "City", name: "Riyadh" },
      url: SITE + pathname
    },
    faqLd(faqs)
  ];
  const costNote = ar
    ? "التسعير في QSC يتبع الفحص لا يسبقه: تستلم بعد التقييم نطاق العمل المقترح وتكلفته للموافقة، ولا يُنفَّذ إلا ما وافقت عليه. أما المدة فتُقدَّر بواقعية لكل عمل بعينه — ولا ننشر وعودًا معممة لا نستطيع الوفاء بها لكل حالة."
    : "Pricing at QSC follows the assessment, never precedes it: after evaluation you receive the proposed scope and its cost for approval, and only what you approve is carried out. Durations are estimated realistically per job — we publish no blanket promises we could not keep for every case.";
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
  <span class="eyebrow">${isPaint ? (ar ? "الدهان والسمكرة" : "PAINTING & BODYWORK") : (ar ? "الصيانة" : "MAINTENANCE")} · ${t(UI.categories[s.category], lang)}</span>
  <h1>${esc(t(s.name, lang))}${ar ? " في الرياض" : " in Riyadh"}</h1>
  <p>${esc(t(s.metaDesc, lang))}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container split">
  <div class="prose deep">
    <p class="lead">${esc(t(s.intro, lang))}</p>
    ${extra ? extra.detail.map(d => `<p>${esc(d)}</p>`).join("") : ""}
    ${img(IMAGES.service[s.category] || IMAGES.pageHero, t(s.name, lang))}
    <h2 style="margin-top:40px">${t(UI.common.whoNeeds, lang)}</h2>
    <hr class="rule">
    <ul style="margin-top:18px">${t(s.symptoms, lang).map(x => `<li>${esc(x)}</li>`).join("")}</ul>
    <h2 style="margin-top:40px">${t(UI.common.whatWeDo, lang)}</h2>
    <hr class="rule">
    <div class="steps">${t(s.scope, lang).map(x => `<div class="step"><p style="margin:0">${esc(x)}</p></div>`).join("")}</div>
    ${extra ? `<h2 style="margin-top:40px">${ar ? "لماذا QSC لهذه الخدمة" : "Why QSC for this service"}</h2>
    <hr class="rule">
    <ul class="checklist">${extra.why.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
    <h2 style="margin-top:40px">${ar ? "السعر والمدة — بصراحة" : "Cost and time — honestly"}</h2>
    <hr class="rule">
    <p style="margin-top:18px">${costNote}</p>
  </div>
  <aside class="panel">
    <span class="eyebrow">${t(UI.common.handledAt, lang)}</span>
    <h3>${esc(t(w.name, lang))}</h3>
    <p class="contact-line">${esc(t(w.address, lang))}</p>
    <p class="contact-line">${esc(t(w.hours, lang))}</p>
    ${ctaGroup(lang, s.branch, { service: s.slug })}
    <p class="contact-line"><a href="${P(lang, `/workshops/${w.slug}/`)}">${t(UI.common.viewWorkshop, lang)} ${ar ? "←" : "→"}</a></p>
  </aside>
</div></section>
<section class="section section--cloud section--tight"><div class="container">
  <span class="eyebrow">${ar ? "خطوات زيارتك" : "YOUR VISIT"}</span>
  <h2>${t(UI.common.processHeading, lang)}</h2>
  <div class="steps">
    ${t(UI.common.process, lang).map(([h, p2]) => `<div class="step"><div><h3>${esc(h)}</h3><p>${esc(p2)}</p></div></div>`).join("")}
  </div>
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
  const pathname = P(lang, "/car-brands/");
  const trail = [[P(lang, "/"), t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.brands, lang)]];
  const title = ar ? "ماركات السيارات التي نخدمها في الرياض | QSC Automotive" : "Luxury Car Brands We Service in Riyadh | QSC Automotive";
  const desc = ar
    ? "من مرسيدس وBMW وبورشه إلى فيراري ورولز-رويس: تعرف على خدمات QSC المستقلة لـ16 علامة فاخرة في الرياض — صيانة ودهان وسمكرة."
    : "From Mercedes-Benz, BMW and Porsche to Ferrari and Rolls-Royce: QSC's independent services for 16 luxury marques in Riyadh — maintenance, painting and bodywork.";
  const hubFaqs = t(pageFaqs.brandsHub, lang);
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
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
      <div class="brand-card-logo">${logoImg(b.slug, t(b.name, "en"))}</div>
      <h3><a href="${P(lang, `/car-brands/${b.slug}/`)}" style="color:inherit">${esc(t(b.name, lang))}</a></h3>
      <p>${esc(t(b.intro, lang).split(/(?<=[.؟!،—])\s/).slice(0, 1).join(" ")).slice(0, 170)}…</p>
      <a class="card-link" href="${P(lang, `/car-brands/${b.slug}/`)}">${t(UI.common.learnMore, lang)} ${ar ? "←" : "→"}</a>
    </article>`).join("")}
  </div>
  <div class="notice notice--muted">${t(UI.common.independentNote, lang)}</div>
  <div class="prose deep" style="margin-top:44px">
    <h2>${ar ? "لماذا نرتب الخدمة حسب الماركة؟" : "Why organize service by marque?"}</h2>
    <hr class="rule">
    <p style="margin-top:18px">${ar
      ? "لأن كل علامة تحمل شخصيتها الهندسية: تعليق مرسيدس الهوائي له أنماط أعطاله، وقيرات BMW ثنائية القابض لها احتياجات خدمتها، وهياكل رنج روفر الألمنيوم لها قواعد إصلاحها، وألوان فيراري لها حساسيات مطابقتها. صفحة الماركة تجمع لك خلاصة تعاملنا مع علامتك — الخدمات التي تطلبها سياراتها فعلًا، والورشة المسؤولة عن كل عمل، وطريق الحجز المباشر — بدل أن تبحث عنها مبعثرة."
      : "Because every marque carries its own engineering personality: Mercedes air suspension has its failure patterns, BMW dual-clutch gearboxes their service needs, Range Rover aluminium bodies their repair rules, Ferrari colors their matching sensitivities. The brand page gathers the essence of how we work with your marque — the services its cars actually ask for, the workshop responsible for each job, and the direct booking path — instead of leaving you to find it scattered."}</p>
    <p>${ar
      ? "ستلاحظ صراحة الصفحات: حيث خبرتنا عميقة نقولها، وحيث يكون الصانع هو الجواب الصحيح — كما في بعض أعمال بوغاتي وباغاني — نقول ذلك أيضًا. فالثقة التي نبنيها بالصدق في صفحة واحدة تخدمك في السيارة كلها."
      : "You will notice the pages' frankness: where our depth is real we say so, and where the manufacturer is the right answer — as for certain Bugatti and Pagani work — we say that too. The trust built by honesty on one page serves you across the whole car."}</p>
  </div>
</div></section>
${brandMarquee(lang)}
${faqBlock(lang, hubFaqs, { cloud: true })}`;
  return page(lang, { title, desc, pathname, navCurrent: pathname, jsonld: [breadcrumbLd(trail), faqLd(hubFaqs)] }, body, { pageType: "brands-hub" });
}

function brandPage(lang, b, bIndex = 0) {
  const ar = lang === "ar";
  const pathname = P(lang, `/car-brands/${b.slug}/`);
  const trail = [
    [P(lang, "/"), t(UI.common.breadcrumbHome, lang)],
    [P(lang, "/car-brands/"), t(UI.nav.brands, lang)],
    [null, t(b.name, lang)]
  ];
  const maint = b.maintenanceFocus.map(findService).filter(Boolean);
  const paint = b.paintingFocus.map(findService).filter(Boolean);
  const genericFaqs = ar
    ? [
      [`هل QSC وكيل معتمد لـ${t(b.name, "ar")}؟`, `لا — QSC ورشة متخصصة مستقلة تخدم سيارات ${t(b.name, "ar")} وفق جداول الصانع وإجراءاته، دون أي ادعاء اعتماد أو ارتباط مصنعي. اسم العلامة يصف السيارات المخدومة فقط.`],
      [`كيف أحجز خدمة لسيارتي ${t(b.name, "ar")}؟`, `اتصل أو أرسل واتساب أو استخدم نموذج الحجز مع اختيار ${t(b.name, "ar")} كماركة — يتولى فريق الورشة المناسبة (صيانة أو دهان) تأكيد الموعد معك مباشرة.`]
    ]
    : [
      [`Is QSC an authorized ${t(b.name, "en")} service center?`, `No — QSC is an independent specialist servicing ${t(b.name, "en")} vehicles to the manufacturer's schedules and procedures, with no claim of authorization or factory affiliation. The brand name describes the vehicles serviced, nothing more.`],
      [`How do I book service for my ${t(b.name, "en")}?`, `Call, send a WhatsApp message or use the booking form with ${t(b.name, "en")} selected as the make — the right workshop's team (maintenance or painting) confirms the appointment with you directly.`]
    ];
  const faqs = [...t(b.faq, lang), ...genericFaqs];
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
  <div class="brand-hero-logo">${logoImg(b.slug, t(b.name, "en"), false)}</div>
  <span class="eyebrow">${ar ? "ماركة السيارة" : "VEHICLE BRAND"}</span>
  <h1>${ar ? `خدمات ${t(b.name, "ar")} في الرياض` : `${t(b.name, "en")} services in Riyadh`}</h1>
  <p>${esc(t(b.metaDesc, lang))}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container prose deep">
  <p class="lead">${esc(t(b.intro, lang))}</p>
  ${brandsExtra[b.slug] ? `<p>${esc(brandsExtra[b.slug][lang])}</p>` : ""}
  ${img(IMAGES.brandPage[bIndex % IMAGES.brandPage.length], ar ? `أعمال ${t(b.name, "ar")} في QSC` : `${t(b.name, "en")} work at QSC`)}
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
${processSection(lang)}
${faqBlock(lang, faqs)}
<section class="section section--dark"><div class="container center">
  <h2>${ar ? `احجز خدمة لسيارتك ${t(b.name, lang)}` : `Book service for your ${t(b.name, "en")}`}</h2>
  <div class="actions" style="justify-content:center">
    <a class="btn btn--primary" href="${P(lang, "/book-appointment/")}?brand=${encodeURIComponent(t(b.name, "en"))}">${t(UI.common.bookForBrand, lang)} ${esc(t(b.name, lang))}</a>
    <a class="btn btn--ghost-light" data-contact="phone" data-workshop="maintenance" data-brand="${esc(t(b.name, "en"))}" href="tel:${workshops.maintenance.phone}">${t(UI.common.callUs, lang)} QSC</a>
  </div>
</div></section>`;
  return page(lang, {
    title: t(b.metaTitle, lang), desc: t(b.metaDesc, lang), pathname, navCurrent: P(lang, "/car-brands/"),
    jsonld: [breadcrumbLd(trail), faqLd(faqs)]
  }, body, { pageType: "brand" });
}

/* ---------- Workshops hub & detail ---------- */
function workshopsHub(lang) {
  const ar = lang === "ar";
  const pathname = P(lang, "/workshops/");
  const trail = [[P(lang, "/"), t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.workshops, lang)]];
  const title = ar ? "ورشتا QSC في الرياض — الصيانة والدهان | QSC Automotive" : "QSC's Two Workshops in Riyadh — Maintenance & Painting | QSC";
  const desc = ar
    ? "منشأتان متخصصتان بعنوانين مستقلين في الرياض: ورشة الصيانة الميكانيكية والفنية، وورشة الدهان والسمكرة (الدهان السريع). تعرف على كل موقع وطريقة الوصول والحجز."
    : "Two dedicated facilities at two separate Riyadh addresses: the mechanical & technical maintenance workshop, and the painting & bodywork (Fast Painting) workshop. Find each location, directions and booking.";
  const wsFaqs = t(pageFaqs.workshops, lang);
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
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
  <div class="prose deep" style="margin-top:44px">
    <h2>${ar ? "منطق الورشتين" : "The logic of two workshops"}</h2>
    <hr class="rule">
    <p style="margin-top:18px">${ar
      ? "حين تجمع ورشة واحدة الميكانيكا والدهان تحت سقف واحد فهي تساوم حتمًا: غبار الصنفرة والمعادن يجد طريقه إلى غرف الرش، ومساحة الدهان تزاحم رافعات الميكانيكا، والفنيون يتوزعون بين حرفتين بدل إتقان واحدة. اختارت QSC الفصل الكامل — منشأة للصيانة بخلجان تشخيصها وميكانيكاها ومحطة زواياها، ومنشأة للدهان بغرفها المضبوطة ومختبر ألوانها ومعدات شاصيها — ليعمل كل فريق في البيئة التي تتطلبها حرفته."
      : "When one workshop puts mechanics and paint under the same roof, it inevitably compromises: sanding and metal dust finds its way into spray booths, paint space competes with mechanical lifts, and technicians split between two crafts instead of mastering one. QSC chose complete separation — a maintenance facility with its diagnostic bays, mechanical zones and alignment station, and a painting facility with its controlled booths, color lab and chassis equipment — so each team works in the environment its craft demands."}</p>
    <p>${ar
      ? "وما يجمع المنشأتين أهم مما يفصلهما: معيار QSC الواحد. الفحص قبل الإصلاح، والنطاق المكتوب قبل العمل، والتوثيق بعد الإنجاز — تجدها في الخليجين على السواء. وحين تحتاج سيارتك الاثنين، كبعد حادث يتطلب سمكرة ثم فحص أنظمة، ينسق الفريقان التسليم بينهما وتبقى أنت أمام جهة واحدة مسؤولة."
      : "What unites the facilities matters more than what separates them: the single QSC standard. Assessment before repair, a written scope before work, documentation after completion — you find them in both buildings alike. And when your car needs both, as after an accident requiring body repair followed by systems checks, the two teams coordinate the handover between them and you face one accountable QSC throughout."}</p>
  </div>
</div></section>
${processSection(lang)}
${faqBlock(lang, wsFaqs)}`;
  return page(lang, { title, desc, pathname, navCurrent: pathname, jsonld: [breadcrumbLd(trail), faqLd(wsFaqs)] }, body, { pageType: "workshops-hub" });
}

function workshopPage(lang, wid) {
  const ar = lang === "ar";
  const w = workshops[wid];
  const isPaint = wid === "painting";
  const pathname = P(lang, `/workshops/${w.slug}/`);
  const trail = [
    [P(lang, "/"), t(UI.common.breadcrumbHome, lang)],
    [P(lang, "/workshops/"), t(UI.nav.workshops, lang)],
    [null, t(w.shortName, lang)]
  ];
  const list = services.filter(s => s.branch === wid).slice(0, 6);
  const title = isPaint
    ? (ar ? "ورشة QSC للدهان والسمكرة (الدهان السريع) — الرياض" : "QSC Painting & Bodywork Workshop (Fast Painting) — Riyadh")
    : (ar ? "ورشة QSC للصيانة — الرياض" : "QSC Maintenance Workshop — Riyadh");
  const desc = ar
    ? `${t(w.role, "ar")} تعرف على الموقع وطرق التواصل والحجز.`
    : `${t(w.role, "en")} Find the location, contact options and booking path.`;
  const wsFaqs = t(pageFaqs.workshops, lang);
  const jsonld = [
    breadcrumbLd(trail),
    {
      "@context": "https://schema.org", "@type": "AutomotiveBusiness",
      name: t(w.name, "en"), url: SITE + P("en", `/workshops/${w.slug}/`),
      telephone: w.phone,
      address: { "@type": "PostalAddress", streetAddress: t(w.address, "en"), addressLocality: "Riyadh", addressCountry: "SA" },
      openingHours: "Sa-Th 08:00-20:00",
      parentOrganization: { "@type": "Organization", name: "QSC Automotive" }
    },
    faqLd(wsFaqs)
  ];
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
  <span class="eyebrow">${ar ? "ملف الورشة" : "WORKSHOP PROFILE"}</span>
  <h1>${esc(t(w.name, lang))}</h1>
  <p>${esc(t(w.role, lang))}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container split">
  <div>
    ${img(isPaint ? IMAGES.choicePainting : IMAGES.choiceMaintenance, ar ? t(w.shortName, "ar") : `QSC ${t(w.shortName, "en")} workshop`)}
    <h2 style="margin-top:36px">${ar ? "ماذا يحدث هنا" : "What happens here"}</h2>
    <p class="lead">${isPaint
      ? (ar ? "هذه هي منشأة QSC الثانية، المكرسة بالكامل للدهان والسمكرة، وتعمل باسم «الدهان السريع». كل أعمال الدهان وإصلاح الهيكل ومطابقة الألوان وقياس الشاصي تُنفَّذ هنا — وتبدأ غالبًا بتقييم من الصور." : "This is QSC's second facility, wholly dedicated to paint and body and operating as the Fast Painting workshop. All painting, body repair, color matching and chassis measurement happens here — usually starting with a photo assessment.")
      : (ar ? "هذه منشأة QSC الأولى، المكرسة للصيانة الميكانيكية والكهربائية والفحص الحاسوبي والعناية الدورية. تبدأ كل زيارة بالتشخيص وتنتهي بتقرير موثق." : "This is QSC's first facility, dedicated to mechanical and electrical repair, diagnostics and scheduled care. Every visit starts with diagnosis and ends with a documented report.")}</p>
    <div class="prose deep">
    ${isPaint
      ? `<p>${ar
          ? "جولة في المنشأة تمر على محطات العمل بترتيب الرحلة نفسها التي تقطعها السيارة: منطقة الاستقبال والتقييم حيث يُفحص الضرر ويُوثق ويُتفق على النطاق؛ ثم خليج السمكرة بمعدات قياس الشاصي وأدوات إصلاح الألمنيوم والفولاذ؛ ثم مختبر الألوان حيث يُقاس لون سيارتك طيفيًا وتُرش بطاقات الاختبار؛ ثم غرف الرش المضبوطة؛ وأخيرًا منطقة التشطيب حيث تُسوى النتيجة وتُلمع وتُفحص تحت مصادر إضاءة متعددة قبل الاتصال بك."
          : "A tour of the facility follows the same journey the car takes: the reception and assessment area where damage is examined, documented and scoped; the body bay with chassis-measurement equipment and aluminium- and steel-correct repair tooling; the color lab where your car's paint is measured spectrally and test cards are sprayed; the controlled spray booths; and finally the finishing area where the result is flatted, polished and inspected under multiple light sources before you get the call."}</p>
        <p>${ar
          ? "اسم «الدهان السريع» وُلد من طريقة عمل المنشأة لا من استعجال العمل: التقييم من الصور يختصر الزيارات، والنطاق المتفق عليه مسبقًا يلغي المفاجآت، والجدولة المنظمة تعني أن سيارتك لا تنتظر في الطابور بل تدخل حين يكون فريقها ومعداتها جاهزين لها. أما مراحل التحضير والمعالجة فتأخذ وقتها كاملًا دائمًا — لأن الاختصار فيها يظهر على السطح خلال أشهر."
          : "The 'Fast Painting' name comes from how the facility is organized, not from hurried work: photo assessment cuts out exploratory visits, a pre-agreed scope eliminates surprises, and disciplined scheduling means your car does not sit in a queue but enters when its team and equipment are ready for it. Preparation and curing stages always take their full time — because shortcuts there surface, literally, within months."}</p>`
      : `<p>${ar
          ? "تنظّم المنشأة أعمالها حول أربع مناطق: خلجان التشخيص حيث تُقرأ أنظمة السيارة وتُجرى الاختبارات الموجهة؛ وخلجان الميكانيكا العامة للمحركات ونواقل الحركة والفرامل والتعليق؛ ومحطة ضبط الزوايا والهندسة؛ ومنطقة الصيانة الدورية حيث تجري الخدمات المجدولة والفحوص متعددة النقاط. لكل منطقة فنيوها ومعداتها، وتنتقل السيارة بينها وفق ما يكشفه التشخيص لا وفق افتراضات مسبقة."
          : "The facility organizes its work around four zones: diagnostic bays where the car's systems are read and guided tests performed; general mechanical bays for engines, transmissions, brakes and suspension; the wheel-alignment and geometry station; and the scheduled-maintenance area where periodic services and multi-point inspections run. Each zone has its technicians and equipment, and a car moves between them according to what diagnosis reveals, not prior assumptions."}</p>
        <p>${ar
          ? "ما يلمسه العميل من هذا التنظيم شيئان: سرعة الوصول إلى السبب، لأن السيارة تذهب مباشرة إلى الفني والمعدة المناسبين؛ وجودة التوثيق، لأن كل محطة تسجل ما وجدته وما فعلته. وفي نهاية الزيارة يتجمع ذلك كله في تقرير واحد مفهوم: ما فُحص، وما وُجد، وما نُفذ، وما يستحق المراقبة مستقبلًا — وهو التقرير الذي يبني مع الوقت سجل سيارتك لدى QSC."
          : "What customers feel from this organization is two things: speed to the cause, because the car goes straight to the right technician and equipment; and quality of documentation, because every station records what it found and did. At the end of the visit it all converges into one readable report: what was checked, what was found, what was done, and what deserves watching — the report that, over time, builds your car's file at QSC."}</p>`}
    </div>
    <h2 style="margin-top:36px">${ar ? "أبرز الخدمات" : "Key services"}</h2>
    <div class="grid grid--3" style="margin-top:18px">${list.map(s => serviceCard(lang, s)).join("")}</div>
    <div class="actions"><a class="btn btn--dark" href="${P(lang, `/${pillarSlug(wid)}/`)}">${ar ? "جميع خدمات هذه الورشة" : "All services at this workshop"}</a></div>
  </div>
  <aside class="panel">
    <h3>${ar ? "الموقع والتواصل" : "Location & contact"}</h3>
    <ul class="workshop-meta">
      <li><span class="k">${ar ? "العنوان" : "Address"}</span><span>${esc(t(w.address, lang))}</span></li>
      <li><span class="k">${ar ? "الهاتف" : "Phone"}</span><span><a href="tel:${w.phone}" data-contact="phone" data-workshop="${wid}" dir="ltr">${esc(w.phoneDisplay)}</a></span></li>
      <li><span class="k">${ar ? "الدوام" : "Hours"}</span><span>${esc(t(w.hours, lang))}</span></li>
    </ul>
    ${ctaGroup(lang, wid)}
    <a class="btn btn--ghost" data-contact="map" data-workshop="${wid}" href="#">${t(UI.common.getDirections, lang)}</a>
  </aside>
</div></section>
${statsStrip(lang)}
${faqBlock(lang, wsFaqs)}`;
  return page(lang, { title, desc, pathname, navCurrent: P(lang, "/workshops/"), jsonld }, body, { pageType: "workshop" });
}

/* ---------- Service areas ---------- */
function serviceAreasHub(lang) {
  const ar = lang === "ar";
  const pathname = P(lang, "/service-areas/");
  const trail = [[P(lang, "/"), t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.serviceAreas, lang)]];
  const title = ar ? "مناطق الخدمة | QSC Automotive" : "Service Areas | QSC Automotive";
  const desc = ar
    ? "تخدم QSC عملاءها من منشأتيها في الرياض. تعرف على نطاق الخدمة وإمكانية استلام السيارة من خارج المدينة — بتأكيد فردي لكل حالة."
    : "QSC serves customers from its two Riyadh facilities. See the service area and how vehicle pickup from outside the city works — confirmed individually per case.";
  const saFaqs = t(pageFaqs.serviceAreas, lang);
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
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
      <h3><a href="${P(lang, "/service-areas/riyadh/")}" style="color:inherit">${ar ? "الرياض" : "Riyadh"}</a></h3>
      <p>${ar ? "ورشتا الصيانة والدهان كلتاهما في الرياض — زيارات مباشرة وحجز بالهاتف أو واتساب أو النموذج." : "Both the maintenance and painting workshops are in Riyadh — walk-in by appointment, booked by phone, WhatsApp or form."}</p>
      <a class="card-link" href="${P(lang, "/service-areas/riyadh/")}">${t(UI.common.learnMore, lang)} ${ar ? "←" : "→"}</a>
    </article>
    <article class="card">
      <span class="card-tag">${ar ? "خارج الرياض" : "OUTSIDE RIYADH"}</span>
      <h3>${ar ? "استفسار الاستلام والتسليم" : "Pickup & delivery inquiry"}</h3>
      <p>${ar ? "إن كنت خارج الرياض فاستفسر عن إمكانية استلام سيارتك — يؤكد الفريق التوفر والترتيبات لحالتك قبل أي التزام." : "If you are outside Riyadh, ask about vehicle collection — the team confirms availability and arrangements for your case before any commitment."}</p>
      <a class="card-link" href="${P(lang, "/maintenance/pickup-delivery/")}">${t(UI.common.learnMore, lang)} ${ar ? "←" : "→"}</a>
    </article>
  </div>
  <div class="prose deep" style="margin-top:44px">
    <h2>${ar ? "كيف تعمل التغطية فعليًا" : "How coverage actually works"}</h2>
    <hr class="rule">
    <p style="margin-top:18px">${ar
      ? "داخل الرياض، الخدمة مباشرة: تحجز موعدًا وتحضر سيارتك إلى الورشة المناسبة — الصيانة لعملها والدهان لعمله — أو تطلب استلامها من موقعك حين يصعب الحضور. يصل عملاؤنا من أنحاء المدينة كلها: من شمالها وجنوبها وشرقها وغربها، ومن ضواحيها القريبة، لأن السيارة الفاخرة تستحق قطع مسافة إضافية إلى فريق يعرفها."
      : "Inside Riyadh, service is direct: you book an appointment and bring the car to the right workshop — maintenance for its work, painting for its own — or request collection from your location when coming in is difficult. Our customers arrive from every part of the city, north to south and east to west, and from its near suburbs, because a luxury car justifies the extra kilometres to a team that knows it."}</p>
    <p>${ar
      ? "خارج الرياض، الصدق أولًا: لا ندّعي فروعًا في مدن أخرى ولا ننشر وعود استلام معممة. ما نقدمه هو مسار استفسار واضح — تخبرنا بموقع السيارة وحالتها والخدمة المطلوبة، فيؤكد الفريق إمكانية الترتيب وكلفته قبل أي التزام. كثير من عملائنا في المدن المجاورة يرتبون نقل سياراتهم إلينا لأعمال الدهان والترميم الكبيرة خاصة، حيث يستحق مستوى التنفيذ رحلة السطحة."
      : "Outside Riyadh, honesty first: we claim no branches in other cities and publish no blanket pickup promises. What we offer is a clear inquiry path — you tell us the car's location, condition and the service needed, and the team confirms what can be arranged and at what cost before any commitment. Many customers in nearby cities arrange transport to us especially for major paint and restoration work, where the standard of execution justifies the flatbed journey."}</p>
  </div>
</div></section>
${faqBlock(lang, saFaqs, { cloud: true })}`;
  return page(lang, { title, desc, pathname, navCurrent: pathname, jsonld: [breadcrumbLd(trail), faqLd(saFaqs)] }, body, { pageType: "service-areas" });
}

function riyadhPage(lang) {
  const ar = lang === "ar";
  const pathname = P(lang, "/service-areas/riyadh/");
  const trail = [
    [P(lang, "/"), t(UI.common.breadcrumbHome, lang)],
    [P(lang, "/service-areas/"), t(UI.nav.serviceAreas, lang)],
    [null, ar ? "الرياض" : "Riyadh"]
  ];
  const title = ar ? "صيانة ودهان السيارات الفاخرة في الرياض | QSC Automotive" : "Luxury Car Service in Riyadh | QSC Automotive";
  const desc = ar
    ? "QSC في الرياض: ورشة صيانة متخصصة وورشة دهان وسمكرة مستقلة للسيارات الفاخرة. 26 خدمة و16 علامة مدعومة وحجز بثلاث قنوات."
    : "QSC in Riyadh: a dedicated maintenance workshop and a separate painting & bodywork facility for luxury vehicles. 26 services, 16 supported marques, three booking channels.";
  const saFaqs = t(pageFaqs.serviceAreas, lang);
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
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
  <div class="prose deep" style="margin-top:44px">
    <h2>${ar ? "سيارة فاخرة في الرياض — ماذا يعني ذلك عمليًا" : "A luxury car in Riyadh — what that means in practice"}</h2>
    <hr class="rule">
    <p style="margin-top:18px">${ar
      ? "مناخ الرياض يعيد ترتيب أولويات الصيانة: التكييف والتبريد يتصدران قائمة الصيف، والبطاريات تهرم أسرع مما تتوقع جداول الصانع الأوروبية، والتعليق الهوائي يواجه مزيج الحرارة والغبار الذي يختبر موانعه يوميًا. وتضيف طرق المدينة نصيبها — مطبات تفاجئ الجنوط المنخفضة، ومواقف ضيقة تترك بصماتها على الأبواب والصدامات. خدمات QSC الست والعشرون مبنية حول هذه الحقائق بالذات."
      : "Riyadh's climate reorders maintenance priorities: AC and cooling top the summer list, batteries age faster than European service schedules expect, and air suspension faces the heat-and-dust combination that tests its seals daily. The city's roads add their share — speed bumps that surprise low-profile wheels, tight parking that leaves its marks on doors and bumpers. QSC's twenty-six services are built around exactly these realities."}</p>
    <p>${ar
      ? "ولأن المدينة كبيرة، صُمم الوصول إلينا ليكون سهلًا من أي حي: حجز مسبق يلغي الانتظار، وتقييم بالصور يغنيك عن زيارة استكشافية، واستلام للسيارة من موقعك حين يصعب الحضور. أيًا كان حيّك — من العليا إلى النرجس ومن الياسمين إلى الملقا — فالمسافة إلى عناية تستحقها سيارتك أقصر مما تظن."
      : "And because the city is large, reaching us is designed to be easy from any district: advance booking eliminates waiting, photo assessment saves you an exploratory visit, and vehicle collection from your location covers the days you cannot come in. Whatever your district — Olaya to Al Narjis, Al Yasmin to Al Malqa — the distance to care your car deserves is shorter than you think."}</p>
  </div>
</div></section>
${statsStrip(lang)}
${faqBlock(lang, saFaqs)}`;
  return page(lang, { title, desc, pathname, navCurrent: P(lang, "/service-areas/"), jsonld: [breadcrumbLd(trail), faqLd(saFaqs)] }, body, { pageType: "service-area" });
}

/* ---------- About ---------- */
function aboutPage(lang) {
  const ar = lang === "ar";
  const pathname = P(lang, "/about/");
  const trail = [[P(lang, "/"), t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.about, lang)]];
  const title = ar ? "عن QSC Automotive — من نحن" : "About QSC Automotive";
  const desc = ar
    ? "QSC Automotive: شركة سعودية متخصصة بالعناية بالسيارات الفاخرة في الرياض عبر منشأتين — صيانة متخصصة ودهان وسمكرة. تعرف على نهجنا وأرقامنا."
    : "QSC Automotive: a Saudi specialist in luxury-vehicle care operating two Riyadh facilities — dedicated maintenance, and painting & bodywork. Our approach, in plain terms.";
  const aboutFaqs = t(pageFaqs.about, lang);
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
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
  ${img(IMAGES.about, ar ? "منشآت QSC" : "QSC facilities")}
  <p>${ar
    ? "تمتد منشآت QSC على 4,500 متر مربع ويعمل فيها 400 فني متخصص يخدمون نحو 50 مركبة يوميًا — أرقام على مستوى الشركة نعرضها كما نشرتها QSC. لكن الرقم الذي نقيس به أنفسنا فعلًا مختلف: كم عميلًا غادر وهو يفهم بالضبط ما حدث لسيارته ولماذا. فالسيارة الفاخرة استثمار وعلاقة معًا، والورشة التي تستحقها هي التي تعاملها كذلك — بقطع مطابقة للمواصفات، وقرارات مبنية على القياس لا التخمين، وفاتورة تحكي قصة العمل كاملة."
    : "QSC's facilities span 4,500 square metres, staffed by 400 expert technicians serving around 50 vehicles daily — company-wide figures, shown as QSC publishes them. But the number we actually measure ourselves by is different: how many customers leave understanding exactly what happened to their car and why. A luxury vehicle is an investment and a relationship at once, and the workshop it deserves treats it as both — with specification-matched parts, decisions built on measurement rather than guesswork, and an invoice that tells the complete story of the work."}</p>
  <h2 style="margin-top:40px">${ar ? "ما نلتزم به في كل زيارة" : "What we commit to on every visit"}</h2>
  <hr class="rule">
  <ul class="checklist" style="margin-top:22px">
    ${(ar
      ? ["تشخيص موثق قبل أي توصية — لا قطع تُستبدل على الظن", "نطاق عمل مكتوب وسعر يُعتمد منك قبل البدء", "قطع مطابقة لمواصفات الصانع مع شفافية كاملة في المصدر", "تجربة طريق أو فحص تحقق بعد كل إصلاح", "تقرير حالة يحفظ تاريخ سيارتك ويحمي قيمتها"]
      : ["Documented diagnosis before any recommendation — no parts replaced on suspicion", "A written scope and price you approve before work begins", "Manufacturer-specification parts with full transparency on sourcing", "A road test or verification check after every repair", "A condition report that preserves your car's history and protects its value"]
    ).map(x => `<li>${esc(x)}</li>`).join("")}
  </ul>
  <h2 style="margin-top:40px">${ar ? "لماذا منشأتان منفصلتان؟" : "Why two separate facilities?"}</h2>
  <hr class="rule">
  <p style="margin-top:18px">${ar
    ? "لأن الجودة تبدأ من البيئة. غرف الدهان تحتاج هواء مرشحًا ورطوبة مضبوطة وعزلًا تامًا عن غبار الصنفرة والمعادن؛ وأعمال الميكانيكا تحتاج رافعات ومعدات قياس ومساحة حركة لا تتوافق مع متطلبات الرش. الورش التي تجمع الاثنين تحت سقف واحد تساوم على أحدهما حتمًا — غالبًا على الدهان. اختارت QSC الطريق الأصعب والأصح: منشأة لكل حرفة، وفريق لكل منشأة، ومعيار واحد يحكم الاثنتين."
    : "Because quality starts with environment. Paint booths need filtered air, controlled humidity and complete isolation from sanding and metal dust; mechanical work needs lifts, measurement equipment and movement space incompatible with spray operations. Workshops that combine both under one roof inevitably compromise one — usually the paint. QSC chose the harder, correct path: a facility per craft, a team per facility, and one standard governing both."}</p>
</div></section>
${statsStrip(lang)}
${processSection(lang)}
${faqBlock(lang, aboutFaqs)}
<section class="section"><div class="container center">
  <h2>${ar ? "تعرّف على الورشتين" : "Meet the two workshops"}</h2>
  <div class="actions" style="justify-content:center">
    <a class="btn btn--dark" href="${P(lang, "/workshops/maintenance/")}">${t(workshops.maintenance.shortName, lang)}</a>
    <a class="btn btn--dark" href="${P(lang, "/workshops/painting-bodywork/")}">${t(workshops.painting.shortName, lang)}</a>
    <a class="btn btn--primary" href="${P(lang, "/book-appointment/")}">${t(UI.nav.book, lang)}</a>
  </div>
</div></section>`;
  return page(lang, { title, desc, pathname, navCurrent: pathname, jsonld: [breadcrumbLd(trail), faqLd(aboutFaqs)] }, body, { pageType: "about" });
}

/* ---------- Contact ---------- */
function contactPage(lang) {
  const ar = lang === "ar";
  const pathname = P(lang, "/contact/");
  const trail = [[P(lang, "/"), t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.contact, lang)]];
  const title = ar ? "اتصل بـ QSC Automotive — الرياض" : "Contact QSC Automotive — Riyadh";
  const desc = ar
    ? "تواصل مع QSC في الرياض: هاتف وواتساب وبريد وورشتان — الصيانة والدهان والسمكرة. اختر الورشة الصحيحة لحاجتك واحجز موعدك."
    : "Reach QSC in Riyadh: phone, WhatsApp, email and two workshops — maintenance, and painting & bodywork. Choose the right workshop for your need and book.";
  const cFaqs = t(pageFaqs.contact, lang);
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
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
    <h2 style="margin-top:44px">${ar ? "كيف تختار القناة الأسرع؟" : "Which channel is fastest for what?"}</h2>
    <div class="prose deep">
      <p>${ar
        ? "للمواعيد والاستفسارات العاجلة، الهاتف هو الأسرع: تصل مباشرة إلى فريق الورشة أثناء ساعات العمل ويُحجز موعدك في المكالمة نفسها. أما واتساب فهو القناة المثالية لأي شيء يحتاج صورًا — خدش، صدمة، تسريب، لمبة تحذير على الشاشة — إذ يستطيع الفريق تقييم ما يراه والرد بخطوة تالية واضحة دون زيارة."
        : "For appointments and urgent questions, the phone is quickest: you reach the workshop team directly during working hours and your appointment is booked in the same call. WhatsApp is the ideal channel for anything that needs photos — a scratch, a dent, a leak, a warning light on the display — because the team can assess what it sees and reply with a clear next step, no visit required."}</p>
      <p>${ar
        ? "نموذج الحجز هو الأفضل عندما تريد تنظيم التفاصيل كلها في طلب واحد: السيارة والخدمة والوصف والصور والتاريخ المفضل. وأيًا كانت القناة التي تبدأ بها، ينتهي طلبك عند الفريق نفسه — فريق الورشة المسؤولة عن نوع العمل الذي تحتاجه سيارتك — ويُرد عليك خلال ساعات العمل."
        : "The booking form is best when you want everything organized in one request: the car, the service, a description, photos and your preferred date. Whichever channel you start with, your request ends up with the same people — the team of the workshop responsible for the kind of work your car needs — and you hear back within working hours."}</p>
    </div>
  </div>
  <aside class="panel">
    <h3>${ar ? "قنوات التواصل" : "Direct channels"}</h3>
    <ul class="workshop-meta">
      <li><span class="k">${t(workshops.maintenance.shortName, lang)}</span><span><a href="tel:${workshops.maintenance.phone}" data-contact="phone" data-workshop="maintenance" dir="ltr">${esc(workshops.maintenance.phoneDisplay)}</a></span></li>
      <li><span class="k">${t(workshops.painting.shortName, lang)}</span><span><a href="tel:${workshops.painting.phone}" data-contact="phone" data-workshop="painting" dir="ltr">${esc(workshops.painting.phoneDisplay)}</a></span></li>
      <li><span class="k">${ar ? "البريد" : "Email"}</span><span><a href="mailto:${business.email}">${business.email}</a></span></li>
      <li><span class="k">${ar ? "الدوام" : "Hours"}</span><span>${esc(t(workshops.maintenance.hours, lang))}</span></li>
    </ul>
    <a class="btn btn--primary" href="${P(lang, "/book-appointment/")}">${t(UI.nav.book, lang)}</a>
    <a class="btn btn--ghost" data-contact="whatsapp" data-workshop="maintenance" href="#">${t(UI.common.whatsapp, lang)} — ${t(workshops.maintenance.shortName, lang)}</a>
    <a class="btn btn--ghost" data-contact="whatsapp" data-workshop="painting" href="#">${t(UI.common.whatsapp, lang)} — ${t(workshops.painting.shortName, lang)}</a>
  </aside>
</div></section>
${faqBlock(lang, cFaqs, { cloud: true })}
${contactBand(lang, "contact")}`;
  return page(lang, { title, desc, pathname, navCurrent: pathname, jsonld: [breadcrumbLd(trail), faqLd(cFaqs)] }, body,
    { pageType: "contact", extraScripts: `<script src="/assets/js/booking.js" defer></script>` });
}

/* ---------- Booking ---------- */
function bookingPage(lang) {
  const ar = lang === "ar";
  const pathname = P(lang, "/book-appointment/");
  const trail = [[P(lang, "/"), t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.book, lang)]];
  const title = ar ? "احجز موعدًا — QSC Automotive الرياض" : "Book an Appointment — QSC Automotive Riyadh";
  const desc = ar
    ? "اطلب موعدًا في ورشة QSC المناسبة: اختر الورشة والخدمة وسيارتك، أو تواصل مباشرة بالهاتف أو واتساب."
    : "Request an appointment at the right QSC workshop: choose the workshop, service and your vehicle, or reach the team directly by phone or WhatsApp.";
  const bFaqs = t(pageFaqs.booking, lang);
  const svcOptions = (branch) => services.filter(s => s.branch === branch)
    .map(s => `<option value="${s.slug}">${esc(t(s.name, lang))}</option>`).join("");
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
  <span class="eyebrow">${ar ? "طلب موعد" : "APPOINTMENT REQUEST"}</span>
  <h1>${ar ? "احجز موعدًا في الورشة" : "Request a workshop appointment"}</h1>
  <p>${ar
    ? "هذا طلب موعد وليس حجزًا مؤكدًا: يراجع الفريق التفاصيل ويتواصل معك للتأكيد. وللتواصل الفوري استخدم الهاتف."
    : "This is an appointment request, not a confirmed reservation: the team reviews your details and contacts you to confirm. For immediate contact, call."}</p>
</div></section>
${breadcrumbs(lang, trail)}
<section class="section section--tight"><div class="container split">
  <div>
    <form class="qsc-form" data-form="full" novalidate>
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
          : "I agree to be contacted by QSC about this request and to my details being handled per the privacy policy."} <a href="${P(lang, "/privacy-policy/")}">${t(UI.nav.privacy, lang)}</a></span>
      </label>
      <span class="error-msg"></span>
      <div class="actions">
        <button type="submit" class="btn btn--primary">${ar ? "إرسال طلب الموعد" : "Send appointment request"}</button>
      </div>
      <div class="form-status" aria-live="polite"></div>
    </form>
    <h2 style="margin-top:48px">${ar ? "ماذا تجهّز قبل الطلب؟" : "What to have ready before you book"}</h2>
    <div class="prose deep">
      <p>${ar
        ? "كلما كان طلبك أدق كان الموعد أنفع. للصيانة: صف العرض بثلاثة عناصر — متى يحدث (تشغيل بارد، سرعة معينة، انعطاف)، وماذا تلاحظ (صوت، اهتزاز، رائحة، رسالة على الشاشة)، ومتى بدأ. وإن استطعت تسجيل مقطع قصير للصوت فهو يختصر على الفني نصف الطريق. وللدهان والسمكرة: صور واضحة في ضوء النهار — الجزء كاملًا من مسافة خطوة، والضرر مواجهة وبزاوية — تكفي لتقييم مبدئي قبل أي زيارة."
        : "The more precise your request, the more useful the appointment. For maintenance: describe the symptom in three parts — when it happens (cold start, a certain speed, turning), what you notice (sound, vibration, smell, a message on the display), and when it started. A short video of the noise saves the technician half the journey. For painting & bodywork: clear daylight photos — the whole panel from a step back, the damage straight-on and at an angle — are enough for an initial assessment before any visit."}</p>
      <p>${ar
        ? "أضف رقم الهيكل (VIN) إن تيسر — تجده أسفل الزجاج الأمامي أو في استمارة السيارة — فهو يتيح للورشة تجهيز القطع والإجراءات الصحيحة لطرازك بالضبط قبل وصولك. وتذكّر أن الطلب ليس التزامًا: الفحص أولًا، ثم النطاق والسعر لموافقتك، ثم العمل."
        : "Add the VIN if convenient — found at the base of the windscreen or in the registration card — as it lets the workshop prepare the exact parts and procedures for your specific model before you arrive. And remember the request commits you to nothing: assessment first, then scope and price for your approval, then the work."}</p>
    </div>
  </div>
  <aside class="panel">
    <h3>${ar ? "تفضل التواصل المباشر؟" : "Prefer to talk directly?"}</h3>
    <p class="contact-line">${ar ? "الهاتف وواتساب يصلانك بالفريق مباشرة أثناء ساعات العمل." : "Phone and WhatsApp reach the team directly during working hours."}</p>
    <a class="btn btn--dark" data-contact="phone" data-workshop="maintenance" href="tel:${workshops.maintenance.phone}">${t(UI.common.callUs, lang)} — ${t(workshops.maintenance.shortName, lang)}</a>
    <a class="btn btn--dark" data-contact="phone" data-workshop="painting" href="tel:${workshops.painting.phone}">${t(UI.common.callUs, lang)} — ${t(workshops.painting.shortName, lang)}</a>
    <a class="btn btn--ghost" data-contact="whatsapp" data-workshop="maintenance" href="#">${t(UI.common.whatsapp, lang)} — ${t(workshops.maintenance.shortName, lang)}</a>
    <a class="btn btn--ghost" data-contact="whatsapp" data-workshop="painting" href="#">${t(UI.common.whatsapp, lang)} — ${t(workshops.painting.shortName, lang)}</a>
    <h3 style="margin-top:28px">${ar ? "ماذا بعد الإرسال؟" : "What happens next?"}</h3>
    <div class="steps">
      ${t(UI.common.process, lang).map(([h]) => `<div class="step"><p style="margin:0">${esc(h)}</p></div>`).join("")}
    </div>
  </aside>
</div></section>
${faqBlock(lang, bFaqs, { cloud: true })}`;
  return page(lang, { title, desc, pathname, navCurrent: pathname, jsonld: [breadcrumbLd(trail), faqLd(bFaqs)] }, body,
    { pageType: "booking", extraScripts: `<script src="/assets/js/booking.js" defer></script>` });
}

/* ---------- Guides & Projects hubs ---------- */
function guidesHub(lang) {
  const ar = lang === "ar";
  const pathname = P(lang, "/guides/");
  const trail = [[P(lang, "/"), t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.guides, lang)]];
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
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
  const pathname = P(lang, "/projects/");
  const trail = [[P(lang, "/"), t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.projects, lang)]];
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
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
    ${[1, 2, 3].map(() => `<div class="card">${ph(ar ? "مشروع قيد التوثيق" : "PROJECT PENDING — REAL BEFORE/AFTER", "ph--light")}<p style="margin-top:14px">${ar ? "يُنشر بعد اكتمال التوثيق والموافقة." : "Published once documentation and consent are complete."}</p></div>`).join("")}
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
  const pathname = P(lang, "/privacy-policy/");
  const trail = [[P(lang, "/"), t(UI.common.breadcrumbHome, lang)], [null, t(UI.nav.privacy, lang)]];
  const body = `
<section class="page-hero">${pageHeroBg()}<div class="container">
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
      <a class="gateway-choice" href="/"><strong>English</strong><span>Go to homepage</span></a>
      <a class="gateway-choice" href="/ar/" lang="ar" dir="rtl"><strong>العربية</strong><span>الصفحة الرئيسية</span></a>
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
writePage("/404.html", notFoundPage());

const indexable = [];
for (const lang of LANGS) {
  writePage(P(lang, "/"), homePage(lang)); indexable.push(P(lang, "/"));
  for (const branch of ["maintenance", "painting"]) {
    writePage(P(lang, `/${pillarSlug(branch)}/`), pillarPage(lang, branch));
    indexable.push(P(lang, `/${pillarSlug(branch)}/`));
  }
  for (const s of services) {
    writePage(serviceUrl(lang, s), servicePage(lang, s));
    indexable.push(serviceUrl(lang, s));
  }
  writePage(P(lang, "/car-brands/"), brandsHub(lang)); indexable.push(P(lang, "/car-brands/"));
  for (const [bi, b] of brands.entries()) {
    writePage(P(lang, `/car-brands/${b.slug}/`), brandPage(lang, b, bi));
    indexable.push(P(lang, `/car-brands/${b.slug}/`));
  }
  writePage(P(lang, "/workshops/"), workshopsHub(lang)); indexable.push(P(lang, "/workshops/"));
  writePage(P(lang, "/workshops/maintenance/"), workshopPage(lang, "maintenance")); indexable.push(P(lang, "/workshops/maintenance/"));
  writePage(P(lang, "/workshops/painting-bodywork/"), workshopPage(lang, "painting")); indexable.push(P(lang, "/workshops/painting-bodywork/"));
  writePage(P(lang, "/service-areas/"), serviceAreasHub(lang)); indexable.push(P(lang, "/service-areas/"));
  writePage(P(lang, "/service-areas/riyadh/"), riyadhPage(lang)); indexable.push(P(lang, "/service-areas/riyadh/"));
  writePage(P(lang, "/about/"), aboutPage(lang)); indexable.push(P(lang, "/about/"));
  writePage(P(lang, "/contact/"), contactPage(lang)); indexable.push(P(lang, "/contact/"));
  writePage(P(lang, "/book-appointment/"), bookingPage(lang)); indexable.push(P(lang, "/book-appointment/"));
  writePage(P(lang, "/guides/"), guidesHub(lang));
  writePage(P(lang, "/projects/"), projectsHub(lang));
  writePage(P(lang, "/privacy-policy/"), privacyPage(lang));
}

/* sitemap.xml */
const today = new Date().toISOString().slice(0, 10);
const enPages = indexable.filter(p => !p.startsWith("/ar"));
const smUrl = (p) => {
  const arP = "/ar" + p;
  return `  <url>
    <loc>${SITE}${p}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${p}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE}${arP}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${p}"/>
  </url>
  <url>
    <loc>${SITE}${arP}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${p}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE}${arP}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${p}"/>
  </url>`;
};
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${enPages.map(smUrl).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);

fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

console.log(`Built ${written.length} HTML documents + sitemap.xml + robots.txt into dist/`);
console.log(`Indexable pages in sitemap: ${enPages.length * 2}`);
