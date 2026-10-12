import { Link } from 'react-router-dom'
import type { Service } from '@/content/services'
import { useLanguage } from '@/i18n'
import { cn } from '@/lib/hooks'
import { Media } from '@/components/ui/Media'
import { Arrow } from '@/components/ui/Links'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Editorial services grid. Panels alternate between tall and wide frames on
 * a 12-column grid so the six services read as a composed spread, not a
 * row of identical cards. The whole panel is the link.
 */
const spans = [
  'lg:col-span-7',
  'lg:col-span-5 lg:mt-32',
  'lg:col-span-5',
  'lg:col-span-7 lg:mt-20',
  'lg:col-span-6',
  'lg:col-span-6 lg:mt-24',
]
const ratios = [
  'aspect-[4/3]',
  'aspect-[4/5]',
  'aspect-[4/5]',
  'aspect-[4/3]',
  'aspect-[5/4]',
  'aspect-[5/4]',
]

export function ServicePanels({ items, headingLevel = 3 }: { items: Service[]; headingLevel?: 2 | 3 }) {
  const { t, tr, href } = useLanguage()
  const H = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <ul className="grid gap-x-10 gap-y-20 md:grid-cols-2 lg:grid-cols-12 lg:gap-y-28">
      {items.map((s, i) => (
        <li key={s.slug} className={cn(spans[i % spans.length])}>
          <Reveal delay={(i % 2) * 120}>
            <Link to={href(`/${s.slug}/`)} className="group block">
              <Media slot={s.hero} ratio={ratios[i % ratios.length]} zoom decorative sizes="(min-width: 1024px) 50vw, 100vw" />
              <div className="mt-7 flex items-start gap-6">
                <span className="pt-2 text-caption font-semibold text-bronze-600">{s.index}</span>
                <div className="flex-1">
                  <H className="font-serif text-display-md text-charcoal-900">{tr(s.title)}</H>
                  <p className="mt-3 max-w-md text-body-sm text-stone-700">{tr(s.short)}</p>
                  <span className="mt-5 inline-flex items-center gap-3 text-caption font-semibold uppercase tracking-[0.16em] text-charcoal-900">
                    <span className="link-underline pb-1">{t.common.discover}</span>
                    <Arrow className="transition-transform duration-400 ease-silk group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
