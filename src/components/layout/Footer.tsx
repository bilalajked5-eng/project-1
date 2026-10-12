import { Link } from 'react-router-dom'
import { ChevronRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { useLanguage } from '@/i18n'
import { company, whatsappLink } from '@/content/company'
import { coreServices, sectors } from '@/content/services'
import { track } from '@/lib/analytics'
import { Logo } from '@/components/ui/Logo'
import { WhatsAppIcon } from '@/components/ui/Links'

export function Footer() {
  const { t, tr, href } = useLanguage()
  const a = company.address
  const year = new Date().getFullYear()

  const explore = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.about, path: '/about/' },
    { label: t.nav.process, path: '/our-process/' },
    { label: t.nav.projects, path: '/our-projects/' },
    { label: t.nav.brands, path: '/our-brands/' },
    { label: t.nav.contact, path: '/contact/' },
  ]

  const linkClass = 'group flex items-center gap-2 text-white/75 transition-colors hover:text-bronze-300'
  const chevron = <ChevronRight className="h-3.5 w-3.5 shrink-0 text-bronze-400 flip-rtl" aria-hidden="true" />

  return (
    <footer className="bg-charcoal-950 text-white">
      <div className="shell grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-6 max-w-sm text-body-sm text-white/70">{t.footer.tagline}</p>
          <a
            href={company.profilePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-light mt-7 min-h-[2.75rem] text-caption"
          >
            {t.common.downloadProfile}
          </a>
        </div>

        <nav aria-label={t.a11y.footerNav} className="contents">
          <div className="lg:col-span-2">
            <h2 className="mb-5 font-heading text-[1.0625rem] font-bold">{t.footer.explore}</h2>
            <ul className="space-y-3 text-body-sm">
              {explore.map((l) => (
                <li key={l.path}>
                  <Link to={href(l.path)} className={linkClass}>
                    {chevron}
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h2 className="mb-5 font-heading text-[1.0625rem] font-bold">{t.footer.services}</h2>
            <ul className="space-y-3 text-body-sm">
              {[...coreServices, ...sectors].map((s) => (
                <li key={s.slug}>
                  <Link to={href(`/${s.slug}/`)} className={linkClass}>
                    {chevron}
                    {tr(s.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="mb-5 font-heading text-[1.0625rem] font-bold">{t.footer.contact}</h2>
          <address className="space-y-4 text-body-sm not-italic text-white/75">
            <p className="flex gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-bronze-400" aria-hidden="true" />
              <span>
                {tr(a.building)}, {tr(a.street)}, {tr(a.district)}, {tr(a.city)} {a.postalCode}
              </span>
            </p>
            {company.phones.map((p) => (
              <p key={p.tel} className="flex gap-3">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-bronze-400" aria-hidden="true" />
                <a href={`tel:${p.tel}`} dir="ltr" className="hover:text-bronze-300" onClick={() => track('click_to_call', { location: 'footer' })}>
                  {p.display}
                </a>
              </p>
            ))}
            <p className="flex gap-3">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-bronze-400" aria-hidden="true" />
              <a href={`mailto:${company.email}`} className="hover:text-bronze-300" onClick={() => track('email_click', { location: 'footer' })}>
                {company.email}
              </a>
            </p>
            <p className="flex gap-3">
              <WhatsAppIcon className="mt-1 h-4 w-4 shrink-0 text-bronze-400" />
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-bronze-300"
                onClick={() => track('whatsapp_click', { location: 'footer' })}
              >
                {t.common.whatsapp}
              </a>
            </p>
            <p className="flex gap-3">
              <Clock className="mt-1 h-4 w-4 shrink-0 text-bronze-400" aria-hidden="true" />
              {tr(company.hours.label)}
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-6 text-caption text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. {t.footer.rights}
          </p>
          <ul className="flex gap-6">
            <li>
              <Link to={href('/privacy-policy/')} className="hover:text-bronze-300">
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link to={href('/terms-conditions/')} className="hover:text-bronze-300">
                {t.footer.terms}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

/** Floating WhatsApp shortcut, bottom corner on every page. */
export function WhatsAppFloat() {
  const { t } = useLanguage()
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.common.whatsapp}
      onClick={() => track('whatsapp_click', { location: 'float' })}
      className="fixed bottom-5 end-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#157A3C] text-white shadow-lift transition-transform duration-300 hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}
