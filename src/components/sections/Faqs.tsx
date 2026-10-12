import type { Faq } from '@/content/services'
import { useLanguage } from '@/i18n'

/** Card accordion built on native <details>: keyboard and screen-reader friendly without JS. */
export function Faqs({ items }: { items: Faq[] }) {
  const { tr } = useLanguage()
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <details key={f.q.en} open={i === 0} className="card group overflow-hidden open:border-bronze-500/50">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 [&::-webkit-details-marker]:hidden">
            <h3 className="font-heading text-[1.0625rem] font-bold">{tr(f.q)}</h3>
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ivory-200 text-[1.25rem] leading-none group-open:bg-bronze-500"
            >
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <p className="px-6 pb-6 text-body-sm text-stone-600">{tr(f.a)}</p>
        </details>
      ))}
    </div>
  )
}
