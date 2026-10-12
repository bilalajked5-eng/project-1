import { cn } from '@/lib/hooks'

/**
 * Projects World logo.
 *
 * Set `LOGO_SRC` (and `LOGO_SRC_LIGHT` for dark grounds) to the original
 * logo files exported from the current website. Until then a neutral
 * typographic name plate is shown. It is not a redesign of the logo and
 * should not be used as one.
 */
const LOGO_SRC = ''
const LOGO_SRC_LIGHT = ''

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  const src = light ? LOGO_SRC_LIGHT || LOGO_SRC : LOGO_SRC
  if (src) {
    return <img src={src} alt="Projects World" width={180} height={48} className={cn('h-10 w-auto', className)} />
  }
  return (
    <span className={cn('flex flex-col leading-none', light ? 'text-ivory-50' : 'text-charcoal-900', className)} dir="ltr">
      <span className="font-['Cormorant',serif] text-[1.6rem] font-medium tracking-[0.04em]">Projects World</span>
      <span className={cn('mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.38em]', light ? 'text-bronze-300' : 'text-bronze-600')}>
        Furnishing · Interiors
      </span>
    </span>
  )
}
