import { useT } from '@/i18n'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { CardAccent } from '@/components/ui/Card'
import { industryIcons } from '@/components/ui/Icons'

/**
 * Industry grid.
 *
 * Sectors are limited to those that align with Atmaal's stated operations
 * (banking and financial services, government, healthcare, retail,
 * telecommunications, insurance, e-commerce, enterprise services). No client
 * names or sector claims beyond published positioning.
 */
export function Industries({ tone = 'tint' }: { tone?: 'light' | 'tint' }) {
  const t = useT()

  return (
    <Section id="industries" tone={tone} aria-labelledby="industries-heading">
      <SectionHeading
        id="industries-heading"
        eyebrow={t.industries.eyebrow}
        title={t.industries.heading}
        intro={t.industries.intro}
        size="xl"
      />

      <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {t.industries.items.map((item, i) => {
          const Icon = industryIcons[item.id as keyof typeof industryIcons]

          return (
            <Reveal key={item.id} delay={(i % 4) * 80 + Math.floor(i / 4) * 60} as="li" className="h-full">
              <article
                id={item.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white p-7 ring-1 ring-sand-200 shadow-soft transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-lift hover:ring-sand-300"
              >
                <CardAccent />

                {/* Brand wash that rises on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-brand-50 to-transparent transition-[height] duration-600 ease-premium group-hover:h-2/3"
                />

                <span className="relative grid h-11 w-11 place-items-center rounded-control bg-sand-100 text-ink-800 transition-all duration-500 ease-premium group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="relative mt-6 font-display text-body-lg font-semibold text-ink-900">
                  {item.title}
                </h3>
                <p className="relative mt-3 text-body-sm leading-relaxed text-sand-600">
                  {item.body}
                </p>
              </article>
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}
