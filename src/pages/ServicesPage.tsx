import { Link } from 'react-router-dom'
import { useLanguage } from '@/i18n'
import { coreServices, sectors, getService } from '@/content/services'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { PageHero } from '@/components/sections/PageHero'
import { ServicePanels } from '@/components/sections/ServicePanels'
import { SectionHead } from '@/components/sections/Cards'
import { ProcessTimeline } from '@/components/sections/Process'
import { CtaBand } from '@/components/sections/CtaBand'
import { Media } from '@/components/ui/Media'
import { Arrow } from '@/components/ui/Links'
import { Reveal } from '@/components/ui/Reveal'

export function ServicesPage() {
  const { t, tr, href, locale } = useLanguage()
  const s = t.services
  const crumbs = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.services, path: '/services/' },
  ]

  // Office and hospitality are services that double as sector pages
  const sectorLinks = [
    sectors[0],
    { ...getService('office-furnishing-fit-out-solutions')!, title: { en: s.sectorsOffice, ar: s.sectorsOffice } },
    { ...getService('hospitality-furnishing-solutions')!, title: { en: s.sectorsHospitality, ar: s.sectorsHospitality } },
    sectors[1],
  ]

  return (
    <>
      <Seo
        title={s.meta.title}
        description={s.meta.description}
        path="/services/"
        jsonLd={[breadcrumbSchema(locale, crumbs.map((c) => ({ name: c.label, path: c.path })))]}
      />
      <PageHero eyebrow={s.eyebrow} title={s.title} lead={s.lead} crumbs={crumbs} />

      <section className="py-section">
        <div className="shell">
          <ServicePanels items={coreServices} headingLevel={2} />
        </div>
      </section>

      <section className="bg-ivory-200 py-section" aria-labelledby="sectors-title">
        <div className="shell">
          <SectionHead id="sectors-title" eyebrow={s.sectorsEyebrow} title={s.sectorsTitle} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sectorLinks.map((sec, i) => (
              <Reveal as="li" key={sec.slug} delay={i * 80}>
                <Link to={href(`/${sec.slug}/`)} className="card card-hover group block overflow-hidden">
                  <Media slot={sec.hero} ratio="aspect-[4/3]" zoom decorative sizes="(min-width: 1024px) 25vw, 50vw" />
                  <div className="p-6">
                    <h3 className="font-heading text-[1.1875rem] font-bold">{tr(sec.title)}</h3>
                    <p className="mt-2 text-body-sm text-stone-600">{tr(sec.short)}</p>
                    <Arrow className="mt-4 text-bronze-600 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-section" aria-labelledby="process-title">
        <div className="shell">
          <SectionHead id="process-title" eyebrow={t.homeX.processEyebrow} title={t.homeX.processTitle} text={t.homeX.processText} align="center" />
          <div className="mt-12">
            <ProcessTimeline />
          </div>
        </div>
      </section>

      <CtaBand title={s.ctaTitle} text={s.ctaText} />
    </>
  )
}
