import type { ElementType, ReactNode } from 'react'
import { useInView } from '@/lib/hooks'
import { cn } from '@/lib/cn'

interface RevealProps {
  children: ReactNode
  /** Stagger in milliseconds — keep increments small (60–90ms) so groups feel like one gesture. */
  delay?: number
  className?: string
  as?: ElementType
  threshold?: number
}

/**
 * Fade-and-rise on first entry. The animation lives in CSS (`.reveal`), so it
 * collapses automatically under `prefers-reduced-motion`.
 */
export function Reveal({ children, delay = 0, className, as: Tag = 'div', threshold }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(threshold ? { threshold } : {})

  return (
    <Tag
      ref={ref}
      data-visible={inView}
      className={cn('reveal', className)}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
