import { useLanguage, type Locale } from '@/i18n'
import { cn } from '@/lib/cn'

const OPTIONS: Array<{ code: Locale; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'العربية' },
]

/**
 * EN | العربية toggle. Rendered as a radio-style group so screen readers
 * announce the current language rather than an unlabelled pair of buttons.
 */
export function LanguageSwitcher({
  onDark,
  size = 'sm',
  onSelect,
}: {
  onDark?: boolean
  size?: 'sm' | 'lg'
  onSelect?: () => void
}) {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t.a11y.languageSwitch}
      className={cn(
        'inline-flex items-center rounded-pill p-0.5 ring-1 transition-colors duration-300',
        onDark ? 'bg-white/5 ring-white/15' : 'bg-sand-100/70 ring-sand-200',
      )}
    >
      {OPTIONS.map(({ code, label }) => {
        const active = locale === code
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            onClick={() => {
              setLocale(code)
              onSelect?.()
            }}
            className={cn(
              'rounded-pill font-medium transition-all duration-400 ease-premium',
              size === 'lg' ? 'px-4 py-2 text-body-sm' : 'px-3 py-1.5 text-[0.8125rem]',
              active
                ? onDark
                  ? 'bg-white text-ink-900 shadow-sm'
                  : 'bg-white text-ink-900 shadow-soft'
                : onDark
                  ? 'text-white/60 hover:text-white'
                  : 'text-sand-600 hover:text-ink-900',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
