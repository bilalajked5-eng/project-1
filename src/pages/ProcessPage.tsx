import { useLanguage } from '@/i18n'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { PageHero } from '@/components/sections/PageHero'
import { ProcessTimeline } from '@/components/sections/Process'
import { CtaBand } from '@/components/sections/CtaBand'
import { ArrowLink } from '@/components/ui/Links'

export function ProcessPage() {
  const { t, href, locale } = useLanguage()
  const p = t.processPage
  const crumbs = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.about, path: '/about/' },
    { label: t.nav.process, path: '/our-process/' },
  ]

  return (
    <>
      <Seo
        title={p.meta.title}
        description={p.meta.description}
        path="/our-process/"
        jsonLd={[breadcrumbSchema(locale, crumbs.map((c) => ({ name: c.label, path: c.path })))]}
      />
      <PageHero eyebrow={p.eyebrow} title={p.title} lead={p.lead} crumbs={crumbs} layout="text" />
      <section className="py-section">
        <div className="shell">
          <ProcessTimeline headingLevel={2} />
          <div className="mt-20 flex flex-wrap gap-10 border-t border-charcoal-900/15 pt-10">
            <ArrowLink to={href('/services/')}>{t.nav.allServices}</ArrowLink>
            <ArrowLink to={href('/our-projects/')}>{t.common.allProjects}</ArrowLink>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
