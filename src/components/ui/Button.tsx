import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'onDarkGhost'
type Size = 'md' | 'lg'

interface BaseProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  /** Show the trailing directional arrow (mirrors under RTL). */
  arrow?: boolean
}

const base =
  'group relative inline-flex items-center justify-center gap-2.5 rounded-control font-medium ' +
  'transition-all duration-400 ease-premium disabled:pointer-events-none disabled:opacity-50 ' +
  'whitespace-nowrap select-none'

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-body-sm',
  lg: 'px-7 py-3.5 text-body-sm sm:text-body',
}

const variants: Record<Variant, string> = {
  /* Filled brand — the single strongest call on any screen.
     A tonal teal gradient; white text clears 6.4:1 across the whole ramp. */
  primary:
    'bg-gradient-to-br from-brand-500 to-brand-600 text-white ' +
    'shadow-[0_1px_2px_rgb(var(--ink-900)/0.18)] ' +
    'hover:from-brand-600 hover:to-brand-700 hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0',
  /* Outlined — pairs beside primary without competing */
  secondary:
    'bg-white text-ink-900 ring-1 ring-inset ring-sand-300 ' +
    'hover:ring-ink-900/25 hover:bg-sand-50 hover:-translate-y-0.5 active:translate-y-0',
  ghost:
    'text-ink-800 hover:text-brand-700 hover:bg-brand-50 px-3',
  /* On the dark technology / CTA sections — the secondary brand green at full
     strength, carrying dark text. White on #92C640 is only 2.7:1, so the
     secondary earns its presence as a ground, never behind white type. */
  onDark:
    'bg-lime-500 text-ink-950 hover:bg-lime-400 hover:-translate-y-0.5 active:translate-y-0 ' +
    'shadow-[0_2px_10px_-2px_rgb(var(--lime-500)/0.5)] hover:shadow-lift',
  onDarkGhost:
    'text-white ring-1 ring-inset ring-white/25 hover:ring-white/60 hover:bg-white/10 ' +
    'hover:-translate-y-0.5 active:translate-y-0',
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="rtl-flip h-4 w-4 shrink-0 transition-transform duration-400 ease-premium group-hover:translate-x-1"
    >
      <path
        d="M2.5 8h10.5M9 3.75 13.25 8 9 12.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  className,
  arrow,
  ...rest
}: ButtonProps) {
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  )
}

interface LinkButtonProps extends BaseProps {
  to?: string
  href?: string
  external?: boolean
  ariaLabel?: string
  onClick?: () => void
}

/** Same visual language as Button, rendered as a router link or anchor. */
export function LinkButton({
  children,
  to,
  href,
  external,
  variant = 'primary',
  size = 'lg',
  className,
  arrow,
  ariaLabel,
  onClick,
}: LinkButtonProps) {
  const classes = cn(base, sizes[size], variants[variant], className)
  const content = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        onClick={onClick}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  return (
    <Link to={to ?? '/'} aria-label={ariaLabel} onClick={onClick} className={classes}>
      {content}
    </Link>
  )
}

/** Understated inline link with an arrow — used inside cards. */
export function TextLink({
  children,
  to,
  href,
  external,
  onDark,
  className,
}: {
  children: ReactNode
  to?: string
  href?: string
  external?: boolean
  onDark?: boolean
  className?: string
}) {
  const classes = cn(
    'group/link inline-flex items-center gap-2 text-body-sm font-medium transition-colors duration-300',
    onDark ? 'text-lime-300 hover:text-white' : 'text-brand-700 hover:text-brand-800',
    className,
  )

  const content = (
    <>
      <span className="relative">
        {children}
        <span
          className={cn(
            'absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 transition-transform',
            'duration-400 ease-premium group-hover/link:scale-x-100',
            onDark ? 'bg-lime-300' : 'bg-brand-700',
          )}
        />
      </span>
      <svg viewBox="0 0 16 16" aria-hidden="true" className="rtl-flip h-3.5 w-3.5 shrink-0 transition-transform duration-400 ease-premium group-hover/link:translate-x-1">
        <path d="M2.5 8h10.5M9 3.75 13.25 8 9 12.25" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {content}
      </a>
    )
  }
  return (
    <Link to={to ?? '/'} className={classes}>
      {content}
    </Link>
  )
}
