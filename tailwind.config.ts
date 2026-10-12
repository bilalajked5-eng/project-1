import type { Config } from 'tailwindcss'

/**
 * Projects World design system.
 *
 * A restrained, architectural palette: warm ivory grounds, charcoal type,
 * stone neutrals and a single muted bronze accent. Bronze has two weights:
 * `bronze-600` is dark enough for text on ivory (AA), `bronze-300` is the
 * champagne tone used on charcoal grounds and for hairline details.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* White and warm-grey grounds */
        ivory: {
          50: '#FFFFFF',
          100: '#FFFFFF', // page ground
          200: '#F6F4F0', // alternate section ground
          300: '#ECE8E1',
        },
        stone: {
          300: '#D9D6D0',
          400: '#B4B1AA',
          500: '#85878D',
          600: '#5A5D64', // secondary text on white (6.6:1)
          700: '#3E4148',
        },
        /* Deep charcoal for header bar, dark sections and footer */
        charcoal: {
          700: '#33363D',
          800: '#23262C',
          900: '#16181D',
          950: '#0D0E11',
        },
        /* Gold accent: 500 for fills (dark text on it), 600 for text on white, 300 on dark */
        bronze: {
          200: '#F4EAD3',
          300: '#E4C98E',
          400: '#D7B36A',
          500: '#C9A24D',
          600: '#8A651F',
          700: '#6B4E17',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        sans: ['var(--font-sans)'],
      },
      fontSize: {
        'display-3xl': ['clamp(2.375rem, 1.6rem + 3.4vw, 4.25rem)', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'display-2xl': ['clamp(2.125rem, 1.5rem + 2.6vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(1.875rem, 1.4rem + 1.9vw, 2.875rem)', { lineHeight: '1.15', letterSpacing: '-0.018em' }],
        'display-lg': ['clamp(1.5rem, 1.25rem + 1.1vw, 2.125rem)', { lineHeight: '1.2', letterSpacing: '-0.012em' }],
        'display-md': ['clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)', { lineHeight: '1.3', letterSpacing: '-0.006em' }],
        lead: ['clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)', { lineHeight: '1.7' }],
        body: ['1rem', { lineHeight: '1.75' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.65' }],
        caption: ['0.8125rem', { lineHeight: '1.5' }],
        eyebrow: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.12em' }],
      },
      maxWidth: {
        shell: '80rem',
        prose: '40rem',
      },
      spacing: {
        gutter: 'var(--gutter)',
        section: 'var(--section-y)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(22,24,29,0.04), 0 8px 24px -12px rgba(22,24,29,0.12)',
        lift: '0 2px 4px rgba(22,24,29,0.05), 0 24px 48px -20px rgba(22,24,29,0.28)',
      },
      borderRadius: {
        card: '14px',
        btn: '8px',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out-soft': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        400: '400ms',
        700: '700ms',
        900: '900ms',
        1200: '1200ms',
      },
    },
  },
  plugins: [],
} satisfies Config
