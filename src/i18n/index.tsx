import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en, type Content } from './en'
import { ar } from './ar'

export type Locale = 'en' | 'ar'

const dictionaries: Record<Locale, Content> = { en, ar }
const STORAGE_KEY = 'atmaal:locale'

interface LanguageValue {
  locale: Locale
  dir: 'ltr' | 'rtl'
  t: Content
  setLocale: (next: Locale) => void
  toggle: () => void
}

const LanguageContext = createContext<LanguageValue | null>(null)

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'ar') return stored
  // Honour the browser's preferred language on first visit
  return window.navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)

  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = dir
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* storage can be unavailable in private browsing — non-fatal */
    }
  }, [locale, dir])

  const setLocale = useCallback((next: Locale) => setLocaleState(next), [])
  const toggle = useCallback(() => setLocaleState((c) => (c === 'en' ? 'ar' : 'en')), [])

  const value = useMemo<LanguageValue>(
    () => ({ locale, dir, t: dictionaries[locale], setLocale, toggle }),
    [locale, dir, setLocale, toggle],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}

/** Shorthand for components that only need the dictionary. */
export function useT(): Content {
  return useLanguage().t
}

export type { Content }
