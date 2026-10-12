import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { SITE_URL } from '@/content/company'
import { localePath, useLanguage } from '@/i18n'

export interface HeadData {
  title: string
  description: string
  /** English-equivalent path, e.g. `/about/`. Used for canonical and hreflang. */
  path: string
  image?: string
  noindex?: boolean
  jsonLd: object[]
  locale: 'en' | 'ar'
}

/**
 * During prerendering, pages write their head data into this collector and
 * the build script serialises it into static HTML. In the browser, the same
 * `<Seo>` call updates the live document head on navigation.
 */
const HeadContext = createContext<{ current: HeadData | null } | null>(null)

export function HeadProvider({ collector, children }: { collector: { current: HeadData | null }; children: ReactNode }) {
  return <HeadContext.Provider value={collector}>{children}</HeadContext.Provider>
}

const DEFAULT_IMAGE = `${SITE_URL}/images/og-projects-world.jpg`

export function headTags(h: HeadData): string {
  const url = `${SITE_URL}${localePath(h.locale, h.path)}`
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  const image = h.image ?? DEFAULT_IMAGE
  const tags = [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    h.noindex ? '<meta name="robots" content="noindex, follow" />' : '',
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="en" href="${SITE_URL}${localePath('en', h.path)}" />`,
    `<link rel="alternate" hreflang="ar" href="${SITE_URL}${localePath('ar', h.path)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${localePath('en', h.path)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Projects World" />`,
    `<meta property="og:locale" content="${h.locale === 'ar' ? 'ar_SA' : 'en_GB'}" />`,
    `<meta property="og:locale:alternate" content="${h.locale === 'ar' ? 'en_GB' : 'ar_SA'}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...h.jsonLd.map(
      (d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`,
    ),
  ]
  // `data-head` marks the managed block so client navigation can replace it
  return tags
    .filter(Boolean)
    .map((t) => t.replace(/^<(\w+)/, '<$1 data-head'))
    .join('\n    ')
}

/** Replace the managed head block in the live document. */
function applyHead(h: HeadData) {
  const html = headTags(h)
  document.head.querySelectorAll('[data-head]').forEach((n) => n.remove())
  document.title = h.title
  const tpl = document.createElement('template')
  tpl.innerHTML = html
  tpl.content.querySelectorAll('meta, link, script').forEach((node) => {
    const el = node as HTMLElement
    // Scripts parsed from a template are inert; recreate JSON-LD so it is real
    if (el.tagName === 'SCRIPT') {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.textContent = el.textContent
      s.setAttribute('data-head', '')
      document.head.appendChild(s)
      return
    }
    el.setAttribute('data-head', '')
    document.head.appendChild(el)
  })
}

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  noindex?: boolean
  jsonLd?: object[]
}

export function Seo({ title, description, path, image, noindex, jsonLd = [] }: SeoProps) {
  const { locale } = useLanguage()
  const collector = useContext(HeadContext)
  const data: HeadData = { title, description, path, image, noindex, jsonLd, locale }

  // Server render: hand the data to the prerender script
  if (collector && typeof window === 'undefined') collector.current = data

  const key = JSON.stringify(data)
  useEffect(() => {
    applyHead(JSON.parse(key) as HeadData)
  }, [key])

  return null
}
