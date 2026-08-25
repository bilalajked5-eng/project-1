import { useT } from '@/i18n'
import { Section, Eyebrow } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Figure } from '@/components/visuals/Figure'
import { cn } from '@/lib/cn'

/** Company introduction, plus vision and mission as a paired statement. */
export function About({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) {
  const t = useT()
  const Heading = headingLevel

  return (
    <Section id="about" aria-labelledby="about-heading">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-14">
        {/* Image column */}
        <div className="lg:col-span-5">
          <Reveal>
            <Figure
              alt={t.about.imageAlt}
              pattern="operations"
              ratio="aspect-[4/5]"
              className="shadow-card"
            />
          </Reveal>

          {/* People + Process + Technology */}
          <Reveal delay={140}>
            <div className="mt-6 flex items-center justify-between gap-2 rounded-panel bg-sand-50 p-5 ring-1 ring-sand-200">
              {t.about.triad.map((word, i) => (
                <div key={word} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-body-lg font-light text-brand-500">
                      +
                    </span>
                  )}
                  <span className="font-display text-body-sm font-semibold text-ink-900">
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Copy column */}
        <div className="lg:col-span-7 lg:ps-4">
          <Reveal>
            <Eyebrow>{t.about.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={70}>
            <Heading id="about-heading" className="mt-6 text-display-lg text-ink-900">
              {t.about.heading}
            </Heading>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-7 text-body-xl font-medium text-ink-800 text-pretty">{t.about.lead}</p>
          </Reveal>

          <div className="mt-6 space-y-5">
            {t.about.body.map((para, i) => (
              <Reveal key={para.slice(0, 24)} delay={200 + i * 80}>
                <p className="text-body-lg text-sand-600 text-pretty">{para}</p>
              </Reveal>
            ))}
          </div>

          {/* Vision & mission */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {[t.about.vision, t.about.mission].map((block, i) => (
              <Reveal key={block.label} delay={340 + i * 90}>
                <div
                  className={cn(
                    'group relative h-full overflow-hidden rounded-panel p-7 ring-1 transition-all duration-500 ease-premium',
                    i === 0
                      ? 'bg-ink-950 ring-ink-900/10 hover:-translate-y-1 hover:shadow-lift'
                      : 'bg-white ring-sand-200 shadow-soft hover:-translate-y-1 hover:shadow-lift',
                  )}
                >
                  {i === 0 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgb(var(--brand-600)/0.4),transparent_58%)]"
                    />
                  )}

                  <p
                    className={cn(
                      'relative text-eyebrow uppercase',
                      i === 0 ? 'text-brand-300' : 'text-brand-700',
                    )}
                  >
                    {block.label}
                  </p>
                  <p
                    className={cn(
                      'relative mt-4 font-display text-body-xl font-medium text-pretty',
                      i === 0 ? 'text-white' : 'text-ink-900',
                    )}
                  >
                    {block.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
