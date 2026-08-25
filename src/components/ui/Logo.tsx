import { cn } from '@/lib/cn'

/**
 * Atmaal wordmark.
 *
 * ▸ REPLACING WITH THE MASTER ASSET: overwrite these two files —
 *     public/images/atmaal-logo.svg        (brand green, for light grounds)
 *     public/images/atmaal-logo-light.svg  (white, for dark grounds)
 *   No code change is needed; every usage (header, mobile menu, footer)
 *   renders through this component.
 *
 * The files currently shipped are a trace of the supplied wordmark: a
 * monoline geometric lowercase set with round terminals. They match the
 * proportions and colour, but they are a redraw, not the original outlines —
 * drop the master file in before the site goes live.
 */

interface LogoProps {
  /** `light` for dark backgrounds, `dark` for white ones. */
  variant?: 'light' | 'dark'
  className?: string
}

export function Logo({ variant = 'dark', className }: LogoProps) {
  const src = variant === 'light' ? '/images/atmaal-logo-light.svg' : '/images/atmaal-logo.svg'

  return (
    <img
      src={src}
      alt="Atmaal"
      /* A fixed brand asset does not mirror in Arabic */
      dir="ltr"
      width={132}
      height={29}
      className={cn('h-7 w-auto shrink-0 select-none sm:h-8', className)}
    />
  )
}
