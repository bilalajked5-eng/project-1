import { useLanguage } from '@/i18n'
import { useSeo } from '@/lib/seo'
import { PageHero } from '@/components/layout/PageHero'
import { Solutions } from '@/components/sections/Solutions'
import { Process } from '@/components/sections/Process'
import { CaseStudies } from '@/components/sections/CaseStudies'
import { ContactCTA } from '@/components/sections/ContactCTA'

export function SolutionsPage() {
  const { locale, t } = useLanguage()
  const page = t.pages.solutions

  useSeo({ title: page.metaTitle, description: page.metaDescription, locale, path: '/solutions' })

  return (
    <>
      <PageHero eyebrow={t.solutions.eyebrow} title={page.hero} lede={page.lede} />
      <Solutions hideHeading />
      <Process />
      <CaseStudies />
      <ContactCTA withForm={false} />
    </>
  )
}
