import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useT } from '@/i18n'
import { useFocusTrap, useScrollLock } from '@/lib/hooks'
import { LinkButton } from '@/components/ui/Button'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/cn'
import type { NavItem } from './nav'

/** Full-screen menu — deliberately spacious rather than a cramped dropdown. */
export function MobileMenu({
  open,
  onClose,
  items,
}: {
  open: boolean
  onClose: () => void
  items: NavItem[]
}) {
  const t = useT()
  const { pathname } = useLocation()
  const trapRef = useFocusTrap<HTMLDivElement>(open)
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      ref={trapRef}
      id="mobile-menu"
      aria-hidden={!open}
      className={cn(
        'on-dark fixed inset-0 z-50 flex flex-col bg-ink-950 lg:hidden',
        'transition-[opacity,visibility] duration-400 ease-premium',
        open ? 'visible opacity-100' : 'invisible opacity-0',
      )}
    >
      {/* Ambient brand wash so the panel reads as designed, not as a black sheet */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgb(var(--brand-600)/0.3),transparent_58%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-dark [background-size:44px_44px] opacity-30" />

      <div className="relative flex items-center justify-between px-gutter py-5">
        <Link to="/" onClick={onClose} aria-label={t.a11y.homeLink}>
          <Logo variant="light" />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.nav.close}
          className="grid h-11 w-11 place-items-center rounded-control text-white/80 ring-1 ring-white/15 transition-colors duration-300 hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <nav aria-label={t.nav.menu} className="relative flex-1 overflow-y-auto px-gutter pt-4">
        <ul className="flex flex-col">
          {items.map((item, i) => {
            const active = pathname === item.to
            return (
              <li key={item.to} className="border-b border-white/[0.07]">
                <Link
                  to={item.to}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group flex items-center justify-between py-5 font-display text-display-sm transition-colors duration-300',
                    active ? 'text-brand-300' : 'text-white hover:text-brand-300',
                  )}
                  style={{
                    transitionDelay: open ? `${80 + i * 45}ms` : '0ms',
                    opacity: open ? 1 : 0,
                    transform: open ? 'none' : 'translateY(14px)',
                    transitionProperty: 'opacity, transform, color',
                    transitionDuration: '520ms',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {item.label}
                  <svg viewBox="0 0 16 16" className="rtl-flip h-4 w-4 text-white/30 transition-transform duration-400 ease-premium group-hover:translate-x-1 group-hover:text-brand-300" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2.5 8h10.5M9 3.75 13.25 8 9 12.25" />
                  </svg>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="relative space-y-5 px-gutter pb-10 pt-8">
        <LinkButton to="/contact" onClick={onClose} variant="primary" size="lg" arrow className="w-full">
          {t.cta.talkToExpert}
        </LinkButton>
        <div className="flex items-center justify-between">
          <LanguageSwitcher onDark size="lg" onSelect={onClose} />
          <a href={`mailto:${t.contact.email}`} className="text-body-sm text-white/55 transition-colors hover:text-white">
            {t.contact.email}
          </a>
        </div>
      </div>
    </div>
  )
}
