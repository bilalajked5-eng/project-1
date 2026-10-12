import { Link } from 'react-router-dom'
import { categoryLabels, type Project } from '@/content/projects'
import { useLanguage } from '@/i18n'
import { cn } from '@/lib/hooks'
import { Media } from '@/components/ui/Media'
import { Arrow } from '@/components/ui/Links'

interface ProjectCardProps {
  project: Project
  ratio?: string
  size?: 'lg' | 'md'
  headingLevel?: 2 | 3
  className?: string
}

/** Portfolio tile: image first, minimal label beneath, the whole tile links. */
export function ProjectCard({ project, ratio = 'aspect-[4/5]', size = 'md', headingLevel = 3, className }: ProjectCardProps) {
  const { t, tr, href } = useLanguage()
  const H = headingLevel === 2 ? 'h2' : 'h3'
  const meta = [tr(categoryLabels[project.category]), project.location && tr(project.location), project.year].filter(Boolean)

  return (
    <Link to={href(`/projects/${project.slug}/`)} className={cn('group block', className)}>
      <div className="relative">
        <Media slot={project.cover} ratio={ratio} zoom decorative sizes="(min-width: 1024px) 50vw, 100vw" />
        <span className="absolute bottom-0 end-0 flex h-14 w-14 items-center justify-center bg-ivory-100 text-charcoal-900 opacity-0 transition-opacity duration-700 ease-silk group-hover:opacity-100 group-focus-visible:opacity-100">
          <Arrow />
          <span className="sr-only">{t.common.viewProject}</span>
        </span>
      </div>
      <div className="mt-6 flex items-baseline justify-between gap-6 border-t border-charcoal-900/15 pt-5">
        <H className={cn('font-serif text-charcoal-900', size === 'lg' ? 'text-display-lg' : 'text-display-md')}>
          <span className="link-underline">{tr(project.title)}</span>
        </H>
      </div>
      <p className="mt-2 text-caption uppercase tracking-[0.14em] text-stone-600">{meta.join(' · ')}</p>
    </Link>
  )
}
