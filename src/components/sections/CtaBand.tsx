import { useLanguage } from '@/i18n'
import { media } from '@/content/media'
import { company, whatsappLink } from '@/content/company'
import { track } from '@/lib/analytics'
import { Media } from '@/components/ui/Media'
import { Button } from '@/components/ui/Links'
import { MaskedHeading, Reveal } from '@/components/ui/Reveal'

interface CtaBandProps {
  title?: string
  text?: string
  /** Prefills the project type on the contact form. */
  context?: string
  /** Full version adds the office details beneath, for the homepage. */
  withDetails?: boolean
}

/** Closing call to action over a dark interior. */
export function CtaBand({ title, text, context, withDetails }: CtaBandProps) {
  const { t, tr, href } = useLanguage()
  const contactPath = href('/contact/') + (context ? `?topic=${encodeURIComponent(context)}` : '') + '#inquiry'
  const a = company.address

  return (
    <section className="relative isolate overflow-hidden bg-charcoal-900 text-ivory-50">
      <Media slot={media.contact} decorative parallax fill className="-z-10 opacity-70" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/60 to-charcoal-950/40" />

      <div className="shell py-28 lg:py-40">
        <div className="max-w-3xl">
          <MaskedHeading lines={[title ?? t.home.contactTitle]} className="font-serif text-display-xl font-light" />
          <Reveal delay={150}>
            <p className="mt-8 max-w-prose text-lead text-ivory-50/85">{text ?? t.home.contactText}</p>
          </Reveal>
          <Reveal delay={250} className="mt-12 flex flex-wrap gap-4">
            <Button to={contactPath} variant="light" track="cta_band_primary">
              {t.home.contactPrimary}
            </Button>
            <Button to={href('/contact/')} variant="ghost-light" track="cta_band_secondary">
              {t.home.contactSecondary}
            </Button>
          </Reveal>
        </div>

        {withDetails && (
          <Reveal delay={300}>
            <dl className="mt-20 grid gap-10 border-t border-ivory-50/20 pt-10 text-body-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="eyebrow mb-3 !text-bronze-300">{t.common.visit}</dt>
                <dd className="text-ivory-50/85">
                  {tr(a.building)}, {tr(a.street)}
                  <br />
                  {tr(a.district)}, {tr(a.city)} {a.postalCode}
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-3 !text-bronze-300">{t.common.call}</dt>
                <dd className="space-y-1">
                  {company.phones.map((p) => (
                    <a key={p.tel} href={`tel:${p.tel}`} dir="ltr" className="link-underline block w-fit" onClick={() => track('click_to_call', { location: 'cta_band' })}>
                      {p.display}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-3 !text-bronze-300">{t.common.whatsapp}</dt>
                <dd>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="link-underline"
                    onClick={() => track('whatsapp_click', { location: 'cta_band' })}
                  >
                    {company.phones[0].display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-3 !text-bronze-300">{t.common.hours}</dt>
                <dd className="text-ivory-50/85">{tr(company.hours.label)}</dd>
              </div>
            </dl>
          </Reveal>
        )}
      </div>
    </section>
  )
}
