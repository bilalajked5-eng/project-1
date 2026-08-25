import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface CardProps {
  children: ReactNode
  className?: string
  /** Adds the lift-and-shadow hover treatment. */
  interactive?: boolean
  tone?: 'light' | 'dark' | 'glass'
  as?: 'div' | 'article' | 'li'
}

const tones = {
  light: 'bg-white ring-1 ring-sand-200 shadow-soft',
  dark: 'bg-ink-900 ring-1 ring-white/10',
  /* Glass is reserved for use over the dark technology visuals */
  glass: 'bg-white/[0.045] ring-1 ring-white/10 backdrop-blur-xl',
}

export function Card({ children, className, interactive, tone = 'light', as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={cn(
        'relative overflow-hidden rounded-card',
        tones[tone],
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-500 ease-premium ' +
            'hover:-translate-y-1.5 hover:shadow-lift focus-within:-translate-y-1.5 focus-within:shadow-lift',
        interactive && tone === 'light' && 'hover:ring-sand-300',
        interactive && tone !== 'light' && 'hover:ring-white/25',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/** Thin gradient hairline used to mark the active edge of a card. */
export function CardAccent({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0',
        'bg-gradient-to-r from-brand-500 via-brand-400 to-lime-500',
        'transition-transform duration-700 ease-premium group-hover:scale-x-100',
        className,
      )}
    />
  )
}
