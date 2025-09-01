import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1320px' } },
    extend: {
      colors: {
        // Core palette (light)
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        stroke: 'var(--stroke)',
        ink: 'var(--text)',
        primary: { DEFAULT: 'var(--primary)', ink: 'var(--primary-ink)', tint: 'var(--primary-tint)' },
        secondary: { DEFAULT: 'var(--secondary)', tint: 'var(--secondary-tint)' },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        // Keep existing shadcn colors for compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
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
    require('tailwindcss-animate'),
    // Utility classes for card, badge, input presets
    plugin(function({ addComponents, theme }) {
      addComponents({
        '.card': {
          background: theme('colors.panel'),
          border: `1px solid ${theme('colors.stroke')}`,
          borderRadius: theme('borderRadius.md'),
          boxShadow: theme('boxShadow.card'),
        },
        '.badge': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '999px',
          fontWeight: '600',
          fontSize: '0.8125rem',
          lineHeight: '1rem',
        },
        '.badge-teal': {
          background: 'var(--primary-tint)',
          color: 'var(--primary)'
        },
        '.input': {
          height: '2.5rem',
          border: `1px solid ${'#E7ECF2'}`,
          borderRadius: '10px',
          background: '#fff',
          paddingLeft: '0.75rem',
          paddingRight: '0.75rem',
        }
      })
    })
  ],
}
export default config