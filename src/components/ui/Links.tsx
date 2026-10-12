import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/hooks'
import { track } from '@/lib/analytics'

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" fill="none" aria-hidden="true" className={cn('h-3 w-6 flip-rtl', className)}>
      <path d="M0 6h22M17 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

interface ButtonProps {
  to: string
  children: ReactNode
  variant?: 'solid' | 'outline' | 'light' | 'ghost-light'
  className?: string
  external?: boolean
  onClick?: () => void
  track?: string
}

const variants = {
  solid: 'bg-charcoal-900 text-ivory-50 hover:bg-charcoal-700',
  outline: 'border border-charcoal-900/40 text-charcoal-900 hover:border-charcoal-900 hover:bg-charcoal-900 hover:text-ivory-50',
  light: 'bg-ivory-50 text-charcoal-900 hover:bg-bronze-200',
  'ghost-light': 'border border-ivory-50/50 text-ivory-50 hover:border-ivory-50 hover:bg-ivory-50 hover:text-charcoal-900',
}

/** Rectangular, uppercase button. Square corners keep it architectural. */
export function Button({ to, children, variant = 'solid', className, external, onClick, track: trackLabel }: ButtonProps) {
  const classes = cn(
    'group inline-flex min-h-[3.25rem] items-center justify-center gap-4 px-7 text-caption font-semibold uppercase tracking-[0.16em] transition-colors duration-400 ease-silk',
    variants[variant],
    className,
  )
  const handle = () => {
    if (trackLabel) track('cta_click', { label: trackLabel })
    onClick?.()
  }
  const content = (
    <>
      <span>{children}</span>
      <Arrow className="transition-transform duration-400 ease-silk group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
    </>
  )
  if (external || /^(https?:|tel:|mailto:)/.test(to)) {
    return (
      <a href={to} className={classes} onClick={handle} {...(to.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {content}
      </a>
    )
  }
  return (
    <Link to={to} className={classes} onClick={handle}>
      {content}
    </Link>
  )
}

/** Inline text link with an animated underline and arrow. */
export function ArrowLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={cn('group inline-flex items-center gap-3 text-caption font-semibold uppercase tracking-[0.16em]', className)}>
      <span className="link-underline pb-1">{children}</span>
      <Arrow className="transition-transform duration-400 ease-silk group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
    </Link>
  )
}
