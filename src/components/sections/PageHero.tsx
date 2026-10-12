import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { MediaSlot } from '@/content/types'
import { useLanguage } from '@/i18n'
import { cn } from '@/lib/hooks'
import { Media } from '@/components/ui/Media'
import { MaskedHeading, Reveal } from '@/components/ui/Reveal'

export interface Crumb {
  label: string
  path: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { t, href } = useLanguage()
  return (
    <nav aria-label={t.a11y.breadcrumb}>
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-stone-600">
        {items.map((c, i) => (
          <li key={c.path} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-charcoal-900">
                {c.label}
              </span>
            ) : (
              <Link to={href(c.path)} className="link-underline hover:text-charcoal-900">
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
  /** `split` puts the image beside the title; `banner` runs it full width below. */
  layout?: 'split' | 'banner' | 'text'
  aside?: ReactNode
}

/** Shared top of every inner page. Three layouts keep page openings varied. */
export function PageHero({ eyebrow, title, lead, crumbs, media, layout = 'split', aside }: PageHeroProps) {
  const words = title
  return (
    <section className="page-enter pt-[calc(var(--header-h)+2.5rem)] lg:pt-40">
      <div className="shell">
        <Breadcrumbs items={crumbs} />
      </div>

      <div className={cn('shell mt-10 grid gap-12 lg:mt-14', layout === 'split' && media && 'lg:grid-cols-12 lg:items-end')}>
        <div className={cn(layout === 'split' && media ? 'lg:col-span-6' : 'max-w-5xl')}>
          <p className="eyebrow mb-6">{eyebrow}</p>
          <MaskedHeading as="h1" lines={[words]} className="font-serif text-display-2xl font-light text-charcoal-900" />
          {lead && (
            <Reveal delay={200}>
              <p className="mt-8 max-w-prose text-lead text-stone-700">{lead}</p>
            </Reveal>
          )}
          {aside && <Reveal delay={300}>{aside}</Reveal>}
        </div>
        {layout === 'split' && media && (
          <Reveal mode="mask" className="lg:col-span-6" delay={150}>
            <Media slot={media} ratio="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]" priority parallax />
          </Reveal>
        )}
      </div>

      {layout === 'banner' && media && (
        <Reveal mode="mask" className="mt-16 lg:mt-24" delay={150}>
          <Media slot={media} ratio="aspect-[4/3] sm:aspect-[16/7]" priority parallax />
        </Reveal>
      )}
    </section>
  )
}
