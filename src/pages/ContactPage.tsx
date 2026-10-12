import { useLanguage } from '@/i18n'
import { company, whatsappLink } from '@/content/company'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema, organizationSchema } from '@/lib/schema'
import { track } from '@/lib/analytics'
import { Breadcrumbs } from '@/components/sections/PageHero'
import { InquiryForm } from '@/components/sections/InquiryForm'
import { MaskedHeading, Reveal } from '@/components/ui/Reveal'

export function ContactPage() {
  const { t, tr, locale } = useLanguage()
  const c = t.contact
  const a = company.address
  const crumbs = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.contact, path: '/contact/' },
  ]

  return (
    <>
      <Seo
        title={c.meta.title}
        description={c.meta.description}
        path="/contact/"
        jsonLd={[organizationSchema(locale), breadcrumbSchema(locale, crumbs.map((x) => ({ name: x.label, path: x.path })))]}
      />

      <section className="page-enter pb-section pt-[calc(var(--header-h)+2.5rem)] lg:pt-40">
        <div className="shell">
          <Breadcrumbs items={crumbs} />
          <div className="mt-10 max-w-4xl lg:mt-14">
            <p className="eyebrow mb-6">{c.eyebrow}</p>
            <MaskedHeading as="h1" lines={[c.title]} className="font-serif text-display-2xl font-light" />
            <Reveal delay={200}>
              <p className="mt-8 max-w-prose text-lead text-stone-700">{c.lead}</p>
            </Reveal>
          </div>

          <div className="mt-20 grid gap-16 lg:grid-cols-12 lg:gap-10">
            {/* Direct contact */}
            <aside className="lg:col-span-4">
              <h2 className="eyebrow mb-6">{c.directTitle}</h2>
              <ul className="border-t border-charcoal-900/15">
                {company.phones.map((p) => (
                  <li key={p.tel} className="border-b border-charcoal-900/15">
                    <a
                      href={`tel:${p.tel}`}
                      className="group flex items-baseline justify-between gap-6 py-5"
                      onClick={() => track('click_to_call', { location: 'contact_page' })}
                    >
                      <span className="text-caption uppercase tracking-[0.14em] text-stone-600">
                        {t.common.call} · {tr(p.label)}
                      </span>
                      <span dir="ltr" className="font-serif text-[1.375rem]">
                        <span className="link-underline">{p.display}</span>
                      </span>
                    </a>
                  </li>
                ))}
                <li className="border-b border-charcoal-900/15">
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-6 py-5"
                    onClick={() => track('whatsapp_click', { location: 'contact_page' })}
                  >
                    <span className="text-caption uppercase tracking-[0.14em] text-stone-600">{t.common.whatsapp}</span>
                    <span dir="ltr" className="font-serif text-[1.375rem]">
                      <span className="link-underline">{company.phones[0].display}</span>
                    </span>
                  </a>
                </li>
                <li className="border-b border-charcoal-900/15">
                  <a
                    href={`mailto:${company.email}`}
                    className="group flex items-baseline justify-between gap-6 py-5"
                    onClick={() => track('email_click', { location: 'contact_page' })}
                  >
                    <span className="text-caption uppercase tracking-[0.14em] text-stone-600">{t.common.email}</span>
                    <span className="font-serif text-[1.25rem]">
                      <span className="link-underline">{company.email}</span>
                    </span>
                  </a>
                </li>
              </ul>

              <h2 className="eyebrow mb-4 mt-14">{c.officeTitle}</h2>
              <address className="not-italic text-stone-700">
                {tr(a.building)}
                <br />
                {tr(a.street)}
                <br />
                {tr(a.district)}, {tr(a.city)} {a.postalCode}
                <br />
                {tr(a.country)}
              </address>
              <a
                href={company.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-4 inline-block pb-1 text-caption font-semibold uppercase tracking-[0.16em]"
              >
                {t.common.directions}
              </a>

              <h2 className="eyebrow mb-4 mt-14">{t.common.hours}</h2>
              <p className="text-stone-700">{tr(company.hours.label)}</p>
            </aside>

            {/* Inquiry form */}
            <div id="inquiry" className="scroll-mt-32 lg:col-span-7 lg:col-start-6">
              <h2 className="mb-10 font-serif text-display-lg font-light">{c.formTitle}</h2>
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
