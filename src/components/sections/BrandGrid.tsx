import { Link } from 'react-router-dom'
import { brands as allBrands, countryLabels, focusLabels, type Brand } from '@/content/brands'
import { useLanguage } from '@/i18n'
import { Arrow } from '@/components/ui/Links'

/**
 * Brand directory cards. Official logos show in greyscale and take their
 * colours on hover; until logo files are supplied, the brand name is set
 * as a typographic plate.
 */
export function BrandGrid({ brands = allBrands, headingLevel = 3 }: { brands?: Brand[]; compact?: boolean; headingLevel?: 2 | 3 }) {
  const { tr, href } = useLanguage()
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {brands.map((b) => (
        <li key={b.slug}>
          <Link to={href(`/brands/${b.slug}/`)} className="card card-hover group flex h-full flex-col p-5 sm:p-6">
            <span className="self-start rounded-full bg-ivory-200 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-stone-600">
              {tr(countryLabels[b.country])}
            </span>
            <div className="flex flex-1 items-center justify-center py-6">
              {b.logo ? (
                <img src={b.logo} alt={b.name} loading="lazy" className="max-h-12 w-auto opacity-70 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0" />
              ) : (
                <H className="text-center font-heading text-[1.125rem] font-extrabold uppercase tracking-[0.06em] text-charcoal-900 transition-colors group-hover:text-bronze-600 sm:text-[1.25rem]" dir="ltr">
                  {b.name}
                </H>
              )}
            </div>
            <span className="flex items-center justify-between border-t border-charcoal-900/10 pt-3 text-caption text-stone-600">
              {tr(focusLabels[b.focus])}
              <Arrow className="h-3.5 w-3.5 text-bronze-600 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
