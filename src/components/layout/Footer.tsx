import { Link } from 'react-router-dom'
import { useLanguage } from '@/i18n'
import { company, whatsappLink } from '@/content/company'
import { coreServices, sectors } from '@/content/services'
import { track } from '@/lib/analytics'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  const { t, tr, href } = useLanguage()
  const a = company.address
  const year = new Date().getFullYear()

  const explore = [
    { label: t.nav.about, path: '/about/' },
    { label: t.nav.process, path: '/our-process/' },
    { label: t.nav.projects, path: '/our-projects/' },
    { label: t.nav.brands, path: '/our-brands/' },
    { label: t.nav.contact, path: '/contact/' },
  ]

  return (
    <footer className="bg-charcoal-950 text-ivory-50">
      <div className="shell grid gap-14 py-20 md:grid-cols-12 lg:py-28">
        <div className="md:col-span-12 lg:col-span-4">
          <Logo light />
          <p className="mt-6 max-w-xs text-body-sm text-ivory-50/75">{t.footer.tagline}</p>
          <a
            href={company.profilePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-8 inline-block pb-1 text-caption font-semibold uppercase tracking-[0.16em] text-bronze-300"
          >
            {t.common.downloadProfile}
          </a>
        </div>

        <nav aria-label={t.a11y.footerNav} className="grid gap-10 sm:grid-cols-3 md:col-span-12 lg:col-span-8">
          <div>
            <h2 className="eyebrow mb-5 !text-bronze-300">{t.footer.explore}</h2>
            <ul className="space-y-3 text-body-sm">
              {explore.map((l) => (
                <li key={l.path}>
                  <Link to={href(l.path)} className="link-underline text-ivory-50/85 hover:text-ivory-50">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow mb-5 !text-bronze-300">{t.footer.services}</h2>
            <ul className="space-y-3 text-body-sm">
              {[...coreServices, ...sectors].map((s) => (
                <li key={s.slug}>
                  <Link to={href(`/${s.slug}/`)} className="link-underline text-ivory-50/85 hover:text-ivory-50">
                    {tr(s.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow mb-5 !text-bronze-300">{t.footer.contact}</h2>
            <address className="space-y-3 text-body-sm not-italic text-ivory-50/85">
              <p>
                {tr(a.building)}
                <br />
                {tr(a.street)}
                <br />
                {tr(a.district)}, {tr(a.city)} {a.postalCode}
              </p>
              {company.phones.map((p) => (
                <p key={p.tel}>
                  <a href={`tel:${p.tel}`} dir="ltr" className="link-underline hover:text-ivory-50" onClick={() => track('click_to_call', { location: 'footer' })}>
                    {p.display}
                  </a>
                </p>
              ))}
              <p>
                <a href={`mailto:${company.email}`} className="link-underline hover:text-ivory-50" onClick={() => track('email_click', { location: 'footer' })}>
                  {company.email}
                </a>
              </p>
              <p>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline hover:text-ivory-50"
                  onClick={() => track('whatsapp_click', { location: 'footer' })}
                >
                  {t.common.whatsapp}
                </a>
              </p>
              <p className="text-ivory-50/65">{tr(company.hours.label)}</p>
            </address>
          </div>
        </nav>
      </div>

      <div className="border-t border-ivory-50/10">
        <div className="shell flex flex-col gap-4 py-6 text-caption text-ivory-50/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. {t.footer.rights}
          </p>
          <ul className="flex gap-6">
            <li>
              <Link to={href('/privacy-policy/')} className="link-underline hover:text-ivory-50">
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link to={href('/terms-conditions/')} className="link-underline hover:text-ivory-50">
                {t.footer.terms}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
