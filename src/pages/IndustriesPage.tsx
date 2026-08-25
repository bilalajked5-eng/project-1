import { useLanguage } from '@/i18n'
import { useSeo } from '@/lib/seo'
import { PageHero } from '@/components/layout/PageHero'
import { Industries } from '@/components/sections/Industries'
import { WhyAtmaal } from '@/components/sections/WhyAtmaal'
import { CaseStudies } from '@/components/sections/CaseStudies'
import { ContactCTA } from '@/components/sections/ContactCTA'

export function IndustriesPage() {
  const { locale, t } = useLanguage()
  const page = t.pages.industries

  useSeo({ title: page.metaTitle, description: page.metaDescription, locale, path: '/industries' })

  return (
    <>
      <PageHero eyebrow={t.industries.eyebrow} title={page.hero} lede={page.lede} />
      <Industries tone="light" />
      <WhyAtmaal />
      <CaseStudies />
      <ContactCTA withForm={false} />
    </>
  )
}
