import { useEffect } from 'react'

interface SeoOptions {
  title: string
  description: string
  locale: string
  path?: string
}

const SITE = 'https://atmaal.sa'

function setMeta(selector: string, attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

/**
 * Keep the document head in sync with the active route and locale.
 * The static tags in index.html cover the crawl-time homepage; this keeps
 * client-side navigation and language switching honest for share previews.
 */
export function useSeo({ title, description, locale, path = '/' }: SeoOptions) {
  useEffect(() => {
    document.title = title

    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', `${SITE}${path}`)
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', locale === 'ar' ? 'ar_SA' : 'en_US')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${SITE}${path}`
  }, [title, description, locale, path])
}

/** Inject a JSON-LD block for the lifetime of the mounted route. */
export function useJsonLd(id: string, data: Record<string, unknown> | null) {
  useEffect(() => {
    if (!data) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
    return () => {
      document.getElementById(id)?.remove()
    }
  }, [id, data])
}
