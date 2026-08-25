import { useState } from 'react'
import { useT } from '@/i18n'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

/**
 * "From Complexity to Clarity" — the three-stage engagement model.
 *
 * Horizontal interactive timeline on desktop; vertical timeline on mobile.
 * The two are the same markup with the rail and node positions switched at
 * the `lg` breakpoint, so the reading order never diverges from the DOM.
 */
export function Process() {
  const t = useT()
  const [active, setActive] = useState(0)

  return (
    <Section id="how-we-work" aria-labelledby="process-heading">
      <SectionHeading
        id="process-heading"
        eyebrow={t.process.eyebrow}
        title={t.process.heading}
        intro={t.process.intro}
        size="xl"
      />

      <div className="relative mt-16 lg:mt-24">
        {/* Base rail */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute start-[23px] top-3 bottom-3 w-px bg-sand-200',
            'lg:inset-x-0 lg:start-0 lg:top-[23px] lg:bottom-auto lg:h-px lg:w-full',
          )}
        />
        {/* Progress rail — fills to the active stage.
            Split by axis: an inline `height` would otherwise beat the
            `lg:h-px` class and break the horizontal rail on desktop. */}
        <span
          aria-hidden="true"
          className="absolute start-[23px] top-3 w-px bg-gradient-to-b from-brand-500 to-brand-400 transition-[height] duration-700 ease-premium lg:hidden"
          style={{ height: `calc(${((active + 0.5) / t.process.stages.length) * 100}% - 1.5rem)` }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 start-0 top-[23px] hidden h-px bg-gradient-to-r from-brand-500 to-brand-400 transition-[width] duration-700 ease-premium lg:block"
          style={{ width: `${((active + 0.5) / t.process.stages.length) * 100}%` }}
        />

        <ol className="relative grid gap-12 lg:grid-cols-3 lg:gap-8">
          {t.process.stages.map((stage, i) => {
            const isActive = active === i
            const isPast = i < active

            return (
              <Reveal key={stage.phase} delay={i * 130} as="li">
                <div
                  onMouseEnter={() => setActive(i)}
                  onFocusCapture={() => setActive(i)}
                  className="group flex gap-6 lg:block"
                >
                  {/* Node */}
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    aria-label={`${stage.number} — ${stage.phase}`}
                    className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-0 rounded-full transition-all duration-600 ease-premium',
                        isActive
                          ? 'scale-100 bg-brand-500/12'
                          : 'scale-75 bg-transparent',
                      )}
                    />
                    <span
                      className={cn(
                        'relative grid h-[30px] w-[30px] place-items-center rounded-full font-display text-[0.7rem] font-semibold transition-all duration-500 ease-premium',
                        isActive || isPast
                          ? 'bg-brand-600 text-white shadow-[0_4px_14px_-4px_rgb(var(--brand-600)/0.8)]'
                          : 'bg-sand-100 text-sand-500 ring-1 ring-sand-300',
                      )}
                    >
                      {isPast ? (
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3.5 8.5 6.5 11.5 12.5 5" />
                        </svg>
                      ) : (
                        stage.number
                      )}
                    </span>
                  </button>

                  {/* Content */}
                  <div className="lg:mt-9 lg:pe-8">
                    <p
                      className={cn(
                        'text-eyebrow uppercase transition-colors duration-500',
                        isActive ? 'text-brand-700' : 'text-sand-500',
                      )}
                    >
                      {stage.phase}
                    </p>
                    <h3
                      className={cn(
                        'mt-3 text-display-sm transition-colors duration-500',
                        isActive ? 'text-ink-900' : 'text-sand-600',
                      )}
                    >
                      {stage.title}
                    </h3>
                    <p className="mt-3 text-body text-sand-600 text-pretty">{stage.body}</p>

                    {/* Underline that extends on the active stage */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'mt-6 block h-px origin-left bg-brand-500 transition-transform duration-700 ease-premium',
                        isActive ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </Section>
  )
}
