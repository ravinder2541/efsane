'use client'

import { ReactNode, useEffect, useState } from 'react'

interface ConsentWrapperProps {
  children: ReactNode
}

export default function ConsentWrapper({ children }: ConsentWrapperProps) {
  const [mounted, setMounted] = useState(false)
  const [hasGivenConsent, setHasGivenConsent] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if consent has been given before
    const checkConsent = () => {
      try {
        const storedConsent = localStorage.getItem('c15t-consent')
        if (storedConsent) {
          setHasGivenConsent(true)
        }
      } catch (error) {
        // Handle localStorage access errors
        console.log('Could not access localStorage')
      }
    }

    checkConsent()
  }, [])

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('c15t-consent', JSON.stringify({
        necessary: true,
        marketing: true,
        timestamp: Date.now()
      }))
      setHasGivenConsent(true)
    } catch (error) {
      console.error('Could not save consent:', error)
    }
  }

  const handleAcceptNecessary = () => {
    try {
      localStorage.setItem('c15t-consent', JSON.stringify({
        necessary: true,
        marketing: false,
        timestamp: Date.now()
      }))
      setHasGivenConsent(true)
    } catch (error) {
      console.error('Could not save consent:', error)
    }
  }

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
    return null
  }

  // If no consent has been given yet, show site with blocking overlay
  if (!hasGivenConsent) {
    return (
      <div className="relative">
        {/* Show the website content but slightly dimmed - more visible */}
        <div className="filter blur-[1px] opacity-80 pointer-events-none select-none">
          {children}
        </div>

        {/* Cookie consent overlay */}
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-[2px]">
          <div className="min-h-screen flex items-end justify-center p-4">
            <div className="bg-white rounded-t-2xl shadow-2xl w-full max-w-4xl p-6 mb-0">
              <div className="text-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-primary-700 mb-3">
                  Cookie-Einstellungen
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten.
                  Bitte wählen Sie Ihre Cookie-Einstellungen.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-green-800">Notwendige Cookies</p>
                      <p className="text-sm text-green-700 mt-1">
                        Erforderlich für die Grundfunktionen der Website (immer aktiv)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-blue-800">Marketing Cookies</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Helfen uns, unsere Website zu verbessern und relevante Inhalte anzuzeigen
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                <button
                  onClick={handleAcceptAll}
                  className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Alle Cookies akzeptieren
                </button>

                <button
                  onClick={handleAcceptNecessary}
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
                >
                  Nur notwendige Cookies
                </button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>
                  Weitere Informationen finden Sie in unserer{' '}
                  <a
                    href="/datenschutz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline font-medium pointer-events-auto"
                    style={{ pointerEvents: 'auto' }}
                  >
                    Datenschutzerklärung
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If consent has been given, render the normal content
  return <>{children}</>
}
