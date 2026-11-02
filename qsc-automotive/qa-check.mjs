#!/usr/bin/env node
/* QSC QA v2: validates every internal link, asset ref, hreflang pair, canonical,
   sitemap entry, bilingual parity and per-page word counts in dist/.
   Structure: English at root (/), Arabic under /ar/. */
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
  if (!clean.startsWith("/")) return true;
  const f = clean.endsWith("/") ? path.join(DIST, clean, "index.html") : path.join(DIST, clean);
  return fs.existsSync(f);
};
const isAr = (rel) => rel === "/ar/index.html" || rel.startsWith("/ar/");
const routeOf = (rel) => rel.replace(/index\.html$/, "");
const twinOf = (route) => route.startsWith("/ar/") ? (route.replace(/^\/ar/, "") || "/") : "/ar" + route;

let errors = 0, links = 0, assets = 0;
const report = [];
const wordCounts = [];
for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const rel = "/" + path.relative(DIST, file).replace(/\\/g, "/");
  if (rel === "/404.html") continue;
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    links++;
    if (!exists(m[1])) { errors++; report.push(`BROKEN LINK ${m[1]} in ${rel}`); }
  }
  for (const m of html.matchAll(/src="(\/[^"]*)"/g)) {
    assets++;
    if (!fs.existsSync(path.join(DIST, m[1]))) { errors++; report.push(`MISSING ASSET ${m[1]} in ${rel}`); }
  }
  if (isAr(rel) && !html.includes('<html lang="ar" dir="rtl">')) { errors++; report.push(`RTL MISSING in ${rel}`); }
  if (!isAr(rel) && !html.includes('<html lang="en" dir="ltr">')) { errors++; report.push(`LTR MISSING in ${rel}`); }

  const route = routeOf(rel);
  const canon = html.match(/rel="canonical" href="https:\/\/qscco\.sa([^"]*)"/);
  if (!canon || canon[1] !== route) { errors++; report.push(`CANONICAL MISMATCH in ${rel}: ${canon && canon[1]}`); }
  const twin = twinOf(route);
  if (!html.includes(`href="https://qscco.sa${twin}"`)) { errors++; report.push(`HREFLANG ALT MISSING in ${rel}`); }
  if (!exists(twin)) { errors++; report.push(`LANGUAGE PAIR MISSING for ${rel}`); }
  if (!/<title>[^<]{10,}<\/title>/.test(html)) { errors++; report.push(`TITLE MISSING in ${rel}`); }
  if (!/<meta name="description" content="[^"]{30,}"/.test(html)) { errors++; report.push(`DESC MISSING in ${rel}`); }

  // visible word count (main content, tags stripped)
  const mainM = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (mainM) {
    const text = mainM[1].replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    wordCounts.push([route, words]);
  }
  // FAQ presence on indexable content pages
  const noindex = html.includes("noindex");
  if (!noindex && !html.includes("<details>")) { errors++; report.push(`FAQ SECTION MISSING in ${rel}`); }
}

// title uniqueness per language
for (const langPrefixTest of [(r) => !isAr(r), (r) => isAr(r)]) {
  const titles = {};
  for (const file of pages) {
    const rel = "/" + path.relative(DIST, file).replace(/\\/g, "/");
    if (rel === "/404.html" || !langPrefixTest(rel)) continue;
    const tMatch = fs.readFileSync(file, "utf8").match(/<title>([^<]+)<\/title>/);
    const title = tMatch && tMatch[1];
    if (titles[title]) { errors++; report.push(`DUPLICATE TITLE "${title}" in ${rel} and ${titles[title]}`); }
    titles[title] = rel;
  }
}

// sitemap entries must exist and be indexable; noindex pages excluded
const sm = fs.readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
let smCount = 0;
for (const m of sm.matchAll(/<loc>https:\/\/qscco\.sa([^<]*)<\/loc>/g)) {
  smCount++;
  if (!exists(m[1])) { errors++; report.push(`SITEMAP 404: ${m[1]}`); }
  const f = path.join(DIST, m[1].replace(/^\//, ""), "index.html");
  if (fs.existsSync(f) && fs.readFileSync(f, "utf8").includes('content="noindex')) {
    errors++; report.push(`SITEMAP CONTAINS NOINDEX PAGE: ${m[1]}`);
  }
}
for (const p of ["/guides/", "/ar/guides/", "/projects/", "/ar/projects/", "/privacy-policy/", "/ar/privacy-policy/"]) {
  if (sm.includes(`<loc>https://qscco.sa${p}</loc>`)) { errors++; report.push(`NOINDEX PAGE IN SITEMAP: ${p}`); }
}

console.log(`Pages checked: ${pages.length}`);
console.log(`Internal links verified: ${links}, asset refs verified: ${assets}`);
console.log(`Sitemap URLs verified: ${smCount}`);
const low = wordCounts.filter(([r, w]) => w < 600 && !r.includes("guides") && !r.includes("projects") && !r.includes("privacy"));
const avg = Math.round(wordCounts.reduce((a, [, w]) => a + w, 0) / wordCounts.length);
console.log(`Average visible words per page: ${avg}`);
console.log(`Pages under 600 visible words (excl. guides/projects/privacy): ${low.length}`);
low.slice(0, 20).forEach(([r, w]) => console.log(`  ~ ${r} (${w} words)`));
console.log(errors ? `FAILURES: ${errors}` : "ALL CHECKS PASSED");
report.slice(0, 60).forEach(r => console.log("  - " + r));
process.exit(errors ? 1 : 0);
