import { useT } from '@/i18n'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { valueIcons } from '@/components/ui/Icons'

/** Six value propositions on a hairline grid — restraint over decoration. */
export function WhyAtmaal() {
  const t = useT()

  return (
    <Section aria-labelledby="why-heading">
      <SectionHeading
        id="why-heading"
        eyebrow={t.why.eyebrow}
        title={t.why.heading}
        intro={t.why.intro}
        size="xl"
      />

      {/* Hairline grid: a 1px gap over a neutral ground draws the rules for us */}
      <ul className="mt-16 grid gap-px overflow-hidden rounded-panel bg-sand-200 ring-1 ring-sand-200 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
        {t.why.items.map((item, i) => {
          const Icon = valueIcons[item.icon as keyof typeof valueIcons]

          return (
            <Reveal key={item.title} delay={(i % 3) * 90 + Math.floor(i / 3) * 70} as="li" className="h-full">
              <article className="group relative h-full bg-white p-8 transition-colors duration-500 hover:bg-sand-25 lg:p-10">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 start-0 w-[2px] origin-top scale-y-0 bg-brand-500 transition-transform duration-600 ease-premium group-hover:scale-y-100"
                />

                <span className="grid h-12 w-12 place-items-center rounded-control bg-brand-50 text-brand-700 transition-all duration-500 ease-premium group-hover:bg-brand-600 group-hover:text-white group-hover:shadow-[0_8px_20px_-8px_rgb(var(--brand-600)/0.8)]">
                  <Icon className="h-6 w-6" />
                </span>

                <h3 className="mt-7 font-display text-body-xl font-semibold text-ink-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-body text-sand-600 text-pretty">{item.body}</p>
              </article>
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}
