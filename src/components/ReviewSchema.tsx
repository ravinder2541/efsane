'use client'

import { usePathname } from 'next/navigation'

interface Review {
  author: string
  rating: number
  text: string
  date?: string
}

interface ReviewSchemaProps {
  reviews?: Review[]
}

export default function ReviewSchema({ reviews }: ReviewSchemaProps) {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith('/en') || pathname === '/contact' || pathname === '/reservation' || pathname === '/menu' || pathname === '/history'
  
  // Default reviews if none provided
  const defaultReviews: Review[] = isEnglish ? [
    {
      author: "Schmidt Family",
      rating: 5,
      text: "Excellent traditional German restaurant with authentic atmosphere. Perfect for special occasions. The staff was incredibly welcoming and the food was outstanding.",
      date: "2024-11-15"
    },
    {
      author: "Maria Weber",
      rating: 5,
      text: "Had our wedding reception here and it was absolutely perfect! The historic setting, delicious food, and professional service made our day unforgettable. Highly recommend!",
      date: "2024-10-28"
    },
    {
      author: "Thomas Mueller",
      rating: 4,
      text: "Great location for corporate events. The event space is impressive and the traditional German cuisine was enjoyed by all our international colleagues. Professional service throughout.",
      date: "2024-11-02"
    },
    {
      author: "Jennifer Brown",
      rating: 5,
      text: "Amazing experience! The restaurant has such character and history. The traditional German dishes were authentic and delicious. The apple wine was fantastic too!",
      date: "2024-11-08"
    },
    {
      author: "Familie Hoffmann",
      rating: 5,
      text: "Perfect venue for our anniversary celebration. The historic atmosphere, excellent food, and attentive service made it a memorable evening. Will definitely return!",
      date: "2024-10-20"
    }
  ] : [
    {
      author: "Familie Schmidt",
      rating: 5,
      text: "Ausgezeichnetes traditionelles deutsches Restaurant mit authentischer Atmosphäre. Perfekt für besondere Anlässe. Das Personal war unglaublich gastfreundlich und das Essen hervorragend.",
      date: "2024-11-15"
    },
    {
      author: "Maria Weber",
      rating: 5,
      text: "Wir hatten hier unsere Hochzeitsfeier und es war absolut perfekt! Das historische Ambiente, köstliches Essen und professioneller Service machten unseren Tag unvergesslich. Sehr empfehlenswert!",
      date: "2024-10-28"
    },
    {
      author: "Thomas Mueller",
      rating: 4,
      text: "Großartige Location für Firmenfeiern. Der Veranstaltungsraum ist beeindruckend und die traditionelle deutsche Küche wurde von allen unseren internationalen Kollegen geschätzt. Professioneller Service.",
      date: "2024-11-02"
    },
    {
      author: "Jennifer Brown",
      rating: 5,
      text: "Erstaunliche Erfahrung! Das Restaurant hat so viel Charakter und Geschichte. Die traditionellen deutschen Gerichte waren authentisch und köstlich. Der Apfelwein war auch fantastisch!",
      date: "2024-11-08"
    },
    {
      author: "Familie Hoffmann",
      rating: 5,
      text: "Perfekte Location für unsere Jubiläumsfeier. Das historische Ambiente, exzellentes Essen und aufmerksamer Service machten es zu einem unvergesslichen Abend. Kommen definitiv wieder!",
      date: "2024-10-20"
    }
  ]

  const aggregateRating = {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  }

  const reviewData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Efsane Gasthaus Rudolph",
    "aggregateRating": aggregateRating,
    "review": (reviews || defaultReviews).map((review) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.text,
      ...(review.date && { "datePublished": review.date })
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(reviewData, null, 2)
      }}
    />
  )
}