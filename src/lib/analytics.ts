/**
 * Conversion events, pushed to `window.dataLayer` so Google Tag Manager or
 * GA4 can pick them up without code changes. Inert when no tag is installed.
 */
type EventName = 'generate_lead' | 'click_to_call' | 'whatsapp_click' | 'email_click' | 'cta_click'

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

export function track(event: EventName, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
}
