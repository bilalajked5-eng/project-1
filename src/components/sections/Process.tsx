import { useLanguage } from '@/i18n'
import { cn } from '@/lib/hooks'
import { Reveal } from '@/components/ui/Reveal'

/** Four numbered process cards. */
export function ProcessTimeline({ tone = 'light', headingLevel = 3 }: { tone?: 'light' | 'dark'; headingLevel?: 2 | 3 }) {
  const { t } = useLanguage()
  const dark = tone === 'dark'
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {t.process.map((step, i) => (
        <Reveal
          as="li"
          key={step.title}
          delay={i * 90}
          className={cn('relative rounded-card p-7', dark ? 'border border-white/10 bg-white/[0.04]' : 'card')}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-900 font-heading text-[1.0625rem] font-extrabold text-bronze-400 ring-1 ring-bronze-500/40">
            0{i + 1}
          </span>
          <H className={cn('mt-6 font-heading text-[1.1875rem] font-bold', dark ? 'text-white' : 'text-charcoal-900')}>{step.title}</H>
          <p className={cn('mt-3 text-body-sm', dark ? 'text-white/70' : 'text-stone-600')}>{step.text}</p>
        </Reveal>
      ))}
    </ol>
  )
}
