import type { UI } from '@/i18n/ui'

export interface NavItem {
  key: keyof UI['nav']
  path: string
  /** Opens the services panel on desktop. */
  panel?: boolean
}

export const primaryNav: NavItem[] = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about/' },
  { key: 'services', path: '/services/', panel: true },
  { key: 'projects', path: '/our-projects/' },
  { key: 'brands', path: '/our-brands/' },
  { key: 'contact', path: '/contact/' },
]

/** Active when the current page sits under this section. */
export function isActive(item: NavItem, base: string, serviceSlugs: string[]) {
  if (item.path === '/') return base === '/'
  if (item.key === 'services') return base === '/services/' || serviceSlugs.some((s) => base === `/${s}/`)
  if (item.key === 'projects') return base.startsWith('/our-projects/') || base.startsWith('/projects/')
  if (item.key === 'brands') return base.startsWith('/our-brands/') || base.startsWith('/brands/')
  if (item.key === 'about') return base === '/about/' || base === '/our-process/'
  return base.startsWith(item.path)
}
