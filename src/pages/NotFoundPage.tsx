import { Link } from 'react-router-dom'
import { useLanguage } from '@/i18n'
import { Seo } from '@/lib/seo'
import { Button } from '@/components/ui/Links'

export function NotFoundPage() {
  const { t, href } = useLanguage()
  const links = [
    { label: t.nav.services, path: '/services/' },
    { label: t.nav.projects, path: '/our-projects/' },
    { label: t.nav.brands, path: '/our-brands/' },
    { label: t.nav.contact, path: '/contact/' },
  ]
  return (
    <>
      <Seo title={t.notFound.meta.title} description={t.notFound.meta.description} path="/404/" noindex />
      <section className="page-enter pb-section pt-[calc(var(--header-h)+5rem)] lg:pt-48">
        <div className="shell max-w-4xl">
          <p className="eyebrow mb-6">404</p>
          <h1 className="font-serif text-display-2xl font-light">{t.notFound.title}</h1>
          <p className="mt-8 max-w-prose text-lead text-stone-700">{t.notFound.text}</p>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {links.map((l) => (
              <li key={l.path}>
                <Link to={href(l.path)} className="link-underline pb-1 font-medium">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button to={href('/')} className="mt-12">
            {t.notFound.home}
          </Button>
        </div>
      </section>
    </>
  )
}
