import { useCountUp, useInView } from '@/lib/hooks'
import { useLanguage } from '@/i18n'
import { cn } from '@/lib/cn'

interface CounterProps {
  value: number
  suffix?: string
  label: string
  note?: string
  onDark?: boolean
  delay?: number
}

/**
 * Animated statistic. Numbers use Latin digits in both locales — that is the
 * convention for figures in Saudi corporate communication and keeps the
 * `8K+ / 22M / 500M+` shorthand legible in Arabic.
 */
export function Counter({ value, suffix = '', label, note, onDark, delay = 0 }: CounterProps) {
  const { locale } = useLanguage()
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 })
  const current = useCountUp(value, inView, 1900)

  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US', {
    maximumFractionDigits: 0,
  })

  return (
    <div
      ref={ref}
      className="reveal group relative"
      data-visible={inView}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      <div className="flex items-baseline gap-0.5">
        <span
          className={cn(
            'font-display text-display-lg tabular-nums',
            onDark ? 'text-white' : 'text-ink-900',
          )}
        >
          {formatter.format(Math.round(current))}
        </span>
        {suffix && (
          <span
            className={cn(
              'font-display text-display-sm',
              onDark ? 'text-brand-300' : 'text-brand-600',
            )}
          >
            {suffix}
          </span>
        )}
      </div>

      <p
        className={cn(
          'mt-3 text-body-sm font-semibold',
          onDark ? 'text-white/90' : 'text-ink-800',
        )}
      >
        {label}
      </p>

      {note && (
        <p className={cn('mt-1.5 text-body-sm', onDark ? 'text-white/50' : 'text-sand-500')}>
          {note}
        </p>
      )}
    </div>
  )
}
