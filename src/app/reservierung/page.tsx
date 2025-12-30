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
import ReservationNotification from '@/components/ReservationNotification'
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
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  phone: z.string().min(10, 'Telefonnummer muss mindestens 10 Zeichen haben'),
  date: z.string().refine((date) => {
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selectedDate >= today
  }, 'Datum muss in der Zukunft liegen'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Bitte geben Sie eine gültige Uhrzeit ein'),
  guests: z.coerce.number({
    required_error: 'Anzahl Gäste ist erforderlich',
    invalid_type_error: 'Bitte geben Sie eine gültige Anzahl ein'
  }).min(1, 'Mindestens 1 Gast erforderlich').max(300, 'Maximal 300 Gäste möglich'),
  eventType: z.string()
    .min(1, 'Bitte wählen Sie eine Art der Veranstaltung aus')
    .refine((val) => ['business', 'private', 'celebration'].includes(val), {
      message: 'Bitte wählen Sie eine gültige Veranstaltungsart aus'
    }),
  specialRequests: z.string().max(1000, 'Besondere Wünsche dürfen maximal 1000 Zeichen haben').optional(),
})

type ReservationFormData = z.infer<typeof reservationSchema>

export default function ReservierungPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  
  // German translations
  const notifications = {
    success: {
      title: 'Reservierung erfolgreich gesendet!',
      message: 'Ihre Reservierungsanfrage wurde erfolgreich übermittelt. Wir haben Ihnen eine Bestätigungs-E-Mail gesendet und melden uns innerhalb von 24 Stunden bei Ihnen.'
    },
    error: {
      title: 'Fehler beim Senden',
      message: 'Entschuldigung, beim Senden Ihrer Reservierung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.'
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
      case 'business': return 'Geschäftstermin'
      case 'private': return 'Private Feier'
      case 'celebration': return 'Besondere Feier'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen">
      <StructuredData type="event" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Reservierung', url: '/reservierung' }
        ]} 
      />
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero_reservation.jpg"
          alt="Reservierung - Efsane Gasthaus Rudolph"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
        <div className="relative z-20 text-center text-white px-4">
          <Link href="/" className="inline-flex items-center text-amber-300 hover:text-amber-200 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            <span className="text-amber-400">Reservierung</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Reservieren Sie Ihren Tisch oder Veranstaltungsraum
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
                Reservierungsanfrage
              </h2>
              


              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-neutral-50 p-6 rounded-xl">
                  <h3 className="font-serif text-xl font-semibold text-primary-700 mb-4">
                    Persönliche Angaben
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
                        placeholder="Ihr vollständiger Name"
                      />
                      {errors.name && (
                        <p className="form-error">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="form-label">
                        E-Mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="ihre.email@beispiel.de"
                      />
                      {errors.email && (
                        <p className="form-error">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="phone" className="form-label">
                        Telefon *
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
                    Reservierungsdetails
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="date" className="form-label">
                        Datum *
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
                        Uhrzeit *
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
                        Anzahl Gäste *
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
                          Für größere Veranstaltungen kontaktieren Sie uns bitte telefonisch.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="eventType" className="form-label">
                      Art der Veranstaltung *
                    </label>
                    <select
                      id="eventType"
                      {...register('eventType')}
                      className={`form-select ${errors.eventType ? 'error' : ''}`}
                    >
                      <option value="">Bitte wählen...</option>
                      <option value="business">Geschäftstermin</option>
                      <option value="private">Private Feier</option>
                      <option value="celebration">Besondere Feier</option>
                    </select>
                    {errors.eventType && (
                      <p className="form-error">{errors.eventType.message}</p>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label htmlFor="specialRequests" className="form-label">
                    Besondere Wünsche
                  </label>
                  <textarea
                    id="specialRequests"
                    {...register('specialRequests')}
                    className="form-textarea"
                    placeholder="Haben Sie besondere Wünsche oder Anforderungen? (z.B. Dekoration, Menüwünsche, Allergien, etc.)"
                    rows={4}
                  />
                  {errors.specialRequests && (
                    <p className="form-error">{errors.specialRequests.message}</p>
                  )}
                </div>

                {/* Turnstile CAPTCHA */}
                {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                  <div className="flex justify-left">
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
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Reservierung anfragen
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Restaurant Information */}
            <div>
              <h2 className="font-serif text-3xl font-bold text-primary-700 mb-6">
                Restaurant Info
              </h2>
              
              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg">
                  <Users className="w-6 h-6 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-primary-700">Bis zu 300 Gäste</h3>
                    <p className="text-sm text-gray-600">Perfekt für große Veranstaltungen</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-lg">
                  <Car className="w-6 h-6 text-secondary-600" />
                  <div>
                    <h3 className="font-semibold text-primary-700">70+ Parkplätze</h3>
                    <p className="text-sm text-gray-600">Kostenlose Parkplätze verfügbar</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-primary-700">Flexible Termine</h3>
                    <p className="text-sm text-gray-600">Auch außerhalb der Öffnungszeiten</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-neutral-50 p-6 rounded-xl">
                <h3 className="font-serif text-xl font-semibold text-primary-700 mb-4">
                  Direkter Kontakt
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium">06196 23640</p>
                      <p className="text-sm text-gray-600">Mi-So: 16:00-22:00, Mo-Di: Geschlossen</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium">info@efsane-events.de</p>
                      <p className="text-sm text-gray-600">Wir antworten innerhalb von 24h</p>
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
                  Öffnungszeiten
                </h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Mittwoch - Sonntag:</span>
                    <span>16:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Montag - Dienstag:</span>
                    <span className="text-red-400">Geschlossen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Reservation Notification */}
      <ReservationNotification
        show={showNotification}
        onClose={() => setShowNotification(false)}
        type={submitStatus === 'success' ? 'success' : 'error'}
        title={submitStatus === 'success' ? notifications.success.title : notifications.error.title}
        message={submitStatus === 'success' ? notifications.success.message : notifications.error.message}
      />
    </div>
  )
}