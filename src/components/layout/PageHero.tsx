import type { ReactNode } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Section'
import { DataLines } from '@/components/visuals/NetworkVisual'

/**
 * Interior-page opening. Deliberately shorter and quieter than the homepage
 * hero so the two never compete — same type scale, a third of the height.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string
  title: string
  lede?: string
  children?: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden bg-white pt-[calc(84px+3rem)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_70%_at_78%_0%,rgb(var(--brand-50)),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-fine [background-size:56px_56px] mask-fade-b opacity-60"
      />
      <DataLines className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 w-full opacity-40" />

      <div className="shell pb-16 pt-8 sm:pb-20 lg:pb-24">
        <div className="max-w-4xl">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 text-display-xl text-ink-900">{title}</h1>
          </Reveal>
          {lede && (
            <Reveal delay={160}>
              <p className="mt-6 max-w-2xl text-body-xl text-sand-600 text-pretty">{lede}</p>
            </Reveal>
          )}
          {children && <Reveal delay={240}>{children}</Reveal>}
        </div>
      </div>
    </section>
  )
}
