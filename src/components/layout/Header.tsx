import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Clock, Mail, MapPin, Menu, Phone } from 'lucide-react'
import { basePath, useLanguage } from '@/i18n'
import { company } from '@/content/company'
import { coreServices, sectors, services } from '@/content/services'
import { cn, useScrolled } from '@/lib/hooks'
import { track } from '@/lib/analytics'
import { Logo } from '@/components/ui/Logo'
import { Arrow } from '@/components/ui/Links'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
import { isActive, primaryNav } from './nav'

const serviceSlugs = services.map((s) => s.slug)

/** Dark contact strip above the main header (tablet and up). */
function TopBar() {
  const { tr } = useLanguage()
  const a = company.address
  return (
    <div className="hidden bg-charcoal-950 text-[0.8125rem] text-white/80 md:block">
      <div className="shell flex h-11 items-center justify-between gap-6">
        <ul className="flex items-center gap-6">
          <li>
            <a href={`tel:${company.phones[0].tel}`} className="flex items-center gap-2 hover:text-bronze-300" onClick={() => track('click_to_call', { location: 'topbar' })}>
              <Phone className="h-3.5 w-3.5 text-bronze-400" aria-hidden="true" />
              <span dir="ltr">{company.phones[0].display}</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${company.email}`} className="flex items-center gap-2 hover:text-bronze-300" onClick={() => track('email_click', { location: 'topbar' })}>
              <Mail className="h-3.5 w-3.5 text-bronze-400" aria-hidden="true" />
              {company.email}
            </a>
          </li>
          <li className="hidden items-center gap-2 xl:flex">
            <Clock className="h-3.5 w-3.5 text-bronze-400" aria-hidden="true" />
            {tr(company.hours.label)}
          </li>
        </ul>
        <div className="flex items-center gap-6">
          <span className="hidden items-center gap-2 lg:flex">
            <MapPin className="h-3.5 w-3.5 text-bronze-400" aria-hidden="true" />
            {tr(a.building)}, {tr(a.district)}, {tr(a.city)}
          </span>
          <LanguageSwitcher className="font-semibold text-white hover:text-bronze-300" />
        </div>
      </div>
    </div>
  )
}

export function Header() {
  const { t, tr, href } = useLanguage()
  const { pathname } = useLocation()
  const base = basePath(pathname)
  const scrolled = useScrolled(60)
  const [menuOpen, setMenuOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const closeTimer = useRef<number>()

  useEffect(() => {
    setMenuOpen(false)
    setPanelOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!panelOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPanelOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [panelOpen])

  const openPanel = () => {
    window.clearTimeout(closeTimer.current)
    setPanelOpen(true)
  }
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setPanelOpen(false), 160)
  }

  const sectorLinks = [
    { path: '/residential-interior-design-furnishing/', label: tr(sectors[0].title) },
    { path: '/office-furnishing-fit-out-solutions/', label: t.services.sectorsOffice },
    { path: '/hospitality-furnishing-solutions/', label: t.services.sectorsHospitality },
    { path: '/styling-furnishing/', label: tr(sectors[1].title) },
  ]

  return (
    <>
      <TopBar />
      <header
        className={cn(
          'sticky top-0 z-40 bg-white transition-shadow duration-300',
          scrolled ? 'shadow-[0_6px_24px_-12px_rgba(22,24,29,0.25)]' : 'shadow-[0_1px_0_rgba(22,24,29,0.08)]',
        )}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-3 sm:gap-6">
          <Link to={href('/')} aria-label={t.a11y.home} className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label={t.a11y.primaryNav} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => {
                const active = isActive(item, base, serviceSlugs)
                const linkClass = cn(
                  'block rounded-btn px-3 py-2 text-[0.9375rem] font-semibold transition-colors',
                  active ? 'text-bronze-600' : 'text-charcoal-900 hover:text-bronze-600',
                )
                if (item.panel) {
                  return (
                    <li key={item.key} className="relative flex items-center" onMouseEnter={openPanel} onMouseLeave={scheduleClose}>
                      <Link to={href(item.path)} aria-current={active ? 'page' : undefined} className={cn(linkClass, 'pe-1')}>
                        {t.nav[item.key]}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={panelOpen}
                        aria-controls="services-panel"
                        aria-label={t.a11y.servicesMenu}
                        onClick={() => setPanelOpen((o) => !o)}
                        className="p-1.5 text-charcoal-900 hover:text-bronze-600"
                      >
                        <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', panelOpen && 'rotate-180')} aria-hidden="true" />
                      </button>

                      <div
                        id="services-panel"
                        className={cn('absolute start-0 top-full w-[42rem] pt-3', panelOpen ? 'block' : 'hidden')}
                      >
                        <div className="grid grid-cols-5 gap-6 rounded-card border border-charcoal-900/10 bg-white p-6 shadow-lift">
                          <div className="col-span-3">
                            <p className="mb-2 px-3 text-caption font-bold uppercase tracking-[0.12em] text-stone-600">{t.nav.servicesHeading}</p>
                            <ul>
                              {coreServices.map((s) => (
                                <li key={s.slug}>
                                  <Link
                                    to={href(`/${s.slug}/`)}
                                    className="flex items-center gap-3 rounded-btn px-3 py-2 text-body-sm font-semibold text-charcoal-900 hover:bg-ivory-200 hover:text-bronze-600"
                                  >
                                    <span className="text-caption text-bronze-600">{s.index}</span>
                                    {tr(s.title)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="col-span-2">
                            <p className="mb-2 px-3 text-caption font-bold uppercase tracking-[0.12em] text-stone-600">{t.nav.sectorsHeading}</p>
                            <ul>
                              {sectorLinks.map((s) => (
                                <li key={s.path}>
                                  <Link to={href(s.path)} className="block rounded-btn px-3 py-2 text-body-sm font-medium text-charcoal-900 hover:bg-ivory-200 hover:text-bronze-600">
                                    {s.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            <Link to={href('/services/')} className="mt-3 inline-flex items-center gap-2 px-3 text-body-sm font-semibold text-bronze-600 hover:text-charcoal-900">
                              {t.nav.allServices} <Arrow />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                }
                return (
                  <li key={item.key}>
                    <Link to={href(item.path)} aria-current={active ? 'page' : undefined} className={linkClass}>
                      {t.nav[item.key]}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher className="text-body-sm font-semibold text-charcoal-900 md:hidden" />
            <Link
              to={href('/contact/') + '#inquiry'}
              className="btn btn-gold hidden min-h-[2.875rem] sm:inline-flex"
              onClick={() => track('cta_click', { label: 'header_quote' })}
            >
              {t.nav.cta}
              <Arrow />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={t.a11y.menuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-btn bg-charcoal-900 text-white lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
