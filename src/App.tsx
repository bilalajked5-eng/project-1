import { useEffect, type ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { basePath, LanguageProvider, localeFromPath, localePath, useLanguage } from '@/i18n'
import { services } from '@/content/services'
import { projects } from '@/content/projects'
import { brands } from '@/content/brands'
import { redirects } from '@/routes'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Home } from '@/pages/Home'
import { AboutPage } from '@/pages/AboutPage'
import { ProcessPage } from '@/pages/ProcessPage'
import { ServicesPage } from '@/pages/ServicesPage'
import { ServiceDetailPage } from '@/pages/ServiceDetailPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { BrandsPage } from '@/pages/BrandsPage'
import { BrandDetailPage } from '@/pages/BrandDetailPage'
import { ContactPage } from '@/pages/ContactPage'
import { LegalPage } from '@/pages/LegalPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const staticPages: Record<string, () => ReactElement> = {
  '/': () => <Home />,
  '/about/': () => <AboutPage />,
  '/our-process/': () => <ProcessPage />,
  '/services/': () => <ServicesPage />,
  '/our-projects/': () => <ProjectsPage />,
  '/our-brands/': () => <BrandsPage />,
  '/contact/': () => <ContactPage />,
  '/privacy-policy/': () => <LegalPage kind="privacy" />,
  '/terms-conditions/': () => <LegalPage kind="terms" />,
}

/** Resolve an English-equivalent path to its page. Paths are normalised to a trailing slash. */
function resolve(base: string): ReactElement | null {
  const path = base.endsWith('/') ? base : `${base}/`
  if (staticPages[path]) return staticPages[path]()

  const serviceMatch = path.match(/^\/([a-z0-9-]+)\/$/)
  if (serviceMatch && services.some((s) => s.slug === serviceMatch[1])) {
    return <ServiceDetailPage key={serviceMatch[1]} slug={serviceMatch[1]} />
  }
  const projectMatch = path.match(/^\/projects\/([a-z0-9-]+)\/$/)
  if (projectMatch && projects.some((p) => p.slug === projectMatch[1])) {
    return <ProjectDetailPage key={projectMatch[1]} slug={projectMatch[1]} />
  }
  const brandMatch = path.match(/^\/brands\/([a-z0-9-]+)\/$/)
  if (brandMatch && brands.some((b) => b.slug === brandMatch[1])) {
    return <BrandDetailPage key={brandMatch[1]} slug={brandMatch[1]} />
  }
  return null
}

/** Restore scroll on navigation, honouring in-page anchors. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }))
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

/** Keep <html lang/dir> in sync with the active locale. */
function DocumentLanguage() {
  const { locale, dir } = useLanguage()
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])
  return null
}

function Shell() {
  const { t } = useLanguage()
  const { pathname, search, hash } = useLocation()
  const locale = localeFromPath(pathname)
  const base = basePath(pathname)

  // Legacy URLs: client-side fallback for the server 301s
  const redirect = redirects.find(([from]) => from.replace(/\/$/, '') === base.replace(/\/$/, ''))
  if (redirect) return <Navigate to={localePath(locale, redirect[1]) + search + hash} replace />

  // Paths without a trailing slash resolve to the canonical form
  const page = resolve(base)
  if (page && !base.endsWith('/')) return <Navigate to={pathname + '/' + search + hash} replace />

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:bg-charcoal-900 focus:px-5 focus:py-3 focus:text-body-sm focus:text-ivory-50"
      >
        {t.a11y.skip}
      </a>
      <DocumentLanguage />
      <ScrollManager />
      <Header />
      <main id="main" key={pathname}>
        {page ?? <NotFoundPage />}
      </main>
      <Footer />
    </>
  )
}

export function App() {
  const { pathname } = useLocation()
  return (
    <LanguageProvider locale={localeFromPath(pathname)}>
      <Shell />
    </LanguageProvider>
  )
}
