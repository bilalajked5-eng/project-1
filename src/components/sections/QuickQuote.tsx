import { useId, useState, type FormEvent } from 'react'
import { useLanguage } from '@/i18n'
import { whatsappLink } from '@/content/company'
import { track } from '@/lib/analytics'
import { Arrow } from '@/components/ui/Links'

/**
 * Short hero quote form: name, phone and project type. It opens WhatsApp
 * with the request pre-written, the fastest route to a reply for this
 * market. The full form on the contact page posts to the CRM endpoint.
 */
export function QuickQuote() {
  const { t, locale } = useLanguage()
  const x = t.homeX
  const f = t.form
  const uid = useId()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (name.trim().length < 2) next.name = f.errors.name
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 8 || digits.length > 15) next.phone = f.errors.phone
    if (!type) next.type = f.errors.projectType
    setErrors(next)
    if (Object.keys(next).length) return

    const message =
      locale === 'ar'
        ? `مرحبًا بروجكتس وورلد، أرغب في عرض سعر.\nالاسم: ${name}\nالهاتف: ${phone}\nنوع المشروع: ${type}`
        : `Hello Projects World, I would like a quote.\nName: ${name}\nPhone: ${phone}\nProject type: ${type}`
    window.open(whatsappLink(message), '_blank', 'noopener')
    track('generate_lead', { method: 'whatsapp_quick_quote', project_type: type })
    setSent(true)
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${uid}-${k}-e`} className="mt-1.5 text-caption text-[#B42318]">
        {errors[k]}
      </p>
    ) : null

  return (
    <div className="rounded-card bg-white p-7 text-charcoal-900 shadow-lift sm:p-8">
      <h2 className="font-heading text-[1.5rem] font-extrabold">{x.quoteTitle}</h2>
      <p className="mt-2 text-body-sm text-stone-600">{x.quoteText}</p>

      {sent ? (
        <p role="status" className="mt-6 rounded-btn bg-bronze-200 p-4 text-body-sm text-charcoal-900">
          {x.quoteSent}
        </p>
      ) : (
        <form noValidate onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={`${uid}-name`} className="text-caption font-semibold text-stone-700">
              {f.name}
            </label>
            <input
              id={`${uid}-name`}
              className="field"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `${uid}-name-e` : undefined}
            />
            {err('name')}
          </div>
          <div>
            <label htmlFor={`${uid}-phone`} className="text-caption font-semibold text-stone-700">
              {f.phone}
            </label>
            <input
              id={`${uid}-phone`}
              type="tel"
              dir="ltr"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+966 5X XXX XXXX"
              className="field rtl:text-right"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? `${uid}-phone-e` : undefined}
            />
            {err('phone')}
          </div>
          <div>
            <label htmlFor={`${uid}-type`} className="text-caption font-semibold text-stone-700">
              {f.projectType}
            </label>
            <select
              id={`${uid}-type`}
              className="field"
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-invalid={!!errors.type}
              aria-describedby={errors.type ? `${uid}-type-e` : undefined}
            >
              <option value="">{f.choose}</option>
              {f.projectTypes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {err('type')}
          </div>
          <button type="submit" className="btn btn-gold group w-full">
            {x.quoteSend}
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </button>
        </form>
      )}
    </div>
  )
}
