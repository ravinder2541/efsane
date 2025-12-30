'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface GoogleAnalyticsProps {
  measurementId: string
  conversionId?: string
  hasMarketingConsent: boolean
}

export default function GoogleAnalytics({
  measurementId,
  conversionId,
  hasMarketingConsent
}: GoogleAnalyticsProps) {
  useEffect(() => {
    if (hasMarketingConsent && typeof window !== 'undefined') {
      // Update consent for Google Analytics
      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted'
        })
      }
    }
  }, [hasMarketingConsent])

  // Don't render anything if no measurement ID is provided
  if (!measurementId || measurementId === 'GA_MEASUREMENT_ID') {
    return <>{/* Analytics disabled - no measurement ID */}</>
  }

  return (
    <>
      {hasMarketingConsent && (
        <>
          {/* Google Ads Conversion Tracking */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${conversionId}`}
            strategy="afterInteractive"
          />
          
          <Script
            id="google-ads-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                
                // Set default consent
                gtag('consent', 'default', {
                  analytics_storage: 'granted',
                  ad_storage: 'granted',
                  ad_user_data: 'granted',
                  ad_personalization: 'granted',
                  wait_for_update: 500
                });
                
                gtag('js', new Date());
                gtag('config', '${conversionId}');
              `
            }}
          />
        </>
      )}
    </>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}