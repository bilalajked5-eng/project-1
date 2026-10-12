import { useState } from 'react'
import { useLanguage } from '@/i18n'
import { categoryLabels, projectRoster, projects, type ProjectCategory } from '@/content/projects'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { cn } from '@/lib/hooks'
import { PageHero } from '@/components/sections/PageHero'
import { ProjectCard } from '@/components/sections/ProjectCard'
import { CtaBand } from '@/components/sections/CtaBand'
import { Reveal } from '@/components/ui/Reveal'

/** Alternating column placements give the grid an editorial, staggered rhythm. */
const placements = [
  { col: 'lg:col-span-7', ratio: 'aspect-[4/3]' },
  { col: 'lg:col-span-4 lg:col-start-9 lg:mt-36', ratio: 'aspect-[4/5]' },
  { col: 'lg:col-span-5 lg:col-start-2', ratio: 'aspect-[4/5]' },
  { col: 'lg:col-span-6 lg:col-start-7 lg:mt-24', ratio: 'aspect-[5/4]' },
]

export function ProjectsPage() {
  const { t, tr, locale } = useLanguage()
  const p = t.projects
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all')
  const categories = Array.from(new Set(projects.map((x) => x.category)))
  const visible = filter === 'all' ? projects : projects.filter((x) => x.category === filter)
  const crumbs = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.projects, path: '/our-projects/' },
  ]

  return (
    <>
      <Seo title={p.meta.title} description={p.meta.description} path="/our-projects/" jsonLd={[breadcrumbSchema(locale, crumbs.map((c) => ({ name: c.label, path: c.path })))]} />
      <PageHero eyebrow={p.eyebrow} title={p.title} lead={p.lead} crumbs={crumbs} layout="text" />

      <section className="pb-section pt-16">
        <div className="shell">
          <div role="group" aria-label={p.labels.category} className="no-scrollbar -mx-gutter flex gap-2 overflow-x-auto px-gutter pb-2">
            {(['all', ...categories] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
                className={cn(
                  'shrink-0 border px-5 py-2.5 text-caption font-semibold uppercase tracking-[0.14em] transition-colors duration-400',
                  filter === c ? 'border-charcoal-900 bg-charcoal-900 text-ivory-50' : 'border-charcoal-900/20 text-charcoal-900 hover:border-charcoal-900',
                )}
              >
                {c === 'all' ? p.all : tr(categoryLabels[c])}
              </button>
            ))}
          </div>

          <ul className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-28" aria-live="polite">
            {visible.map((project, i) => {
              const place = placements[i % placements.length]
              return (
                <li key={project.slug} className={place.col}>
                  <Reveal>
                    <ProjectCard project={project} ratio={place.ratio} size={i % 4 === 0 ? 'lg' : 'md'} headingLevel={2} />
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="border-t border-charcoal-900/10 bg-ivory-200 py-section" aria-labelledby="roster-title">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 id="roster-title" className="font-serif text-display-lg font-light">
              {p.rosterTitle}
            </h2>
            <p className="mt-6 text-body-sm text-stone-700">{p.rosterText}</p>
          </div>
          <ul className="grid border-t border-charcoal-900/15 sm:grid-cols-2 lg:col-span-8">
            {projectRoster.map((r) => (
              <li key={r.en} className="border-b border-charcoal-900/15 py-5 font-serif text-[1.375rem] leading-snug sm:pe-6">
                {tr(r)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={p.ctaTitle} text={p.ctaText} />
    </>
  )
}
