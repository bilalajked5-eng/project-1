import { useLanguage } from '@/i18n'
import { useSeo } from '@/lib/seo'
import { PageHero } from '@/components/layout/PageHero'
import { Technology } from '@/components/sections/Technology'
import { Process } from '@/components/sections/Process'
import { BrandStory } from '@/components/sections/BrandStory'
import { ContactCTA } from '@/components/sections/ContactCTA'

export function TechnologyPage() {
  const { locale, t } = useLanguage()
  const page = t.pages.technology

  useSeo({ title: page.metaTitle, description: page.metaDescription, locale, path: '/technology' })

  return (
    <>
      <PageHero eyebrow={t.technology.eyebrow} title={page.hero} lede={page.lede} />
      <Technology hideHeading />
      <Process />
      <BrandStory />
      <ContactCTA withForm={false} />
    </>
  )
}
