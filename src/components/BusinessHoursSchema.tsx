'use client'

interface BusinessHoursSchemaProps {
  specialHours?: Array<{
    date: string // YYYY-MM-DD format
    opens?: string // HH:MM format or 'closed'
    closes?: string // HH:MM format
    description?: string
  }>
}

export default function BusinessHoursSchema({ specialHours }: BusinessHoursSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://efsane-events.de'
  
  const openingHoursData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Efsane Gasthaus Rudolph",
    "url": baseUrl,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "16:00",
        "closes": "22:00",
        "validFrom": "2024-01-01",
        "validThrough": "2024-12-31"
      }
    ],
    // Special holiday hours
    "specialOpeningHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "opens": "14:00",
        "closes": "22:00",
        "validFrom": "2024-12-24",
        "validThrough": "2024-12-24",
        "dayOfWeek": "Tuesday"
      },
      {
        "@type": "OpeningHoursSpecification",
        "opens": "12:00",
        "closes": "23:00", 
        "validFrom": "2024-12-31",
        "validThrough": "2024-12-31",
        "dayOfWeek": "Tuesday"
      },
      ...(specialHours || []).map(hour => ({
        "@type": "OpeningHoursSpecification",
        ...(hour.opens !== 'closed' && {
          "opens": hour.opens,
          "closes": hour.closes
        }),
        "validFrom": hour.date,
        "validThrough": hour.date,
        ...(hour.description && { "description": hour.description })
      }))
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(openingHoursData, null, 2)
      }}
    />
  )
}