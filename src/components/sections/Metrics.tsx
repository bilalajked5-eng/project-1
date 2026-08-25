import { useT } from '@/i18n'
import { Counter } from '@/components/ui/Counter'
import { Reveal } from '@/components/ui/Reveal'
import { DataLines } from '@/components/visuals/NetworkVisual'

/**
 * Trust band, immediately below the hero.
 *
 * Figures are Atmaal's published operating metrics. The fourth tile states
 * the three-pillar capability model rather than inventing a statistic.
 */
export function Metrics() {
  const t = useT()

  return (
    <section aria-labelledby="metrics-heading" className="relative isolate border-y border-sand-200 bg-sand-50">
      <DataLines className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full opacity-45" />

      <div className="shell relative py-14 sm:py-16 lg:py-20">
        <Reveal>
          <h2 id="metrics-heading" className="text-eyebrow uppercase text-sand-500">
            {t.metrics.label}
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
          {t.metrics.items.map((item, i) => (
            <div
              key={item.label}
              className="relative lg:ps-8 lg:first:ps-0"
            >
              {/* Hairline separators between tiles on wide viewports only */}
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1 start-0 hidden w-px bg-gradient-to-b from-transparent via-sand-300 to-transparent lg:block"
                />
              )}
              <Counter
                value={item.value}
                suffix={item.suffix}
                label={item.label}
                note={item.note}
                delay={i * 90}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
