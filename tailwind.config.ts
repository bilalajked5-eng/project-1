import type { Config } from 'tailwindcss'

/**
 * Atmaal design system.
 *
 * Colour values live as RGB channel triplets in `src/styles/globals.css`
 * (`:root` → `--brand-*`). That file is the single source of truth for the
 * palette — see the BRAND TOKENS block there to swap in exact brand-guide
 * hexes without touching any component.
 */

const channel = (name: string) => `rgb(var(${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Deep corporate ground — headers, dark sections, footers */
        ink: {
          950: channel('--ink-950'),
          900: channel('--ink-900'),
          800: channel('--ink-800'),
          700: channel('--ink-700'),
          600: channel('--ink-600'),
        },
        /* Primary brand */
        brand: {
          50: channel('--brand-50'),
          100: channel('--brand-100'),
          200: channel('--brand-200'),
          300: channel('--brand-300'),
          400: channel('--brand-400'),
          500: channel('--brand-500'),
          600: channel('--brand-600'),
          700: channel('--brand-700'),
          800: channel('--brand-800'),
          900: channel('--brand-900'),
        },
        /* Secondary brand */
        azure: {
          50: channel('--azure-50'),
          100: channel('--azure-100'),
          200: channel('--azure-200'),
          300: channel('--azure-300'),
          400: channel('--azure-400'),
          500: channel('--azure-500'),
          600: channel('--azure-600'),
          700: channel('--azure-700'),
          800: channel('--azure-800'),
          900: channel('--azure-900'),
        },
        /* Neutral surfaces and text */
        sand: {
          25: channel('--sand-25'),
          50: channel('--sand-50'),
          100: channel('--sand-100'),
          200: channel('--sand-200'),
          300: channel('--sand-300'),
          400: channel('--sand-400'),
          500: channel('--sand-500'),
          600: channel('--sand-600'),
          700: channel('--sand-700'),
          800: channel('--sand-800'),
          900: channel('--sand-900'),
        },
        glow: channel('--glow'),
      },

      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        /* Editorial scale — clamped so it breathes from 375px to 1920px */
        'display-2xl': ['clamp(2.625rem, 1.75rem + 3.9vw, 5.25rem)', { lineHeight: '0.98', letterSpacing: '-0.035em', fontWeight: '600' }],
        'display-xl': ['clamp(2.125rem, 1.55rem + 2.55vw, 3.625rem)', { lineHeight: '1.03', letterSpacing: '-0.03em', fontWeight: '600' }],
        'display-lg': ['clamp(1.875rem, 1.45rem + 1.9vw, 2.875rem)', { lineHeight: '1.08', letterSpacing: '-0.025em', fontWeight: '600' }],
        'display-md': ['clamp(1.5rem, 1.2rem + 1.35vw, 2.125rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-sm': ['clamp(1.35rem, 1.15rem + 0.9vw, 1.875rem)', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '600' }],
        'body-xl': ['clamp(1.125rem, 1.05rem + 0.35vw, 1.375rem)', { lineHeight: '1.6', letterSpacing: '-0.005em' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.65' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.65' }],
        'eyebrow': ['0.75rem', { lineHeight: '1', letterSpacing: '0.16em', fontWeight: '600' }],
      },

      spacing: {
        section: 'clamp(4.5rem, 3rem + 6vw, 9rem)',
        'section-sm': 'clamp(3rem, 2rem + 4vw, 5.5rem)',
        gutter: 'clamp(1.25rem, 0.5rem + 3vw, 3rem)',
      },

      maxWidth: {
        shell: '1440px',
        content: '1200px',
        prose: '68ch',
      },

      borderRadius: {
        /* Rounded but professional — 12–16px is the working range */
        card: '14px',
        panel: '16px',
        control: '12px',
        pill: '999px',
      },

      boxShadow: {
        soft: '0 1px 2px 0 rgb(var(--ink-900) / 0.04), 0 4px 16px -4px rgb(var(--ink-900) / 0.06)',
        card: '0 1px 3px 0 rgb(var(--ink-900) / 0.05), 0 12px 32px -12px rgb(var(--ink-900) / 0.12)',
        lift: '0 2px 6px 0 rgb(var(--ink-900) / 0.06), 0 24px 56px -20px rgb(var(--ink-900) / 0.22)',
        header: '0 1px 0 0 rgb(var(--ink-900) / 0.06), 0 8px 28px -12px rgb(var(--ink-900) / 0.14)',
        inset: 'inset 0 1px 0 0 rgb(255 255 255 / 0.06)',
      },

      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
        entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      transitionDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
      },

      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translate3d(0, 24px, 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'draw-line': {
          from: { strokeDashoffset: 'var(--dash, 1000)' },
          to: { strokeDashoffset: '0' },
        },
        'drift': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -14px, 0)' },
        },
        'orbit-pulse': {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.35)' },
        },
        'sheen': {
          from: { transform: 'translateX(-120%)' },
          to: { transform: 'translateX(220%)' },
        },
      },

      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        drift: 'drift 9s ease-in-out infinite',
        'orbit-pulse': 'orbit-pulse 3.2s ease-in-out infinite',
      },

      backgroundImage: {
        'grid-fine':
          'linear-gradient(to right, rgb(var(--ink-900) / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--ink-900) / 0.045) 1px, transparent 1px)',
        'grid-dark':
          'linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
} satisfies Config
