import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useT } from '@/i18n'
import { useScrolled } from '@/lib/hooks'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/ui/Logo'
import { LinkButton } from '@/components/ui/Button'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
import { navItems } from './nav'

/**
 * Sticky header.
 *
 * At rest it floats on a translucent surface with generous height. Past the
 * fold it compacts, deepens its blur and picks up a hairline + shadow — the
 * elevation change signals "you have left the hero" without a jump.
 */
export function Header() {
  const t = useT()
  const scrolled = useScrolled(24)
  const [menuOpen, setMenuOpen] = useState(false)
  const items = navItems(t)

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-premium',
          scrolled
            ? 'bg-white/85 shadow-header backdrop-blur-xl backdrop-saturate-150'
            : 'bg-white/0',
        )}
        style={{ ['--header-h' as string]: scrolled ? '68px' : '84px' }}
      >
        <div className="shell">
          <div
            className={cn(
              'flex items-center justify-between transition-all duration-500 ease-premium',
              scrolled ? 'h-[68px]' : 'h-[84px]',
            )}
          >
            <Link
              to="/"
              aria-label={t.a11y.homeLink}
              className="shrink-0 transition-opacity duration-300 hover:opacity-80"
            >
              <Logo />
            </Link>

            {/* Desktop navigation — minimal, with a precise active indicator */}
            <nav aria-label={t.nav.primary} className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'group relative block rounded-control px-3.5 py-2 text-body-sm font-medium transition-colors duration-300',
                          isActive ? 'text-ink-900' : 'text-sand-600 hover:text-ink-900',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {item.label}
                          <span
                            aria-hidden="true"
                            className={cn(
                              'absolute inset-x-3.5 -bottom-px h-px origin-center bg-brand-600 transition-transform duration-400 ease-premium',
                              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                            )}
                          />
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              <LinkButton
                to="/contact"
                variant="primary"
                size="md"
                arrow
                className="hidden sm:inline-flex"
              >
                {t.cta.talkToExpert}
              </LinkButton>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={t.nav.open}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="grid h-11 w-11 place-items-center rounded-control text-ink-800 ring-1 ring-sand-200 transition-colors duration-300 hover:bg-sand-50 lg:hidden"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Hairline appears only once elevated */}
        <div
          aria-hidden="true"
          className={cn(
            'h-px bg-gradient-to-r from-transparent via-sand-200 to-transparent transition-opacity duration-500',
            scrolled ? 'opacity-100' : 'opacity-0',
          )}
        />
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} items={items} />
    </>
  )
}
