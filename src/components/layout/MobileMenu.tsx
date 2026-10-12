import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { basePath, useLanguage } from '@/i18n'
import { company, whatsappLink } from '@/content/company'
import { services } from '@/content/services'
import { cn, useFocusTrap, useScrollLock } from '@/lib/hooks'
import { track } from '@/lib/analytics'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { isActive, primaryNav } from './nav'

const serviceSlugs = services.map((s) => s.slug)

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, href } = useLanguage()
  const { pathname } = useLocation()
  const base = basePath(pathname)
  const trapRef = useFocusTrap<HTMLDivElement>(open)
  const closeRef = useRef<HTMLButtonElement>(null)
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      id="mobile-menu"
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.a11y.primaryNav}
      className={cn(
        'fixed inset-0 z-50 flex flex-col bg-charcoal-900 text-ivory-50 transition-[opacity,visibility] duration-700 ease-silk lg:hidden',
        open ? 'visible opacity-100' : 'invisible opacity-0',
      )}
    >
      <div className="shell flex h-20 items-center justify-between">
        <Logo light />
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t.a11y.menuClose} className="-me-2 flex h-11 w-11 items-center justify-center">
          <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
            <path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>

      <nav aria-label={t.a11y.primaryNav} className="shell flex-1 overflow-y-auto pb-10 pt-8">
        <ul>
          {primaryNav.map((item, i) => (
            <li
              key={item.key}
              className={cn('border-b border-ivory-50/10 transition-[opacity,transform] duration-700 ease-silk', open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}
              style={{ transitionDelay: open ? `${120 + i * 50}ms` : '0ms' }}
            >
              <Link
                to={href(item.path)}
                aria-current={isActive(item, base, serviceSlugs) ? 'page' : undefined}
                className="flex items-baseline justify-between py-4 font-heading text-[1.375rem] font-bold leading-tight aria-[current=page]:text-bronze-300"
              >
                {t.nav[item.key]}
                <span className="font-sans text-caption text-ivory-50/60">0{i + 1}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 space-y-3 text-body-sm">
          <a href={`tel:${company.phones[0].tel}`} dir="ltr" className="block" onClick={() => track('click_to_call', { location: 'mobile_menu' })}>
            {company.phones[0].display}
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-bronze-300"
            onClick={() => track('whatsapp_click', { location: 'mobile_menu' })}
          >
            {t.common.whatsapp}
          </a>
          <LanguageSwitcher className="inline-block pt-4" />
        </div>
      </nav>

      <div className="shell pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Link
          to={href('/contact/')}
          className="btn btn-gold w-full"
        >
          {t.nav.cta}
        </Link>
      </div>
    </div>
  )
}
