import { useLanguage } from '@/i18n'
import { useSeo } from '@/lib/seo'
import { PageHero } from '@/components/layout/PageHero'
import { About } from '@/components/sections/About'
import { BrandStory } from '@/components/sections/BrandStory'
import { Metrics } from '@/components/sections/Metrics'
import { WhyAtmaal } from '@/components/sections/WhyAtmaal'
import { ContactCTA } from '@/components/sections/ContactCTA'

export function AboutPage() {
  const { locale, t } = useLanguage()
  const page = t.pages.about

  useSeo({ title: page.metaTitle, description: page.metaDescription, locale, path: '/about' })

  return (
    <>
      <PageHero eyebrow={t.about.eyebrow} title={page.hero} lede={page.lede} />
      <Metrics />
      <div id="story">
        <About hideHeading />
      </div>
      <BrandStory />
      <WhyAtmaal />
      <ContactCTA withForm={false} />
    </>
  )
}
