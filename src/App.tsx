import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useT } from '@/i18n'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Home } from '@/pages/Home'
import { AboutPage } from '@/pages/AboutPage'
import { SolutionsPage } from '@/pages/SolutionsPage'
import { IndustriesPage } from '@/pages/IndustriesPage'
import { TechnologyPage } from '@/pages/TechnologyPage'
import { CareersPage } from '@/pages/CareersPage'
import { ContactPage } from '@/pages/ContactPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * Restore scroll on navigation, honouring in-page anchors so footer links
 * like `/solutions#automation` land on their section rather than the top.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Let the target render before measuring it
      const id = hash.slice(1)
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' })
      })
      return
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return null
}

export function App() {
  const t = useT()

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:rounded-control focus:bg-ink-950 focus:px-5 focus:py-3 focus:text-body-sm focus:text-white"
      >
        {t.a11y.skipToContent}
      </a>

      <ScrollManager />
      <Header />

      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/technology" element={<TechnologyPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}
