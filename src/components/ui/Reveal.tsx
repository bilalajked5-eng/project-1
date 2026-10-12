import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn, useInView } from '@/lib/hooks'

interface RevealProps {
  children: ReactNode
  /** Stagger in ms. Keep increments small so a group reads as one gesture. */
  delay?: number
  className?: string
  as?: ElementType
  /** `fade` rises in; `mask` lifts a curtain off an image frame. */
  mode?: 'fade' | 'mask'
}

/** Entrance on first view. All motion lives in CSS and respects reduced motion. */
export function Reveal({ children, delay = 0, className, as: Tag = 'div', mode = 'fade' }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const style = { '--reveal-delay': `${delay}ms` } as CSSProperties

  // The clip sits on an inner layer: a fully clipped element never reports
  // an intersection, so the observed wrapper must stay unclipped.
  if (mode === 'mask') {
    return (
      <Tag ref={ref} data-visible={inView} className={cn('mask-wrap', className)} style={style}>
        <div className="mask-reveal">{children}</div>
      </Tag>
    )
  }

  return (
    <Tag ref={ref} data-visible={inView} className={cn('reveal', className)} style={style}>
      {children}
    </Tag>
  )
}

interface MaskedHeadingProps {
  as?: 'h1' | 'h2' | 'h3'
  lines: string[]
  className?: string
  delay?: number
}

/** Headline whose lines rise from behind a mask, one after another. */
export function MaskedHeading({ as: Tag = 'h2', lines, className, delay = 0 }: MaskedHeadingProps) {
  const { ref, inView } = useInView<HTMLHeadingElement>({ threshold: 0.3 })
  return (
    <Tag ref={ref} data-visible={inView} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask" style={{ '--line-delay': `${delay + i * 120}ms` } as CSSProperties}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  )
}
