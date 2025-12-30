'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Globe, Languages } from 'lucide-react'

interface LanguageSwitcherProps {
  currentLocale: string
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    {
      code: 'de',
      name: 'Deutsch',
      nativeName: 'Deutsch',
      flag: 'DE',
      path: getGermanPath(pathname)
    },
    {
      code: 'en', 
      name: 'English',
      nativeName: 'English',
      flag: 'EN',
      path: getEnglishPath(pathname)
    }
  ]

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Professional Language Switcher */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md group"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Languages className="w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors" />
        <span className="font-medium text-sm">{currentLanguage.flag}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-300 ${isOpen ? 'rotate-180 text-primary-600' : 'group-hover:text-gray-600'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-40 md:hidden" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 min-w-[180px] animate-scale-in">
            {/* Header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Select Language</span>
              </div>
            </div>
            
            {/* Language Options */}
            <div className="py-1">
              {languages.map((lang) => (
                <Link
                  key={lang.code}
                  href={lang.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group
                    ${currentLocale === lang.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:text-gray-900'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-8 h-6 rounded-sm flex items-center justify-center text-xs font-bold border
                      ${currentLocale === lang.code 
                        ? 'bg-primary-100 text-primary-700 border-primary-200' 
                        : 'bg-gray-100 text-gray-600 border-gray-200 group-hover:bg-gray-200'
                      }
                    `}>
                      {lang.flag}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{lang.nativeName}</div>
                      <div className="text-xs text-gray-500">{lang.name}</div>
                    </div>
                  </div>
                  
                  {currentLocale === lang.code && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Helper functions to map paths between languages
function getGermanPath(pathname: string): string {
  // Remove /en prefix and map English paths to German
  const cleanPath = pathname.replace(/^\/en/, '')
  
  const pathMap: Record<string, string> = {
    '': '/',
    '/': '/',
    '/history': '/geschichte',
    '/menu': '/speisekarte', 
    '/contact': '/kontakt',
    '/reservation': '/reservierung'
  }
  
  return pathMap[cleanPath] || '/'
}

function getEnglishPath(pathname: string): string {
  // Map German paths to English
  const pathMap: Record<string, string> = {
    '/': '/en',
    '/geschichte': '/history',
    '/speisekarte': '/menu',
    '/kontakt': '/contact', 
    '/reservierung': '/reservation'
  }
  
  return pathMap[pathname] || '/en'
}