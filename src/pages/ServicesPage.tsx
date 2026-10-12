import { Link } from 'react-router-dom'
import { useLanguage } from '@/i18n'
import { coreServices, sectors, getService } from '@/content/services'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { PageHero } from '@/components/sections/PageHero'
import { ServicePanels } from '@/components/sections/ServicePanels'
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
      <PageHero eyebrow={s.eyebrow} title={s.title} lead={s.lead} crumbs={crumbs} layout="text" />

      <section className="py-section">
        <div className="shell">
          <ServicePanels items={coreServices} headingLevel={2} />
        </div>
      </section>

      <section className="bg-ivory-200 py-section" aria-labelledby="sectors-title">
        <div className="shell">
          <p className="eyebrow mb-6">{s.sectorsEyebrow}</p>
          <h2 id="sectors-title" className="font-serif text-display-xl font-light">
            {s.sectorsTitle}
          </h2>
          <ul className="mt-16 grid gap-px bg-charcoal-900/15 sm:grid-cols-2 lg:grid-cols-4">
            {sectorLinks.map((sec, i) => (
              <Reveal as="li" key={sec.slug} delay={i * 90} className="bg-ivory-200">
                <Link to={href(`/${sec.slug}/`)} className="group block p-6 lg:p-8">
                  <Media slot={sec.hero} ratio="aspect-[4/5]" zoom decorative />
                  <h3 className="mt-6 font-serif text-[1.5rem] leading-snug">{tr(sec.title)}</h3>
                  <p className="mt-2 text-body-sm text-stone-700">{tr(sec.short)}</p>
                  <Arrow className="mt-5 transition-transform duration-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={s.ctaTitle} text={s.ctaText} />
    </>
  )
}
