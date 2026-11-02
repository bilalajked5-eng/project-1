# QSC — Booking Form Integration & Secrets Setup

The form (`/en|ar/book-appointment/`) is complete and validated client-side, but ships
**unconnected**: `bookingEndpoint: null` in `src/scripts/site-config.js` renders an explicit
"integration pending" notice and submission never fakes success.

## Contract for the endpoint

- HTTPS URL accepting `POST multipart/form-data`.
- Fields: `name, phone, workshop (maintenance|painting), service (slug), brand, model,
  message, preferred_date, contact_method, consent, photos[] (≤6 images ≤8MB each),
  language, source_page`.
- Respond `2xx` only when the lead is durably stored/delivered; any other status shows
  the user an honest failure message.
- Server-side duties (not in the front end): re-validate all fields, verify image MIME +
  size, spam control (honeypot/turnstile/rate limit), CSRF strategy appropriate to the
  endpoint, consent logging with timestamp, delivery to email/CRM routed by `workshop`.

## Secrets policy

- No API keys, tokens or credentials ever go in `site-config.js` or any front-end file.
- SMTP/CRM credentials live in the serverless function's environment variables.
- `site-config.js` holds only public values: phone numbers, WhatsApp numbers, map URLs,
  the endpoint URL, analytics IDs.

## Suggested minimal implementation

A single serverless function (Cloudflare Worker / Vercel / Netlify function) that
validates, stores to a sheet/CRM, emails the correct branch inbox, and returns 200.
Wire its URL into `bookingEndpoint`, rebuild, deploy, then test: a successful submit
must show "Inquiry received… not a confirmed reservation", and a forced 500 must show
the failure message.

## Analytics events already emitted (dataLayer)

`phone_click, whatsapp_click, booking_start, booking_submit, photo_upload,
map_directions_click, workshop_select, service_select` — each with `language`,
`page_type`, and `workshop`/`service` where relevant. No personal form data or photo
contents are pushed. GA4/GTM only loads when an ID is configured.
