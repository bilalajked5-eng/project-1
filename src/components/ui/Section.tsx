import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

/** Small uppercase kicker that labels a section without competing with its heading. */
export function Eyebrow({
  children,
  onDark,
  className,
}: {
  children: ReactNode
  onDark?: boolean
  className?: string
}) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 text-eyebrow uppercase',
        onDark ? 'text-brand-300' : 'text-brand-700',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('h-px w-8 shrink-0', onDark ? 'bg-brand-300/50' : 'bg-brand-700/35')}
      />
      {children}
    </p>
  )
}

interface SectionProps {
  children: ReactNode
  id?: string
  className?: string
  /** `dark` paints the deep corporate ground; `tint` is the faint neutral wash. */
  tone?: 'light' | 'tint' | 'dark'
  /** Narrower shell for text-led sections. */
  narrow?: boolean
  spacing?: 'default' | 'compact' | 'none'
  as?: 'section' | 'div' | 'footer'
  'aria-labelledby'?: string
}

const tones = {
  light: 'bg-white text-ink-900',
  tint: 'bg-sand-50 text-ink-900',
  dark: 'on-dark bg-ink-950 text-white',
}

const spacings = {
  default: 'py-section',
  compact: 'py-section-sm',
  none: '',
}

export function Section({
  children,
  id,
  className,
  tone = 'light',
  narrow,
  spacing = 'default',
  as: Tag = 'section',
  ...rest
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn('relative isolate', tones[tone], spacings[spacing], className)}
      {...rest}
    >
      <div className={narrow ? 'shell-narrow' : 'shell'}>{children}</div>
    </Tag>
  )
}

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  intro?: string
  onDark?: boolean
  align?: 'start' | 'center'
  /** Heading level — keeps the document outline correct per page. */
  level?: 'h1' | 'h2' | 'h3'
  id?: string
  className?: string
  size?: 'lg' | 'xl'
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  onDark,
  align = 'start',
  level: Heading = 'h2',
  id,
  className,
  size = 'lg',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <Eyebrow onDark={onDark} className={align === 'center' ? 'justify-center' : undefined}>
            {eyebrow}
          </Eyebrow>
        </Reveal>
      )}
      <Reveal delay={eyebrow ? 70 : 0}>
        <Heading
          id={id}
          className={cn(
            'mt-5',
            size === 'xl' ? 'text-display-xl' : 'text-display-lg',
            onDark ? 'text-white' : 'text-ink-900',
          )}
        >
          {title}
        </Heading>
      </Reveal>
      {intro && (
        <Reveal delay={140}>
          <p
            className={cn(
              'mt-5 text-body-xl text-pretty',
              align === 'center' && 'mx-auto',
              onDark ? 'text-white/70' : 'text-sand-600',
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  )
}
