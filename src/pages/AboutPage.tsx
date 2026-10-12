import { useLanguage } from '@/i18n'
import { company } from '@/content/company'
import { media } from '@/content/media'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema, organizationSchema } from '@/lib/schema'
import { PageHero } from '@/components/sections/PageHero'
import { ProcessTimeline } from '@/components/sections/Process'
import { CtaBand } from '@/components/sections/CtaBand'
import { Media } from '@/components/ui/Media'
import { ArrowLink } from '@/components/ui/Links'
import { Reveal } from '@/components/ui/Reveal'
import { Needs } from '@/components/ui/Needs'

export function AboutPage() {
  const { t, tr, href, locale } = useLanguage()
  const a = t.about
  const crumbs = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.about, path: '/about/' },
  ]

  return (
    <>
      <Seo
        title={a.meta.title}
        description={a.meta.description}
        path="/about/"
        jsonLd={[organizationSchema(locale), breadcrumbSchema(locale, crumbs.map((c) => ({ name: c.label, path: c.path })))]}
      />
      <PageHero eyebrow={t.nav.about} title={a.title} lead={a.lead} crumbs={crumbs} media={media.about} layout="banner" />

      {/* Story with a large year marker */}
      <section className="py-section">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">{a.storyEyebrow}</p>
            <p aria-hidden="true" className="font-serif text-[clamp(6rem,4rem+10vw,14rem)] font-light leading-none text-bronze-300">
              {company.founded}
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
            <h2 className="font-serif text-display-lg font-light">{a.storyTitle}</h2>
            {a.story.map((p, i) => (
              <Reveal key={i} delay={i * 100}>
                <p className="mt-8 text-stone-700">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission and vision */}
      <section id="mission" className="bg-charcoal-900 py-section text-ivory-50">
        <div className="shell grid gap-16 md:grid-cols-2 md:gap-10">
          {[
            { title: a.missionTitle, text: a.mission },
            { title: a.visionTitle, text: a.vision },
          ].map((m, i) => (
            <Reveal key={m.title} delay={i * 150} className="border-t border-ivory-50/20 pt-10">
              <h2 className="eyebrow mb-8 !text-bronze-300">{m.title}</h2>
              <p className="font-serif text-display-md font-light leading-snug">{m.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="py-section" aria-labelledby="founder-title">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal mode="mask" className="lg:col-span-5">
            <Media slot={media.aboutTeam} ratio="aspect-[4/5]" />
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
            <p className="eyebrow mb-6">{a.founderEyebrow}</p>
            <h2 id="founder-title" className="font-serif text-display-lg font-light">
              {tr(company.founder)}
            </h2>
            <p className="mt-2 text-caption uppercase tracking-[0.14em] text-stone-600">{a.founderRole}</p>
            <p className="mt-8 text-stone-700">{a.mission}</p>
            <Needs items={['Founder’s message in full (the current About page carries a CEO message) and an approved portrait']} />
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="border-t border-charcoal-900/10 bg-ivory-200 py-section" aria-labelledby="how-title">
        <div className="shell">
          <div className="mb-20 grid gap-8 lg:grid-cols-12 lg:gap-10">
            <h2 id="how-title" className="font-serif text-display-xl font-light lg:col-span-6">
              {a.teamTitle}
            </h2>
            <p className="text-stone-700 lg:col-span-5 lg:col-start-8 lg:self-end">{a.teamText}</p>
          </div>
          <ProcessTimeline />
        </div>
      </section>

      {/* Company profile */}
      <section className="py-24">
        <div className="shell flex flex-col gap-8 border-y border-charcoal-900/15 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-display-md">{a.profileTitle}</h2>
            <p className="mt-2 text-stone-700">{a.profileText}</p>
          </div>
          <a
            href={company.profilePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[3.25rem] items-center border border-charcoal-900 px-7 text-caption font-semibold uppercase tracking-[0.16em] transition-colors duration-400 hover:bg-charcoal-900 hover:text-ivory-50"
          >
            {t.common.downloadProfile}
          </a>
        </div>
        <div className="shell mt-10">
          <ArrowLink to={href('/our-projects/')}>{t.common.allProjects}</ArrowLink>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
