import { chromium } from 'playwright'
const BASE='http://127.0.0.1:4173'
const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--disable-dev-shm-usage'] })
const routes = ['/','/about','/solutions','/industries','/technology','/careers','/contact','/nope']
const problems = []

const contrastFn = `
(() => {
  const lum = (rgb) => {
    const [r,g,b] = rgb.map(v => { v/=255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4) })
    return 0.2126*r + 0.7152*g + 0.0722*b
  }
  const parse = (s) => { const m = s.match(/\\d+(\\.\\d+)?/g); return m ? m.slice(0,3).map(Number) : null }
  const alphaOf = (s) => { const m = s.match(/\\d+(\\.\\d+)?/g); return (m && m.length >= 4) ? parseFloat(m[3]) : 1 }
  const over = (fg, a, bg) => fg.map((c,i) => c*a + bg[i]*(1-a))
  const gradientStops = (s) => {
    if (!s || s === 'none' || !/gradient/.test(s)) return []
    return (s.match(/rgba?\\([^)]*\\)/g) || []).map(parse).filter(Boolean)
  }
  // Returns candidate backgrounds; contrast is judged against the worst one.
  const bgsOf = (el) => {
    let n = el
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n)
      const stops = gradientStops(cs.backgroundImage)
      if (stops.length) return stops
      const c = cs.backgroundColor
      const p = parse(c)
      if (p) {
        const nums = c.match(/\\d+(\\.\\d+)?/g)
        const a = (nums && nums.length >= 4) ? parseFloat(nums[3]) : 1
        if (a > 0.85) return [p]
      }
      n = n.parentElement
    }
    return [[255,255,255]]
  }
  const out = []
  for (const el of document.querySelectorAll('p,h1,h2,h3,h4,a,button,span,li,dt,dd,label')) {
    const txt = el.textContent?.trim()
    if (!txt || txt.length < 2) continue
    if (el.children.length > 0 && !Array.from(el.childNodes).some(n => n.nodeType===3 && n.textContent.trim())) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.95) continue
    if (el.closest('[aria-hidden="true"]')) continue
    if (cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)' || cs.color === 'rgba(0, 0, 0, 0)') continue
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    const rawFg = parse(cs.color); if (!rawFg) continue
    const bgs = bgsOf(el)
    let ratio = Infinity
    for (const bg of bgs) {
      const fg = over(rawFg, alphaOf(cs.color), bg)
      const L1 = lum(fg), L2 = lum(bg)
      ratio = Math.min(ratio, (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05))
    }
    const size = parseFloat(cs.fontSize)
    const large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight) >= 700)
    const need = large ? 3 : 4.5
    if (ratio < need) out.push({ text: txt.slice(0,42), ratio:+ratio.toFixed(2), need, size:+size.toFixed(1) })
  }
  return out
})()`

for (const route of routes) {
  const ctx = await browser.newContext({ viewport:{width:1440,height:900} })
  const page = await ctx.newPage()
  page.on('pageerror', e => problems.push(`${route} PAGEERROR: ${e.message}`))
  await page.goto(BASE+route, { waitUntil:'load' })
  await page.evaluate(()=>document.fonts.ready)
  await page.evaluate(()=>new Promise(r=>setTimeout(r,900)))

  const headings = await page.$$eval('h1,h2,h3,h4,h5,h6', els => els.map(e => ({ l:+e.tagName[1], t:e.textContent.trim().slice(0,40) })))
  const h1s = headings.filter(h=>h.l===1)
  if (h1s.length !== 1) problems.push(`${route}: expected 1 <h1>, found ${h1s.length}`)
  let prev = 0
  for (const h of headings) { if (prev && h.l > prev+1) problems.push(`${route}: heading jump h${prev}->h${h.l} at "${h.t}"`); prev = h.l }

  // A page must not restate its own <h1> in a section heading below it
  const dupe = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim().toLowerCase()
    if (!h1) return null
    const hit = Array.from(document.querySelectorAll('h2,h3'))
      .find(h => h.textContent.trim().toLowerCase() === h1)
    return hit ? hit.textContent.trim().slice(0,60) : null
  })
  if (dupe) problems.push(`${route}: heading repeated below the hero — "${dupe}"`)

  const noAlt = await page.$$eval('img:not([alt])', els => els.length)
  if (noAlt) problems.push(`${route}: ${noAlt} <img> without alt`)
  const unnamed = await page.$$eval('a,button', els => els.filter(e => !((e.textContent||'').trim() || e.getAttribute('aria-label') || e.getAttribute('title'))).length)
  if (unnamed) problems.push(`${route}: ${unnamed} interactive element(s) unnamed`)
  const overflow = await page.evaluate(()=> document.documentElement.scrollWidth - document.documentElement.clientWidth)
  if (overflow > 1) problems.push(`${route}: horizontal overflow ${overflow}px @1440`)
  const broken = await page.$$eval('img', els => els.filter(e => e.complete && e.naturalWidth === 0).map(e => e.getAttribute('src')))
  for (const b of broken) problems.push(`${route}: image failed to load — ${b}`)
  for (const c of (await page.evaluate(contrastFn)).slice(0,6)) problems.push(`${route}: contrast ${c.ratio}:1 (needs ${c.need}) @${c.size}px — "${c.text}"`)
  await ctx.close()
}

for (const w of [390,375]) {
  const ctx = await browser.newContext({ viewport:{width:w,height:800} })
  const page = await ctx.newPage()
  await page.goto(BASE+'/', { waitUntil:'load' })
  await page.evaluate(()=>new Promise(r=>setTimeout(r,700)))
  const o = await page.evaluate(()=> document.documentElement.scrollWidth - document.documentElement.clientWidth)
  if (o > 1) problems.push(`/ @${w}px: horizontal overflow ${o}px`)
  await ctx.close()
}
{
  const ctx = await browser.newContext({ viewport:{width:1440,height:900}, reducedMotion:'reduce' })
  const page = await ctx.newPage()
  await page.goto(BASE+'/', { waitUntil:'load' })
  await page.evaluate(()=>new Promise(r=>setTimeout(r,500)))
  const hidden = await page.$$eval('.reveal', els => els.filter(e => parseFloat(getComputedStyle(e).opacity) < 0.95).length)
  if (hidden) problems.push(`reduced-motion: ${hidden} reveal(s) hidden`)
  await ctx.close()
}
await browser.close()
console.log(problems.length ? `${problems.length} ISSUE(S):\n` + problems.map(p=>' • '+p).join('\n') : 'AUDIT CLEAN')
