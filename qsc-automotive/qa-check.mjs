#!/usr/bin/env node
/* QSC QA: validates every internal link, asset reference, hreflang pair,
   canonical, sitemap entry and bilingual parity in dist/. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), "dist");

const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) pages.push(p);
  }
})(DIST);

const exists = (url) => {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean.startsWith("/")) return true; // external or tel/mailto
  const f = clean.endsWith("/") ? path.join(DIST, clean, "index.html") : path.join(DIST, clean);
  return fs.existsSync(f);
};

let errors = 0, links = 0, assets = 0;
const report = [];
for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const rel = "/" + path.relative(DIST, file).replace(/\\/g, "/");
  // internal hrefs
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    links++;
    if (!exists(m[1])) { errors++; report.push(`BROKEN LINK ${m[1]} in ${rel}`); }
  }
  // asset src
  for (const m of html.matchAll(/src="(\/[^"]*)"/g)) {
    assets++;
    if (!fs.existsSync(path.join(DIST, m[1]))) { errors++; report.push(`MISSING ASSET ${m[1]} in ${rel}`); }
  }
  // lang/dir sanity
  if (rel.startsWith("/ar/") && !html.includes('<html lang="ar" dir="rtl">')) { errors++; report.push(`RTL MISSING in ${rel}`); }
  if (rel.startsWith("/en/") && !html.includes('<html lang="en" dir="ltr">')) { errors++; report.push(`LTR MISSING in ${rel}`); }
  // canonical self-reference
  const canon = html.match(/rel="canonical" href="https:\/\/qscco\.sa([^"]*)"/);
  if ((rel.startsWith("/en/") || rel.startsWith("/ar/"))) {
    const expected = rel.replace(/index\.html$/, "");
    if (!canon || canon[1] !== expected) { errors++; report.push(`CANONICAL MISMATCH in ${rel}: ${canon && canon[1]}`); }
    // hreflang reciprocal
    const other = expected.startsWith("/en/") ? expected.replace("/en/", "/ar/") : expected.replace("/ar/", "/en/");
    if (!html.includes(`href="https://qscco.sa${other}"`)) { errors++; report.push(`HREFLANG ALT MISSING in ${rel}`); }
    if (!exists(other)) { errors++; report.push(`LANGUAGE PAIR MISSING for ${rel}`); }
    // unique title/desc presence
    if (!/<title>[^<]{10,}<\/title>/.test(html)) { errors++; report.push(`TITLE MISSING in ${rel}`); }
    if (!/<meta name="description" content="[^"]{30,}"/.test(html)) { errors++; report.push(`DESC MISSING in ${rel}`); }
  }
}

// title uniqueness per language
for (const lang of ["en", "ar"]) {
  const titles = {};
  for (const file of pages) {
    const rel = "/" + path.relative(DIST, file).replace(/\\/g, "/");
    if (!rel.startsWith(`/${lang}/`)) continue;
    const tMatch = fs.readFileSync(file, "utf8").match(/<title>([^<]+)<\/title>/);
    const title = tMatch && tMatch[1];
    if (titles[title]) { errors++; report.push(`DUPLICATE TITLE "${title}" in ${rel} and ${titles[title]}`); }
    titles[title] = rel;
  }
}

// sitemap entries must exist and be indexable
const sm = fs.readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
let smCount = 0;
for (const m of sm.matchAll(/<loc>https:\/\/qscco\.sa([^<]*)<\/loc>/g)) {
  smCount++;
  if (!exists(m[1])) { errors++; report.push(`SITEMAP 404: ${m[1]}`); }
  const f = m[1] === "/" ? path.join(DIST, "index.html") : path.join(DIST, m[1], "index.html");
  if (fs.existsSync(f) && fs.readFileSync(f, "utf8").includes("noindex")) {
    errors++; report.push(`SITEMAP CONTAINS NOINDEX PAGE: ${m[1]}`);
  }
}

// noindex pages must NOT be in sitemap (guides/projects/privacy/404)
for (const p of ["/en/guides/", "/ar/guides/", "/en/projects/", "/ar/projects/", "/en/privacy-policy/", "/ar/privacy-policy/"]) {
  if (sm.includes(`<loc>https://qscco.sa${p}</loc>`)) { errors++; report.push(`NOINDEX PAGE IN SITEMAP: ${p}`); }
}

console.log(`Pages checked: ${pages.length}`);
console.log(`Internal links verified: ${links}, asset refs verified: ${assets}`);
console.log(`Sitemap URLs verified: ${smCount}`);
console.log(errors ? `FAILURES: ${errors}` : "ALL CHECKS PASSED");
report.slice(0, 60).forEach(r => console.log("  - " + r));
process.exit(errors ? 1 : 0);
