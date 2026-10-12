import { Link } from 'react-router-dom'
import { CheckCircle2, Phone } from 'lucide-react'
import { useLanguage } from '@/i18n'
import { company, whatsappLink } from '@/content/company'
import { getService, type Service } from '@/content/services'
import { getProject } from '@/content/projects'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema'
import { cn } from '@/lib/hooks'
import { track } from '@/lib/analytics'
import { PageHero } from '@/components/sections/PageHero'
import { CtaBand } from '@/components/sections/CtaBand'
import { Faqs } from '@/components/sections/Faqs'
import { ProjectTile, SectionHead, serviceIcons } from '@/components/sections/Cards'
import { Media } from '@/components/ui/Media'
import { Arrow, Button } from '@/components/ui/Links'
import { Reveal } from '@/components/ui/Reveal'
import { Needs } from '@/components/ui/Needs'

/** Maps a service to the matching project type on the inquiry form. */
const topicIndex: Record<string, number> = {
  'residential-interior-design-furnishing': 0,
  'office-furnishing-fit-out-solutions': 1,
  'hospitality-furnishing-solutions': 2,
  'project-furniture-design-supply': 3,
}

/** Append the brand only while the title stays within ~60 characters. */
const withBrand = (title: string) => (title.length + 17 <= 60 ? `${title} | Projects World` : title)

/** The service's main content block, in the layout the service calls for. */
function Blocks({ service }: { service: Service }) {
  const { tr } = useLanguage()
  const { layout, blocks } = service

  if (layout === 'steps') {
    return (
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {blocks.map((b, i) => (
          <Reveal as="li" key={b.title.en} delay={(i % 3) * 70} className="card p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-charcoal-900 font-heading text-[1rem] font-extrabold text-bronze-400">
              0{i + 1}
            </span>
            <h3 className="mt-5 font-heading text-[1.125rem] font-bold">{tr(b.title)}</h3>
            <p className="mt-2 text-body-sm text-stone-600">{tr(b.text)}</p>
          </Reveal>
        ))}
      </ol>
    )
  }

  // scope-grid, table and split-list all read well as check cards
  return (
    <ul className={cn('grid gap-5 sm:grid-cols-2', layout === 'scope-grid' && blocks.length % 3 === 0 && 'lg:grid-cols-3')}>
      {blocks.map((b, i) => (
        <Reveal as="li" key={b.title.en} delay={(i % 3) * 70} className="card p-7">
          <span className="icon-tile h-11 w-11">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-5 font-heading text-[1.125rem] font-bold">{tr(b.title)}</h3>
          <p className="mt-2 text-body-sm text-stone-600">{tr(b.text)}</p>
        </Reveal>
      ))}
    </ul>
  )
}

export function ServiceDetailPage({ slug }: { slug: string }) {
  const { t, tr, href, locale } = useLanguage()
  const service = getService(slug)!
  const title = tr(service.title)
  const Icon = serviceIcons[slug]
  const crumbs = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.services, path: '/services/' },
    { label: title, path: `/${slug}/` },
  ]
  const related = service.related.map(getService).filter(Boolean) as Service[]
  const projects = (service.projects ?? []).map(getProject).filter((p): p is NonNullable<typeof p> => !!p)
  const topic = topicIndex[slug] !== undefined ? t.form.projectTypes[topicIndex[slug]] : undefined

  const jsonLd: object[] = [
    serviceSchema(locale, title, tr(service.metaDescription), `/${slug}/`),
    breadcrumbSchema(locale, crumbs.map((c) => ({ name: c.label, path: c.path }))),
  ]
  if (service.faqs?.length) jsonLd.push(faqSchema(service.faqs.map((f) => ({ q: tr(f.q), a: tr(f.a) }))))

  return (
    <>
      <Seo title={withBrand(tr(service.metaTitle))} description={tr(service.metaDescription)} path={`/${slug}/`} jsonLd={jsonLd} />

      <PageHero
        eyebrow={service.kind === 'service' ? `${t.nav.services} · ${service.index}` : t.nav.sectorsHeading}
        title={title}
        lead={tr(service.lead)}
        crumbs={crumbs}
        media={service.hero}
        aside={
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to={href('/contact/') + (topic ? `?topic=${encodeURIComponent(topic)}` : '') + '#inquiry'} track={`service_${slug}`}>
              {t.nav.cta}
            </Button>
            <Button to={whatsappLink()} variant="whatsapp" icon="whatsapp" track={`service_${slug}_whatsapp`}>
              {t.homeX.whatsappCta}
            </Button>
          </div>
        }
      />

      {/* Overview: text + photo, with a sticky contact card */}
      <section className="py-section">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Media slot={service.detail} ratio="aspect-[16/9]" className="rounded-card" sizes="(min-width: 1024px) 66vw, 100vw" />
            <div className="mt-10">
              {service.body.map((p, i) => (
                <p key={i} className={cn(i === 0 ? 'text-lead text-charcoal-900' : 'mt-5 text-stone-600')}>
                  {tr(p)}
                </p>
              ))}
              {service.includes && (
                <div className="mt-10">
                  <h2 className="font-heading text-[1.25rem] font-bold">{tr(service.includes.title)}</h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {service.includes.items.map((it) => (
                      <li key={it.en} className="flex items-center gap-2.5 text-body-sm font-semibold">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-bronze-500" aria-hidden="true" />
                        {tr(it)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Needs items={service.needs} />
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <nav aria-label={t.nav.services} className="card p-6">
                <p className="mb-3 font-heading text-[1.0625rem] font-bold">{t.common.related}</p>
                <ul className="space-y-1">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        to={href(`/${r.slug}/`)}
                        className="group flex items-center justify-between gap-3 rounded-btn bg-ivory-200 px-4 py-3 text-body-sm font-semibold hover:bg-bronze-500 hover:text-charcoal-950"
                      >
                        {tr(r.title)}
                        <Arrow className="h-3.5 w-3.5 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="rounded-card bg-charcoal-900 p-7 text-white">
                {Icon && (
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-bronze-500 text-charcoal-950">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                )}
                <p className="mt-5 font-heading text-[1.25rem] font-bold">{t.services.ctaTitle}</p>
                <p className="mt-2 text-body-sm text-white/75">{t.services.ctaText}</p>
                <a
                  href={`tel:${company.phones[0].tel}`}
                  className="btn btn-gold mt-6 w-full"
                  onClick={() => track('click_to_call', { location: `service_${slug}` })}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span dir="ltr">{company.phones[0].display}</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-ivory-200 py-section" aria-labelledby="blocks-title">
        <div className="shell">
          <SectionHead id="blocks-title" eyebrow={title} title={tr(service.blocksTitle)} />
          <div className="mt-12">
            <Blocks service={service} />
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="py-section" aria-labelledby="related-projects">
          <div className="shell">
            <SectionHead id="related-projects" eyebrow={t.homeX.projectsEyebrow} title={t.services.projectsTitle} />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 80}>
                  <ProjectTile project={p} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {service.faqs && (
        <section className={cn('py-section', projects.length > 0 && 'bg-ivory-200')} aria-labelledby="faq-title">
          <div className="shell grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHead id="faq-title" eyebrow={t.homeX.faqEyebrow} title={t.common.faqs} />
            </div>
            <div className="lg:col-span-7">
              <Faqs items={service.faqs} />
            </div>
          </div>
        </section>
      )}

      <div className="pt-section">
        <CtaBand title={t.services.ctaTitle} text={t.services.ctaText} context={topic} />
      </div>
    </>
  )
}
