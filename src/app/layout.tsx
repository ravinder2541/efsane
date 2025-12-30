import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
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
    <html lang="de" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#D97706" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
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