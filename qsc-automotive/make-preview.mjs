#!/usr/bin/env node
/* Builds QSC_WEBSITE_PREVIEW.html — a single self-contained file that bundles
   every built page (CSS, logo and JS inlined) with in-file navigation, so the
   whole site can be browsed by double-clicking one file (no server needed).
   PREVIEW ONLY — the real deliverable is the multi-page dist/ output. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "dist");

const css = fs.readFileSync(path.join(DIST, "assets/css/main.css"), "utf8");
const logo = "data:image/jpeg;base64," + fs.readFileSync(path.join(DIST, "assets/logo/qsc-logo.jpg")).toString("base64");
const js = {};
for (const f of ["site-config.js", "main.js", "booking.js"]) {
  js[f] = fs.readFileSync(path.join(DIST, "assets/js", f), "utf8");
}

const pages = {};
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) {
      let rel = "/" + path.relative(DIST, p).replace(/\\/g, "/");
      let route = rel === "/index.html" ? "/" : rel.replace(/index\.html$/, "");
      let html = fs.readFileSync(p, "utf8");
      html = html.replace('<link rel="icon" href="/assets/logo/qsc-logo.jpg">', "");
      // link interception → parent navigation
      html = html.replace("</body>", `<script>
document.addEventListener("click",function(e){
  var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
  if(!a) return;
  var h = a.getAttribute("href");
  if(h && h.charAt(0)==="/" && h.indexOf("/assets/")!==0){ e.preventDefault(); parent.postMessage({qscGo:h.split("#")[0].split("?")[0], q:(h.split("?")[1]||"")},"*"); }
});
</script></body>`);
      pages[route] = html;
    }
  }
})(DIST);

const J = (v) => JSON.stringify(v).replace(/</g, "\\u003c");
const shell = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>QSC Automotive — Website Preview (single file)</title>
<style>
  html,body{margin:0;height:100%;font-family:Manrope,Segoe UI,Arial,sans-serif;background:#101D2A}
  .bar{display:flex;align-items:center;gap:12px;background:#141A20;color:#cfd9e2;padding:8px 14px;font-size:12px;flex-wrap:wrap}
  .bar strong{color:#fff;letter-spacing:.06em}
  .bar .route{background:#0d141b;border:1px solid #2a3844;border-radius:6px;padding:5px 10px;direction:ltr;color:#7db6e3;min-width:200px}
  .bar button{background:#2178BF;border:0;color:#fff;border-radius:6px;padding:6px 12px;font-weight:700;cursor:pointer;font-size:12px}
  .bar button.alt{background:#2a3844}
  .bar .note{color:#68798a;margin-inline-start:auto}
  iframe{border:0;width:100%;height:calc(100% - 41px);background:#fff;display:block}
</style>
</head>
<body>
<div class="bar">
  <strong>QSC PREVIEW</strong>
  <button onclick="go('/')">⌂ Gateway</button>
  <button class="alt" onclick="go('/en/')">EN Home</button>
  <button class="alt" onclick="go('/ar/')">AR الرئيسية</button>
  <button class="alt" onclick="history.length&&back()">← Back</button>
  <span class="route" id="route">/</span>
  <span class="note">Single-file preview — asal site 116 alag HTML pages hai (dist/ folder)</span>
</div>
<iframe id="frame" title="QSC Automotive preview"></iframe>
<script>
var PAGES = ${J(pages)};
var CSS = ${J(css)};
var LOGO = ${J(logo)};
var JS1 = ${J(js["site-config.js"])};
var JS2 = ${J(js["main.js"])};
var JS3 = ${J(js["booking.js"])};
var stack = [];
var current = "/";
function render(route, q){
  var html = PAGES[route] || PAGES["/404.html"] || "<h1>404</h1>";
  html = html.replace('<link rel="stylesheet" href="/assets/css/main.css">', "<style>" + CSS + "</style>");
  html = html.split('src="/assets/logo/qsc-logo.jpg"').join('src="' + LOGO + '"');
  html = html.replace('<script src="/assets/js/site-config.js"></scr' + 'ipt>', "<script>" + JS1 + "</scr" + "ipt>");
  html = html.replace('<script src="/assets/js/main.js" defer></scr' + 'ipt>', "<script defer>" + JS2 + "</scr" + "ipt>");
  html = html.replace('<script src="/assets/js/booking.js" defer></scr' + 'ipt>', "<script defer>" + JS3 + "</scr" + "ipt>");
  if(q){ html = html.replace("</head>", "<script>try{history.replaceState(null,'','?"+q+"')}catch(e){}<\\/script></head>"); }
  document.getElementById("frame").srcdoc = html;
  document.getElementById("route").textContent = route;
  current = route;
}
function go(route, q){ if(current!==route){ stack.push(current); } render(route, q||""); }
function back(){ if(stack.length) render(stack.pop(), ""); }
window.addEventListener("message", function(ev){
  if(ev.data && ev.data.qscGo){ go(ev.data.qscGo, ev.data.q); window.scrollTo(0,0); }
});
render("/");
</script>
</body>
</html>`;

const out = path.join(ROOT, "QSC_WEBSITE_PREVIEW.html");
fs.writeFileSync(out, shell);
console.log("Wrote", out, (fs.statSync(out).size / 1048576).toFixed(1) + " MB,", Object.keys(pages).length, "pages bundled");
