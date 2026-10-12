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
      <section className="bg-ivory-200 py-section">
        <div className="shell max-w-3xl text-center">
          <p className="font-heading text-[6rem] font-extrabold leading-none text-bronze-600">404</p>
          <h1 className="mt-4 font-heading text-display-xl font-extrabold">{t.notFound.title}</h1>
          <p className="mx-auto mt-5 max-w-prose text-lead text-stone-600">{t.notFound.text}</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {links.map((l) => (
              <li key={l.path}>
                <Link to={href(l.path)} className="btn btn-outline min-h-[2.75rem] bg-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button to={href('/')} className="mt-8">
            {t.notFound.home}
          </Button>
        </div>
      </section>
    </>
  )
}
