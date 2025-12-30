/* 
  Example of how to use the new analytics system in your components
  This file shows best practices for tracking events, conversions, and page views
*/

'use client'

import { useAnalytics } from '@/hooks/useAnalytics'
import { useEffect } from 'react'

export default function ExampleAnalyticsUsage() {
  const { hasConsent, trackEvent, trackPageView, trackConversion } = useAnalytics()

  useEffect(() => {
    // Track page view when component mounts
    if (hasConsent) {
      trackPageView(window.location.href, 'Example Page')
    }
  }, [hasConsent, trackPageView])

  const handleButtonClick = () => {
    // Track button clicks
    trackEvent({
      action: 'click',
      category: 'engagement',
      label: 'example_button',
      value: 1
    })
  }

  const handleReservationSubmit = () => {
    // Track form submissions
    trackEvent({
      action: 'form_submit',
      category: 'reservation',
      label: 'reservation_form'
    })

    // Track conversion for reservations
    trackConversion('AW-17605550256', 'CONVERSION_LABEL', 50)
  }

  const handleMenuView = () => {
    // Track menu interactions
    trackEvent({
      action: 'view',
      category: 'menu',
      label: 'menu_opened'
    })
  }

  const handlePhoneCall = () => {
    // Track phone calls
    trackEvent({
      action: 'call',
      category: 'contact',
      label: 'phone_click'
    })

    // Track conversion for phone calls
    trackConversion('AW-17605550256', 'PHONE_CALL_LABEL')
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Analytics Usage Examples</h2>
      <p className="mb-4">
        Consent Status: {hasConsent ? '✅ Marketing cookies accepted' : '❌ Only necessary cookies'}
      </p>
      
      <div className="space-y-4">
        <button 
          onClick={handleButtonClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Track Button Click
        </button>

        <button 
          onClick={handleReservationSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Track Reservation (with conversion)
        </button>

        <button 
          onClick={handleMenuView}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Track Menu View
        </button>

        <button 
          onClick={handlePhoneCall}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Track Phone Call (with conversion)
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Common Tracking Examples:</h3>
        <pre className="text-sm overflow-x-auto">
{`// Track reservation form submission
trackEvent({
  action: 'form_submit',
  category: 'reservation',
  label: 'reservation_form'
})

// Track menu download
trackEvent({
  action: 'download',
  category: 'menu',
  label: 'menu_pdf'
})

// Track phone number click
trackEvent({
  action: 'click',
  category: 'contact',
  label: 'phone_number'
})

// Track conversion with value
trackConversion('AW-17605550256', 'PURCHASE', 25.50)`}
        </pre>
      </div>
    </div>
  )
}