import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { basePath, useLanguage } from '@/i18n'
import { coreServices, sectors, services } from '@/content/services'
import { cn, useScrolled } from '@/lib/hooks'
import { Logo } from '@/components/ui/Logo'
import { Arrow } from '@/components/ui/Links'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
import { isActive, primaryNav } from './nav'

const serviceSlugs = services.map((s) => s.slug)

/** Pages that open on a full-bleed dark hero, where the header starts transparent. */
const darkHeroPages = (base: string) => base === '/'

export function Header() {
  const { t, tr, href } = useLanguage()
  const { pathname } = useLocation()
  const base = basePath(pathname)
  const scrolled = useScrolled(40)
  const [menuOpen, setMenuOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number>()

  const overHero = darkHeroPages(base) && !scrolled && !panelOpen
  const solid = !overHero

  // Close overlays on navigation
  useEffect(() => {
    setMenuOpen(false)
    setPanelOpen(false)
  }, [pathname])

  // Escape closes the services panel
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
    closeTimer.current = window.setTimeout(() => setPanelOpen(false), 180)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-[background-color,color,box-shadow,height] duration-700 ease-silk',
          solid ? 'bg-ivory-100/95 text-charcoal-900 shadow-[0_1px_0_rgba(30,29,27,0.08)] backdrop-blur-sm' : 'bg-transparent text-ivory-50',
        )}
      >
        <div className={cn('shell flex items-center justify-between gap-6 transition-[height] duration-700 ease-silk', scrolled ? 'h-[4.25rem]' : 'h-20 lg:h-24')}>
          <Link to={href('/')} aria-label={t.a11y.home} className="shrink-0">
            <Logo light={!solid} />
          </Link>

          <nav aria-label={t.a11y.primaryNav} className="hidden lg:block">
            <ul className="flex items-center gap-8 xl:gap-10">
              {primaryNav.map((item) => {
                const active = isActive(item, base, serviceSlugs)
                if (item.panel) {
                  return (
                    <li key={item.key} className="flex items-center gap-1.5" onMouseEnter={openPanel} onMouseLeave={scheduleClose}>
                      <Link
                        to={href(item.path)}
                        aria-current={active ? 'page' : undefined}
                        className="link-underline pb-1 text-body-sm font-medium"
                      >
                        {t.nav[item.key]}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={panelOpen}
                        aria-controls="services-panel"
                        aria-label={t.a11y.servicesMenu}
                        onClick={() => setPanelOpen((o) => !o)}
                        className="-m-2 p-2"
                      >
                        <svg viewBox="0 0 10 6" className={cn('h-1.5 w-2.5 transition-transform duration-400', panelOpen && 'rotate-180')} aria-hidden="true">
                          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </button>
                    </li>
                  )
                }
                return (
                  <li key={item.key}>
                    <Link
                      to={href(item.path)}
                      aria-current={active ? 'page' : undefined}
                      className="link-underline pb-1 text-body-sm font-medium"
                    >
                      {t.nav[item.key]}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-5 xl:gap-7">
            <LanguageSwitcher className="hidden sm:inline-block" />
            <Link
              to={href('/contact/')}
              className={cn(
                'hidden min-h-[2.75rem] items-center border px-5 text-caption font-semibold uppercase tracking-[0.16em] transition-colors duration-400 md:inline-flex',
                solid
                  ? 'border-charcoal-900 text-charcoal-900 hover:bg-charcoal-900 hover:text-ivory-50'
                  : 'border-ivory-50/60 text-ivory-50 hover:bg-ivory-50 hover:text-charcoal-900',
              )}
            >
              {t.nav.cta}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={t.a11y.menuOpen}
              className="-me-2 flex h-11 w-11 flex-col items-center justify-center gap-[7px] lg:hidden"
            >
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-6 bg-current" />
            </button>
          </div>
        </div>

        {/* Services panel (desktop) */}
        <div
          id="services-panel"
          ref={panelRef}
          onMouseEnter={openPanel}
          onMouseLeave={scheduleClose}
          className={cn(
            'absolute inset-x-0 top-full hidden border-t border-charcoal-900/10 bg-ivory-100 text-charcoal-900 shadow-[0_24px_48px_-24px_rgba(30,29,27,0.25)]',
            panelOpen && 'lg:block',
          )}
        >
          <div className="shell grid grid-cols-12 gap-10 py-12">
            <div className="col-span-7">
              <p className="eyebrow mb-6">{t.nav.servicesHeading}</p>
              <ul className="grid grid-cols-2 gap-x-10">
                {coreServices.map((s) => (
                  <li key={s.slug} className="border-t border-charcoal-900/10">
                    <Link to={href(`/${s.slug}/`)} className="group flex items-baseline gap-4 py-4">
                      <span className="text-caption text-stone-600">{s.index}</span>
                      <span className="font-serif text-[1.35rem] leading-tight">
                        <span className="link-underline">{tr(s.title)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-3">
              <p className="eyebrow mb-6">{t.nav.sectorsHeading}</p>
              <ul>
                {[
                  { path: '/residential-interior-design-furnishing/', label: tr(sectors[0].title) },
                  { path: '/office-furnishing-fit-out-solutions/', label: t.services.sectorsOffice },
                  { path: '/hospitality-furnishing-solutions/', label: t.services.sectorsHospitality },
                  { path: '/styling-furnishing/', label: tr(sectors[1].title) },
                ].map((s) => (
                  <li key={s.path} className="border-t border-charcoal-900/10">
                    <Link to={href(s.path)} className="group block py-4 text-body-sm font-medium">
                      <span className="link-underline">{s.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 flex flex-col justify-end">
              <Link to={href('/services/')} className="group inline-flex items-center gap-3 text-caption font-semibold uppercase tracking-[0.16em]">
                <span className="link-underline pb-1">{t.nav.allServices}</span>
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
