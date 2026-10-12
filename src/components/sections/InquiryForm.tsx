import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '@/i18n'
import { company, whatsappLink } from '@/content/company'
import { cn } from '@/lib/hooks'
import { track } from '@/lib/analytics'
import { Arrow } from '@/components/ui/Links'

/**
 * Project inquiry form.
 *
 * Submits JSON to `VITE_FORM_ENDPOINT` (any form backend or the client's CRM
 * webhook). Without an endpoint it falls back to a pre-filled email so the
 * inquiry is never lost. Spam protection: a hidden honeypot field and a
 * minimum time-to-submit, both checked before sending.
 */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined
const MIN_FILL_MS = 3000

type Field = 'projectType' | 'name' | 'company' | 'email' | 'phone' | 'message' | 'consent'
type Values = Record<Exclude<Field, 'consent'>, string> & { consent: boolean }
type Errors = Partial<Record<Field, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Saudi and international numbers: digits, spaces, +, -, brackets; 8–15 digits
const phoneOk = (v: string) => /^[+\d\s()-]+$/.test(v) && (v.match(/\d/g)?.length ?? 0) >= 8 && (v.match(/\d/g)?.length ?? 0) <= 15

export function InquiryForm({ initialTopic }: { initialTopic?: string }) {
  const { t, locale } = useLanguage()
  const f = t.form
  const uid = useId()
  const { search } = useLocation()
  const started = useRef(Date.now())
  const summaryRef = useRef<HTMLDivElement>(null)

  const topicParam = initialTopic ?? new URLSearchParams(search).get('topic') ?? ''
  const [values, setValues] = useState<Values>({
    projectType: f.projectTypes.includes(topicParam) ? topicParam : '',
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    consent: false,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback' | 'error'>('idle')
  const [honeypot, setHoneypot] = useState('')

  useEffect(() => {
    if (topicParam && f.projectTypes.includes(topicParam)) setValues((v) => ({ ...v, projectType: topicParam }))
  }, [topicParam, f.projectTypes])

  const validate = (v: Values): Errors => {
    const e: Errors = {}
    if (!v.projectType) e.projectType = f.errors.projectType
    if (v.name.trim().length < 2) e.name = f.errors.name
    if (!EMAIL_RE.test(v.email.trim())) e.email = f.errors.email
    if (!phoneOk(v.phone.trim())) e.phone = f.errors.phone
    if (v.message.trim().length < 20) e.message = f.errors.message
    if (!v.consent) e.consent = f.errors.consent
    return e
  }

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    // Clear an error as soon as the field becomes valid
    if (errors[key]) {
      const next = validate({ ...values, [key]: value })
      setErrors((prev) => ({ ...prev, [key]: next[key] }))
    }
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }

    // Bots fill hidden fields and submit instantly; quietly accept and drop
    if (honeypot || Date.now() - started.current < MIN_FILL_MS) {
      setStatus('sent')
      return
    }

    const payload = { ...values, locale, page: window.location.href, submittedAt: new Date().toISOString() }

    if (!ENDPOINT) {
      const body = [
        `${f.projectType}: ${values.projectType}`,
        `${f.name}: ${values.name}`,
        values.company ? `${f.company}: ${values.company}` : null,
        `${f.email}: ${values.email}`,
        `${f.phone}: ${values.phone}`,
        '',
        values.message,
      ]
        .filter((l) => l !== null)
        .join('\n')
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`Project inquiry – ${values.projectType}`)}&body=${encodeURIComponent(body)}`
      track('generate_lead', { method: 'mailto', project_type: values.projectType })
      setStatus('fallback')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(String(res.status))
      track('generate_lead', { method: 'form', project_type: values.projectType })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent' || status === 'fallback') {
    return (
      <div role="status" className="border-t border-charcoal-900/20 pt-10">
        <p className="font-serif text-display-md">{status === 'sent' ? f.successTitle : f.fallbackTitle}</p>
        <p className="mt-4 max-w-prose text-stone-700">{status === 'sent' ? f.successText : f.fallbackText}</p>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline mt-6 inline-block pb-1 text-caption font-semibold uppercase tracking-[0.16em]"
          onClick={() => track('whatsapp_click', { location: 'form_success' })}
        >
          {t.common.whatsapp}
        </a>
      </div>
    )
  }

  const errorList = Object.entries(errors).filter(([, v]) => v) as Array<[Field, string]>
  const id = (k: Field) => `${uid}-${k}`
  const describedBy = (k: Field, hint?: boolean) =>
    [errors[k] && `${id(k)}-error`, hint && `${id(k)}-hint`].filter(Boolean).join(' ') || undefined

  const label = (k: Field, text: string, required = true) => (
    <label htmlFor={id(k)} className="block text-caption font-semibold uppercase tracking-[0.14em] text-stone-700">
      {text}
      {required && <span className="sr-only"> ({f.required})</span>}
    </label>
  )
  const error = (k: Field) =>
    errors[k] ? (
      <p id={`${id(k)}-error`} className="mt-2 text-caption text-[#9B2C2C]">
        {errors[k]}
      </p>
    ) : null

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-8" aria-describedby={errorList.length ? `${uid}-summary` : undefined}>
      {errorList.length > 0 && (
        <div ref={summaryRef} id={`${uid}-summary`} tabIndex={-1} role="alert" className="border-s-2 border-[#9B2C2C] bg-[#9B2C2C]/5 p-4 text-body-sm text-[#7A1F1F]">
          <p className="font-semibold">{f.errors.summary}</p>
          <ul className="mt-2 list-disc space-y-1 ps-5">
            {errorList.map(([k, msg]) => (
              <li key={k}>
                <a href={`#${id(k)}`} className="underline">
                  {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        {label('projectType', f.projectType)}
        <select
          id={id('projectType')}
          className="field"
          value={values.projectType}
          onChange={(e) => set('projectType', e.target.value)}
          aria-invalid={!!errors.projectType}
          aria-describedby={describedBy('projectType')}
          required
        >
          <option value="">{f.choose}</option>
          {f.projectTypes.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {error('projectType')}
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          {label('name', f.name)}
          <input
            id={id('name')}
            className="field"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy('name')}
            required
          />
          {error('name')}
        </div>
        <div>
          {label('company', f.company, false)}
          <input id={id('company')} className="field" autoComplete="organization" value={values.company} onChange={(e) => set('company', e.target.value)} />
        </div>
        <div>
          {label('email', f.email)}
          <input
            id={id('email')}
            type="email"
            dir="ltr"
            className="field rtl:text-right"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy('email')}
            required
          />
          {error('email')}
        </div>
        <div>
          {label('phone', f.phone)}
          <input
            id={id('phone')}
            type="tel"
            dir="ltr"
            className="field rtl:text-right"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+966"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy('phone')}
            required
          />
          {error('phone')}
        </div>
      </div>

      <div>
        {label('message', f.message)}
        <p id={`${id('message')}-hint`} className="mt-1 text-caption text-stone-600">
          {f.messageHint}
        </p>
        <textarea
          id={id('message')}
          rows={5}
          className="field resize-y"
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy('message', true)}
          required
        />
        {error('message')}
      </div>

      {/* Honeypot: hidden from people and assistive tech, visible to naive bots */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id('company') + '-hp'}>Website</label>
        <input id={id('company') + '-hp'} tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-body-sm text-stone-700">
          <input
            id={id('consent')}
            type="checkbox"
            checked={values.consent}
            onChange={(e) => set('consent', e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={describedBy('consent')}
            className="mt-1 h-4 w-4 shrink-0 accent-charcoal-900"
          />
          <span>{f.consent}</span>
        </label>
        {error('consent')}
      </div>

      {status === 'error' && (
        <p role="alert" className="text-body-sm text-[#9B2C2C]">
          {f.errors.network}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className={cn(
          'group inline-flex min-h-[3.25rem] items-center gap-4 bg-charcoal-900 px-8 text-caption font-semibold uppercase tracking-[0.16em] text-ivory-50 transition-colors duration-400 hover:bg-charcoal-700',
          status === 'sending' && 'cursor-wait opacity-70',
        )}
      >
        {status === 'sending' ? f.sending : f.submit}
        <Arrow className="transition-transform duration-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </button>
    </form>
  )
}
