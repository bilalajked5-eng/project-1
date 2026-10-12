export type Locale = 'en' | 'ar'

/** A string in both site languages. */
export interface L {
  en: string
  ar: string
}

/** Art-directed fallback compositions — see `components/art/Art.tsx`. */
export type ArtVariant =
  | 'lounge'
  | 'sofa'
  | 'office'
  | 'hotel'
  | 'plan'
  | 'materials'
  | 'chair'
  | 'colonnade'
  | 'dining'

export type ArtTone = 'ivory' | 'stone' | 'charcoal' | 'bronze'

/**
 * One image slot. `src` is empty until authentic photography is supplied;
 * until then the art-directed composition renders in its place, so the
 * layout never shows a broken or borrowed image.
 */
export interface MediaSlot {
  /** Public path or absolute URL. Leave empty to render the art fallback. */
  src?: string
  /** Optional responsive set, e.g. `/images/x-800.avif 800w, /images/x-1600.avif 1600w`. */
  srcSet?: string
  width?: number
  height?: number
  alt: L
  art: ArtVariant
  tone?: ArtTone
}
