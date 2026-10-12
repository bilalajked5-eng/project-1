import { CheckCircle2, Eye, Target } from 'lucide-react'
import { useLanguage } from '@/i18n'
import { company } from '@/content/company'
import { media } from '@/content/media'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema, organizationSchema } from '@/lib/schema'
import { PageHero } from '@/components/sections/PageHero'
import { ProcessTimeline } from '@/components/sections/Process'
import { SectionHead } from '@/components/sections/Cards'
import { CtaBand } from '@/components/sections/CtaBand'
import { Media } from '@/components/ui/Media'
import { Button } from '@/components/ui/Links'
import { Reveal } from '@/components/ui/Reveal'
import { Needs } from '@/components/ui/Needs'

export function AboutPage() {
  const { t, tr, href, locale } = useLanguage()
  const a = t.about
  const x = t.homeX
  const years = new Date().getFullYear() - company.founded
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
      <PageHero eyebrow={t.nav.about} title={a.title} lead={a.lead} crumbs={crumbs} media={media.about} />

      {/* Story */}
      <section className="py-section" aria-labelledby="story-title">
        <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative pb-8">
            <Media slot={media.intro} ratio="aspect-[5/4]" className="rounded-card" sizes="(min-width: 1024px) 50vw, 100vw" />
            <div className="absolute bottom-0 end-6 rounded-card bg-bronze-500 p-6 text-charcoal-950 shadow-lift">
              <p className="font-heading text-[2.75rem] font-extrabold leading-none">{company.founded}</p>
              <p className="mt-2 text-caption font-semibold">{t.home.introFacts[0].label}</p>
            </div>
          </Reveal>
          <div>
            <SectionHead id="story-title" eyebrow={a.storyEyebrow} title={a.storyTitle} />
            {a.story.map((p, i) => (
              <p key={i} className="mt-5 text-stone-600">
                {p}
              </p>
            ))}
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {x.aboutChecks.map((c) => (
                <li key={c} className="flex items-center gap-2.5 text-body-sm font-semibold">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-bronze-500" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-charcoal-900 py-14 text-white" aria-label={t.nav.about}>
        <dl className="shell grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {[
            { v: String(company.founded), l: x.stats[0].label },
            { v: `${years}+`, l: x.aboutBadge },
            { v: `${x.stats[1].value}${x.stats[1].suffix}`, l: x.stats[1].label },
            { v: String(x.stats[3].value), l: x.stats[3].label },
          ].map((s) => (
            <div key={s.l} className="flex flex-col-reverse">
              <dt className="mt-2 text-body-sm text-white/70">{s.l}</dt>
              <dd className="font-heading text-[2.5rem] font-extrabold leading-none text-bronze-400">{s.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Mission and vision */}
      <section id="mission" className="py-section" aria-labelledby="mv-title">
        <div className="shell">
          <SectionHead id="mv-title" eyebrow={t.nav.about} title={`${a.missionTitle} & ${a.visionTitle}`} align="center" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { icon: Target, title: a.missionTitle, text: a.mission },
              { icon: Eye, title: a.visionTitle, text: a.vision },
            ].map((m) => (
              <Reveal key={m.title} className="card p-8">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-bronze-500 text-charcoal-950">
                  <m.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-heading text-[1.375rem] font-extrabold">{m.title}</h3>
                <p className="mt-3 text-stone-600">{m.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-ivory-200 py-section" aria-labelledby="founder-title">
        <div className="shell grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Media slot={media.aboutTeam} ratio="aspect-[4/3]" className="rounded-card" />
          </Reveal>
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">{a.founderEyebrow}</p>
            <h2 id="founder-title" className="font-heading text-display-lg font-extrabold">
              {tr(company.founder)}
            </h2>
            <p className="mt-1 text-body-sm font-semibold text-bronze-600">{a.founderRole}</p>
            <blockquote className="mt-6 border-s-4 border-bronze-500 ps-6 text-lead text-charcoal-900">{a.mission}</blockquote>
            <p className="mt-6 text-stone-600">{a.teamText}</p>
            <Needs items={['Founder’s message in full (the current About page carries a CEO message) and an approved portrait']} />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={company.profilePdf} variant="dark" icon="none" external>
                {t.common.downloadProfile}
              </Button>
              <Button to={href('/our-projects/')} variant="outline">
                {t.common.allProjects}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-section" aria-labelledby="how-title">
        <div className="shell">
          <SectionHead id="how-title" eyebrow={x.processEyebrow} title={a.teamTitle} align="center" />
          <div className="mt-12">
            <ProcessTimeline />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
