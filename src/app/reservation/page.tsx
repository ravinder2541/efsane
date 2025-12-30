'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Turnstile } from '@marsidev/react-turnstile'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import ReservationNotificationEn from '@/components/ReservationNotificationEn'
import {
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  Car,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react'

const reservationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  date: z.string().refine((date) => {
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selectedDate >= today
  }, 'Date must be in the future'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time'),
  guests: z.coerce.number({
    required_error: 'Number of guests is required',
    invalid_type_error: 'Please enter a valid number'
  }).min(1, 'At least 1 guest required').max(300, 'Maximum 300 guests allowed'),
  eventType: z.string()
    .min(1, 'Please select an event type')
    .refine((val) => ['business', 'private', 'celebration'].includes(val), {
      message: 'Please select a valid event type'
    }),
  specialRequests: z.string().max(1000, 'Special requests must not exceed 1000 characters').optional(),
})

type ReservationFormData = z.infer<typeof reservationSchema>

export default function ReservationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  
  // English translations
  const notifications = {
    success: {
      title: 'Reservation Successfully Sent!',
      message: 'Your reservation request has been successfully submitted. We have sent you a confirmation email and will get back to you within 24 hours.',
      emailSent: 'Confirmation email sent',
      responseTime: 'Response within 24 hours',
      understood: 'Understood'
    },
    error: {
      title: 'Error Sending Reservation',
      message: 'Sorry, an error occurred while sending your reservation. Please try again or contact us directly.',
      tryAgain: 'Try Again',
      understood: 'Understood'
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema)
  })

  const watchedGuests = watch('guests')

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Verify CAPTCHA if enabled
      if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && turnstileToken) {
        const captchaResponse = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: turnstileToken }),
        })

        if (!captchaResponse.ok) {
          setSubmitStatus('error')
          setIsSubmitting(false)
          return
        }
      }

      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setShowNotification(true)
        reset()
        setTurnstileToken(null)
      } else {
        setSubmitStatus('error')
        setShowNotification(true)
      }
    } catch (error) {
      setSubmitStatus('error')
      setShowNotification(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'business': return 'Business meeting'
      case 'private': return 'Private celebration'
      case 'celebration': return 'Special celebration'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen">
      <StructuredData type="event" />
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero_reservation.jpg"
          alt="Reservation - Efsane Gasthaus Rudolph"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
        <div className="relative z-20 text-center text-white px-4">
          <Link href="/en" className="inline-flex items-center text-amber-300 hover:text-amber-200 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            <span className="text-amber-400">Reservation</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Reserve your table or event space
          </p>
        </div>
      </section>

      {/* Reservation Content */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Reservation Form */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-3xl font-bold text-primary-700 mb-6">
                Reservation request
              </h2>
              


              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-neutral-50 p-6 rounded-xl">
                  <h3 className="font-serif text-xl font-semibold text-primary-700 mb-4">
                    Personal information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="form-label">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...register('name')}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="form-error">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="form-label">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="form-error">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="phone" className="form-label">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        {...register('phone')}
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="06196 23640"
                      />
                      {errors.phone && (
                        <p className="form-error">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="bg-neutral-50 p-6 rounded-xl">
                  <h3 className="font-serif text-xl font-semibold text-primary-700 mb-4">
                    Reservation details
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="date" className="form-label">
                        Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        {...register('date')}
                        className={`form-input ${errors.date ? 'error' : ''}`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.date && (
                        <p className="form-error">{errors.date.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="time" className="form-label">
                        Time *
                      </label>
                      <input
                        type="time"
                        id="time"
                        {...register('time')}
                        className={`form-input ${errors.time ? 'error' : ''}`}
                        step="900"
                        placeholder="13:00"
                      />
                      {errors.time && (
                        <p className="form-error">{errors.time.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="guests" className="form-label">
                        Number of guests *
                      </label>
                      <input
                        type="number"
                        id="guests"
                        {...register('guests')}
                        className={`form-input ${errors.guests ? 'error' : ''}`}
                        min="1"
                        max="300"
                        placeholder="1"
                      />
                      {errors.guests && (
                        <p className="form-error">{errors.guests.message}</p>
                      )}
                      {watchedGuests > 50 && (
                        <p className="text-sm text-blue-600 mt-1">
                          For larger events, please contact us by phone.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="eventType" className="form-label">
                      Type of event *
                    </label>
                    <select
                      id="eventType"
                      {...register('eventType')}
                      className={`form-select ${errors.eventType ? 'error' : ''}`}
                    >
                      <option value="">Please select...</option>
                      <option value="business">Business meeting</option>
                      <option value="private">Private celebration</option>
                      <option value="celebration">Special celebration</option>
                    </select>
                    {errors.eventType && (
                      <p className="form-error">{errors.eventType.message}</p>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label htmlFor="specialRequests" className="form-label">
                    Special requests
                  </label>
                  <textarea
                    id="specialRequests"
                    {...register('specialRequests')}
                    className={`form-textarea ${errors.specialRequests ? 'error' : ''}`}
                    placeholder="Do you have any special requests or requirements? (e.g. decoration, menu preferences, allergies, etc.)"
                    rows={4}
                  />
                  {errors.specialRequests && (
                    <p className="form-error">{errors.specialRequests.message}</p>
                  )}
                </div>

                {/* Turnstile CAPTCHA */}
                {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                  <div className="flex justify-center">
                    <Turnstile
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                      onSuccess={setTurnstileToken}
                      onError={() => setTurnstileToken(null)}
                      onExpire={() => setTurnstileToken(null)}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
                  className="btn-primary w-full flex items-center justify-center text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Request reservation
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Restaurant Information */}
            <div>
              <h2 className="font-serif text-3xl font-bold text-primary-700 mb-6">
                Restaurant info
              </h2>
              
              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg">
                  <Users className="w-6 h-6 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-primary-700">Up to 300 guests</h3>
                    <p className="text-sm text-gray-600">Perfect for large events</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-lg">
                  <Car className="w-6 h-6 text-secondary-600" />
                  <div>
                    <h3 className="font-semibold text-primary-700">70+ parking spaces</h3>
                    <p className="text-sm text-gray-600">Free parking available</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-primary-700">Flexible times</h3>
                    <p className="text-sm text-gray-600">Also outside opening hours</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-neutral-50 p-6 rounded-xl">
                <h3 className="font-serif text-xl font-semibold text-primary-700 mb-4">
                  Direct contact
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium">06196 23640</p>
                      <p className="text-sm text-gray-600">Wed-Sun: 16:00-22:00</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium">info@efsane-events.de</p>
                      <p className="text-sm text-gray-600">We respond within 24h</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium">Alt Niederhofheim 30</p>
                      <p className="text-sm text-gray-600">65835 Liederbach am Taunus</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="mt-6 p-4 bg-primary-800 text-white rounded-xl">
                <h3 className="font-serif text-lg font-semibold mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Opening hours
                </h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Wednesday - Sunday:</span>
                    <span>16:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monday - Tuesday:</span>
                    <span className="text-red-400">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Reservation Notification */}
      <ReservationNotificationEn
        show={showNotification}
        onClose={() => setShowNotification(false)}
        type={submitStatus === 'success' ? 'success' : 'error'}
        title={submitStatus === 'success' ? notifications.success.title : notifications.error.title}
        message={submitStatus === 'success' ? notifications.success.message : notifications.error.message}
        emailSentText={notifications.success.emailSent}
        responseTimeText={notifications.success.responseTime}
        understoodText={notifications.success.understood}
        tryAgainText={notifications.error.tryAgain}
      />
    </div>
  )
}