import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cinzel, Cormorant_Garamond, Great_Vibes, UnifrakturMaguntia } from 'next/font/google'
import './globals.css'
import ConsentWrapper from '@/components/ConsentWrapper'
import AnalyticsProvider from '@/components/AnalyticsProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes',
  display: 'swap',
})

const fraktur = UnifrakturMaguntia({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-fraktur',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://efsane-events.de'),
  title: {
    default: 'Efsane Gasthaus Rudolph - Eventlocation für 300 Gäste | Seit 1620',
    template: '%s | Efsane Gasthaus Rudolph'
  },
  description: 'Premium Eventlocation und deutsches Restaurant seit 1620. Bis zu 300 Gäste, 70+ kostenlose Parkplätze. Perfekt für Geschäftsevents, Hochzeiten und private Feiern in traditionellem Ambiente.',
  keywords: [
    'Eventlocation', 'Restaurant 300 Gäste', 'Hochzeitslocation', 'Geschäftsevents',
    'deutsche Küche', 'Parkplätze Restaurant', 'Veranstaltungsraum', 'Firmenfeier',
    'private Feiern', 'traditionelles Restaurant', 'Gasthaus seit 1620', 'Eventcatering'
  ],
  authors: [{ name: 'Efsane Gasthaus Rudolph' }],
  creator: 'Efsane Gasthaus Rudolph',
  publisher: 'Efsane Gasthaus Rudolph',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    url: 'https://efsane-events.de',
    siteName: 'Efsane Gasthaus Rudolph',
    title: 'Premium Eventlocation für 300 Gäste | Efsane Gasthaus Rudolph',
    description: 'Exklusive Eventlocation seit 1620: Bis zu 300 Gäste, 70+ kostenlose Parkplätze, traditionelle deutsche Küche. Ideal für Hochzeiten, Geschäftsevents und Feiern.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Efsane Gasthaus Rudolph - Premium Eventlocation für 300 Gäste',
        type: 'image/jpeg',
      },
      {
        url: '/images/restaurant-interior.jpg',
        width: 1200,
        height: 630,
        alt: 'Traditionelles deutsches Restaurant - Innenansicht',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@efsane_events',
    creator: '@efsane_events',
    title: 'Premium Eventlocation für 300 Gäste | Efsane Gasthaus Rudolph',
    description: 'Exklusive Eventlocation seit 1620: 300 Gäste, 70+ Parkplätze, deutsche Küche. Perfekt für Events & Feiern.',
    images: {
      url: '/images/twitter-image.jpg',
      alt: 'Efsane Gasthaus Rudolph - Premium Event Venue',
      width: 1200,
      height: 630,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://efsane-events.de',
    languages: {
      'de': 'https://efsane-events.de',
      'en': 'https://efsane-events.de/en',
    },
  },
  category: 'restaurant',
  classification: 'Event Venue, Restaurant, Catering',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${inter.variable} ${playfair.variable} ${cinzel.variable} ${cormorant.variable} ${greatVibes.variable} ${fraktur.variable}`}>
      <head>
        {/* All icons are generated from public/favicon.png; bump ?v= after replacing it */}
        <link rel="icon" href="/favicon.ico?v=2" sizes="32x32" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <link rel="manifest" href="/site.webmanifest?v=2" />
        <meta name="theme-color" content="#D97706" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla) add attributes to <body> */}
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {/* ConsentWrapper with integrated Analytics */}
        <ConsentWrapper>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </ConsentWrapper>
      </body>
    </html>
  )
}