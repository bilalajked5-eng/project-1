import { useT } from '@/i18n'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { TextLink } from '@/components/ui/Button'
import { Figure } from '@/components/visuals/Figure'

/**
 * Case studies.
 *
 * IMPORTANT — these are structural placeholders. Client names, percentages
 * and outcomes are deliberately absent: the `result` field carries a pending
 * label rather than a fabricated figure, and the section states this openly.
 * Replace `result` (and optionally add a client name) once outcomes are
 * verified and approved; no layout changes are needed.
 */
export function CaseStudies() {
  const t = useT()
  const patterns = ['data', 'operations', 'team'] as const

  return (
    <Section tone="tint" aria-labelledby="cases-heading">
      <SectionHeading
        id="cases-heading"
        eyebrow={t.caseStudies.eyebrow}
        title={t.caseStudies.heading}
        intro={t.caseStudies.intro}
        size="xl"
      />

      <ul className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-3">
        {t.caseStudies.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 120} as="li" className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-panel bg-white ring-1 ring-sand-200 shadow-soft transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-lift">
              <div className="relative overflow-hidden">
                <Figure
                  alt={item.title}
                  pattern={patterns[i % patterns.length]}
                  ratio="aspect-[16/9]"
                  className="rounded-none ring-0 transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
                />
                <span className="absolute bottom-4 start-4 rounded-pill bg-white/95 px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-800 backdrop-blur">
                  {item.industry}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-display text-body-xl font-semibold text-ink-900">
                  {item.title}
                </h3>

                <dl className="mt-6 flex-1 space-y-5">
                  <div>
                    <dt className="text-eyebrow uppercase text-sand-500">{t.caseStudies.labels.challenge}</dt>
                    <dd className="mt-2 text-body-sm leading-relaxed text-sand-600">
                      {item.challenge}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-eyebrow uppercase text-sand-500">{t.caseStudies.labels.solution}</dt>
                    <dd className="mt-2 text-body-sm leading-relaxed text-sand-600">
                      {item.solution}
                    </dd>
                  </div>
                  <div className="hairline pt-5">
                    <dt className="text-eyebrow uppercase text-brand-700">{t.caseStudies.labels.result}</dt>
                    <dd className="mt-2 inline-flex items-center gap-2 text-body-sm font-medium text-sand-500">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sand-300" />
                      {item.result}
                    </dd>
                  </div>
                </dl>

                <div className="mt-7">
                  <TextLink to="/contact">{t.cta.readCase}</TextLink>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={200}>
        <p className="mt-10 max-w-3xl text-body-sm leading-relaxed text-sand-500">
          <span aria-hidden="true" className="me-2 font-semibold text-sand-500">
            {t.caseStudies.labels.note} —
          </span>
          {t.caseStudies.disclaimer}
        </p>
      </Reveal>
    </Section>
  )
}
