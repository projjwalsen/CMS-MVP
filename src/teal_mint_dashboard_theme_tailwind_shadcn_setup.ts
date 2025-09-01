// =============================
// 1) tailwind.config.ts
// =============================
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
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

// =============================
// 2) app/globals.css
// =============================
/* Font suggestion: Inter or Plus Jakarta Sans */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root{
  --bg: #F7F9FB; 
  --panel:#FFFFFF; 
  --stroke:#E7ECF2;
  --text:#0F172A; 
  --muted:#64748B;
  --primary:#20B486; 
  --primary-ink:#0B3B2F; 
  --primary-tint:#E6FBF4;
  --secondary:#4C6FFF; 
  --secondary-tint:#EEF2FF;
  --success:#21C679; 
  --warning:#FFCE54; 
  --danger:#EF4444;
  --radius-sm:8px; 
  --radius-md:12px; 
  --radius-lg:16px;
  --shadow:0 1px 2px rgba(16,24,40,.06),0 1px 1px rgba(16,24,40,.04);
}

/* Dark mode tokens (optional) */
.dark{
  --bg: #0B1220;
  --panel:#0F172A;
  --stroke:#1E293B;
  --text:#E5E7EB;
  --muted:#93A3B8;
  --primary:#22D3A1;
  --primary-ink:#04261F;
  --primary-tint:#073D31;
  --secondary:#7EA1FF; 
  --secondary-tint:#1B2A52;
  --success:#16A34A; 
  --warning:#F59E0B; 
  --danger:#F87171;
  --shadow:0 1px 2px rgba(0,0,0,.35),0 2px 8px rgba(0,0,0,.25);
}

html,body{ height:100%; }
body{
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
  background: var(--bg);
  color: var(--text);
}

/* Focus rings */
:where(button,a,input,select,textarea,[role="button"]) {
  outline: none;
}
:where(button,a,input,select,textarea,[role="button"]):focus-visible{
  box-shadow: 0 0 0 2px #A5EBDD;
}

/* Utility tints */
.bg-tint-primary{ background: var(--primary-tint); color: var(--primary); }
.bg-tint-secondary{ background: var(--secondary-tint); color: var(--secondary); }

/* Scrollbar subtle */
*{ scrollbar-width: thin; scrollbar-color: #CBD5E1 transparent }
*::-webkit-scrollbar{ height:8px; width:8px }
*::-webkit-scrollbar-thumb{ background:#CBD5E1; border-radius:8px }

// =============================
// 3) shadcn theme bridge (tokens → CSS vars)
//    Place in app/providers.tsx and wrap <ThemeProvider> if using next-themes
// =============================
'use client'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  )
}

// =============================
// 4) Example layout using tokens (app/(admin)/layout.tsx)
// =============================
import type { Metadata } from 'next'
import '../globals.css'
import Link from 'next/link'

export const metadata: Metadata = { title: 'College MVP', description: 'Teal-Mint Dashboard' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 border-b border-stroke bg-panel/80 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/admin" className="font-semibold">College MVP</Link>
          <div className="flex items-center gap-2">
            <input className="input w-64" placeholder="Search" />
            <button className="h-10 px-4 rounded-full bg-primary text-white">New</button>
          </div>
        </div>
      </header>
      <div className="container grid grid-cols-12 gap-6 py-6">
        <aside className="col-span-3 lg:col-span-2">
          <nav className="card p-3 sticky top-20">
            <ul className="space-y-1 text-sm text-muted">
              {['Dashboard','Students','Teachers','Courses','Sections','Timetable','Notices','Calendar','Messages'].map((i)=> (
                <li key={i}><a className="block rounded-md px-3 py-2 hover:bg-[var(--primary-tint)] hover:text-[var(--primary)]" href={'/admin/'+i.toLowerCase()}>{i}</a></li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="col-span-9 lg:col-span-10 space-y-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// =============================
// 5) Sample cards/tiles (components)
// =============================
export function KPI() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[['Students','1,240'],['Teachers','34'],['Today\'s Classes','18'],['Unread Messages','2']].map(([k,v])=> (
        <div key={k} className="card p-4">
          <div className="text-sm text-muted">{k}</div>
          <div className="text-2xl font-semibold mt-1">{v}</div>
        </div>
      ))}
    </div>
  )
}

export function RosterTile() {
  return (
    <div className="card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/avatar.png" className="h-10 w-10 rounded-full" alt=""/>
        <div>
          <div className="font-medium">Nina Elle</div>
          <div className="text-sm text-slate-500">Roll 2025-012 • CSE-5A</div>
        </div>
      </div>
      <span className="badge bg-tint-primary">Present</span>
    </div>
  )
}

// =============================
// 6) Minimal page example (app/admin/page.tsx)
// =============================
import { KPI, RosterTile } from '@/components/demo'

export default function Page(){
  return (
    <div className="space-y-6">
      <KPI />
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Recently Attended</div>
          <div className="flex gap-2">
            <button className="h-10 px-4 rounded-full border border-stroke">Filters</button>
            <button className="h-10 px-4 rounded-full bg-primary text-white">Export CSV</button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({length:6}).map((_,i)=>(<RosterTile key={i}/>))}
        </div>
      </div>
    </div>
  )
}
