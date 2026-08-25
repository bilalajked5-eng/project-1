import { useT } from '@/i18n'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { NetworkVisual } from '@/components/visuals/NetworkVisual'
import { cn } from '@/lib/cn'

/**
 * Dark brand section: the technology argument.
 *
 * The People → Process → Technology → Performance chain runs as a horizontal
 * rail on desktop and stacks vertically on mobile, with the connecting line
 * redrawn per axis rather than rotated.
 */
export function Technology({ hideHeading }: { hideHeading?: boolean } = {}) {
  const t = useT()
  const CapHeading = hideHeading ? 'h2' : 'h3'

  return (
    <Section tone="dark" aria-labelledby={hideHeading ? undefined : "technology-heading"} className="overflow-hidden">
      {/* Ambient field */}
      <NetworkVisual className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.55]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_70%_at_50%_110%,rgb(var(--brand-700)/0.42),transparent_60%)]"
      />

      {!hideHeading && (
        <SectionHeading
          id="technology-heading"
          eyebrow={t.technology.eyebrow}
          title={t.technology.heading}
          intro={t.technology.body}
          onDark
          align="center"
          size="xl"
          className="mx-auto"
        />
      )}

      {/* Capabilities */}
      <ul className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-5', hideHeading ? 'mt-0' : 'mt-16 lg:mt-20')}>
        {t.technology.capabilities.map((cap, i) => (
          <Reveal key={cap.title} delay={i * 80} as="li" className="h-full">
            <div
              className={cn(
                'group h-full rounded-card bg-white/[0.04] p-6 ring-1 ring-white/10 backdrop-blur-sm',
                'transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:bg-white/[0.075] hover:ring-brand-400/40',
              )}
            >
              <span
                aria-hidden="true"
                className="block h-px w-9 bg-gradient-to-r from-brand-400 to-transparent transition-all duration-600 ease-premium group-hover:w-full"
              />
              <CapHeading className="mt-5 font-display text-body-lg font-semibold text-white">
                {cap.title}
              </CapHeading>
              <p className="mt-2.5 text-body-sm leading-relaxed text-white/55">{cap.body}</p>
            </div>
          </Reveal>
        ))}
      </ul>

      {/* People → Process → Technology → Performance */}
      <div className="mt-20 lg:mt-24">
        <Reveal>
          <p className="text-center text-eyebrow uppercase text-white/60">
            {t.technology.chainLabel}
          </p>
        </Reveal>

        <div className="relative mt-10">
          {/* Rail — horizontal on desktop, vertical on mobile */}
          <span
            aria-hidden="true"
            className="absolute start-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-400/60 via-brand-400/25 to-transparent lg:inset-x-0 lg:start-0 lg:top-[15px] lg:bottom-auto lg:h-px lg:w-full lg:bg-gradient-to-r lg:from-transparent lg:via-brand-400/45 lg:to-transparent"
          />

          <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
            {t.technology.chain.map((node, i) => (
              <Reveal key={node.step} delay={i * 110} as="li">
                <div className="flex items-start gap-5 lg:block">
                  <span className="relative grid h-8 w-8 shrink-0 place-items-center">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-glow/20 blur-[6px]"
                    />
                    <span className="relative h-3 w-3 rounded-full bg-glow ring-4 ring-ink-950" />
                  </span>

                  <div className="lg:mt-6">
                    <h3 className="font-display text-body-lg font-semibold text-white">
                      {node.step}
                    </h3>
                    <p className="mt-1.5 text-body-sm text-white/50">{node.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
