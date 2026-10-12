import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { useLanguage } from '@/i18n'
import { categoryLabels, projectRoster, projects, type ProjectCategory } from '@/content/projects'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { cn } from '@/lib/hooks'
import { PageHero } from '@/components/sections/PageHero'
import { ProjectTile, SectionHead } from '@/components/sections/Cards'
import { CtaBand } from '@/components/sections/CtaBand'
import { Reveal } from '@/components/ui/Reveal'

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
      <PageHero eyebrow={p.eyebrow} title={p.title} lead={p.lead} crumbs={crumbs} />

      <section className="py-section">
        <div className="shell">
          <div role="group" aria-label={p.labels.category} className="flex flex-wrap gap-2">
            {(['all', ...categories] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
                className={cn(
                  'rounded-full border px-5 py-2.5 text-body-sm font-semibold transition-colors',
                  filter === c ? 'border-bronze-500 bg-bronze-500 text-charcoal-950' : 'border-charcoal-900/15 bg-white hover:border-charcoal-900',
                )}
              >
                {c === 'all' ? p.all : tr(categoryLabels[c])}
              </button>
            ))}
          </div>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            {visible.map((project, i) => (
              <Reveal as="li" key={project.slug} delay={(i % 3) * 80}>
                <ProjectTile project={project} tall headingLevel={2} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ivory-200 py-section" aria-labelledby="roster-title">
        <div className="shell">
          <SectionHead id="roster-title" eyebrow={p.eyebrow} title={p.rosterTitle} text={p.rosterText} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectRoster.map((r) => (
              <li key={r.en} className="card flex items-center gap-4 p-5">
                <span className="icon-tile h-11 w-11">
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-heading text-[1.0625rem] font-bold">{tr(r)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="pt-section">
        <CtaBand title={p.ctaTitle} text={p.ctaText} />
      </div>
    </>
  )
}
