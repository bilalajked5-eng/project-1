import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { L, Locale } from '@/content/types'
import { ui, type UI } from './ui'

interface LanguageValue {
  locale: Locale
  dir: 'ltr' | 'rtl'
  t: UI
  /** Pick the active language from a bilingual record. */
  tr: (value: L) => string
  /** Prefix an English path for the active locale. */
  href: (path: string) => string
}

const LanguageContext = createContext<LanguageValue | null>(null)

/** `/about/` → `/ar/about/` for Arabic. Paths always keep their trailing slash. */
export function localePath(locale: Locale, path: string) {
  if (locale === 'en') return path
  return path === '/' ? '/ar/' : `/ar${path}`
}

/** Read the locale from a URL path: everything under `/ar` is Arabic. */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/ar' || pathname.startsWith('/ar/') ? 'ar' : 'en'
}

/** Strip the locale prefix, giving the English-equivalent path. */
export function basePath(pathname: string) {
  if (pathname === '/ar' || pathname === '/ar/') return '/'
  return pathname.startsWith('/ar/') ? pathname.slice(3) : pathname
}

export function LanguageProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<LanguageValue>(
    () => ({
      locale,
      dir: locale === 'ar' ? 'rtl' : 'ltr',
      t: ui[locale],
      tr: (v) => v[locale],
      href: (path) => localePath(locale, path),
    }),
    [locale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
