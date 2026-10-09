'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, CalendarDays, ArrowRight } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Better locale detection based on actual German/English page paths
  const getLocale = (path: string): 'en' | 'de' => {
    const englishPaths = ['/en', '/history', '/menu', '/contact', '/reservation', '/privacy', '/legal']
    const germanPaths = ['/', '/geschichte', '/speisekarte', '/kontakt', '/reservierung', '/datenschutz', '/impressum']

    if (englishPaths.some(p => path === p || path.startsWith(p + '/'))) {
      return 'en'
    }
    return 'de'
  }
  
  const locale = getLocale(pathname)

  // On the home pages the navbar sits transparently on top of the hero until the user scrolls
  const [isAtTop, setIsAtTop] = useState(true)
  const isHomePage = pathname === '/' || pathname === '/en'
  const isOverlay = isHomePage && isAtTop && !isMenuOpen

  // Navbar stays fixed; once the page scrolls it gets a solid background and a slimmer height
  useEffect(() => {
    const onScroll = () => setIsAtTop(window.scrollY < 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const messages = {
    de: {
      home: 'Startseite',
      history: 'Geschichte',
      menu: 'Speisekarte',
      contact: 'Kontakt',
      reservation: 'Reservierung',
      cta: 'Tisch reservieren'
    },
    en: {
      home: 'Home',
      history: 'History',
      menu: 'Menu',
      contact: 'Contact',
      reservation: 'Reservation',
      cta: 'Reserve a Table'
    }
  }

  const currentMessages = messages[locale as keyof typeof messages]

  const reservationLink = {
    href: locale === 'en' ? '/reservation' : '/reservierung',
    label: currentMessages.reservation
  }

  const navigationLinks = [
    { href: locale === 'en' ? '/en' : '/', label: currentMessages.home },
    { href: locale === 'en' ? '/history' : '/geschichte', label: currentMessages.history },
    { href: locale === 'en' ? '/menu' : '/speisekarte', label: currentMessages.menu },
    { href: locale === 'en' ? '/contact' : '/kontakt', label: currentMessages.contact },
    reservationLink,
  ]

  return (
    <nav className={`[font-variant-numeric:lining-nums] fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
      isOverlay
        ? 'bg-transparent border-b border-transparent'
        : 'bg-[#f7efe1] shadow-[0_4px_16px_rgba(80,50,20,0.15)] border-b border-[#e3d3b4]'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-[7.8vw]">
        <div className={`flex justify-between items-center transition-[height] duration-300 ${isAtTop ? 'h-20 lg:h-24' : 'h-16 lg:h-[72px]'}`}>
          {/* Logo */}
          <Link
            href={locale === 'en' ? '/en' : '/'}
            className="flex items-center no-underline shrink-0"
            style={{ textDecoration: 'none' }}
          >
            <Image
              src="/logo.png?v=2"
              alt="Efsane Gasthaus Rudolph"
              width={2172}
              height={724}
              className={`w-auto drop-shadow-[0_1px_2px_rgba(60,35,10,0.45)] transition-[height] duration-300 ${isAtTop ? 'h-12 lg:h-[clamp(48px,4.6vw,92px)]' : 'h-10 lg:h-[52px]'}`}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-[2.3vw]">
            {navigationLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-2 font-garamond font-semibold text-[clamp(1rem,1.22vw,1.45rem)] whitespace-nowrap no-underline transition-colors duration-200 ${
                    isActive ? 'text-[#7b1a1f]' : 'text-[#2b1a10] hover:text-[#7b1a1f]'
                  }`}
                  style={{ textDecoration: 'none' }}
                >
                  {link.label}
                  {isActive && (
                    <svg viewBox="0 0 60 8" className="absolute left-0 -bottom-1 w-full h-2 text-[#7b1a1f]" preserveAspectRatio="none" aria-hidden="true">
                      <line x1="0" y1="4" x2="25" y2="4" stroke="currentColor" strokeWidth="1" />
                      <path d="M30 0.5 L33.5 4 L30 7.5 L26.5 4 Z" fill="currentColor" />
                      <line x1="35" y1="4" x2="60" y2="4" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  )}
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-[1.6vw]">
            <LanguageSwitcher currentLocale={locale} />
            <Link
              href={reservationLink.href}
              className="group hidden xl:inline-flex items-center gap-[0.8vw] px-[1.5vw] py-[0.75vw] rounded-lg bg-gradient-to-b from-[#8e1f25] to-[#6c1519] text-[#fbf3e4] font-garamond font-semibold text-[clamp(1rem,1.22vw,1.45rem)] shadow-[0_6px_14px_rgba(80,20,20,0.3)] hover:from-[#7b1a1f] hover:to-[#5a1014] transition-colors no-underline whitespace-nowrap"
              style={{ textDecoration: 'none' }}
            >
              <CalendarDays className="w-5 h-5" strokeWidth={1.6} />
              {currentMessages.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <LanguageSwitcher currentLocale={locale} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-[#2b1a10]"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[#e3d3b4] py-4">
            <div className="flex flex-col space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 font-garamond font-semibold text-lg no-underline rounded-lg mx-2 transition-colors duration-200 ${
                    pathname === link.href
                      ? 'bg-[#efe1c8] text-[#7b1a1f]'
                      : 'text-[#2b1a10] hover:text-[#7b1a1f] hover:bg-[#f1e6d2]'
                  }`}
                  style={{ textDecoration: 'none' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="px-4 pt-4 border-t border-[#e3d3b4] mt-2">
                <Link
                  href={reservationLink.href}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg bg-gradient-to-b from-[#8e1f25] to-[#6c1519] text-[#fbf3e4] font-garamond font-semibold text-lg no-underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CalendarDays className="w-5 h-5" strokeWidth={1.6} />
                  {currentMessages.cta}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
