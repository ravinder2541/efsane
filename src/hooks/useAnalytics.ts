'use client'

import { useCallback, useEffect, useState } from 'react'

interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export function useAnalytics() {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Check if user has given marketing consent
    const checkConsent = () => {
      try {
        const storedConsent = localStorage.getItem('c15t-consent')
        if (storedConsent) {
          const consent = JSON.parse(storedConsent)
          setHasConsent(consent.marketing === true)
        }
      } catch (error) {
        console.log('Could not check consent for analytics')
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

  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (!hasConsent || typeof window === 'undefined' || !window.gtag) {
      return
    }

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value
    })
  }, [hasConsent])

  const trackPageView = useCallback((url: string, title?: string) => {
    if (!hasConsent || typeof window === 'undefined' || !window.gtag) {
      return
    }

    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_title: title || document.title,
      page_location: url
    })
  }, [hasConsent])

  const trackConversion = useCallback((conversionId: string, conversionLabel?: string, value?: number) => {
    if (!hasConsent || typeof window === 'undefined' || !window.gtag) {
      return
    }

    window.gtag('event', 'conversion', {
      send_to: `${conversionId}/${conversionLabel}`,
      value: value || 1,
      currency: 'EUR'
    })
  }, [hasConsent])

  return {
    hasConsent,
    trackEvent,
    trackPageView,
    trackConversion
  }
}