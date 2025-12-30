'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Turnstile } from '@marsidev/react-turnstile'
import Image from 'next/image'
import Link from 'next/link'
import StructuredData from '@/components/StructuredData'
import FAQSchema from '@/components/FAQSchema'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Betreff muss mindestens 5 Zeichen haben'),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen haben'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function KontaktPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const navigationMessages = {
    home: 'Startseite',
    history: 'Geschichte',
    menu: 'Speisekarte',
    contact: 'Kontakt',
    reservation: 'Reservierung'
  }

  const footerMessages = {
    navigation: 'Navigation',
    contact: 'Kontakt',
    openingHours: 'Öffnungszeiten',
    features: 'Unsere Stärken',
    home: 'Startseite',
    history: 'Geschichte',
    menu: 'Speisekarte',
    contactPage: 'Kontakt',
    reservation: 'Reservierung',
    address: 'Alt Niederhofheim 30, 65835 Liederbach am Taunus',
    phone: '06196 23640',
    email: 'info@efsane-events.de',
    mondayFriday: 'Di-So',
    saturdaSunday: 'Montag',
    upTo300Guests: 'Bis zu 300 Gäste',
    parkingSpaces: 'Parkplätze',
    regionalSpecialties: 'Regionale Spezialitäten',
    businessPrivateEvents: 'Geschäfts- & Privatfeiern',
    copyright: 'Alle Rechte vorbehalten.',
    followUs: 'Folgen Sie uns',
    newsletter: 'Newsletter',
    newsletterText: 'Bleiben Sie über Events und Angebote informiert',
    subscribe: 'Anmelden'
  }

  const onSubmit = async (data: ContactFormData) => {
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

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitStatus('success')
        reset()
        setTurnstileToken(null)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <StructuredData type="contact" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Kontakt', url: '/kontakt' }
        ]} 
      />
      <FAQSchema />
      
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero_contact.jpg"
          alt="Kontakt - Efsane Gasthaus Rudolph"
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
            <span className="text-amber-400">Kontakt</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Wir freuen uns auf Ihre Nachricht
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-slide-left">
              <h2 className="font-serif text-3xl font-bold text-primary-700 mb-6">
                Schreiben Sie uns
              </h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center animate-fade-in">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center animate-fade-in">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Entschuldigung, beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="form-label">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="form-input"
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
                    className="form-input"
                    placeholder="ihre.email@beispiel.de"
                  />
                  {errors.email && (
                    <p className="form-error">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="form-label">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="form-input"
                    placeholder="06196 23640"
                  />
                  {errors.phone && (
                    <p className="form-error">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="form-label">
                    Betreff *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register('subject')}
                    className="form-input"
                    placeholder="Worum geht es in Ihrer Nachricht?"
                  />
                  {errors.subject && (
                    <p className="form-error">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="form-label">
                    Nachricht *
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    className="form-textarea"
                    placeholder="Ihre Nachricht an uns..."
                    rows={6}
                  />
                  {errors.message && (
                    <p className="form-error">{errors.message.message}</p>
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
                  className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover-glow"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Nachricht senden
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="animate-slide-right">
              <h2 className="font-serif text-3xl font-bold text-primary-700 mb-6">
                Kontaktinformationen
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-700 mb-1">Adresse</h3>
                    <p className="text-gray-600">
                      Alt Niederhofheim 30<br />
                      65835 Liederbach am Taunus<br />
                      Deutschland
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-700 mb-1">Telefon</h3>
                    <a href="tel:+4961962364" className="text-gray-600 hover:text-primary-600 transition-colors">
                      06196 23640
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-700 mb-1">E-Mail</h3>
                    <a href="mailto:info@efsane-events.de" className="text-gray-600 hover:text-primary-600 transition-colors">
                      info@efsane-events.de
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-700 mb-1">Öffnungszeiten</h3>
                    <div className="text-gray-600">
                      <p>Mittwoch - Sonntag: 16:00 - 22:00</p>
                      <p className="text-red-600">Montag - Dienstag: Geschlossen</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Restaurant Features */}
              <div className="mt-12 p-6 bg-neutral-50 rounded-xl hover-lift">
                <h3 className="font-serif text-xl font-semibold text-primary-700 mb-4">
                  Warum uns wählen?
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Bis zu 300 Gäste
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    70+ Parkplätze verfügbar
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Traditionelle deutsche Küche
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Perfekt für Geschäfts- und Privatfeiern
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}