import { useState } from 'react'
import { useLanguage } from '@/i18n'
import { brands, focusLabels, type BrandFocus } from '@/content/brands'
import { media } from '@/content/media'
import { Seo } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { cn } from '@/lib/hooks'
import { PageHero } from '@/components/sections/PageHero'
import { BrandGrid } from '@/components/sections/BrandGrid'
import { CtaBand } from '@/components/sections/CtaBand'

export function BrandsPage() {
  const { t, tr, locale } = useLanguage()
  const b = t.brands
  const [focus, setFocus] = useState<BrandFocus | 'all'>('all')
  const foci = Array.from(new Set(brands.map((x) => x.focus)))
  const visible = focus === 'all' ? brands : brands.filter((x) => x.focus === focus)
  const crumbs = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.brands, path: '/our-brands/' },
  ]

  return (
    <>
      <Seo title={b.meta.title} description={b.meta.description} path="/our-brands/" jsonLd={[breadcrumbSchema(locale, crumbs.map((c) => ({ name: c.label, path: c.path })))]} />
      <PageHero eyebrow={b.eyebrow} title={b.title} lead={b.lead} crumbs={crumbs} media={media.brands} />

      <section className="py-section">
        <div className="shell">
          <div role="group" aria-label={b.focus} className="mb-10 flex flex-wrap gap-2">
            {(['all', ...foci] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={focus === f}
                onClick={() => setFocus(f)}
                className={cn(
                  'rounded-full border px-5 py-2.5 text-body-sm font-semibold transition-colors',
                  focus === f ? 'border-bronze-500 bg-bronze-500 text-charcoal-950' : 'border-charcoal-900/15 bg-white hover:border-charcoal-900',
                )}
              >
                {f === 'all' ? b.filterAll : tr(focusLabels[f])}
              </button>
            ))}
          </div>
          <BrandGrid brands={visible} headingLevel={2} />
          <p className="mt-10 rounded-card bg-ivory-200 p-6 text-body-sm text-stone-700">{b.note}</p>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
