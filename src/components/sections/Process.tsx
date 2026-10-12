import { useLanguage } from '@/i18n'
import { cn, useInView } from '@/lib/hooks'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Four-stage process. Horizontal on desktop, with a hairline that draws
 * across as the section enters; vertical on mobile, with the line running
 * down the start edge.
 */
export function ProcessTimeline({ tone = 'light', headingLevel = 3 }: { tone?: 'light' | 'dark'; headingLevel?: 2 | 3 }) {
  const { t } = useLanguage()
  const { ref, inView } = useInView<HTMLOListElement>({ threshold: 0.25 })
  const dark = tone === 'dark'
  const H = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <ol ref={ref} className="relative grid gap-12 ps-10 lg:grid-cols-4 lg:gap-10 lg:ps-0 lg:pt-14">
      {/* Track: vertical on mobile, horizontal on desktop */}
      <span aria-hidden="true" className={cn('absolute bottom-2 start-[0.3rem] top-2 w-px lg:hidden', dark ? 'bg-ivory-50/20' : 'bg-charcoal-900/15')} />
      <span aria-hidden="true" className={cn('absolute inset-x-0 top-[0.3rem] hidden h-px lg:block', dark ? 'bg-ivory-50/20' : 'bg-charcoal-900/15')} />
      <span
        aria-hidden="true"
        className={cn(
          'absolute start-0 top-[0.3rem] hidden h-px w-full origin-left transition-transform duration-[1800ms] ease-in-out-soft motion-reduce:transition-none rtl:origin-right lg:block',
          dark ? 'bg-bronze-300' : 'bg-bronze-500',
          inView ? 'scale-x-100' : 'scale-x-0',
        )}
      />

      {t.process.map((step, i) => (
        <Reveal as="li" key={step.title} delay={150 + i * 140} className="relative">
          <span
            aria-hidden="true"
            className={cn(
              'absolute -start-10 top-1 h-[0.65rem] w-[0.65rem] rotate-45 border lg:-top-14 lg:start-0',
              dark ? 'border-bronze-300 bg-charcoal-900' : 'border-bronze-500 bg-ivory-100',
            )}
          />
          <p className={cn('font-serif text-display-lg font-light', dark ? 'text-bronze-300' : 'text-bronze-600')}>0{i + 1}</p>
          <H className={cn('mt-3 font-serif text-display-md', dark ? 'text-ivory-50' : 'text-charcoal-900')}>{step.title}</H>
          <p className={cn('mt-4 max-w-sm text-body-sm', dark ? 'text-ivory-50/75' : 'text-stone-700')}>{step.text}</p>
        </Reveal>
      ))}
    </ol>
  )
}
