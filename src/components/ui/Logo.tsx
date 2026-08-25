import { cn } from '@/lib/cn'

/**
 * Atmaal wordmark.
 *
 * ▸ REPLACE WITH THE OFFICIAL ASSET: drop the supplied SVG into
 *   `public/images/atmaal-logo.svg` and swap the markup below for an
 *   `<img>` pointing at it. Every usage across the site renders through
 *   this component, so the change is made once.
 *
 * The mark is an "A" formed from two ascending strokes and a crossbar —
 * built from the same geometry as the data lines used across the site.
 */

interface LogoProps {
  /** `light` for dark backgrounds, `dark` for white ones. */
  variant?: 'light' | 'dark'
  className?: string
  /** Render the mark alone, without the wordmark. */
  markOnly?: boolean
}

export function Logo({ variant = 'dark', className, markOnly }: LogoProps) {
  const isLight = variant === 'light'

  return (
    /* dir="ltr" keeps the lockup in its designed order (mark, then wordmark)
       in both languages — a fixed brand asset should not mirror. */
    <span dir="ltr" className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 40 40"
        className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
        role="img"
        aria-label="Atmaal"
      >
        <defs>
          <linearGradient id="atmaal-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--brand-500))" />
            <stop offset="100%" stopColor="rgb(var(--azure-700))" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="9" fill="url(#atmaal-mark)" />
        <path
          d="M11 28.5 20 11.5l9 17"
          fill="none"
          stroke="#fff"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M15.4 23.4h9.2" fill="none" stroke="#fff" strokeWidth="3.1" strokeLinecap="round" />
        {/* Node accents — echoes the data-point language used site-wide */}
        <circle cx="20" cy="11.5" r="1.9" fill="rgb(var(--glow))" />
      </svg>

      {!markOnly && (
        /* Real text, not SVG: an SVG <text> inherits the document's RTL
           direction and renders outside its own viewBox in Arabic. */
        <span
          dir="ltr"
          className={cn(
            'font-display text-[1.375rem] font-semibold leading-none tracking-[-0.03em] sm:text-[1.5rem]',
            isLight ? 'text-white' : 'text-ink-900',
          )}
        >
          atmaal
        </span>
      )}
    </span>
  )
}
