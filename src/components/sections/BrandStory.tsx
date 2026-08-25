import { useState } from 'react'
import { useT } from '@/i18n'
import { Section, Eyebrow } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

/**
 * The name as the operating model.
 *
 * The lockup is assembled from the same segments as the pillar list, so
 * selecting a pillar lights the part of the word it corresponds to. The
 * third pillar (AAMAAL) cross-fades the lockup to its own form — the name
 * is literally built in front of the reader.
 *
 * Pointer users drive it on hover; keyboard users drive it with the tab key
 * and arrow keys via the same buttons. It degrades to a readable three-item
 * list with no interaction at all.
 */
export function BrandStory() {
  const t = useT()
  const [active, setActive] = useState(0)
  const parts = t.brandStory.parts
  const isThird = active === 2

  return (
    <Section
      tone="dark"
      aria-labelledby="brand-story-heading"
      className="overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgb(var(--brand-800)/0.55),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-dark [background-size:56px_56px] opacity-25"
      />

      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <Eyebrow onDark className="justify-center">
            {t.brandStory.eyebrow}
          </Eyebrow>
        </Reveal>
        <Reveal delay={70}>
          <h2 id="brand-story-heading" className="mt-5 text-display-lg text-white">
            {t.brandStory.heading}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-5 text-body-xl text-white/60 text-pretty">{t.brandStory.intro}</p>
        </Reveal>
      </div>

      {/* ── The lockup ── */}
      <Reveal delay={200}>
        <div className="relative mt-16 flex min-h-[clamp(3.75rem,9.5vw,7.5rem)] items-center justify-center lg:mt-20">
          {/* Glow that tracks the active pillar */}
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute h-40 w-[60%] rounded-full blur-3xl transition-all duration-700 ease-premium',
              'bg-[radial-gradient(circle,rgb(var(--glow)/0.24),transparent_70%)]',
              isThird ? 'translate-x-0' : active === 0 ? '-translate-x-1/4' : 'translate-x-1/4',
            )}
          />

          {/* AT + MAAL */}
          <p
            aria-hidden={isThird}
            className={cn(
              'absolute select-none font-display text-[clamp(2.25rem,8.5vw,6rem)] font-semibold leading-none tracking-tight',
              'transition-all duration-700 ease-premium',
              isThird ? 'scale-95 opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0',
            )}
          >
            {[0, 1].map((i) => (
              <span
                key={parts[i].key}
                className={cn(
                  'transition-all duration-600 ease-premium',
                  active === i
                    ? 'text-white [text-shadow:0_0_46px_rgb(var(--glow)/0.55)]'
                    : 'text-white/40',
                )}
              >
                {parts[i].word}
              </span>
            ))}
          </p>

          {/* AAMAAL */}
          <p
            aria-hidden={!isThird}
            className={cn(
              'absolute select-none font-display text-[clamp(2.25rem,8.5vw,6rem)] font-semibold leading-none tracking-tight',
              'transition-all duration-700 ease-premium',
              isThird
                ? 'scale-100 text-white opacity-100 blur-0 [text-shadow:0_0_46px_rgb(var(--glow)/0.55)]'
                : 'scale-105 opacity-0 blur-sm',
            )}
          >
            {parts[2].word}
          </p>
        </div>
      </Reveal>

      {/* ── The pillars ── */}
      <Reveal delay={280}>
        <ul className="mt-14 grid gap-4 md:grid-cols-3 lg:mt-16">
          {parts.map((part, i) => {
            const isActive = active === i
            return (
              <li key={part.key}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  className={cn(
                    'group h-full w-full rounded-panel p-7 text-start transition-all duration-500 ease-premium',
                    'ring-1 backdrop-blur-sm',
                    isActive
                      ? 'bg-white/[0.07] ring-brand-400/45 -translate-y-1'
                      : 'bg-white/[0.025] ring-white/10 hover:bg-white/[0.05] hover:ring-white/20',
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex items-center gap-2.5 font-display text-body-sm font-semibold uppercase tracking-[0.18em] transition-colors duration-500',
                      isActive ? 'text-brand-300' : 'text-white/60',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'h-1.5 w-1.5 rounded-full transition-all duration-500',
                        isActive ? 'bg-glow shadow-[0_0_12px_rgb(var(--glow))]' : 'bg-white/25',
                      )}
                    />
                    {part.key}
                  </span>

                  <h3
                    className={cn(
                      'mt-5 font-display text-display-sm transition-colors duration-500',
                      isActive ? 'text-white' : 'text-white/80',
                    )}
                  >
                    {part.title}
                  </h3>

                  <p
                    className={cn(
                      'mt-3 text-body-sm leading-relaxed transition-colors duration-500',
                      isActive ? 'text-white/70' : 'text-white/60',
                    )}
                  >
                    {part.body}
                  </p>
                </button>
              </li>
            )
          })}
        </ul>
      </Reveal>

      <Reveal delay={360}>
        <p className="mt-12 text-center text-body-sm text-white/60">{t.brandStory.footnote}</p>
      </Reveal>
    </Section>
  )
}
