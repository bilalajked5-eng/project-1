import type { L } from './types'

/**
 * Company facts, taken from the current projects-world.com contact, about
 * and profile pages. Every component reads NAP details from here so the
 * address, phone and hours stay identical across pages and structured data.
 */
export const SITE_URL = 'https://projects-world.com'

export const company = {
  name: 'Projects World',
  legalName: 'Projects World Co.',
  nameAr: 'بروجكتس وورلد',
  founded: 2012,
  founder: { en: 'Shadi Salahia', ar: 'شادي صلاحية' } satisfies L,
  email: 'info@projects-world.com',
  phones: [
    { display: '+966 50 082 8018', tel: '+966500828018', label: { en: 'Mobile', ar: 'الجوال' } },
    { display: '+966 11 416 3757', tel: '+966114163757', label: { en: 'Office', ar: 'المكتب' } },
  ],
  /** WhatsApp uses the mobile line. Confirm it is WhatsApp-enabled before launch. */
  whatsapp: '966500828018',
  address: {
    building: { en: 'Dema Center', ar: 'مركز ديما' } satisfies L,
    street: { en: '7790 Wadi Al Artawi Street', ar: '7790 شارع وادي الأرطاوي' } satisfies L,
    district: { en: 'Al Olaya', ar: 'العليا' } satisfies L,
    city: { en: 'Riyadh', ar: 'الرياض' } satisfies L,
    postalCode: '12212',
    country: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' } satisfies L,
    countryCode: 'SA',
  },
  hours: {
    label: { en: 'Sunday – Thursday, 9:00 am – 6:00 pm', ar: 'الأحد – الخميس، 9:00 صباحًا – 6:00 مساءً' } satisfies L,
    schema: { days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '18:00' },
  },
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dema+Center+Wadi+Al+Artawi+Street+Al+Olaya+Riyadh',
  profilePdf: 'https://projects-world.com/wp-content/uploads/2023/10/Projects-World-Profile.pdf',
  /** [NEEDS: confirmed social profile URLs] — rendered only when filled. */
  social: [] as Array<{ name: string; url: string }>,
} as const

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${company.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
