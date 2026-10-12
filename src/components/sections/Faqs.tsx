import type { Faq } from '@/content/services'
import { useLanguage } from '@/i18n'

/** Native disclosure widgets: keyboard and screen-reader friendly with no JS. */
export function Faqs({ items }: { items: Faq[] }) {
  const { tr } = useLanguage()
  return (
    <div className="border-t border-charcoal-900/15">
      {items.map((f) => (
        <details key={f.q.en} className="group border-b border-charcoal-900/15">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
            <h3 className="font-serif text-[1.375rem] leading-snug">{tr(f.q)}</h3>
            <span aria-hidden="true" className="relative h-3 w-3 shrink-0">
              <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
              <span className="absolute inset-y-0 left-1/2 w-px bg-current transition-transform duration-400 group-open:scale-y-0" />
            </span>
          </summary>
          <p className="max-w-prose pb-7 text-stone-700">{tr(f.a)}</p>
        </details>
      ))}
    </div>
  )
}
