'use client'

import { usePathname } from 'next/navigation'

interface StructuredDataProps {
  type?: 'restaurant' | 'event' | 'menu' | 'contact' | 'breadcrumb'
  breadcrumbs?: Array<{ name: string; url: string }>
}

export default function StructuredData({ type = 'restaurant', breadcrumbs }: StructuredDataProps) {
  const pathname = usePathname()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://efsane-events.de'
  const isEnglish = pathname.startsWith('/en') || pathname === '/contact' || pathname === '/reservation' || pathname === '/menu' || pathname === '/history'

  // Enhanced Restaurant Schema with more comprehensive data
  const restaurantData = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "FoodEstablishment", "LocalBusiness", "TouristAttraction"],
    "name": "Efsane Gasthaus Rudolph",
    "alternateName": ["Gasthaus Rudolph", "Efsane Events", "Restaurant Efsane"],
    "description": isEnglish
      ? "Historic German restaurant and premium event venue since 1620 in Liederbach am Taunus, Frankfurt Rhine-Main area. Traditional German cuisine, authentic atmosphere, and professional event hosting for up to 300 guests. Specializing in weddings, corporate events, birthday parties, and private celebrations with 70+ free parking spaces."
      : "Historisches deutsches Restaurant und Premium-Eventlocation seit 1620 in Liederbach am Taunus, Rhein-Main-Gebiet. Traditionelle deutsche Küche, authentisches Ambiente und professionelle Eventbetreuung für bis zu 300 Gäste. Spezialisiert auf Hochzeiten, Firmenfeiern, Geburtstagsfeiern und private Feiern mit 70+ kostenlosen Parkplätzen.",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/images/logo.svg`,
      "width": "300",
      "height": "200"
    },
    "image": [
      {
        "@type": "ImageObject",
        "url": `${baseUrl}/menu.jpg`,
        "caption": "Traditional German restaurant interior"
      },
      {
        "@type": "ImageObject", 
        "url": `${baseUrl}/menu2.jpg`,
        "caption": "Elegant dining room"
      },
      {
        "@type": "ImageObject",
        "url": `${baseUrl}/menu3.jpg`, 
        "caption": "Event space setup"
      }
    ],
    "telephone": "+49 (0) 123 456789",
    "email": "info@efsane-events.de",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Musterstraße 123",
      "addressLocality": "Liederbach am Taunus",
      "addressRegion": "Hessen",
      "postalCode": "65835",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "50.1659",
      "longitude": "8.5417"
    },
    "openingHours": [
      "Mo-Fr 11:00-22:00",
      "Sa-Su 12:00-23:00"
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "11:00",
        "closes": "22:00"
      },
      {
        "@type": "OpeningHoursSpecification", 
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "12:00",
        "closes": "23:00"
      }
    ],
    "priceRange": "€€€",
    "servesCuisine": ["German", "European", "Traditional", "Regional"],
    "acceptsReservations": true,
    "hasMenu": `${baseUrl}${isEnglish ? '/menu' : '/speisekarte'}`,
    "foundingDate": "1620",
    "slogan": isEnglish ? "Traditional German Hospitality Since 1620" : "Deutsche Gastlichkeit seit 1620",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Schmidt Familie"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": isEnglish 
          ? "Excellent traditional German restaurant with authentic atmosphere. Perfect for special occasions."
          : "Ausgezeichnetes traditionelles deutsches Restaurant mit authentischem Ambiente. Perfekt für besondere Anlässe."
      }
    ],
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Parking",
        "value": "70+ free parking spaces"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Event Space",
        "value": "Up to 300 guests"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Wheelchair Accessible",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Wi-Fi",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Private Dining",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Outdoor Seating",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Air Conditioning",
        "value": true
      }
    ],
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Bank Transfer"],
    "currenciesAccepted": "EUR",
    "smokingAllowed": false,
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Event Packages",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": isEnglish ? "Wedding Package" : "Hochzeitspaket",
          "category": "Wedding",
          "priceRange": "€€€",
          "availability": "InStock",
          "itemOffered": {
            "@type": "Service",
            "name": isEnglish ? "Wedding Events" : "Hochzeitsfeiern",
            "description": isEnglish ? "Complete wedding event packages for up to 300 guests with traditional German cuisine" : "Komplette Hochzeitsfeier-Pakete für bis zu 300 Gäste mit traditioneller deutscher Küche"
          }
        },
        {
          "@type": "Offer",
          "name": isEnglish ? "Corporate Event Package" : "Firmenfeier-Paket",
          "category": "Corporate",
          "priceRange": "€€€",
          "availability": "InStock",
          "itemOffered": {
            "@type": "Service",
            "name": isEnglish ? "Corporate Events" : "Firmenfeiern",
            "description": isEnglish ? "Professional corporate event hosting with catering and AV equipment" : "Professionelle Firmenveranstaltungen mit Catering und AV-Technik"
          }
        }
      ]
    },
    "areaServed": [
      {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "50.1659",
          "longitude": "8.5417"
        },
        "geoRadius": "50000"
      }
    ],
    "knowsAbout": ["German Cuisine", "Event Planning", "Traditional Cooking", "Wedding Catering", "Corporate Events"],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "MenuItem",
          "name": isEnglish ? "Traditional German Menu" : "Traditionelle deutsche Speisekarte"
        }
      }
    ]
  }

  // Enhanced Event Venue Schema
  const eventVenueData = {
    "@context": "https://schema.org",
    "@type": ["EventVenue", "Place", "LocalBusiness"],
    "name": "Efsane Gasthaus Rudolph - Event Location",
    "description": isEnglish
      ? "Historic premium event venue in Liederbach am Taunus, Frankfurt Rhine-Main area. Traditional German restaurant setting since 1620. Perfect for weddings, corporate events, birthday parties, and private celebrations. Professional event planning with capacity up to 300 guests and 70+ free parking spaces."
      : "Historische Premium Eventlocation in Liederbach am Taunus, Rhein-Main-Gebiet. Traditionelles deutsches Restaurant-Ambiente seit 1620. Perfekt für Hochzeiten, Firmenfeiern, Geburtstagsfeiern und private Feiern. Professionelle Eventplanung mit Kapazität bis zu 300 Gäste und 70+ kostenlosen Parkplätzen.",
    "url": `${baseUrl}${isEnglish ? '/reservation' : '/reservierung'}`,
    "image": [
      {
        "@type": "ImageObject",
        "url": `${baseUrl}/menu.jpg`,
        "caption": "Event space interior"
      }
    ],
    "telephone": "+49 (0) 123 456789",
    "email": "events@efsane-events.de",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Musterstraße 123",
      "addressLocality": "Liederbach am Taunus",
      "addressRegion": "Hessen", 
      "postalCode": "65835",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "50.1659",
      "longitude": "8.5417"
    },
    "maximumAttendeeCapacity": 300,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": "500",
      "unitCode": "MTK"
    },
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free Parking",
        "value": "70+ spaces"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Professional Catering",
        "value": "Traditional German cuisine"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Audio/Visual Equipment",
        "value": "Professional AV setup available"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Event Planning Services",
        "value": "Full service event coordination"
      }
    ],
    "containedInPlace": {
      "@type": "Restaurant",
      "name": "Efsane Gasthaus Rudolph"
    },
    "eventType": ["Wedding", "Corporate Event", "Birthday Party", "Anniversary", "Private Celebration"],
    "isAccessibleForFree": false,
    "publicAccess": false
  }

  // Enhanced Menu Schema with Food Establishment details
  const menuData = {
    "@context": "https://schema.org",
    "@type": ["Menu", "CreativeWork"],
    "name": isEnglish ? "Traditional German Restaurant Menu" : "Traditionelle Deutsche Speisekarte",
    "description": isEnglish 
      ? "Authentic German cuisine menu featuring traditional dishes, regional specialties, and seasonal offerings from our historic restaurant since 1620"
      : "Authentische deutsche Küche mit traditionellen Gerichten, regionalen Spezialitäten und saisonalen Angeboten aus unserem historischen Restaurant seit 1620",
    "inLanguage": isEnglish ? "en" : "de",
    "url": `${baseUrl}${pathname}`,
    "dateModified": new Date().toISOString().split('T')[0],
    "provider": {
      "@type": "Restaurant",
      "name": "Efsane Gasthaus Rudolph",
      "url": baseUrl
    },
    "hasPart": [
      {
        "@type": "MenuSection",
        "name": isEnglish ? "Appetizers" : "Vorspeisen",
        "description": isEnglish ? "Traditional German starters" : "Traditionelle deutsche Vorspeisen"
      },
      {
        "@type": "MenuSection", 
        "name": isEnglish ? "Main Courses" : "Hauptgerichte",
        "description": isEnglish ? "Hearty German main dishes" : "Herzhafte deutsche Hauptgerichte"
      },
      {
        "@type": "MenuSection",
        "name": isEnglish ? "Desserts" : "Nachspeisen", 
        "description": isEnglish ? "Traditional German desserts" : "Traditionelle deutsche Nachspeisen"
      }
    ],
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "availability": "InStock",
      "validFrom": new Date().toISOString().split('T')[0]
    }
  }

  // Enhanced Organization Schema
  const organizationData = {
    "@context": "https://schema.org",
    "@type": ["Organization", "Restaurant", "LocalBusiness"],
    "name": "Efsane Gasthaus Rudolph",
    "legalName": "Efsane Gasthaus Rudolph GmbH",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/images/logo.svg`,
      "width": "300",
      "height": "200"
    },
    "description": isEnglish
      ? "Historic German restaurant and event venue established in 1620, specializing in traditional German cuisine and professional event hosting"
      : "Historisches deutsches Restaurant und Eventlocation seit 1620, spezialisiert auf traditionelle deutsche Küche und professionelle Eventbetreuung",
    "foundingDate": "1620",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+49 (0) 123 456789",
        "contactType": "customer service",
        "email": "info@efsane-events.de",
        "availableLanguage": ["German", "English"],
        "areaServed": "DE"
      },
      {
        "@type": "ContactPoint",
        "telephone": "+49 (0) 123 456789",
        "contactType": "reservations",
        "email": "reservations@efsane-events.de",
        "availableLanguage": ["German", "English"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Musterstraße 123",
      "addressLocality": "Liederbach am Taunus",
      "addressRegion": "Hessen",
      "postalCode": "65835", 
      "addressCountry": "DE"
    },
    "sameAs": [
      "https://www.facebook.com/efsane-gasthaus",
      "https://www.instagram.com/efsane_gasthaus",
      "https://www.tripadvisor.com/restaurant/efsane-gasthaus"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Restaurant and Event Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isEnglish ? "Restaurant Service" : "Restaurant Service",
            "serviceType": "Restaurant"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": isEnglish ? "Event Hosting" : "Event Betreuung",
            "serviceType": "Event Planning"
          }
        }
      ]
    },
    "knowsAbout": ["German Cuisine", "Event Planning", "Traditional Hospitality", "Wedding Services", "Corporate Events"]
  }

  // Breadcrumb Schema
  const breadcrumbData = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${baseUrl}${crumb.url}`
    }))
  } : null

  let structuredData: any = restaurantData

  if (type === 'event') {
    structuredData = eventVenueData
  } else if (type === 'menu') {
    structuredData = menuData
  } else if (type === 'contact') {
    structuredData = organizationData
  } else if (type === 'breadcrumb' && breadcrumbData) {
    structuredData = breadcrumbData
  }

  // Always include WebSite schema for better SEO
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Efsane Gasthaus Rudolph",
    "alternateName": "Efsane Events",
    "url": baseUrl,
    "description": isEnglish
      ? "Historic German restaurant and premium event venue since 1620"
      : "Historisches deutsches Restaurant und Premium Eventlocation seit 1620",
    "inLanguage": isEnglish ? "en" : "de",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Efsane Gasthaus Rudolph",
      "url": baseUrl
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData, null, 2)
        }}
      />
      {breadcrumbData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData, null, 2)
          }}
        />
      )}
    </>
  )
}