import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/hooks'
import { track } from '@/lib/analytics'

export function Arrow({ className }: { className?: string }) {
  return <ArrowRight aria-hidden="true" className={cn('h-4 w-4 flip-rtl', className)} strokeWidth={2.25} />
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 448 512" aria-hidden="true" className={cn('h-4 w-4 fill-current', className)}>
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  )
}

type Variant = 'gold' | 'dark' | 'outline' | 'outline-light' | 'whatsapp' | 'solid' | 'light' | 'ghost-light'

interface ButtonProps {
  to: string
  children: ReactNode
  variant?: Variant
  className?: string
  external?: boolean
  onClick?: () => void
  track?: string
  icon?: 'arrow' | 'whatsapp' | 'none'
}

// Older variant names map onto the current palette
const variantClass: Record<Variant, string> = {
  gold: 'btn-gold',
  light: 'btn-gold',
  dark: 'btn-dark',
  solid: 'btn-dark',
  outline: 'btn-outline',
  'outline-light': 'btn-outline-light',
  'ghost-light': 'btn-outline-light',
  whatsapp: 'btn-whatsapp',
}

export function Button({ to, children, variant = 'gold', className, external, onClick, track: trackLabel, icon = 'arrow' }: ButtonProps) {
  const classes = cn('btn group', variantClass[variant], className)
  const handle = () => {
    if (trackLabel) track(variant === 'whatsapp' ? 'whatsapp_click' : 'cta_click', { label: trackLabel })
    onClick?.()
  }
  const content = (
    <>
      {icon === 'whatsapp' && <WhatsAppIcon />}
      <span>{children}</span>
      {icon === 'arrow' && <Arrow className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />}
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

/** Inline text link with arrow. */
export function ArrowLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={cn('group inline-flex items-center gap-2 text-body-sm font-semibold text-bronze-600 hover:text-charcoal-900', className)}>
      <span>{children}</span>
      <Arrow className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
    </Link>
  )
}
