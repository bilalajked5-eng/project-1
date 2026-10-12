import { Link } from 'react-router-dom'
import { useLanguage } from '@/i18n'
import { categoryLabels, getProject, projects } from '@/content/projects'
import { getService } from '@/content/services'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { SITE_URL } from '@/content/company'
import { localePath } from '@/i18n'
import { cn } from '@/lib/hooks'
import { Breadcrumbs } from '@/components/sections/PageHero'
import { CtaBand } from '@/components/sections/CtaBand'
import { Media } from '@/components/ui/Media'
import { Arrow } from '@/components/ui/Links'
import { MaskedHeading, Reveal } from '@/components/ui/Reveal'
import { Needs } from '@/components/ui/Needs'

export function ProjectDetailPage({ slug }: { slug: string }) {
  const { t, tr, href, locale } = useLanguage()
  const l = t.projects.labels
  const project = getProject(slug)!
  const title = tr(project.title)
  const index = projects.findIndex((p) => p.slug === slug)
  const next = projects[(index + 1) % projects.length]
  const crumbs = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.projects, path: '/our-projects/' },
    { label: title, path: `/projects/${slug}/` },
  ]

  const facts = [
    { label: l.category, value: tr(categoryLabels[project.category]) },
    project.location && { label: l.location, value: tr(project.location) },
    project.year && { label: l.year, value: project.year },
    project.style && { label: l.style, value: tr(project.style) },
  ].filter(Boolean) as Array<{ label: string; value: string }>

  const description = `${tr(project.summary)}${project.location ? ` ${tr(project.location)}.` : ''}`.slice(0, 155)
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: title,
      description: tr(project.summary),
      url: `${SITE_URL}${localePath(locale, `/projects/${slug}/`)}`,
      creator: { '@id': `${SITE_URL}/#organization` },
      ...(project.year ? { dateCreated: project.year } : {}),
      ...(project.location ? { locationCreated: { '@type': 'Place', name: project.location.en } } : {}),
    },
    breadcrumbSchema(locale, crumbs.map((c) => ({ name: c.label, path: c.path }))),
  ]

  return (
    <>
      <Seo title={`${title} | ${tr(categoryLabels[project.category])} | Projects World`.slice(0, 70)} description={description} path={`/projects/${slug}/`} jsonLd={jsonLd} />

      {/* Opening: title over a full-width frame */}
      <section className="page-enter pt-[calc(var(--header-h)+2.5rem)] lg:pt-40">
        <div className="shell">
          <Breadcrumbs items={crumbs} />
          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow mb-6">{tr(categoryLabels[project.category])}</p>
              <MaskedHeading as="h1" lines={[title]} className="font-serif text-display-2xl font-light" />
            </div>
            <Reveal delay={200} className="lg:col-span-4">
              <p className="text-lead text-stone-700">{tr(project.summary)}</p>
            </Reveal>
          </div>
        </div>
        <Reveal mode="mask" delay={150} className="mt-14 lg:mt-20">
          <Media slot={project.cover} ratio="aspect-[4/3] sm:aspect-[16/8]" priority parallax />
        </Reveal>
      </section>

      {/* Facts and overview */}
      <section className="py-section">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-4">
            <dl className="border-t border-charcoal-900/15">
              {facts.map((f) => (
                <div key={f.label} className="flex justify-between gap-6 border-b border-charcoal-900/15 py-4 text-body-sm">
                  <dt className="text-stone-600">{f.label}</dt>
                  <dd className="text-end font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="eyebrow mb-4 mt-12">{l.scope}</h2>
            <ul className="space-y-2">
              {project.scope.map((s) => (
                <li key={s.en} className="flex items-center gap-3 font-serif text-[1.375rem]">
                  <span aria-hidden="true" className="h-px w-4 bg-bronze-500" />
                  {tr(s)}
                </li>
              ))}
            </ul>
          </aside>

          <div className="lg:col-span-7 lg:col-start-6">
            {project.overview && (
              <>
                <h2 className="eyebrow mb-6">{l.overview}</h2>
                {project.overview.map((p, i) => (
                  <Reveal key={i}>
                    <p className={cn(i === 0 ? 'text-lead text-charcoal-900' : 'mt-6 text-stone-700')}>{tr(p)}</p>
                  </Reveal>
                ))}
              </>
            )}
            {project.direction && (
              <Reveal className="mt-14 border-s border-bronze-500 ps-8">
                <h2 className="eyebrow mb-4">{l.direction}</h2>
                <p className="font-serif text-display-md font-light">{tr(project.direction)}</p>
              </Reveal>
            )}
            {project.features && (
              <div className="mt-14">
                <h2 className="eyebrow mb-4">{l.features}</h2>
                <ul className="space-y-2 text-stone-700">
                  {project.features.map((f) => (
                    <li key={f.en}>{tr(f)}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-14">
              <h2 className="eyebrow mb-4">{l.services}</h2>
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {project.services.map((slug) => {
                  const s = getService(slug)
                  return s ? (
                    <li key={slug}>
                      <Link to={href(`/${slug}/`)} className="link-underline pb-0.5 text-body-sm font-medium">
                        {tr(s.title)}
                      </Link>
                    </li>
                  ) : null
                })}
              </ul>
            </div>
            <Needs items={project.needs} />
          </div>
        </div>
      </section>

      {/* Gallery: one wide frame, then a pair */}
      <section className="pb-section" aria-labelledby="gallery-title">
        <div className="shell">
          <h2 id="gallery-title" className="sr-only">
            {l.gallery}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-10">
            {project.gallery.map((g, i) => (
              <Reveal
                key={i}
                mode="mask"
                delay={(i % 2) * 150}
                className={cn(i === 0 && project.gallery.length % 2 === 1 && 'sm:col-span-2')}
              >
                <Media slot={g} ratio={i === 0 && project.gallery.length % 2 === 1 ? 'aspect-[16/9]' : 'aspect-[4/5]'} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Next project */}
      <section className="border-t border-charcoal-900/10">
        <Link to={href(`/projects/${next.slug}/`)} className="group shell flex items-center justify-between gap-8 py-14 lg:py-20">
          <span>
            <span className="eyebrow block">{l.next}</span>
            <span className="mt-3 block font-serif text-display-lg font-light">
              <span className="link-underline">{tr(next.title)}</span>
            </span>
          </span>
          <Arrow className="h-4 w-10 shrink-0 transition-transform duration-400 group-hover:translate-x-2 rtl:group-hover:-translate-x-2" />
        </Link>
      </section>

      <CtaBand title={t.projects.ctaTitle} text={t.projects.ctaText} />
    </>
  )
}
