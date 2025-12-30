'use client'

import { ReactNode, useEffect, useState } from 'react'
import GoogleAnalytics from './GoogleAnalytics'

interface AnalyticsProviderProps {
  children: ReactNode
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [hasMarketingConsent, setHasMarketingConsent] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const checkConsent = () => {
      try {
        const storedConsent = localStorage.getItem('c15t-consent')
        if (storedConsent) {
          const consent = JSON.parse(storedConsent)
          setHasMarketingConsent(consent.marketing === true)
        }
      } catch (error) {
        console.log('Could not access localStorage for analytics')
      }
    }

    checkConsent()

    // Listen for consent changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'c15t-consent') {
        checkConsent()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <>
      {/* Only load GoogleAnalytics if we have a valid measurement ID */}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics
          measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          conversionId="AW-17605550256"
          hasMarketingConsent={hasMarketingConsent}
        />
      )}
      
      {/* Google Tag Manager (noscript) - only if GTM is configured */}
      {hasMarketingConsent && process.env.NEXT_PUBLIC_GTM_ID && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}
      
      {children}
    </>
  )
}