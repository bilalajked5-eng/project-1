import { useT } from '@/i18n'
import { Section, Eyebrow } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Figure } from '@/components/visuals/Figure'

/**
 * "The Powerhouse Supporting Industry Leaders" — the positioning statement.
 *
 * Two columns: a large editorial claim on one side, the substantiating
 * argument on the other. The asymmetry is the point — the statement is
 * allowed to be big and quiet.
 */
export function Intro() {
  const t = useT()

  return (
    <Section id="why-atmaal" aria-labelledby="intro-heading">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        {/* Left — the claim */}
        <div className="lg:col-span-6 lg:pe-6">
          <Reveal>
            <Eyebrow>{t.intro.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={70}>
            <h2 id="intro-heading" className="mt-6 text-display-md text-sand-500">
              {t.intro.heading}
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-8 font-display text-display-lg text-ink-900 text-balance">
              {t.intro.statement}
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-12">
              <Figure
                alt={t.intro.imageAlt}
                pattern="skyline"
                ratio="aspect-[16/10]"
                className="shadow-card"
              />
            </div>
          </Reveal>
        </div>

        {/* Right — the argument */}
        <div className="lg:col-span-6 lg:pt-24">
          <div className="space-y-6">
            {t.intro.body.map((para, i) => (
              <Reveal key={para.slice(0, 24)} delay={120 + i * 80}>
                <p className="text-body-xl text-sand-600 text-pretty">{para}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 space-y-px overflow-hidden rounded-panel bg-sand-200">
            {t.intro.pillars.map((pillar, i) => (
              <Reveal key={pillar.k} delay={280 + i * 90}>
                <div className="group flex flex-col gap-2 bg-white p-6 transition-colors duration-400 hover:bg-sand-25 sm:flex-row sm:items-baseline sm:gap-8 sm:p-7">
                  <h3 className="w-32 shrink-0 font-display text-body-lg font-semibold text-ink-900">
                    <span className="relative">
                      {pillar.k}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-brand-600 transition-transform duration-600 ease-premium group-hover:scale-x-100"
                      />
                    </span>
                  </h3>
                  <p className="text-body text-sand-600">{pillar.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
