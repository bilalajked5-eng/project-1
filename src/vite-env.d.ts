/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Form backend or CRM webhook that accepts a JSON POST. */
  readonly VITE_FORM_ENDPOINT?: string
  /** Google Tag Manager container ID, e.g. GTM-XXXXXXX. */
  readonly VITE_GTM_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
