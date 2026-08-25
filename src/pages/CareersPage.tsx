import { useLanguage } from '@/i18n'
import { useSeo } from '@/lib/seo'
import { PageHero } from '@/components/layout/PageHero'
import { Careers } from '@/components/sections/Careers'
import { WhyAtmaal } from '@/components/sections/WhyAtmaal'
import { Metrics } from '@/components/sections/Metrics'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { LinkButton } from '@/components/ui/Button'

export function CareersPage() {
  const { locale, t } = useLanguage()
  const page = t.pages.careers

  useSeo({ title: page.metaTitle, description: page.metaDescription, locale, path: '/careers' })

  return (
    <>
      <PageHero eyebrow={t.careers.eyebrow} title={page.hero} lede={page.lede}>
        <div className="mt-9">
          <LinkButton href="https://careers.atmaal.sa/en/" external variant="primary" size="lg" arrow>
            {t.careers.cta}
          </LinkButton>
        </div>
      </PageHero>
      <Metrics />
      <Careers />
      <WhyAtmaal />
      <ContactCTA withForm={false} />
    </>
  )
}
