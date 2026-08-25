import { useLanguage } from '@/i18n'
import { useSeo } from '@/lib/seo'
import { PageHero } from '@/components/layout/PageHero'
import { ContactCTA } from '@/components/sections/ContactCTA'

export function ContactPage() {
  const { locale, t } = useLanguage()
  const page = t.pages.contact

  useSeo({ title: page.metaTitle, description: page.metaDescription, locale, path: '/contact' })

  return (
    <>
      <PageHero eyebrow={t.contact.eyebrow} title={page.hero} lede={page.lede} />
      <ContactCTA hideHeading />
    </>
  )
}
