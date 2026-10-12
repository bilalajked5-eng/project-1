import { Link } from 'react-router-dom'
import { useLanguage } from '@/i18n'
import { brands, countryLabels, focusLabels, getBrand } from '@/content/brands'
import { getService } from '@/content/services'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { Breadcrumbs } from '@/components/sections/PageHero'
import { BrandGrid } from '@/components/sections/BrandGrid'
import { Button } from '@/components/ui/Links'
import { MaskedHeading, Reveal } from '@/components/ui/Reveal'

export function BrandDetailPage({ slug }: { slug: string }) {
  const { t, tr, href, locale } = useLanguage()
  const b = t.brands
  const brand = getBrand(slug)!
  const country = tr(countryLabels[brand.country])
  const focus = tr(focusLabels[brand.focus])
  const meta = b.detailMeta(brand.name)
  const crumbs = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.brands, path: '/our-brands/' },
    { label: brand.name, path: `/brands/${slug}/` },
  ]
  const others = brands.filter((x) => x.slug !== slug && x.focus === brand.focus).concat(brands.filter((x) => x.slug !== slug && x.focus !== brand.focus)).slice(0, 4)

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={`/brands/${slug}/`} jsonLd={[breadcrumbSchema(locale, crumbs.map((c) => ({ name: c.label, path: c.path })))]} />

      <section className="page-enter pb-section pt-[calc(var(--header-h)+2.5rem)] lg:pt-40">
        <div className="shell">
          <Breadcrumbs items={crumbs} />
          <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-6">{b.eyebrow}</p>
              <div dir="ltr" className="rtl:text-right">
                <MaskedHeading as="h1" lines={[brand.name]} className="font-['Cormorant',serif] text-display-3xl font-light" />
              </div>
              <Reveal delay={200}>
                <p className="mt-10 max-w-prose text-lead text-stone-700">{b.detailLead(brand.name, country, focus)}</p>
              </Reveal>
              <Reveal delay={300} className="mt-12">
                <Button to={href('/contact/') + '#inquiry'} track={`brand_${slug}`}>
                  {b.ask}
                </Button>
              </Reveal>
            </div>
            <Reveal delay={150} className="lg:col-span-4 lg:col-start-9">
              <div className="flex aspect-square items-center justify-center border border-charcoal-900/15 bg-ivory-50 p-10">
                {brand.logo ? (
                  <img src={brand.logo} alt={`${brand.name} logo`} className="max-h-24 w-auto" />
                ) : (
                  <span aria-hidden="true" dir="ltr" className="text-center font-['Cormorant',serif] text-[2.75rem] leading-none text-charcoal-800">
                    {brand.name}
                  </span>
                )}
              </div>
              <dl className="mt-8 border-t border-charcoal-900/15">
                <div className="flex justify-between gap-6 border-b border-charcoal-900/15 py-4 text-body-sm">
                  <dt className="text-stone-600">{b.origin}</dt>
                  <dd className="font-medium">{country}</dd>
                </div>
                <div className="flex justify-between gap-6 border-b border-charcoal-900/15 py-4 text-body-sm">
                  <dt className="text-stone-600">{b.focus}</dt>
                  <dd className="font-medium">{focus}</dd>
                </div>
                <div className="border-b border-charcoal-900/15 py-4 text-body-sm">
                  <dt className="text-stone-600">{b.usedFor}</dt>
                  <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                    {brand.services.map((s) => {
                      const svc = getService(s)
                      return svc ? (
                        <Link key={s} to={href(`/${s}/`)} className="link-underline font-medium">
                          {tr(svc.title)}
                        </Link>
                      ) : null
                    })}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-charcoal-900/10 bg-ivory-200 py-section" aria-labelledby="other-brands">
        <div className="shell">
          <h2 id="other-brands" className="mb-12 font-serif text-display-lg font-light">
            {b.other}
          </h2>
          <BrandGrid brands={others} compact />
        </div>
      </section>
    </>
  )
}
