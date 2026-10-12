import type { Service } from '@/content/services'
import { Reveal } from '@/components/ui/Reveal'
import { ServicePhotoCard } from './Cards'

/** Services grid: photo cards with an icon badge. */
export function ServicePanels({ items, headingLevel = 3 }: { items: Service[]; headingLevel?: 2 | 3 }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => (
        <Reveal as="li" key={s.slug} delay={(i % 3) * 80}>
          <ServicePhotoCard service={s} headingLevel={headingLevel} />
        </Reveal>
      ))}
    </ul>
  )
}
