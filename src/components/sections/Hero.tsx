import { useT } from '@/i18n'
import { LinkButton } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Section'
import { HeroVisual } from '@/components/visuals/HeroVisual'

/**
 * Full-height opening statement.
 *
 * Layout is asymmetric — 7/5 on desktop — so the headline holds the primary
 * axis and the visual supports rather than competes. On mobile the visual
 * drops below the copy and the type scale takes over.
 */
export function Hero() {
  const t = useT()

  return (
    <section className="relative isolate overflow-hidden bg-white pt-[calc(84px+2.5rem)] lg:min-h-[92svh] lg:pt-[84px]">
      {/* Ground: a soft brand wash rising from the lower corner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_88%_18%,rgb(var(--brand-50)),transparent_58%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_4%_92%,rgb(var(--lime-50)),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-fine [background-size:64px_64px] mask-fade-b opacity-70"
      />

      <div className="shell">
        <div className="grid items-center gap-14 py-12 lg:grid-cols-12 lg:gap-8 lg:py-20">
          {/* Copy */}
          <div className="lg:col-span-7 lg:pe-8">
            <Reveal>
              <Eyebrow>{t.hero.eyebrow}</Eyebrow>
            </Reveal>

            <h1 className="mt-7 text-display-2xl text-ink-900">
              <Reveal delay={80} as="span" className="block">
                {t.hero.h1a}
              </Reveal>
              <Reveal delay={170} as="span" className="block">
                <span className="bg-gradient-to-br from-brand-700 via-brand-500 to-lime-700 bg-clip-text text-transparent">
                  {t.hero.h1b}
                </span>
              </Reveal>
            </h1>

            <Reveal delay={260}>
              <p className="mt-8 max-w-2xl text-body-xl font-medium text-ink-800 text-pretty">
                {t.hero.sub}
              </p>
            </Reveal>

            <Reveal delay={330}>
              <p className="mt-5 max-w-xl text-body-lg text-sand-600 text-pretty">{t.hero.body}</p>
            </Reveal>

            <Reveal delay={410}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <LinkButton to="/contact" variant="primary" size="lg" arrow>
                  {t.cta.talkToExpert}
                </LinkButton>
                <LinkButton to="/solutions" variant="secondary" size="lg" arrow>
                  {t.cta.exploreSolutions}
                </LinkButton>
              </div>
            </Reveal>
          </div>

          {/* Visual */}
          <div className="lg:col-span-5">
            <Reveal delay={200}>
              <HeroVisual ariaLabel={t.hero.visualAlt} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
