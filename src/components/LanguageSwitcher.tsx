'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface LanguageSwitcherProps {
  currentLocale: string
}

// German page <-> English page
const pagePairs: [string, string][] = [
  ['/', '/en'],
  ['/geschichte', '/history'],
  ['/speisekarte', '/menu'],
  ['/kontakt', '/contact'],
  ['/reservierung', '/reservation'],
  ['/datenschutz', '/privacy'],
  ['/impressum', '/legal'],
]

function counterpart(pathname: string, target: 'de' | 'en'): string {
  const path = pathname.replace(/\/+$/, '') || '/'
  const pair = pagePairs.find(([de, en]) => path === de || path === en)
  if (!pair) return target === 'en' ? '/en' : '/'
  return target === 'en' ? pair[1] : pair[0]
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname()

  const options = [
    { code: 'de' as const, label: 'DE', name: 'Deutsch' },
    { code: 'en' as const, label: 'EN', name: 'English' },
  ]
  
  return (
    <div
      role="group"
      aria-label="Language"
      className="relative flex items-center p-1 rounded-full bg-[#fbf5ea]/90 border border-[#d6c098] shadow-[0_2px_6px_rgba(80,50,20,0.12)]"
    >
      {/* Sliding highlight behind the active language */}
      <span
        aria-hidden="true"
        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-b from-[#8e1f25] to-[#6c1519] shadow-[0_2px_6px_rgba(80,20,20,0.35)] transition-transform duration-300 ease-out ${
          currentLocale === 'en' ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      {options.map((opt) => {
        const active = currentLocale === opt.code
        return (
          <Link
            key={opt.code}
            href={active ? pathname : counterpart(pathname, opt.code)}
            aria-current={active ? 'true' : undefined}
            aria-label={opt.name}
            hrefLang={opt.code}
            className={`relative z-10 flex items-center justify-center gap-1.5 w-[4.25rem] py-1.5 rounded-full font-garamond font-bold text-base leading-none no-underline transition-colors duration-300 ${
              active ? 'text-[#fbf3e4] pointer-events-none' : 'text-[#2b1a10] hover:text-[#7b1a1f]'
            }`}
            style={{ textDecoration: 'none' }}
          >
            <Flag code={opt.code} />
            {opt.label}
          </Link>
        )
      })}
    </div>
  )
}

function Flag({ code }: { code: 'de' | 'en' }) {
  if (code === 'en') {
    return (
      <svg viewBox="0 0 60 30" className="w-5 h-3 rounded-[2px] shadow-sm shrink-0" aria-hidden="true">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2.5" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 5 3" className="w-5 h-3 rounded-[2px] shadow-sm shrink-0" aria-hidden="true">
      <rect width="5" height="1" y="0" fill="#000" />
      <rect width="5" height="1" y="1" fill="#DD0000" />
      <rect width="5" height="1" y="2" fill="#FFCE00" />
    </svg>
  )
}
