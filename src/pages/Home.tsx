import { useLanguage } from '@/i18n'
import { useJsonLd, useSeo } from '@/lib/seo'
import { Hero } from '@/components/sections/Hero'
import { Metrics } from '@/components/sections/Metrics'
import { Intro } from '@/components/sections/Intro'
import { Solutions } from '@/components/sections/Solutions'
import { BrandStory } from '@/components/sections/BrandStory'
import { Technology } from '@/components/sections/Technology'
import { Process } from '@/components/sections/Process'
import { Industries } from '@/components/sections/Industries'
import { WhyAtmaal } from '@/components/sections/WhyAtmaal'
import { CaseStudies } from '@/components/sections/CaseStudies'
import { About } from '@/components/sections/About'
import { Careers } from '@/components/sections/Careers'
import { ContactCTA } from '@/components/sections/ContactCTA'

/**
 * Homepage.
 *
 * Section order is deliberate: claim → proof → positioning → what we do →
 * who we are → how we do it → how we work → who we serve → why us →
 * evidence → about → careers → act. Tone alternates light / tint / dark so
 * the page has rhythm rather than one long scroll of white.
 */
export function Home() {
  const { locale, t } = useLanguage()

  useSeo({
    title: `Atmaal | ${t.hero.h1a} ${t.hero.h1b}`,
    description: t.hero.body,
    locale,
    path: '/',
  })

  useJsonLd('ld-services', {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.solutions.heading,
    itemListElement: t.solutions.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: item.title,
        description: item.tagline,
        provider: { '@id': 'https://atmaal.sa/#organization' },
        areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
      },
    })),
  })

  return (
    <>
      <Hero />
      <Metrics />
      <Intro />
      <Solutions />
      <BrandStory />
      <Technology />
      <Process />
      <Industries />
      <WhyAtmaal />
      <CaseStudies />
      <About />
      <Careers />
      <ContactCTA />
    </>
  )
}
