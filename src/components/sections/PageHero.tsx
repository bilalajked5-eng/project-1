import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home as HomeIcon } from 'lucide-react'
import type { MediaSlot } from '@/content/types'
import { media as siteMedia } from '@/content/media'
import { useLanguage } from '@/i18n'
import { cn } from '@/lib/hooks'
import { Media } from '@/components/ui/Media'

export interface Crumb {
  label: string
  path: string
}

export function Breadcrumbs({ items, dark }: { items: Crumb[]; dark?: boolean }) {
  const { t, href } = useLanguage()
  return (
    <nav aria-label={t.a11y.breadcrumb}>
      <ol className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm', dark ? 'text-white/75' : 'text-stone-600')}>
        {items.map((c, i) => (
          <li key={c.path} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60 flip-rtl" aria-hidden="true" />}
            {i === items.length - 1 ? (
              <span aria-current="page" className={cn('font-semibold', dark ? 'text-bronze-300' : 'text-charcoal-900')}>
                {c.label}
              </span>
            ) : (
              <Link to={href(c.path)} className="flex items-center gap-1.5 hover:text-bronze-300">
                {i === 0 && <HomeIcon className="h-3.5 w-3.5" aria-hidden="true" />}
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

interface PageHeroProps {
  eyebrow: string
  title: string
  lead?: string
  crumbs: Crumb[]
  media?: MediaSlot
  /** Legacy prop from the previous layout; every inner page now opens on the same banner. */
  layout?: 'split' | 'banner' | 'text'
  aside?: ReactNode
}

/** Inner-page banner: dark photo, breadcrumb, title and intro. */
export function PageHero({ eyebrow, title, lead, crumbs, media, aside }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal-950 text-white">
      <Media slot={media ?? siteMedia.hero} fill priority decorative className="-z-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/85 to-charcoal-950/55 rtl:bg-gradient-to-l" />
      <div className="shell page-enter py-16 lg:py-24">
        <Breadcrumbs items={crumbs} dark />
        <div className="on-dark mt-8 max-w-3xl">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="font-heading text-display-2xl font-extrabold">{title}</h1>
          {lead && <p className="mt-5 text-lead text-white/80">{lead}</p>}
          {aside}
        </div>
      </div>
    </section>
  )
}
