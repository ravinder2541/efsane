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
  Clock,
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

      {/* Reservation Content */}
      <section className="relative overflow-hidden bg-[#f6eedf] text-[#3b2416] font-garamond [font-variant-numeric:lining-nums]">
        <Image src="/contactbg-light.png" alt="" fill priority sizes="100vw" className="object-cover object-bottom" />

        <div className="relative z-10 w-full px-5 sm:px-8 lg:px-[6.5vw] pt-28 lg:pt-32 pb-28 lg:pb-36">
          {/* Header */}
          <div className="relative text-center">
            <Link
              href="/"
              className="lg:absolute lg:left-0 lg:top-2 inline-flex items-center gap-3 mb-6 lg:mb-0 px-6 py-2 rounded-full border border-[#b08a45] bg-[#fffaf1]/70 text-[#7b1a1f] text-lg hover:bg-[#f3e6cf] transition-colors no-underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zur Startseite
            </Link>
            <h1 className="font-serif font-bold text-5xl md:text-7xl bg-gradient-to-b from-[#8e1f25] to-[#5a1014] bg-clip-text text-transparent leading-tight">
              Reservierung
            </h1>
            <svg viewBox="0 0 320 14" className="mx-auto mt-2 w-72 md:w-80 h-auto text-[#b08a45]" aria-hidden="true">
              <line x1="0" y1="7" x2="130" y2="7" stroke="currentColor" strokeWidth="1" />
              <line x1="190" y1="7" x2="320" y2="7" stroke="currentColor" strokeWidth="1" />
              <path d="M160 2 L165 7 L160 12 L155 7 Z" fill="currentColor" />
              <path d="M130 7 C136 1, 146 1, 150 6 C152 9, 148 11, 145 9 M190 7 C184 1, 174 1, 170 6 C168 9, 172 11, 175 9" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <p className="mt-3 mx-auto max-w-3xl text-xl md:text-[1.7rem] leading-snug text-[#3b2416]">
              An den Aktionstagen ist es vorteilhaft,  wenn Sie rechtzeitig reservieren.
            </p>
          </div>

          <div className="mt-10 lg:mt-12 grid gap-8 lg:grid-cols-3 lg:gap-7 items-start">
            {/* Reservation Form */}
            <div className="lg:col-span-2 rounded-xl border border-[#c9a25e]/60 bg-[#fffaf1]/85 backdrop-blur-sm shadow-[0_18px_40px_rgba(120,80,30,0.18)] p-6 md:p-8">
              <div className="flex items-center gap-5">
                <span className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-b from-[#8e1f25] to-[#6c1519] text-[#fbe9c4] flex items-center justify-center shadow-[0_3px_8px_rgba(80,20,20,0.3)]">
                  <Calendar className="w-6 h-6" strokeWidth={1.8} />
                </span>
                <h2 className="font-serif text-3xl md:text-[2.1rem] font-bold text-[#2b1a10]">Reservierungsanfrage</h2>
              </div>
              


              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                {/* Personal Information */}
                <div className="rounded-xl border border-[#c9a25e]/40 bg-white/50 p-5 md:p-6">
                  <h3 className="font-serif text-2xl font-semibold text-[#7b1a1f] mb-4 pb-2 border-b border-[#c9a25e]/40">
                    Persönliche Angaben
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block mb-1.5 text-xl font-bold text-[#2b1a10]">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...register('name')}
                        className={`w-full rounded-lg border bg-white/90 px-4 py-3 text-[#2b1a10] placeholder:text-[#9a8a78] font-garamond text-lg focus:outline-none focus:ring-2 focus:ring-[#c9a25e]/30 transition-colors ${errors.name ? 'border-[#b3261e]' : 'border-[#d6c098] focus:border-[#b08a45]'}`}
                        placeholder="Ihr vollständiger Name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-[#b3261e] text-base">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block mb-1.5 text-xl font-bold text-[#2b1a10]">
                        E-Mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className={`w-full rounded-lg border bg-white/90 px-4 py-3 text-[#2b1a10] placeholder:text-[#9a8a78] font-garamond text-lg focus:outline-none focus:ring-2 focus:ring-[#c9a25e]/30 transition-colors ${errors.email ? 'border-[#b3261e]' : 'border-[#d6c098] focus:border-[#b08a45]'}`}
                        placeholder="ihre.email@beispiel.de"
                      />
                      {errors.email && (
                        <p className="mt-1 text-[#b3261e] text-base">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="phone" className="block mb-1.5 text-xl font-bold text-[#2b1a10]">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        {...register('phone')}
                        className={`w-full rounded-lg border bg-white/90 px-4 py-3 text-[#2b1a10] placeholder:text-[#9a8a78] font-garamond text-lg focus:outline-none focus:ring-2 focus:ring-[#c9a25e]/30 transition-colors ${errors.phone ? 'border-[#b3261e]' : 'border-[#d6c098] focus:border-[#b08a45]'}`}
                        placeholder="06196 23640"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-[#b3261e] text-base">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="rounded-xl border border-[#c9a25e]/40 bg-white/50 p-5 md:p-6">
                  <h3 className="font-serif text-2xl font-semibold text-[#7b1a1f] mb-4 pb-2 border-b border-[#c9a25e]/40">
                    Reservierungsdetails
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="date" className="block mb-1.5 text-xl font-bold text-[#2b1a10]">
                        Datum *
                      </label>
                      <input
                        type="date"
                        id="date"
                        {...register('date')}
                        className={`w-full rounded-lg border bg-white/90 px-4 py-3 text-[#2b1a10] placeholder:text-[#9a8a78] font-garamond text-lg focus:outline-none focus:ring-2 focus:ring-[#c9a25e]/30 transition-colors ${errors.date ? 'border-[#b3261e]' : 'border-[#d6c098] focus:border-[#b08a45]'}`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.date && (
                        <p className="mt-1 text-[#b3261e] text-base">{errors.date.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="time" className="block mb-1.5 text-xl font-bold text-[#2b1a10]">
                        Uhrzeit *
                      </label>
                      <input
                        type="time"
                        id="time"
                        {...register('time')}
                        className={`w-full rounded-lg border bg-white/90 px-4 py-3 text-[#2b1a10] placeholder:text-[#9a8a78] font-garamond text-lg focus:outline-none focus:ring-2 focus:ring-[#c9a25e]/30 transition-colors ${errors.time ? 'border-[#b3261e]' : 'border-[#d6c098] focus:border-[#b08a45]'}`}
                        step="900"
                        placeholder="13:00"
                      />
                      {errors.time && (
                        <p className="mt-1 text-[#b3261e] text-base">{errors.time.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="guests" className="block mb-1.5 text-xl font-bold text-[#2b1a10]">
                        Anzahl Gäste *
                      </label>
                      <input
                        type="number"
                        id="guests"
                        {...register('guests')}
                        className={`w-full rounded-lg border bg-white/90 px-4 py-3 text-[#2b1a10] placeholder:text-[#9a8a78] font-garamond text-lg focus:outline-none focus:ring-2 focus:ring-[#c9a25e]/30 transition-colors ${errors.guests ? 'border-[#b3261e]' : 'border-[#d6c098] focus:border-[#b08a45]'}`}
                        min="1"
                        max="300"
                        placeholder="1"
                      />
                      {errors.guests && (
                        <p className="mt-1 text-[#b3261e] text-base">{errors.guests.message}</p>
                      )}
                      {watchedGuests > 50 && (
                        <p className="mt-1 text-base text-[#7b1a1f]">
                          Für größere Veranstaltungen kontaktieren Sie uns bitte telefonisch.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="eventType" className="block mb-1.5 text-xl font-bold text-[#2b1a10]">
                      Art der Veranstaltung *
                    </label>
                    <select
                      id="eventType"
                      {...register('eventType')}
                      className={`w-full rounded-lg border bg-white/90 px-4 py-3 text-[#2b1a10] placeholder:text-[#9a8a78] font-garamond text-lg focus:outline-none focus:ring-2 focus:ring-[#c9a25e]/30 transition-colors appearance-none pr-10 ${errors.eventType ? 'border-[#b3261e]' : 'border-[#d6c098] focus:border-[#b08a45]'}`}
                    >
                      <option value="">Bitte wählen...</option>
                      <option value="business">Geschäftstermin</option>
                      <option value="private">Private Feier</option>
                      <option value="celebration">Besondere Feier</option>
                    </select>
                    {errors.eventType && (
                      <p className="mt-1 text-[#b3261e] text-base">{errors.eventType.message}</p>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label htmlFor="specialRequests" className="block mb-1.5 text-xl font-bold text-[#2b1a10]">
                    Besondere Wünsche
                  </label>
                  <textarea
                    id="specialRequests"
                    {...register('specialRequests')}
                    className="w-full rounded-lg border bg-white/90 px-4 py-3 text-[#2b1a10] placeholder:text-[#9a8a78] font-garamond text-lg focus:outline-none focus:ring-2 focus:ring-[#c9a25e]/30 transition-colors border-[#d6c098] focus:border-[#b08a45] resize-y"
                    placeholder="Haben Sie besondere Wünsche oder Anforderungen? (z.B. Dekoration, Menüwünsche, Allergien, etc.)"
                    rows={4}
                  />
                  {errors.specialRequests && (
                    <p className="mt-1 text-[#b3261e] text-base">{errors.specialRequests.message}</p>
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
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-b from-[#8e1f25] to-[#6c1519] text-[#fbf3e4] text-2xl font-bold shadow-[0_8px_20px_rgba(80,20,20,0.3)] hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#fbf3e4] border-t-transparent"></div>
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" fill="currentColor" />
                      Reservierung anfragen
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Restaurant Information */}
            <div className="space-y-7">
              <div className="rounded-xl border border-[#c9a25e]/60 bg-[#fffaf1]/85 backdrop-blur-sm shadow-[0_18px_40px_rgba(120,80,30,0.18)] p-6">
              <div className="flex items-center gap-4 mb-3">
                <span className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-b from-[#8e1f25] to-[#6c1519] text-[#fbe9c4] flex items-center justify-center shadow-[0_3px_8px_rgba(80,20,20,0.3)]">
                  <Users className="w-6 h-6" strokeWidth={1.8} />
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#2b1a10]">Restaurant Info</h2>
              </div>
              
              {/* Features */}
              <div className="divide-y divide-[#c9a25e]/40">
                <div className="flex items-center gap-4 py-3.5">
                  <span className="shrink-0 w-11 h-11 rounded-full border border-[#c9a25e] bg-[#fbf3e3] text-[#7b1a1f] flex items-center justify-center"><Users className="w-5 h-5" strokeWidth={1.8} /></span>
                  <div>
                    <h3 className="text-xl font-bold text-[#2b1a10] leading-tight">Bis zu 300 Gäste</h3>
                    <p className="text-base text-[#5a4636]">Perfekt für große Veranstaltungen</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-3.5">
                  <span className="shrink-0 w-11 h-11 rounded-full border border-[#c9a25e] bg-[#fbf3e3] text-[#7b1a1f] flex items-center justify-center"><Car className="w-5 h-5" strokeWidth={1.8} /></span>
                  <div>
                    <h3 className="text-xl font-bold text-[#2b1a10] leading-tight">70+ Parkplätze</h3>
                    <p className="text-base text-[#5a4636]">Kostenlose Parkplätze verfügbar</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-3.5">
                  <span className="shrink-0 w-11 h-11 rounded-full border border-[#c9a25e] bg-[#fbf3e3] text-[#7b1a1f] flex items-center justify-center"><Calendar className="w-5 h-5" strokeWidth={1.8} /></span>
                  <div>
                    <h3 className="text-xl font-bold text-[#2b1a10] leading-tight">Flexible Termine</h3>
                    <p className="text-base text-[#5a4636]">Auch außerhalb der Öffnungszeiten</p>
                  </div>
                </div>
              </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-xl border border-[#c9a25e]/60 bg-[#fffaf1]/85 backdrop-blur-sm shadow-[0_18px_40px_rgba(120,80,30,0.18)] p-6">
                <h3 className="font-serif text-2xl font-bold text-[#2b1a10] mb-4 pb-2 border-b border-[#c9a25e]/40">
                  Direkter Kontakt
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="shrink-0 w-11 h-11 rounded-full border border-[#c9a25e] bg-[#fbf3e3] text-[#7b1a1f] flex items-center justify-center"><Phone className="w-5 h-5" strokeWidth={1.8} /></span>
                    <div>
                      <p className="text-xl font-semibold text-[#2b1a10] leading-tight">06196 23640</p>
                      <p className="text-base text-[#5a4636]">Mi-So: 16:00-22:00, Mo-Di: Geschlossen</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="shrink-0 w-11 h-11 rounded-full border border-[#c9a25e] bg-[#fbf3e3] text-[#7b1a1f] flex items-center justify-center"><Mail className="w-5 h-5" strokeWidth={1.8} /></span>
                    <div>
                      <p className="text-xl font-semibold text-[#2b1a10] leading-tight">info@efsane-events.de</p>
                      <p className="text-base text-[#5a4636]">Wir antworten innerhalb von 24h</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="shrink-0 w-11 h-11 rounded-full border border-[#c9a25e] bg-[#fbf3e3] text-[#7b1a1f] flex items-center justify-center"><MapPin className="w-5 h-5" strokeWidth={1.8} /></span>
                    <div>
                      <p className="text-xl font-semibold text-[#2b1a10] leading-tight">Alt Niederhofheim 30</p>
                      <p className="text-base text-[#5a4636]">65835 Liederbach am Taunus</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
             <div className="p-6 rounded-xl bg-gradient-to-b from-[#7b1a1f] to-[#5a1014] text-[#fbf3e4] border border-[#c9a25e]/60 shadow-[0_18px_40px_rgba(80,20,20,0.25)]">
  <h3 className="font-serif text-2xl font-bold mb-3 pb-2 flex items-center gap-3 border-b border-[#e6c27a]/40 text-[#f6dca0]">
    <Clock className="w-6 h-6" />
    Öffnungszeiten
  </h3>

  <div className="text-lg space-y-2">
    <div className="flex justify-between">
      <span>Dienstag - Samstag:</span>
      <span>16:00 - 22:00</span>
    </div>

    <div className="flex justify-between">
      <span>Sonntag (Mai - Okt):</span>
      <span>12:00 - 22:00</span>
    </div>

    <div className="flex justify-between">
      <span>Sonntag (Nov - Apr):</span>
      <span>11:00 - 16:00</span>
    </div>

    <div className="flex justify-between">
      <span>Montag:</span>
      <span className="text-[#f6dca0] font-semibold">
        Geschlossen
      </span>
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