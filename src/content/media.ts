import type { MediaSlot } from './types'

/**
 * Site-wide image slots outside services and projects.
 *
 * To go live with photography, export each image from the current
 * WordPress media library (or a licensed source for non-project imagery),
 * place it in `public/images/`, and set `src`, `width` and `height` here.
 * Prefer AVIF or WebP at 1600–2400px on the long edge, plus a `srcSet`.
 */
export const media = {
  hero: {
    art: 'lounge',
    tone: 'charcoal',
    alt: {
      en: 'Luxury living room with European furniture and soft evening light',
      ar: 'غرفة معيشة فاخرة بأثاث أوروبي وإضاءة مسائية هادئة',
    },
  },
  /** Optional muted, looping background video for the hero (MP4, under 4 MB). */
  heroVideo: '' as string,
  intro: {
    art: 'sofa',
    tone: 'stone',
    alt: { en: 'Furnished living space by Projects World', ar: 'مساحة معيشة أثّثتها بروجكتس وورلد' },
  },
  introDetail: {
    art: 'materials',
    tone: 'ivory',
    alt: { en: 'Fabric, timber and stone finish samples', ar: 'عيّنات أقمشة وأخشاب وأحجار' },
  },
  why: {
    art: 'colonnade',
    tone: 'stone',
    alt: { en: 'Architectural interior with columns and daylight', ar: 'مساحة معمارية بأعمدة وضوء نهاري' },
  },
  about: {
    art: 'plan',
    tone: 'ivory',
    alt: { en: 'Projects World design studio, Riyadh', ar: 'استوديو التصميم في بروجكتس وورلد، الرياض' },
  },
  aboutTeam: {
    art: 'office',
    tone: 'stone',
    alt: { en: 'The Projects World office in Al Olaya, Riyadh', ar: 'مكتب بروجكتس وورلد في العليا، الرياض' },
  },
  contact: {
    art: 'dining',
    tone: 'charcoal',
    alt: { en: 'Elegant dining room in evening light', ar: 'غرفة طعام أنيقة في إضاءة المساء' },
  },
  brands: {
    art: 'chair',
    tone: 'bronze',
    alt: { en: 'Italian armchair in a showroom setting', ar: 'كرسي إيطالي في صالة عرض' },
  },
} satisfies Record<string, MediaSlot | string>
