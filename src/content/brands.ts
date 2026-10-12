import type { L } from './types'

/**
 * European furniture partners shown on projects-world.com.
 *
 * `logo` stays empty until the official logo files are exported from the
 * current site or the brands' press kits; the directory shows a typographic
 * name plate until then, so no logo is ever redrawn or approximated.
 *
 * `slug` matches the existing /brands/{slug}/ URLs where they are known.
 */

export type BrandFocus = 'upholstery' | 'classical' | 'contemporary' | 'office' | 'lighting' | 'seating'

export const focusLabels: Record<BrandFocus, L> = {
  upholstery: { en: 'Upholstery', ar: 'التنجيد' },
  classical: { en: 'Classical furniture', ar: 'أثاث كلاسيكي' },
  contemporary: { en: 'Contemporary furniture', ar: 'أثاث معاصر' },
  office: { en: 'Office furniture', ar: 'أثاث مكتبي' },
  lighting: { en: 'Lighting', ar: 'الإضاءة' },
  seating: { en: 'Chairs & seating', ar: 'الكراسي والمقاعد' },
}

export const countryLabels = {
  IT: { en: 'Italy', ar: 'إيطاليا' },
  PT: { en: 'Portugal', ar: 'البرتغال' },
} satisfies Record<string, L>

export interface Brand {
  slug: string
  name: string
  country: keyof typeof countryLabels
  focus: BrandFocus
  /** Path to the official logo (SVG preferred). */
  logo?: string
  /** Services this brand is typically specified for. */
  services: string[]
}

export const brands: Brand[] = [
  { slug: 'daytona', name: 'Daytona', country: 'IT', focus: 'upholstery', services: ['interior-design-furnishing', 'residential-interior-design-furnishing'] },
  { slug: 'quadrifoglio', name: 'Quadrifoglio', country: 'IT', focus: 'office', services: ['office-furnishing-fit-out-solutions'] },
  { slug: 'zanaboni', name: 'Zanaboni', country: 'IT', focus: 'classical', services: ['residential-interior-design-furnishing'] },
  { slug: 'antonelli-moravio', name: 'Antonelli Moravio', country: 'IT', focus: 'classical', services: ['residential-interior-design-furnishing'] },
  { slug: 'altavilla', name: 'Altavilla', country: 'IT', focus: 'classical', services: ['residential-interior-design-furnishing'] },
  { slug: 'ulivi', name: 'Ulivi', country: 'IT', focus: 'upholstery', services: ['residential-interior-design-furnishing', 'hospitality-furnishing-solutions'] },
  { slug: 'volpi', name: 'Volpi', country: 'IT', focus: 'classical', services: ['residential-interior-design-furnishing'] },
  { slug: 'meroni-colzani', name: 'Meroni & Colzani', country: 'IT', focus: 'contemporary', services: ['interior-design-furnishing'] },
  { slug: 'dema', name: 'Dema', country: 'IT', focus: 'contemporary', services: ['interior-design-furnishing', 'hospitality-furnishing-solutions'] },
  { slug: 'dellarovere', name: 'Dellarovere', country: 'IT', focus: 'upholstery', services: ['interior-design-furnishing'] },
  { slug: 'codutti', name: 'Codutti', country: 'IT', focus: 'contemporary', services: ['interior-design-furnishing'] },
  { slug: 'valderamobili', name: 'Valderamobili', country: 'IT', focus: 'classical', services: ['residential-interior-design-furnishing'] },
  { slug: 'masiero', name: 'Masiero', country: 'IT', focus: 'lighting', services: ['styling-furnishing', 'hospitality-furnishing-solutions'] },
  { slug: 'cmcadeiras', name: 'CM Cadeiras', country: 'PT', focus: 'seating', services: ['hospitality-furnishing-solutions'] },
  { slug: 'domkapa', name: 'Domkapa', country: 'PT', focus: 'upholstery', services: ['interior-design-furnishing', 'hospitality-furnishing-solutions'] },
  { slug: 'laskasas', name: 'Laskasas', country: 'PT', focus: 'contemporary', services: ['interior-design-furnishing', 'residential-interior-design-furnishing'] },
]

export function getBrand(slug: string) {
  return brands.find((b) => b.slug === slug)
}
