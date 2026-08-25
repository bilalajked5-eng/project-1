import { Link } from 'react-router-dom'
import { useT } from '@/i18n'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { IconLinkedIn, IconMail, IconX } from '@/components/ui/Icons'

export function Footer() {
  const t = useT()
  const year = new Date().getFullYear()

  return (
    <footer className="on-dark relative isolate overflow-hidden bg-ink-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgb(var(--brand-700)/0.35),transparent_55%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-dark [background-size:52px_52px] opacity-25" />

      <div className="shell relative">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link to="/" aria-label={t.a11y.homeLink} className="inline-block">
              <Logo variant="light" />
            </Link>
            <p className="mt-6 max-w-sm text-body-sm leading-relaxed text-white/55">
              {t.footer.blurb}
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={`mailto:${t.contact.email}`}
                className="group inline-flex items-center gap-3 text-body-sm text-white/75 transition-colors duration-300 hover:text-white"
              >
                <IconMail className="h-4 w-4 text-brand-300" />
                {t.contact.email}
              </a>
              <p className="text-body-sm text-white/60">{t.contact.location}</p>
            </div>

            <div className="mt-8">
              <p className="text-eyebrow uppercase text-white/60">{t.footer.social}</p>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href="https://x.com/atmaalksa"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Atmaal on X"
                  className="grid h-10 w-10 place-items-center rounded-control text-white/60 ring-1 ring-white/12 transition-all duration-300 hover:bg-white/10 hover:text-white"
                >
                  <IconX className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/atmaal"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Atmaal on LinkedIn"
                  className="grid h-10 w-10 place-items-center rounded-control text-white/60 ring-1 ring-white/12 transition-all duration-300 hover:bg-white/10 hover:text-white"
                >
                  <IconLinkedIn className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {t.footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="text-eyebrow uppercase text-white/60">{col.title}</h2>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}`}>
                      <Link
                        to={link.to}
                        className="group inline-flex text-body-sm text-white/65 transition-colors duration-300 hover:text-white"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-300 transition-transform duration-400 ease-premium group-hover:scale-x-100" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="hairline flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-white/60">
            © {year} Atmaal. {t.footer.rights}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link to="/privacy" className="text-body-sm text-white/50 transition-colors hover:text-white">
              {t.footer.privacy}
            </Link>
            <Link to="/terms" className="text-body-sm text-white/50 transition-colors hover:text-white">
              {t.footer.terms}
            </Link>
            <LanguageSwitcher onDark />
          </div>
        </div>
      </div>
    </footer>
  )
}
