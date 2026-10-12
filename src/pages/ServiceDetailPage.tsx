import { Link } from 'react-router-dom'
import { useLanguage } from '@/i18n'
import { getService, type Service } from '@/content/services'
import { getProject } from '@/content/projects'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema'
import { cn } from '@/lib/hooks'
import { PageHero } from '@/components/sections/PageHero'
import { CtaBand } from '@/components/sections/CtaBand'
import { Faqs } from '@/components/sections/Faqs'
import { ProjectCard } from '@/components/sections/ProjectCard'
import { Media } from '@/components/ui/Media'
import { Arrow } from '@/components/ui/Links'
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

function Blocks({ service }: { service: Service }) {
  const { tr } = useLanguage()
  const { layout, blocks } = service

  if (layout === 'steps') {
    return (
      <ol className="border-t border-charcoal-900/15">
        {blocks.map((b, i) => (
          <Reveal as="li" key={b.title.en} delay={i * 70} className="grid gap-4 border-b border-charcoal-900/15 py-8 sm:grid-cols-12 sm:gap-8">
            <span className="font-serif text-display-md font-light text-bronze-600 sm:col-span-2">0{i + 1}</span>
            <h3 className="font-serif text-[1.5rem] leading-snug sm:col-span-4">{tr(b.title)}</h3>
            <p className="text-stone-700 sm:col-span-6">{tr(b.text)}</p>
          </Reveal>
        ))}
      </ol>
    )
  }

  if (layout === 'table') {
    return (
      <dl className="grid border-t border-charcoal-900/15 sm:grid-cols-2">
        {blocks.map((b, i) => (
          <Reveal key={b.title.en} delay={i * 70} className={cn('border-b border-charcoal-900/15 py-8 sm:px-8', i % 2 === 0 ? 'sm:border-e sm:ps-0' : 'sm:pe-0')}>
            <dt className="font-serif text-[1.5rem] leading-snug">{tr(b.title)}</dt>
            <dd className="mt-3 text-stone-700">{tr(b.text)}</dd>
          </Reveal>
        ))}
      </dl>
    )
  }

  if (layout === 'split-list') {
    return (
      <div className="space-y-0">
        {blocks.map((b, i) => (
          <Reveal key={b.title.en} delay={i * 70} className="border-t border-charcoal-900/15 py-7 last:border-b">
            <h3 className="flex items-baseline gap-4 font-serif text-[1.5rem] leading-snug">
              <span className="text-caption font-sans font-semibold text-bronze-600">{String.fromCharCode(65 + i)}</span>
              {tr(b.title)}
            </h3>
            <p className="mt-3 ps-8 text-stone-700">{tr(b.text)}</p>
          </Reveal>
        ))}
      </div>
    )
  }

  // scope-grid
  return (
    <ul className="grid gap-px bg-charcoal-900/15 sm:grid-cols-2 lg:grid-cols-3">
      {blocks.map((b, i) => (
        <Reveal as="li" key={b.title.en} delay={i * 70} className="bg-ivory-100 p-8">
          <span aria-hidden="true" className="mb-8 block h-px w-10 bg-bronze-500" />
          <h3 className="font-serif text-[1.5rem] leading-snug">{tr(b.title)}</h3>
          <p className="mt-3 text-body-sm text-stone-700">{tr(b.text)}</p>
        </Reveal>
      ))}
    </ul>
  )
}

export function ServiceDetailPage({ slug }: { slug: string }) {
  const { t, tr, href, locale } = useLanguage()
  const service = getService(slug)!
  const title = tr(service.title)
  const crumbs = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.services, path: '/services/' },
    { label: title, path: `/${slug}/` },
  ]
  const related = service.related.map(getService).filter(Boolean) as Service[]
  const projects = (service.projects ?? []).map(getProject).filter((p): p is NonNullable<typeof p> => !!p)
  const topic = topicIndex[slug] !== undefined ? t.form.projectTypes[topicIndex[slug]] : undefined

  // The layouts deliberately place the detail image and text differently
  const sideImageFirst = service.layout === 'split-list' || service.layout === 'table'

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
        layout={service.layout === 'scope-grid' || service.layout === 'table' ? 'banner' : 'split'}
      />

      {/* Narrative */}
      <section className="py-section">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className={cn('lg:col-span-5', sideImageFirst ? 'lg:order-1' : 'lg:order-2 lg:col-start-8')}>
            <Reveal mode="mask">
              <Media slot={service.detail} ratio="aspect-[4/5]" parallax sizes="(min-width: 1024px) 40vw, 100vw" />
            </Reveal>
          </div>
          <div className={cn('lg:col-span-6 lg:self-center', sideImageFirst ? 'lg:order-2 lg:col-start-7' : 'lg:order-1')}>
            {service.body.map((p, i) => (
              <Reveal key={i} delay={i * 100}>
                <p className={cn(i === 0 ? 'text-lead text-charcoal-900' : 'mt-6 text-stone-700')}>{tr(p)}</p>
              </Reveal>
            ))}
            {service.includes && (
              <Reveal delay={200} className="mt-12">
                <h2 className="eyebrow mb-5">{tr(service.includes.title)}</h2>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-body-sm">
                  {service.includes.items.map((it) => (
                    <li key={it.en} className="flex items-center gap-3">
                      <span aria-hidden="true" className="h-px w-4 bg-bronze-500" />
                      {tr(it)}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            <Needs items={service.needs} />
          </div>
        </div>
      </section>

      {/* Main content block, in the service's own layout */}
      <section className={cn('py-section', service.layout === 'scope-grid' ? 'bg-ivory-200' : 'border-t border-charcoal-900/10')} aria-labelledby="blocks-title">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 id="blocks-title" className="font-serif text-display-lg font-light lg:sticky lg:top-32">
              {tr(service.blocksTitle)}
            </h2>
          </div>
          <div className="lg:col-span-8">
            <Blocks service={service} />
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="py-section" aria-labelledby="related-projects">
          <div className="shell">
            <h2 id="related-projects" className="mb-14 font-serif text-display-lg font-light">
              {t.services.projectsTitle}
            </h2>
            <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal key={p.slug} delay={i * 100}>
                  <ProjectCard project={p} ratio="aspect-[4/5]" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {service.faqs && (
        <section className="border-t border-charcoal-900/10 py-section" aria-labelledby="faq-title">
          <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
            <h2 id="faq-title" className="font-serif text-display-lg font-light lg:col-span-4">
              {t.common.faqs}
            </h2>
            <div className="lg:col-span-8">
              <Faqs items={service.faqs} />
            </div>
          </div>
        </section>
      )}

      {/* Related services */}
      <section className="bg-ivory-200 py-20" aria-labelledby="related-title">
        <div className="shell">
          <h2 id="related-title" className="eyebrow mb-8">
            {t.common.related}
          </h2>
          <ul className="grid border-t border-charcoal-900/15 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug} className="border-b border-charcoal-900/15 md:border-e md:last:border-e-0">
                <Link to={href(`/${r.slug}/`)} className="group flex items-center justify-between gap-6 py-7 md:px-6 md:first:ps-0">
                  <span className="font-serif text-[1.5rem] leading-snug">
                    <span className="link-underline">{tr(r.title)}</span>
                  </span>
                  <Arrow className="shrink-0 transition-transform duration-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={t.services.ctaTitle} text={t.services.ctaText} context={topic} />
    </>
  )
}
