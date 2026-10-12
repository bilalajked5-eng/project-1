import { services } from '@/content/services'
import { projects } from '@/content/projects'
import { brands } from '@/content/brands'

/**
 * Canonical English paths. Every path exists again under `/ar`.
 *
 * Existing projects-world.com URLs are kept verbatim (including trailing
 * slashes and slugs such as `private-palace-2`) so indexed pages and
 * backlinks continue to resolve without a redirect.
 */
export const staticPaths = [
  '/',
  '/about/',
  '/our-process/',
  '/services/',
  '/our-projects/',
  '/our-brands/',
  '/contact/',
  '/privacy-policy/',
  '/terms-conditions/',
]

export function allPaths(): string[] {
  return [
    ...staticPaths,
    ...services.map((s) => `/${s.slug}/`),
    ...projects.map((p) => `/projects/${p.slug}/`),
    ...brands.map((b) => `/brands/${b.slug}/`),
  ]
}

/**
 * Permanent (301) redirects from legacy or retired URLs to their closest
 * replacement. Written to `dist/_redirects` and `dist/.htaccess` at build time
 * and honoured client-side for in-app navigation.
 */
export const redirects: Array<[from: string, to: string]> = [
  ['/home/', '/'],
  ['/en/', '/'],
  ['/en/Projects', '/our-projects/'],
  ['/en/projects/', '/our-projects/'],
  ['/gallery/', '/our-projects/'],
  ['/projects/', '/our-projects/'],
  ['/portfolio/', '/our-projects/'],
  ['/brands/', '/our-brands/'],
  ['/about-us/', '/about/'],
  ['/contact-us/', '/contact/'],
  ['/process/', '/our-process/'],
]
