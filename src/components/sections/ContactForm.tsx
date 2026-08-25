import { useId, useState, type FormEvent } from 'react'
import { useT } from '@/i18n'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

type Field = 'name' | 'email' | 'company' | 'message'
type Errors = Partial<Record<Field, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Enquiry form.
 *
 * ▸ WIRING THE BACKEND: `submit()` currently validates and resolves locally.
 *   Replace the marked block with a POST to the real endpoint (or a form
 *   service) and surface a failure state alongside the existing success one.
 *   Everything else — validation, labelling, focus management, the live
 *   region — already behaves correctly.
 *
 * Accessibility: every control has a visible label, errors are tied to their
 * input via aria-describedby and announced politely, and the success message
 * takes focus so it is not missed by screen-reader users.
 */
export function ContactForm({ headingLevel = 'h3' }: { headingLevel?: 'h2' | 'h3' } = {}) {
  const t = useT()
  const f = t.contact.form
  const uid = useId()
  const Heading = headingLevel
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  function validate(data: FormData): Errors {
    const next: Errors = {}
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    if (!name) next.name = f.errorRequired
    if (!email) next.email = f.errorRequired
    else if (!EMAIL_RE.test(email)) next.email = f.errorEmail
    if (!message) next.message = f.errorRequired

    return next
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const found = validate(data)
    setErrors(found)

    if (Object.keys(found).length > 0) {
      // Move focus to the first field in error
      const first = Object.keys(found)[0]
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setStatus('sending')

    /* ── Replace with the real submission ──────────────────────────────
       await fetch('/api/enquiries', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(Object.fromEntries(data)),
       })
       ─────────────────────────────────────────────────────────────────── */
    await new Promise((resolve) => setTimeout(resolve, 700))

    setStatus('sent')
    form.reset()
  }

  const fieldClass = (hasError: boolean) =>
    cn(
      'w-full rounded-control bg-white/[0.04] px-4 py-3 text-body-sm text-white placeholder:text-white/30',
      'ring-1 transition-all duration-300 outline-none',
      'focus:bg-white/[0.07] focus:ring-2',
      hasError
        ? 'ring-red-400/70 focus:ring-red-300'
        : 'ring-white/12 hover:ring-white/25 focus:ring-brand-400',
    )

  const labelClass = 'block text-body-sm font-medium text-white/80'

  if (status === 'sent') {
    return (
      <div
        role="status"
        tabIndex={-1}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        ref={(node) => node?.focus()}
        className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-panel bg-white/[0.05] p-10 text-center ring-1 ring-white/12 backdrop-blur-xl"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/40">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <p className="mt-7 max-w-sm text-body-lg text-white/85 text-pretty">{f.success}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-panel bg-white/[0.05] p-7 ring-1 ring-white/12 backdrop-blur-xl sm:p-9"
    >
      <Heading className="font-display text-display-sm text-white">{f.title}</Heading>
      <p className="mt-2.5 text-body-sm text-white/55">{f.note}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor={`${uid}-name`} className={labelClass}>
            {f.name} <span className="text-brand-300" aria-hidden="true">*</span>
            <span className="sr-only">({f.required})</span>
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder={f.namePlaceholder}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
            className={cn('mt-2', fieldClass(Boolean(errors.name)))}
          />
          {errors.name && (
            <p id={`${uid}-name-err`} className="mt-2 text-body-sm text-red-300">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor={`${uid}-email`} className={labelClass}>
            {f.email} <span className="text-brand-300" aria-hidden="true">*</span>
            <span className="sr-only">({f.required})</span>
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            placeholder={f.emailPlaceholder}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
            className={cn('mt-2', fieldClass(Boolean(errors.email)))}
          />
          {errors.email && (
            <p id={`${uid}-email-err`} className="mt-2 text-body-sm text-red-300">
              {errors.email}
            </p>
          )}
        </div>

        {/* Company */}
        <div>
          <label htmlFor={`${uid}-company`} className={labelClass}>
            {f.company}
          </label>
          <input
            id={`${uid}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            placeholder={f.companyPlaceholder}
            className={cn('mt-2', fieldClass(false))}
          />
        </div>

        {/* Interest */}
        <div>
          <label htmlFor={`${uid}-interest`} className={labelClass}>
            {f.interest}
          </label>
          <select
            id={`${uid}-interest`}
            name="interest"
            defaultValue={f.interestOptions[0]}
            className={cn('mt-2 appearance-none', fieldClass(false))}
          >
            {f.interestOptions.map((option) => (
              <option key={option} value={option} className="bg-ink-900 text-white">
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-message`} className={labelClass}>
            {f.message} <span className="text-brand-300" aria-hidden="true">*</span>
            <span className="sr-only">({f.required})</span>
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={4}
            placeholder={f.messagePlaceholder}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${uid}-message-err` : undefined}
            className={cn('mt-2 resize-y', fieldClass(Boolean(errors.message)))}
          />
          {errors.message && (
            <p id={`${uid}-message-err`} className="mt-2 text-body-sm text-red-300">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button
          type="submit"
          variant="onDark"
          size="lg"
          arrow
          disabled={status === 'sending'}
          className="w-full sm:w-auto"
        >
          {status === 'sending' ? f.sending : f.submit}
        </Button>
      </div>
    </form>
  )
}
