import { Link, useLocation } from 'react-router-dom'
import { basePath, localePath, useLanguage } from '@/i18n'
import { cn } from '@/lib/hooks'

/** Links to the same page in the other language, so the switch keeps context. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, t } = useLanguage()
  const { pathname, hash } = useLocation()
  const other = locale === 'en' ? 'ar' : 'en'
  const target = localePath(other, basePath(pathname)) + hash

  return (
    <Link
      to={target}
      hrefLang={other}
      lang={other}
      aria-label={t.a11y.switchTo}
      className={cn('link-underline pb-0.5 text-body-sm font-medium', other === 'ar' ? "font-['IBM_Plex_Sans_Arabic',sans-serif]" : "font-['Manrope',sans-serif]", className)}
    >
      {t.nav.langShort}
    </Link>
  )
}
