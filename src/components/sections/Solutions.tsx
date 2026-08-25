import { useState } from 'react'
import { useT } from '@/i18n'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { TextLink } from '@/components/ui/Button'
import { solutionIcons } from '@/components/ui/Icons'
import { cn } from '@/lib/cn'

/**
 * The three solution pillars as large interactive panels.
 *
 * Each panel carries its full service list at all times on mobile (where
 * hover does not exist). On desktop the list is revealed on hover/focus and
 * the panel's index number, rule and icon respond — so pointer users get the
 * reveal and everyone gets the content.
 */
export function Solutions({ hideHeading }: { hideHeading?: boolean } = {}) {
  const t = useT()
  const [active, setActive] = useState<string | null>(null)
  const ItemHeading = hideHeading ? 'h2' : 'h3'

  return (
    <Section id="solutions" tone="tint" aria-labelledby={hideHeading ? undefined : "solutions-heading"}>
      {!hideHeading && (
        <SectionHeading
          id="solutions-heading"
          eyebrow={t.solutions.eyebrow}
          title={t.solutions.heading}
          intro={t.solutions.intro}
          size="xl"
        />
      )}

      <div className={cn('space-y-5', hideHeading ? 'mt-0' : 'mt-16 lg:mt-20')}>
        {t.solutions.items.map((item, i) => {
          const Icon = solutionIcons[item.id as keyof typeof solutionIcons]
          const isActive = active === item.id

          return (
            <Reveal key={item.id} delay={i * 110}>
              <article
                id={item.id}
                onMouseEnter={() => setActive(item.id)}
                onMouseLeave={() => setActive(null)}
                onFocusCapture={() => setActive(item.id)}
                onBlurCapture={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setActive(null)
                }}
                className={cn(
                  'group relative overflow-hidden rounded-panel bg-white ring-1 transition-all duration-600 ease-premium',
                  isActive
                    ? 'ring-brand-200 shadow-lift lg:-translate-y-1'
                    : 'ring-sand-200 shadow-soft',
                )}
              >
                {/* Brand edge that fills on activation */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-y-0 start-0 w-[3px] origin-top bg-gradient-to-b from-brand-500 to-lime-600',
                    'transition-transform duration-700 ease-premium',
                    isActive ? 'scale-y-100' : 'scale-y-0',
                  )}
                />

                {/* Faint number watermark — pinned to the corner so it never
                    crosses the body column, and kept below text weight. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute -top-8 end-0 select-none font-display text-[6rem] font-semibold leading-none',
                    'transition-all duration-700 ease-premium sm:text-[7.5rem]',
                    isActive ? 'text-brand-500/[0.055]' : 'text-sand-900/[0.025]',
                  )}
                >
                  {item.number}
                </span>

                <div className="relative grid gap-8 p-7 sm:p-9 lg:grid-cols-12 lg:gap-10 lg:p-11">
                  {/* Identity */}
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          'grid h-12 w-12 shrink-0 place-items-center rounded-control transition-all duration-500 ease-premium',
                          isActive
                            ? 'bg-brand-600 text-white shadow-[0_6px_18px_-6px_rgb(var(--brand-600)/0.7)]'
                            : 'bg-brand-50 text-brand-700',
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="font-display text-body-sm font-semibold tracking-widest text-brand-600">
                        {item.number}
                      </span>
                    </div>

                    <ItemHeading className="mt-6 text-display-sm text-ink-900">{item.title}</ItemHeading>
                    <p className="mt-3 text-body-lg font-medium text-brand-700 text-pretty">
                      {item.tagline}
                    </p>
                  </div>

                  {/* Body + services */}
                  <div className="lg:col-span-7">
                    <p className="text-body-lg text-sand-600 text-pretty">{item.body}</p>

                    {/* Always present in the DOM; height animates on desktop only */}
                    <div
                      className={cn(
                        'grid transition-[grid-template-rows,opacity] duration-700 ease-premium',
                        'grid-rows-[1fr] opacity-100',
                        !isActive && 'lg:grid-rows-[0fr] lg:opacity-0',
                      )}
                    >
                      <div className="overflow-hidden">
                        <ul className="mt-7 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                          {item.services.map((service, si) => (
                            <li
                              key={service}
                              className="flex items-start gap-3 text-body-sm text-ink-800"
                              style={{
                                transitionDelay: isActive ? `${si * 45}ms` : '0ms',
                              }}
                            >
                              <span
                                aria-hidden="true"
                                className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                              />
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8">
                      <TextLink to={`/solutions#${item.id}`}>{item.cta}</TextLink>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
