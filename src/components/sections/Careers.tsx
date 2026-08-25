import { useT } from '@/i18n'
import { Section, Eyebrow } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { LinkButton } from '@/components/ui/Button'
import { Figure } from '@/components/visuals/Figure'

/** Recruitment section — links out to the live Atmaal careers platform. */
export function Careers() {
  const t = useT()

  return (
    <Section id="careers" tone="tint" aria-labelledby="careers-heading">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow>{t.careers.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={70}>
            <h2 id="careers-heading" className="mt-6 text-display-lg text-ink-900">
              {t.careers.heading}
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-5 text-body-xl text-sand-600 text-pretty">{t.careers.sub}</p>
          </Reveal>

          <ul className="mt-10 space-y-px overflow-hidden rounded-panel bg-sand-200 ring-1 ring-sand-200">
            {t.careers.items.map((item, i) => (
              <Reveal key={item.title} delay={210 + i * 90} as="li">
                <div className="group flex items-start gap-5 bg-white p-6 transition-colors duration-400 hover:bg-sand-25">
                  <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 font-display text-[0.7rem] font-semibold text-brand-700 transition-colors duration-400 group-hover:bg-brand-600 group-hover:text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-body-lg font-semibold text-ink-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-body-sm leading-relaxed text-sand-600">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={480}>
            <div className="mt-10">
              <LinkButton
                href="https://careers.atmaal.sa/en/"
                external
                variant="primary"
                size="lg"
                arrow
              >
                {t.careers.cta}
              </LinkButton>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal delay={160}>
            <Figure
              alt={t.careers.imageAlt}
              pattern="team"
              ratio="aspect-[5/4]"
              className="shadow-card"
              overlay
            />
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
