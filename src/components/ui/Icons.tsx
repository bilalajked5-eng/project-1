import type { SVGProps } from 'react'

/**
 * Line iconography — a single 24px grid, 1.5 stroke, round caps.
 * Geometric and restrained: these read as engineering marks, not illustration.
 */

type IconProps = SVGProps<SVGSVGElement>

const shared = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

/* ── Value-proposition icons ─────────────────────────────────────────── */

export function IconExcellence(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M3 17.5 8.5 12l3.5 3.5L21 6.5" />
      <path d="M21 11V6.5h-4.5" />
      <path d="M3 21h18" />
    </svg>
  )
}

export function IconAutomation(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <rect x="7.5" y="7.5" width="9" height="9" rx="2" />
      <path d="M12 3v4.5M12 16.5V21M3 12h4.5M16.5 12H21" />
      <path d="M5.5 5.5 7.9 7.9M16.1 16.1l2.4 2.4M18.5 5.5 16.1 7.9M7.9 16.1l-2.4 2.4" />
    </svg>
  )
}

export function IconCost(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M12 3v18" />
      <path d="M16.5 7.2c-.8-1.4-2.5-2.2-4.5-2.2-2.5 0-4.2 1.3-4.2 3.2 0 4.4 9 2.3 9 6.9 0 2-1.9 3.4-4.8 3.4-2.2 0-4-.9-4.8-2.4" />
    </svg>
  )
}

export function IconScale(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <rect x="3" y="14" width="4.5" height="7" rx="1" />
      <rect x="9.75" y="9" width="4.5" height="12" rx="1" />
      <rect x="16.5" y="3.5" width="4.5" height="17.5" rx="1" />
    </svg>
  )
}

export function IconPeople(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.75 20a6.25 6.25 0 0 1 12.5 0" />
      <path d="M16 5.4a3.25 3.25 0 0 1 0 6.2" />
      <path d="M17.5 14.4A6.26 6.26 0 0 1 21.25 20" />
    </svg>
  )
}

export function IconContinuity(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M12 2.75 4.5 6v6c0 4.4 3.1 8.2 7.5 9.25 4.4-1.05 7.5-4.85 7.5-9.25V6Z" />
      <path d="M9 12.2l2.1 2.1L15.2 10" />
    </svg>
  )
}

/* ── Solution-pillar icons ───────────────────────────────────────────── */

export function IconChip(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2.5" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
      <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
    </svg>
  )
}

export function IconLedger(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M5 3.75h11.5L20 7.25v13H5Z" />
      <path d="M16 3.75v3.5h4" />
      <path d="M8.5 12h7M8.5 15.5h7M8.5 8.5h3" />
    </svg>
  )
}

export function IconOperations(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.75v3M12 18.25v3M21.25 12h-3M5.75 12h-3" />
      <path d="m18.4 5.6-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6" />
    </svg>
  )
}

/* ── Industry marks ──────────────────────────────────────────────────── */

export function IconBank(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M5.5 9.5v8M10 9.5v8M14 9.5v8M18.5 9.5v8" />
      <path d="M3 20.5h18" />
    </svg>
  )
}

export function IconGovernment(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M12 2.75 4 7v2h16V7Z" />
      <path d="M6.5 9v9M11 9v9M15.5 9v9M20 9v9" />
      <path d="M3 21h18" />
      <path d="M12 5.5v.01" />
    </svg>
  )
}

export function IconHealth(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <rect x="3.5" y="6.5" width="17" height="14" rx="2.5" />
      <path d="M9 6.5V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M12 10.5v6M9 13.5h6" />
    </svg>
  )
}

export function IconRetail(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M4 8h16l-1.2 12.2a1 1 0 0 1-1 .8H6.2a1 1 0 0 1-1-.8Z" />
      <path d="M8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5" />
    </svg>
  )
}

export function IconTelecom(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M12 13.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M12 13.5V21" />
      <path d="M7.6 7.1a6 6 0 0 0 0 7.3M16.4 7.1a6 6 0 0 1 0 7.3" />
      <path d="M4.8 4.3a10 10 0 0 0 0 12.9M19.2 4.3a10 10 0 0 1 0 12.9" />
    </svg>
  )
}

export function IconInsurance(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M12 2.75 4.5 6v6c0 4.4 3.1 8.2 7.5 9.25 4.4-1.05 7.5-4.85 7.5-9.25V6Z" />
      <path d="M12 8.5v6M9 11.5h6" />
    </svg>
  )
}

export function IconEcommerce(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M2.75 4h2.4l2.2 10.6a1.6 1.6 0 0 0 1.6 1.3h8.1a1.6 1.6 0 0 0 1.6-1.25L20.5 7.5H6" />
      <circle cx="9.5" cy="19.5" r="1.3" />
      <circle cx="17.5" cy="19.5" r="1.3" />
    </svg>
  )
}

export function IconEnterprise(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M3.5 21V6.5L11 3.5V21" />
      <path d="M11 10h9.5v11" />
      <path d="M6.5 8.5v.01M6.5 12v.01M6.5 15.5v.01M15 13.5v.01M15 17v.01" />
      <path d="M2.5 21h19" />
    </svg>
  )
}

/* ── Utility marks ───────────────────────────────────────────────────── */

export function IconMail(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <rect x="2.75" y="5" width="18.5" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  )
}

export function IconPin(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

export function IconBriefcase(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <rect x="2.75" y="7" width="18.5" height="13" rx="2.5" />
      <path d="M8.5 7V5.5a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 5.5V7" />
      <path d="M2.75 12h18.5" />
    </svg>
  )
}

export function IconGlobe(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M2.75 12h18.5" />
      <path d="M12 2.75c2.3 2.5 3.6 5.8 3.6 9.25s-1.3 6.75-3.6 9.25c-2.3-2.5-3.6-5.8-3.6-9.25S9.7 5.25 12 2.75Z" />
    </svg>
  )
}

export function IconLinkedIn(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94ZM20.44 21v-6.86c0-3.36-1.79-4.92-4.18-4.92-1.93 0-2.79 1.06-3.27 1.8V8.5H9.62V21H13v-6.98c0-1.6.3-3.15 2.28-3.15 1.96 0 1.99 1.83 1.99 3.25V21h3.17Z" />
    </svg>
  )
}

export function IconX(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.53 3h3.16l-6.9 7.89L21.9 21h-6.35l-4.98-6.5L4.88 21H1.72l7.38-8.44L2.1 3h6.51l4.5 5.95L17.53 3Zm-1.11 16.06h1.75L7.66 4.84H5.78l10.64 14.22Z" />
    </svg>
  )
}

/** Registry so content can reference an icon by key. */
export const valueIcons = {
  excellence: IconExcellence,
  automation: IconAutomation,
  cost: IconCost,
  scale: IconScale,
  people: IconPeople,
  continuity: IconContinuity,
} as const

export const industryIcons = {
  banking: IconBank,
  government: IconGovernment,
  healthcare: IconHealth,
  retail: IconRetail,
  telecom: IconTelecom,
  insurance: IconInsurance,
  ecommerce: IconEcommerce,
  enterprise: IconEnterprise,
} as const

export const solutionIcons = {
  automation: IconChip,
  'financial-operations': IconLedger,
  'business-solutions': IconOperations,
} as const
