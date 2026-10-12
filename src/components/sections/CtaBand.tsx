import { useLanguage } from '@/i18n'
import { media } from '@/content/media'
import { whatsappLink } from '@/content/company'
import { Media } from '@/components/ui/Media'
import { Button } from '@/components/ui/Links'

interface CtaBandProps {
  title?: string
  text?: string
  /** Prefills the project type on the contact form. */
  context?: string
  /** Kept for older call sites; contact details live in the footer. */
  withDetails?: boolean
}

/** Closing call to action: rounded dark panel over an interior photo. */
export function CtaBand({ title, text, context }: CtaBandProps) {
  const { t, href } = useLanguage()
  const x = t.homeX
  const contactPath = href('/contact/') + (context ? `?topic=${encodeURIComponent(context)}` : '') + '#inquiry'

  return (
    <section className="pb-section pt-4">
      <div className="shell">
        <div className="relative isolate overflow-hidden rounded-card bg-charcoal-900 text-white">
          <Media slot={media.contact} fill decorative className="-z-20" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/85 to-charcoal-950/55 rtl:bg-gradient-to-l" />
          <div className="flex flex-col gap-8 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:p-16">
            <div className="on-dark max-w-2xl">
              <p className="eyebrow mb-4">{x.ctaEyebrow}</p>
              <h2 className="font-heading text-display-xl font-extrabold">{title ?? x.ctaTitle}</h2>
              <p className="mt-4 text-lead text-white/80">{text ?? x.ctaText}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
              <Button to={contactPath} track="cta_band_quote">
                {x.ctaPrimary}
              </Button>
              <Button to={whatsappLink()} variant="whatsapp" icon="whatsapp" track="cta_band_whatsapp">
                {x.ctaWhatsapp}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
