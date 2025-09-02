// Tailwind CSS configuration for teal-mint dashboard theme
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1320px' } },
    extend: {
      colors: {
        // Custom color variables
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        stroke: 'var(--stroke)',
        ink: 'var(--text)',
        muted: 'var(--muted)',
        primary: { DEFAULT: 'var(--primary)', ink: 'var(--primary-ink)', tint: 'var(--primary-tint)' },
        secondary: { DEFAULT: 'var(--secondary)', tint: 'var(--secondary-tint)' },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: 'var(--shadow)',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    plugin(function({ addComponents }) {
      addComponents({
        '.card': {
          backgroundColor: 'var(--panel)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--stroke)',
          boxShadow: 'var(--shadow)',
        },
        '.input': {
          backgroundColor: 'var(--panel)',
          border: '1px solid var(--stroke)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          color: 'var(--text)',
          '&:focus': {
            outline: 'none',
            borderColor: 'var(--primary)',
            boxShadow: '0 0 0 2px var(--primary-tint)',
          },
        },
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.875rem',
          fontWeight: '500',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        }
      })
    })
  ],
}
export default config
