import { company, SITE_URL } from '@/content/company'
import type { Locale } from '@/content/types'
import { localePath } from '@/i18n'

/** Structured data builders. Facts come only from `content/company.ts`. */

export function organizationSchema(locale: Locale) {
  const a = company.address
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'FurnitureStore'],
    '@id': `${SITE_URL}/#organization`,
    name: company.name,
    alternateName: [company.legalName, company.nameAr],
    url: `${SITE_URL}${localePath(locale, '/')}`,
    logo: `${SITE_URL}/images/projects-world-logo.png`,
    image: `${SITE_URL}/images/og-projects-world.jpg`,
    email: company.email,
    telephone: company.phones[0].tel,
    foundingDate: String(company.founded),
    founder: { '@type': 'Person', name: company.founder.en },
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${a.building.en}, ${a.street.en}`,
      addressLocality: a.city.en,
      addressRegion: a.district.en,
      postalCode: a.postalCode,
      addressCountry: a.countryCode,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: company.hours.schema.days,
      opens: company.hours.schema.opens,
      closes: company.hours.schema.closes,
    },
    areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
    contactPoint: company.phones.map((p) => ({
      '@type': 'ContactPoint',
      telephone: p.tel,
      contactType: 'customer service',
      areaServed: 'SA',
      availableLanguage: ['English', 'Arabic'],
    })),
    ...(company.social.length ? { sameAs: company.social.map((s) => s.url) } : {}),
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: company.name,
    inLanguage: ['en', 'ar'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

export function breadcrumbSchema(locale: Locale, items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${localePath(locale, item.path)}`,
    })),
  }
}

export function serviceSchema(locale: Locale, name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${SITE_URL}${localePath(locale, path)}`,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
  }
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}
