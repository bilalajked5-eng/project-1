import { Link } from 'react-router-dom'
import { brands as allBrands, countryLabels, focusLabels, type Brand } from '@/content/brands'
import { useLanguage } from '@/i18n'
import { cn } from '@/lib/hooks'

/**
 * Brand directory. Official logos render in monochrome and take their
 * original colours on hover; until logo files are supplied, each tile shows
 * the brand name as a typographic plate with its origin and speciality.
 */
export function BrandGrid({ brands = allBrands, compact, headingLevel = 3 }: { brands?: Brand[]; compact?: boolean; headingLevel?: 2 | 3 }) {
  const { tr, href } = useLanguage()
  const H = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <ul className={cn('grid grid-cols-2 border-s border-t border-charcoal-900/15 sm:grid-cols-3', compact ? 'lg:grid-cols-4' : 'lg:grid-cols-4 xl:grid-cols-4')}>
      {brands.map((b) => (
        <li key={b.slug} className="border-b border-e border-charcoal-900/15">
          <Link
            to={href(`/brands/${b.slug}/`)}
            className={cn(
              'group relative flex flex-col justify-between overflow-hidden p-5 transition-colors duration-700 ease-silk hover:bg-ivory-50 sm:p-7',
              compact ? 'aspect-[3/2]' : 'aspect-[4/3]',
            )}
          >
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-stone-600" dir="auto">
              {tr(countryLabels[b.country])}
            </span>
            {b.logo ? (
              <img
                src={b.logo}
                alt={b.name}
                loading="lazy"
                className="mx-auto max-h-12 w-auto max-w-[75%] opacity-70 grayscale transition-[filter,opacity] duration-700 group-hover:opacity-100 group-hover:grayscale-0"
              />
            ) : (
              <H className="text-center font-['Cormorant',serif] text-[1.5rem] font-medium leading-tight tracking-[0.02em] text-charcoal-800 transition-colors duration-700 group-hover:text-bronze-600 sm:text-[1.875rem]" dir="ltr">
                {b.name}
              </H>
            )}
            <span className="flex items-center justify-between text-caption text-stone-600">
              <span>{tr(focusLabels[b.focus])}</span>
              <span aria-hidden="true" className="translate-y-2 opacity-0 transition-[opacity,transform] duration-700 ease-silk group-hover:translate-y-0 group-hover:opacity-100">
                ↗
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
