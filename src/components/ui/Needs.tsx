/**
 * Content gaps, visible in development only.
 *
 * Production pages never show placeholder text; they omit the missing
 * field. In `npm run dev` each gap is listed so the team can see what to
 * supply. The full list is also in README.md.
 */
export function Needs({ items }: { items?: string[] }) {
  if (!import.meta.env.DEV || !items?.length) return null
  return (
    <aside className="my-8 border border-dashed border-[#9B2C2C]/60 bg-[#9B2C2C]/5 p-4 text-caption text-[#7A1F1F]" dir="ltr">
      <p className="mb-2 font-semibold uppercase tracking-[0.14em]">Content needed (dev only)</p>
      <ul className="list-disc space-y-1 ps-5">
        {items.map((n) => (
          <li key={n}>[NEEDS: {n}]</li>
        ))}
      </ul>
    </aside>
  )
}
