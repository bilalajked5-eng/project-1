import { useT } from '@/i18n'
import { Reveal } from '@/components/ui/Reveal'
import { LinkButton } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Section'
import { IconMail, IconPin, IconBriefcase } from '@/components/ui/Icons'
import { NetworkVisual } from '@/components/visuals/NetworkVisual'
import { ContactForm } from './ContactForm'
import { cn } from '@/lib/cn'

/** High-impact closing CTA with the verified contact details and the form. */
export function ContactCTA({ withForm = true, hideHeading }: { withForm?: boolean; hideHeading?: boolean }) {
  const t = useT()

  const details = [
    { Icon: IconPin, label: t.contact.locationLabel, value: t.contact.location, href: undefined },
    { Icon: IconMail, label: t.contact.emailLabel, value: t.contact.email, href: `mailto:${t.contact.email}` },
    {
      Icon: IconBriefcase,
      label: t.contact.careersLabel,
      value: t.contact.careersValue,
      href: 'https://careers.atmaal.sa/en/',
    },
  ]

  return (
    <section
      id="contact"
      aria-labelledby={hideHeading ? undefined : "contact-heading"}
      className="on-dark relative isolate overflow-hidden bg-ink-950 py-section text-white"
    >
      <NetworkVisual className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_70%_at_18%_0%,rgb(var(--brand-700)/0.5),transparent_58%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_92%_100%,rgb(var(--lime-700)/0.45),transparent_60%)]"
      />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Statement */}
          <div className="lg:col-span-5">
            {!hideHeading && (
              <>
                <Reveal>
                  <Eyebrow onDark>{t.contact.eyebrow}</Eyebrow>
                </Reveal>

                <Reveal delay={70}>
                  <h2 id="contact-heading" className="mt-6 text-display-lg text-white">
                    {t.contact.heading}
                  </h2>
                </Reveal>

                <Reveal delay={140}>
                  <p className="mt-6 text-body-xl text-white/65 text-pretty">{t.contact.sub}</p>
                </Reveal>
              </>
            )}

            <Reveal delay={210}>
              <div className={cn('flex flex-col gap-3 sm:flex-row sm:gap-4', hideHeading ? 'mt-0' : 'mt-10')}>
                <LinkButton to="/contact" variant="onDark" size="lg" arrow>
                  {t.cta.talkToExpert}
                </LinkButton>
                <LinkButton href={`mailto:${t.contact.email}`} variant="onDarkGhost" size="lg" arrow>
                  {t.cta.contactAtmaal}
                </LinkButton>
              </div>
            </Reveal>

            {/* Contact details */}
            <dl className="mt-12 space-y-px overflow-hidden rounded-panel">
              {details.map((d, i) => (
                <Reveal key={d.label} delay={280 + i * 80}>
                  <div className="flex items-start gap-4 bg-white/[0.045] p-5 ring-1 ring-white/[0.07] backdrop-blur-sm">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-control bg-white/[0.07] text-brand-300">
                      <d.Icon className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-eyebrow uppercase text-white/60">{d.label}</dt>
                      <dd className="mt-1.5 truncate text-body-sm text-white/85">
                        {d.href ? (
                          <a
                            href={d.href}
                            {...(d.href.startsWith('http')
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {})}
                            className="transition-colors duration-300 hover:text-brand-300"
                          >
                            {d.value}
                          </a>
                        ) : (
                          d.value
                        )}
                      </dd>
                    </div>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          {/* Form */}
          {withForm && (
            <div className="lg:col-span-7">
              <Reveal delay={180}>
                <ContactForm headingLevel={hideHeading ? 'h2' : 'h3'} />
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
