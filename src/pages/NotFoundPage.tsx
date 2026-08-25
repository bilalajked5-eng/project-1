import { useLanguage } from '@/i18n'
import { useSeo } from '@/lib/seo'
import { LinkButton } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'

export function NotFoundPage() {
  const { locale, t } = useLanguage()
  const page = t.pages.notFound

  useSeo({ title: page.metaTitle, description: page.metaDescription, locale, path: '/404' })

  return (
    <section className="relative isolate flex min-h-[75svh] items-center overflow-hidden bg-white pt-[84px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_70%_10%,rgb(var(--brand-50)),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-fine [background-size:56px_56px] mask-fade-b opacity-60"
      />

      <div className="shell">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>404</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 text-display-xl text-ink-900">{page.hero}</h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 text-body-xl text-sand-600">{page.lede}</p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <LinkButton to="/" variant="primary" size="lg" arrow>
                {t.cta.backHome}
              </LinkButton>
              <LinkButton to="/contact" variant="secondary" size="lg" arrow>
                {t.cta.talkToExpert}
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
