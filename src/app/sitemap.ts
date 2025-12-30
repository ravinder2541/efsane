import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://efsane-events.de'
  
  // Get current date for lastModified
  const now = new Date()
  const staticLastModified = new Date('2024-12-01') // Update this when you make major content changes
  
  return [
    // Homepage - Highest Priority
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          de: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    
    // Main Business Pages - High Priority
    {
      url: `${baseUrl}/speisekarte`,
      lastModified: now,
      changeFrequency: 'weekly', // Menu updates frequently
      priority: 0.9,
      alternates: {
        languages: {
          de: `${baseUrl}/speisekarte`,
          en: `${baseUrl}/menu`,
        },
      },
    },
    {
      url: `${baseUrl}/reservierung`,
      lastModified: now,
      changeFrequency: 'weekly', // Booking availability changes
      priority: 0.9,
      alternates: {
        languages: {
          de: `${baseUrl}/reservierung`,
          en: `${baseUrl}/reservation`,
        },
      },
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly', // Contact info stable
      priority: 0.8,
      alternates: {
        languages: {
          de: `${baseUrl}/kontakt`,
          en: `${baseUrl}/contact`,
        },
      },
    },
    
    // About/History Pages - Medium Priority
    {
      url: `${baseUrl}/geschichte`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly', // History rarely changes
      priority: 0.7,
      alternates: {
        languages: {
          de: `${baseUrl}/geschichte`,
          en: `${baseUrl}/history`,
        },
      },
    },
    
    // English Pages - High Priority for International SEO
    {
      url: `${baseUrl}/en`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9, // International homepage
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reservation`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/history`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    
    // Legal/Compliance Pages - Lower Priority but Important for Trust
    {
      url: `${baseUrl}/datenschutz`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
      alternates: {
        languages: {
          de: `${baseUrl}/datenschutz`,
          en: `${baseUrl}/privacy`,
        },
      },
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
      alternates: {
        languages: {
          de: `${baseUrl}/impressum`,
          en: `${baseUrl}/legal`,
        },
      },
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}