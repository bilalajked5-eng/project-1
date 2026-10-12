import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { useLanguage } from '@/i18n'
import { company, whatsappLink } from '@/content/company'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema, organizationSchema } from '@/lib/schema'
import { track } from '@/lib/analytics'
import { PageHero } from '@/components/sections/PageHero'
import { InquiryForm } from '@/components/sections/InquiryForm'
import { WhatsAppIcon } from '@/components/ui/Links'

export function ContactPage() {
  const { t, tr, locale } = useLanguage()
  const c = t.contact
  const a = company.address
  const crumbs = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.contact, path: '/contact/' },
  ]

  const cards = [
    {
      icon: Phone,
      title: t.common.call,
      body: (
        <div className="space-y-1">
          {company.phones.map((p) => (
            <a key={p.tel} href={`tel:${p.tel}`} dir="ltr" className="block font-semibold hover:text-bronze-600" onClick={() => track('click_to_call', { location: 'contact_page' })}>
              {p.display}
            </a>
          ))}
        </div>
      ),
    },
    {
      icon: WhatsAppIcon,
      title: t.common.whatsapp,
      body: (
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          dir="ltr"
          className="font-semibold hover:text-bronze-600"
          onClick={() => track('whatsapp_click', { location: 'contact_page' })}
        >
          {company.phones[0].display}
        </a>
      ),
    },
    {
      icon: Mail,
      title: t.common.email,
      body: (
        <a href={`mailto:${company.email}`} className="font-semibold hover:text-bronze-600" onClick={() => track('email_click', { location: 'contact_page' })}>
          {company.email}
        </a>
      ),
    },
    {
      icon: Clock,
      title: t.common.hours,
      body: <p className="font-semibold">{tr(company.hours.label)}</p>,
    },
  ]

  return (
    <>
      <Seo
        title={c.meta.title}
        description={c.meta.description}
        path="/contact/"
        jsonLd={[organizationSchema(locale), breadcrumbSchema(locale, crumbs.map((x) => ({ name: x.label, path: x.path })))]}
      />
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} crumbs={crumbs} />

      <section className="relative z-10 -mt-10">
        <ul className="shell grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.title} className="card flex gap-4 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bronze-500 text-charcoal-950">
                <card.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 text-body-sm">
                <h2 className="mb-1 text-caption font-bold uppercase tracking-[0.08em] text-stone-600">{card.title}</h2>
                {card.body}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-section">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div id="inquiry" className="card scroll-mt-28 p-7 sm:p-10 lg:col-span-7">
            <h2 className="font-heading text-display-md font-extrabold">{c.formTitle}</h2>
            <p className="mb-8 mt-2 text-body-sm text-stone-600">{t.homeX.quoteText}</p>
            <InquiryForm />
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="overflow-hidden rounded-card bg-charcoal-900 text-white">
              <div className="p-7">
                <h2 className="flex items-center gap-2 font-heading text-[1.25rem] font-bold">
                  <MapPin className="h-5 w-5 text-bronze-400" aria-hidden="true" />
                  {c.officeTitle}
                </h2>
                <address className="mt-4 not-italic text-white/80">
                  {tr(a.building)}
                  <br />
                  {tr(a.street)}
                  <br />
                  {tr(a.district)}, {tr(a.city)} {a.postalCode}
                  <br />
                  {tr(a.country)}
                </address>
                <a href={company.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-6">
                  {t.common.directions}
                </a>
              </div>
            </div>
            <div className="card p-7">
              <h2 className="font-heading text-[1.25rem] font-bold">{c.directTitle}</h2>
              <p className="mt-2 text-body-sm text-stone-600">{t.homeX.faqText}</p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp mt-6 w-full"
                onClick={() => track('whatsapp_click', { location: 'contact_aside' })}
              >
                <WhatsAppIcon />
                {t.homeX.ctaWhatsapp}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
