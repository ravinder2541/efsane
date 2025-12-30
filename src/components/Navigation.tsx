'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
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

  // Scroll detection for navbar visibility
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 100) {
        // Always show navbar when near top
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlNavbar)
    return () => window.removeEventListener('scroll', controlNavbar)
  }, [lastScrollY])

  const messages = {
    de: {
      home: 'Startseite',
      history: 'Geschichte',
      menu: 'Speisekarte',
      contact: 'Kontakt',
      reservation: 'Reservierung'
    },
    en: {
      home: 'Home',
      history: 'History',
      menu: 'Menu',
      contact: 'Contact',
      reservation: 'Reservation'
    }
  }

  const currentMessages = messages[locale as keyof typeof messages]
  
  const navigationLinks = [
    { href: locale === 'en' ? '/en' : '/', label: currentMessages.home },
    { href: locale === 'en' ? '/history' : '/geschichte', label: currentMessages.history },
    { href: locale === 'en' ? '/menu' : '/speisekarte', label: currentMessages.menu },
    { href: locale === 'en' ? '/contact' : '/kontakt', label: currentMessages.contact },
  ]

  const reservationLink = {
    href: locale === 'en' ? '/reservation' : '/reservierung',
    label: currentMessages.reservation
  }

  return (
    <nav className={`bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section - Compact and Professional */}
          <Link 
            href={locale === 'en' ? '/en' : '/'} 
            className="flex items-center space-x-3 no-underline md:mt-8"
            style={{ textDecoration: 'none' }}
          >
            <div className="md:bg-white md:rounded-lg md:p-2 md:shadow-sm">
              <Image
                src="/images/logo.svg"
                alt="Efsane Gasthaus Rudolph"
                width={148}
                height={148}
                className="h-16 md:h-48 drop-shadow-sm md:mt-14"
                priority
              />
            </div>
          </Link>
          
          {/* Desktop Navigation - Clean and Minimal */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium no-underline rounded-lg transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50/50'
                }`}
                style={{ textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Separator */}
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            
            {/* Reservation Button - Premium Style */}
            <Link
              href={reservationLink.href}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm no-underline hover:from-amber-700 hover:to-amber-800 hover:shadow-md transition-all duration-200"
              style={{ textDecoration: 'none' }}
            >
              {reservationLink.label}
            </Link>
            
            {/* Language Switcher */}
            <div className="ml-2">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>

          {/* Mobile Menu Button - Refined */}
          <div className="lg:hidden flex items-center space-x-3">
            <LanguageSwitcher currentLocale={locale} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Clean Slide Down */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 bg-white/95 backdrop-blur-md">
            <div className="flex flex-col space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 text-sm font-medium no-underline rounded-lg mx-2 transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50/50'
                  }`}
                  style={{ textDecoration: 'none' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Reservation Button */}
              <div className="px-4 pt-4 border-t border-gray-100 mt-2">
                <Link
                  href={reservationLink.href}
                  className="block w-full text-center px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {reservationLink.label}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}