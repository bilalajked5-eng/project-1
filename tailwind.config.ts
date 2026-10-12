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
        ivory: {
          50: '#FCFAF7', // soft white — cards, form fields
          100: '#F7F3EC', // page ground
          200: '#EFE9DF', // alternate section ground
          300: '#E4DCCF',
        },
        stone: {
          300: '#CFC7BA',
          400: '#B3AA9B',
          500: '#8C8478',
          600: '#6B645A', // secondary text on ivory (5.3:1)
          700: '#4D4841',
        },
        charcoal: {
          700: '#3A3733',
          800: '#2A2825',
          900: '#1E1D1B', // primary text and dark sections
          950: '#141312',
        },
        bronze: {
          200: '#E2D3BC',
          300: '#CDB592', // champagne on charcoal
          400: '#B4976E',
          500: '#9A7B52',
          600: '#7A5F3D', // accent text on ivory (5.6:1)
          700: '#5F4930',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)'],
        sans: ['var(--font-sans)'],
      },
      fontSize: {
        /* Editorial scale, clamped from 360px to 1920px */
        'display-3xl': ['clamp(2.75rem, 1.6rem + 5.2vw, 6.5rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        'display-2xl': ['clamp(2.375rem, 1.5rem + 3.8vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.018em' }],
        'display-xl': ['clamp(2rem, 1.4rem + 2.6vw, 3.75rem)', { lineHeight: '1.06', letterSpacing: '-0.015em' }],
        'display-lg': ['clamp(1.625rem, 1.25rem + 1.6vw, 2.625rem)', { lineHeight: '1.12', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.375rem, 1.18rem + 0.8vw, 1.875rem)', { lineHeight: '1.2', letterSpacing: '-0.005em' }],
        lead: ['clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)', { lineHeight: '1.65' }],
        body: ['1rem', { lineHeight: '1.75' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.65' }],
        caption: ['0.8125rem', { lineHeight: '1.5' }],
        eyebrow: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.2em' }],
      },
      maxWidth: {
        shell: '96rem',
        prose: '40rem',
      },
      spacing: {
        gutter: 'var(--gutter)',
        section: 'var(--section-y)',
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
