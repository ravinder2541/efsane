'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Car,
  Calendar,
  ChefHat
} from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' : 'de'
  
  const messages = {
    de: {
      navigation: 'Navigation',
      contact: 'Kontakt',
      openingHours: 'Öffnungszeiten',
      home: 'Startseite',
      history: 'Geschichte',
      menu: 'Speisekarte',
      contactPage: 'Kontakt',
      reservation: 'Reservierung',
      upTo300Guests: 'Bis zu 300 Gäste',
      parkingSpaces: 'Parkplätze',
      regionalSpecialties: 'Regionale Spezialitäten',
      businessPrivateEvents: 'Geschäfts- & Privatfeiern',
      copyright: 'Alle Rechte vorbehalten.',
      newsletter: 'Newsletter',
      newsletterText: 'Bleiben Sie über Events und Angebote informiert',
      subscribe: 'Anmelden',
      since: 'Seit 1620',
      description: 'Traditionelle deutsche Küche seit 1620. Perfekt für Geschäftstermine und private Feiern mit bis zu 300 Gästen.'
    },
    en: {
      navigation: 'Navigation',
      contact: 'Contact',
      openingHours: 'Opening Hours',
      home: 'Home',
      history: 'History',
      menu: 'Menu',
      contactPage: 'Contact',
      reservation: 'Reservation',
      upTo300Guests: 'Up to 300 guests',
      parkingSpaces: 'parking spaces',
      regionalSpecialties: 'Regional specialties',
      businessPrivateEvents: 'Business & private events',
      copyright: 'All rights reserved.',
      newsletter: 'Newsletter',
      newsletterText: 'Stay informed about events and offers',
      subscribe: 'Subscribe',
      since: 'Since 1620',
      description: 'Traditional German cuisine since 1620. Perfect for business meetings and private celebrations with up to 300 guests.'
    }
  }
  
  const currentMessages = messages[locale as keyof typeof messages]
  const navigationLinks = [
    { href: locale === 'en' ? '/en' : '/', label: currentMessages.home },
    { href: locale === 'en' ? '/history' : '/geschichte', label: currentMessages.history },
    { href: locale === 'en' ? '/menu' : '/speisekarte', label: currentMessages.menu },
    { href: locale === 'en' ? '/contact' : '/kontakt', label: currentMessages.contactPage },
    { href: locale === 'en' ? '/reservation' : '/reservierung', label: currentMessages.reservation },
  ]

  return (
    <footer className="bg-primary-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 german-pattern opacity-5"></div>

      <div className="container-max section-padding relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-6 animate-fade-in">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <Image
                  src="/images/logo.svg"
                  alt="Efsane Gasthaus Rudolph"
                  width={180}
                  height={180}
                  className="h-52 w-auto"
                />
              </div>
            </div>
            <p className="text-sm opacity-80 mb-6 leading-relaxed animate-fade-in">
              {locale === "en"
                ? "Traditional German cuisine since 1620. Perfect for business meetings and private celebrations with up to 300 guests."
                : "Traditionelle deutsche Küche seit 1620. Perfekt für Geschäftstermine und private Feiern mit bis zu 300 Gästen."}
            </p>
          </div>

          {/* Navigation */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h4 className="font-semibold mb-4 text-secondary-400">
              {currentMessages.navigation}
            </h4>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-secondary-400 transition-all duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-secondary-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h4 className="font-semibold mb-4 text-secondary-400">
              {currentMessages.contact}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 mt-0.5 text-secondary-400 group-hover:scale-110 transition-transform" />
                <div className="text-sm">
                  <p className="opacity-90 font-medium">
                    Efsane Gasthaus Rudolph
                  </p>
                  <p className="opacity-80">Alt Niederhofheim 30</p>
                  <p className="opacity-80">65835 Liederbach am Taunus</p>
                  <p className="opacity-80">Deutschland</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-secondary-400 group-hover:scale-110 transition-transform" />
                <a
                  href="tel:+4961962364"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-secondary-400 transition-colors"
                >
                  06196 23640
                </a>
              </div>

              <div className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-secondary-400 group-hover:scale-110 transition-transform" />
                <a
                  href="mailto:info@efsane-events.de"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-secondary-400 transition-colors"
                >
                  info@efsane-events.de
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours & Features */}
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h4 className="font-semibold mb-4 text-secondary-400">
              {currentMessages.openingHours}
            </h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-secondary-400" />
                <div className="text-sm opacity-80">
                  <p className="font-medium">Di-So</p>
                  <p>16:00 - 22:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-secondary-400" />
                <div className="text-sm opacity-80">
                  <p className="font-medium">Mo</p>
                  <p className="text-red-400">Geschlossen</p>
                </div>
              </div>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-xs opacity-80">
                <Users className="w-4 h-4 text-secondary-400" />
                <span>{currentMessages.upTo300Guests}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs opacity-80">
                <Car className="w-4 h-4 text-secondary-400" />
                <span>70+ {currentMessages.parkingSpaces}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs opacity-80">
                <ChefHat className="w-4 h-4 text-secondary-400" />
                <span>{currentMessages.regionalSpecialties}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs opacity-80">
                <Calendar className="w-4 h-4 text-secondary-400" />
                <span>{currentMessages.businessPrivateEvents}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
            <p className="text-sm opacity-80 animate-fade-in">
              © {new Date().getFullYear()} Efsane Gasthaus Rudolph.{" "}
              {currentMessages.copyright}
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 animate-fade-in">
              <div className="flex items-center space-x-4 text-center">
                <Link
                  href={locale === "en" ? "/privacy" : "/datenschutz"}
                  className="text-sm opacity-80 hover:opacity-100 hover:text-secondary-400 transition-colors"
                >
                  {locale === "en" ? "Privacy Policy" : "Datenschutz"}
                </Link>
                <Link
                  href={locale === "en" ? "/legal" : "/impressum"}
                  className="text-sm opacity-80 hover:opacity-100 hover:text-secondary-400 transition-colors"
                >
                  {locale === "en" ? "Legal Notice" : "Impressum"}
                </Link>
              </div>
              {/* <div className="flex items-center justify-center space-x-1 whitespace-nowrap">
                <span className="text-xs opacity-60">Made with</span>
                <span className="text-red-400 animate-pulse">♥</span>
                <span className="text-xs opacity-60">
                  <a
                    href="https://uensolutions.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs opacity-60 hover:opacity-80 transition-opacity"
                  >
                    Uen Solutions
                  </a>
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}