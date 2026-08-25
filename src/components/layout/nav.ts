import type { Content } from '@/i18n'

export interface NavItem {
  to: string
  label: string
}

/** Primary navigation, derived from the active dictionary. */
export function navItems(t: Content): NavItem[] {
  return [
    { to: '/', label: t.nav.home },
    { to: '/about', label: t.nav.about },
    { to: '/solutions', label: t.nav.solutions },
    { to: '/industries', label: t.nav.industries },
    { to: '/technology', label: t.nav.technology },
    { to: '/careers', label: t.nav.careers },
    { to: '/contact', label: t.nav.contact },
  ]
}
