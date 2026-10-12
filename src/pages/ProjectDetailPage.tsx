import { Link } from 'react-router-dom'
import { CalendarDays, CheckCircle2, MapPin, Palette, Tag } from 'lucide-react'
import { useLanguage, localePath } from '@/i18n'
import { categoryLabels, getProject, projects } from '@/content/projects'
import { getService } from '@/content/services'
import { SITE_URL } from '@/content/company'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { cn } from '@/lib/hooks'
import { PageHero } from '@/components/sections/PageHero'
import { ProjectTile, SectionHead } from '@/components/sections/Cards'
import { CtaBand } from '@/components/sections/CtaBand'
import { Media } from '@/components/ui/Media'
import { Button } from '@/components/ui/Links'
import { Reveal } from '@/components/ui/Reveal'
import { Needs } from '@/components/ui/Needs'

export function ProjectDetailPage({ slug }: { slug: string }) {
  const { t, tr, href, locale } = useLanguage()
  const l = t.projects.labels
  const project = getProject(slug)!
  const title = tr(project.title)
  const index = projects.findIndex((p) => p.slug === slug)
  const others = [1, 2, 3].map((n) => projects[(index + n) % projects.length])
  const crumbs = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.projects, path: '/our-projects/' },
    { label: title, path: `/projects/${slug}/` },
  ]

  const facts = [
    { icon: Tag, label: l.category, value: tr(categoryLabels[project.category]) },
    project.location && { icon: MapPin, label: l.location, value: tr(project.location) },
    project.year && { icon: CalendarDays, label: l.year, value: project.year },
    project.style && { icon: Palette, label: l.style, value: tr(project.style) },
  ].filter(Boolean) as Array<{ icon: typeof Tag; label: string; value: string }>

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
      <PageHero eyebrow={tr(categoryLabels[project.category])} title={title} lead={tr(project.summary)} crumbs={crumbs} />

      <section className="py-section">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Media slot={project.cover} ratio="aspect-[16/10]" className="rounded-card" priority sizes="(min-width: 1024px) 66vw, 100vw" />

            {project.overview && (
              <div className="mt-10">
                <h2 className="font-heading text-display-md font-extrabold">{l.overview}</h2>
                {project.overview.map((p, i) => (
                  <p key={i} className={cn('mt-4', i === 0 ? 'text-lead text-charcoal-900' : 'text-stone-600')}>
                    {tr(p)}
                  </p>
                ))}
              </div>
            )}

            {project.direction && (
              <div className="mt-10 rounded-card border-s-4 border-bronze-500 bg-ivory-200 p-7">
                <h2 className="font-heading text-[1.125rem] font-bold">{l.direction}</h2>
                <p className="mt-2 text-stone-700">{tr(project.direction)}</p>
              </div>
            )}

            {project.features && (
              <div className="mt-10">
                <h2 className="font-heading text-[1.25rem] font-bold">{l.features}</h2>
                <ul className="mt-4 space-y-2">
                  {project.features.map((f) => (
                    <li key={f.en} className="flex items-center gap-2.5 text-stone-700">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-bronze-500" aria-hidden="true" />
                      {tr(f)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <h2 className="sr-only">{l.gallery}</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {project.gallery.map((g, i) => (
                <Reveal key={i} className={cn(i === 0 && project.gallery.length % 2 === 1 && 'sm:col-span-2')}>
                  <Media slot={g} ratio={i === 0 && project.gallery.length % 2 === 1 ? 'aspect-[16/9]' : 'aspect-[4/3]'} className="rounded-card" />
                </Reveal>
              ))}
            </div>
            <Needs items={project.needs} />
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="card p-7">
                <dl className="space-y-4">
                  {facts.map((f) => (
                    <div key={f.label} className="flex items-start gap-4">
                      <span className="icon-tile h-11 w-11">
                        <f.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <dt className="text-caption font-semibold uppercase tracking-[0.08em] text-stone-600">{f.label}</dt>
                        <dd className="mt-0.5 font-semibold">{f.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <h2 className="mt-7 border-t border-charcoal-900/10 pt-6 font-heading text-[1.0625rem] font-bold">{l.scope}</h2>
                <ul className="mt-3 space-y-2">
                  {project.scope.map((s) => (
                    <li key={s.en} className="flex items-center gap-2.5 text-body-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-bronze-500" aria-hidden="true" />
                      {tr(s)}
                    </li>
                  ))}
                </ul>
                <h2 className="mt-7 border-t border-charcoal-900/10 pt-6 font-heading text-[1.0625rem] font-bold">{l.services}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.services.map((s) => {
                    const svc = getService(s)
                    return svc ? (
                      <li key={s}>
                        <Link to={href(`/${s}/`)} className="inline-block rounded-full bg-ivory-200 px-3 py-1.5 text-caption font-semibold hover:bg-bronze-500">
                          {tr(svc.title)}
                        </Link>
                      </li>
                    ) : null
                  })}
                </ul>
              </div>
              <div className="rounded-card bg-charcoal-900 p-7 text-white">
                <p className="font-heading text-[1.25rem] font-bold">{t.projects.ctaTitle}</p>
                <p className="mt-2 text-body-sm text-white/75">{t.projects.ctaText}</p>
                <Button to={href('/contact/') + '#inquiry'} className="mt-6 w-full" track={`project_${slug}`}>
                  {t.nav.cta}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-ivory-200 py-section" aria-labelledby="more-projects">
        <div className="shell">
          <SectionHead id="more-projects" eyebrow={t.homeX.projectsEyebrow} title={l.next} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <li key={p.slug}>
                <ProjectTile project={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="pt-section">
        <CtaBand title={t.projects.ctaTitle} text={t.projects.ctaText} />
      </div>
    </>
  )
}
