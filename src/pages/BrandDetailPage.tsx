import { Link } from 'react-router-dom'
import { Globe2, Layers, Sofa } from 'lucide-react'
import { useLanguage } from '@/i18n'
import { brands, countryLabels, focusLabels, getBrand } from '@/content/brands'
import { getService } from '@/content/services'
import { media } from '@/content/media'
import { whatsappLink } from '@/content/company'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { PageHero } from '@/components/sections/PageHero'
import { BrandGrid } from '@/components/sections/BrandGrid'
import { SectionHead } from '@/components/sections/Cards'
import { Button } from '@/components/ui/Links'

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
  const others = brands
    .filter((x) => x.slug !== slug && x.focus === brand.focus)
    .concat(brands.filter((x) => x.slug !== slug && x.focus !== brand.focus))
    .slice(0, 4)

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={`/brands/${slug}/`} jsonLd={[breadcrumbSchema(locale, crumbs.map((c) => ({ name: c.label, path: c.path })))]} />
      <PageHero eyebrow={b.eyebrow} title={brand.name} crumbs={crumbs} media={media.brands} />

      <section className="py-section">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-lead text-charcoal-900">{b.detailLead(brand.name, country, focus)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={href('/contact/') + '#inquiry'} track={`brand_${slug}`}>
                {b.ask}
              </Button>
              <Button to={whatsappLink(`${brand.name} – Projects World`)} variant="whatsapp" icon="whatsapp" track={`brand_${slug}_whatsapp`}>
                {t.homeX.whatsappCta}
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="card p-7">
              <div className="flex aspect-[2/1] items-center justify-center rounded-btn bg-ivory-200">
                {brand.logo ? (
                  <img src={brand.logo} alt={`${brand.name} logo`} className="max-h-16 w-auto" />
                ) : (
                  <span aria-hidden="true" dir="ltr" className="font-heading text-[1.75rem] font-extrabold uppercase tracking-[0.06em]">
                    {brand.name}
                  </span>
                )}
              </div>
              <dl className="mt-6 space-y-4">
                <div className="flex items-start gap-4">
                  <span className="icon-tile h-11 w-11">
                    <Globe2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-caption font-semibold uppercase tracking-[0.08em] text-stone-600">{b.origin}</dt>
                    <dd className="font-semibold">{country}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="icon-tile h-11 w-11">
                    <Sofa className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-caption font-semibold uppercase tracking-[0.08em] text-stone-600">{b.focus}</dt>
                    <dd className="font-semibold">{focus}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="icon-tile h-11 w-11">
                    <Layers className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-caption font-semibold uppercase tracking-[0.08em] text-stone-600">{b.usedFor}</dt>
                    <dd className="mt-1 flex flex-wrap gap-2">
                      {brand.services.map((s) => {
                        const svc = getService(s)
                        return svc ? (
                          <Link key={s} to={href(`/${s}/`)} className="rounded-full bg-ivory-200 px-3 py-1 text-caption font-semibold hover:bg-bronze-500">
                            {tr(svc.title)}
                          </Link>
                        ) : null
                      })}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory-200 py-section" aria-labelledby="other-brands">
        <div className="shell">
          <SectionHead id="other-brands" eyebrow={b.eyebrow} title={b.other} />
          <div className="mt-12">
            <BrandGrid brands={others} />
          </div>
        </div>
      </section>
    </>
  )
}
