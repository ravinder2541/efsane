import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://efsane-events.de'
  
  return {
    rules: [
      // Main rule for all search engines
      {
        userAgent: '*',
        allow: [
          '/',
          '/en',
          '/speisekarte',
          '/menu', 
          '/reservierung',
          '/reservation',
          '/kontakt',
          '/contact',
          '/geschichte',
          '/history',
          '/datenschutz',
          '/privacy',
          '/impressum',
          '/legal',
          '/sitemap.xml',
          '/robots.txt',
        ],
        disallow: [
          '/admin*', // Block all admin areas
          '/api*',   // Block API endpoints
          '/_next/static/chunks*', // Block JS chunks
          '/_next/static/css*', // Block CSS files
          '/_next/static/media*', // Block fonts and media assets
          '/_next/static/webpack*', // Block webpack files
          '/private*', // Block any private content
          '*.json$', // Block JSON files
          '/node_modules*', // Block dependencies
          '/.env*', // Block environment files
          '/backup*', // Block backup files
          '/temp*', // Block temporary files
        ],
        crawlDelay: 1, // Be polite to servers - 1 second between requests
      },
      // Special rules for major search engines
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin*', '/api*', '/_next/static/chunks*', '/_next/static/css*', '/_next/static/media*'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin*', '/api*', '/_next/static/chunks*', '/_next/static/css*', '/_next/static/media*'],
      },
      // Block aggressive crawlers that might cause server load
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}