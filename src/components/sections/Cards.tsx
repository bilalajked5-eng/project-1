import { Link } from 'react-router-dom'
import {
  BedDouble,
  Briefcase,
  ClipboardList,
  Home as HomeIcon,
  KeyRound,
  Lamp,
  MapPin,
  PenTool,
  Sofa,
  type LucideIcon,
} from 'lucide-react'
import type { Service } from '@/content/services'
import { categoryLabels, type Project } from '@/content/projects'
import { useLanguage } from '@/i18n'
import { cn } from '@/lib/hooks'
import { Media } from '@/components/ui/Media'
import { Arrow } from '@/components/ui/Links'

export const serviceIcons: Record<string, LucideIcon> = {
  'project-furniture-design-supply': Sofa,
  'interior-design-furnishing': PenTool,
  'office-furnishing-fit-out-solutions': Briefcase,
  'hospitality-furnishing-solutions': BedDouble,
  'end-to-end-project-management-services': ClipboardList,
  'turnkey-project-solutions': KeyRound,
  'residential-interior-design-furnishing': HomeIcon,
  'styling-furnishing': Lamp,
}

/** Icon card with a large faded index number, as in the services grid. */
export function ServiceCard({ service, headingLevel = 3 }: { service: Service; headingLevel?: 2 | 3 }) {
  const { t, tr, href } = useLanguage()
  const Icon = serviceIcons[service.slug] ?? Sofa
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <Link to={href(`/${service.slug}/`)} className="card card-hover group relative flex h-full flex-col overflow-hidden p-7">
      <span aria-hidden="true" className="absolute end-5 top-3 font-heading text-[3.5rem] font-extrabold leading-none text-charcoal-900/[0.06]">
        {service.index.padStart(2, '0')}
      </span>
      <span className="icon-tile transition-colors duration-300 group-hover:bg-bronze-500 group-hover:text-charcoal-950">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <H className="mt-6 font-heading text-[1.25rem] font-bold leading-snug text-charcoal-900">{tr(service.title)}</H>
      <p className="mt-3 flex-1 text-body-sm text-stone-600">{tr(service.short)}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-body-sm font-semibold text-bronze-600 group-hover:text-charcoal-900">
        {t.homeX.explore}
        <Arrow className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </span>
    </Link>
  )
}

/** Service card with a photo header, used on the services index. */
export function ServicePhotoCard({ service, headingLevel = 3 }: { service: Service; headingLevel?: 2 | 3 }) {
  const { t, tr, href } = useLanguage()
  const Icon = serviceIcons[service.slug] ?? Sofa
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <Link to={href(`/${service.slug}/`)} className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative">
        <Media slot={service.hero} ratio="aspect-[16/10]" zoom decorative sizes="(min-width: 1024px) 33vw, 100vw" />
        <span className="absolute -bottom-6 start-6 flex h-12 w-12 items-center justify-center rounded-xl bg-bronze-500 text-charcoal-950 shadow-lift">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7 pt-10">
        <H className="font-heading text-[1.25rem] font-bold leading-snug">{tr(service.title)}</H>
        <p className="mt-3 flex-1 text-body-sm text-stone-600">{tr(service.short)}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-body-sm font-semibold text-bronze-600 group-hover:text-charcoal-900">
          {t.homeX.explore}
          <Arrow className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

/** Project tile: image with a dark gradient, category tag and title over it. */
export function ProjectTile({ project, className, tall, headingLevel = 3 }: { project: Project; className?: string; tall?: boolean; headingLevel?: 2 | 3 }) {
  const { tr, href } = useLanguage()
  const H = headingLevel === 2 ? 'h2' : 'h3'
  const place = [project.location && tr(project.location), project.year].filter(Boolean).join(' · ')
  return (
    <Link to={href(`/projects/${project.slug}/`)} className={cn('group relative block overflow-hidden rounded-card bg-charcoal-900', className)}>
      <Media slot={project.cover} ratio={tall ? 'aspect-[4/5]' : 'aspect-[4/3]'} zoom decorative sizes="(min-width: 1024px) 33vw, 100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <span className="inline-block rounded-full bg-bronze-500 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-charcoal-950">
          {tr(categoryLabels[project.category])}
        </span>
        <H className="mt-3 font-heading text-[1.375rem] font-bold leading-snug text-white">{tr(project.title)}</H>
        {place && (
          <p className="mt-1 flex items-center gap-1.5 text-body-sm text-white/80">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {place}
          </p>
        )}
      </div>
    </Link>
  )
}

/** Section heading block used across pages: eyebrow, title, optional intro. */
export function SectionHead({
  eyebrow,
  title,
  text,
  id,
  align = 'start',
  dark,
  className,
}: {
  eyebrow: string
  title: string
  text?: string
  id?: string
  align?: 'start' | 'center'
  dark?: boolean
  className?: string
}) {
  return (
    <div className={cn(align === 'center' && 'mx-auto max-w-3xl text-center', dark && 'on-dark', className)}>
      <p className={cn('eyebrow mb-4', align === 'center' && 'justify-center')}>{eyebrow}</p>
      <h2 id={id} className={cn('font-heading text-display-xl font-extrabold', dark ? 'text-white' : 'text-charcoal-900')}>
        {title}
      </h2>
      {text && <p className={cn('mt-5 max-w-2xl text-lead', align === 'center' && 'mx-auto', dark ? 'text-white/75' : 'text-stone-600')}>{text}</p>}
    </div>
  )
}
