import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { menuParser } from '@/lib/menuParser'
import { ExtractedMenuData, MenuExtractionResponse, MenuCacheInfo } from '@/types/menu'

// Cache configuration
const CACHE_DIR = path.join(process.cwd(), '.menu-cache')
const CACHE_FILE = path.join(CACHE_DIR, 'extracted-menu.json')
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

/**
 * Ensure cache directory exists
 */
async function ensureCacheDir(): Promise<void> {
  try {
    await fs.access(CACHE_DIR)
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true })
  }
}

/**
 * Get cache information
 */
async function getCacheInfo(): Promise<MenuCacheInfo> {
  try {
    const stats = await fs.stat(CACHE_FILE)
    const age = Date.now() - stats.mtime.getTime()
    
    return {
      exists: true,
      lastModified: stats.mtime.toISOString(),
      size: stats.size,
      isValid: age < CACHE_DURATION
    }
  } catch {
    return {
      exists: false,
      isValid: false
    }
  }
}

/**
 * Load cached menu data
 */
async function loadCachedMenu(): Promise<ExtractedMenuData | null> {
  try {
    const cacheInfo = await getCacheInfo()
    if (!cacheInfo.exists || !cacheInfo.isValid) {
      return null
    }

    const cachedData = await fs.readFile(CACHE_FILE, 'utf-8')
    return JSON.parse(cachedData) as ExtractedMenuData
  } catch (error) {
    console.error('Error loading cached menu:', error)
    return null
  }
}

/**
 * Save menu data to cache
 */
async function saveCachedMenu(menuData: ExtractedMenuData): Promise<void> {
  try {
    await ensureCacheDir()
    await fs.writeFile(CACHE_FILE, JSON.stringify(menuData, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving menu cache:', error)
  }
}

/**
 * Extract text from PDF file - Placeholder implementation
 * TODO: Implement proper PDF text extraction when library issues are resolved
 */
async function extractPdfText(pdfPath: string): Promise<string> {
  try {
    // For now, return a sample menu text that represents what would be extracted from PDF
    // This allows us to test the parsing logic while we resolve PDF extraction issues
    const sampleMenuText = `
EFSANE GASTHAUS RUDOLPH
Traditionelle deutsche Küche seit 1620

VORSPEISEN
Traditionelle Leberwurst mit Zwiebeln und Schwarzbrot - 8,50 €
Hausgemachte Leberwurst mit Zwiebeln und dunklem Brot

Rheinischer Sauerbraten-Carpaccio - 12,90 €
Dünn geschnittener marinierter Rinderbraten mit Röstzwiebeln

HAUPTGERICHTE
Sauerbraten mit Rotkohl - 18,90 €
Klassischer rheinischer Sauerbraten mit hausgemachtem Rotkohl und Kartoffelklößen

Schweinebraten mit Sauerkraut - 16,50 €
Knuspriger Schweinebraten mit traditionellem Sauerkraut und Salzkartoffeln

Rheinischer Himmel un Ääd - 14,80 €
Kartoffel-Apfel-Püree mit Blutwurst und Röstzwiebeln

NACHSPEISEN
Schwarzwälder Kirschtorte - 6,90 €
Klassische Schwarzwälder Kirschtorte mit Sahne und Kirschen

Apfelstrudel mit Vanillesoße - 5,50 €
Hausgemachter Apfelstrudel mit warmer Vanillesoße

GETRÄNKE
Kölsch (0,2l) - 2,80 €
Traditionelles Kölner Bier

Rheinwein Riesling (0,2l) - 4,50 €
Trockener Riesling aus dem Rheintal

Apfelschorle (0,3l) - 3,20 €
Erfrischende Apfelschorle
    `.trim()

    // TODO: Replace with actual PDF extraction
    // const pdfBuffer = await fs.readFile(pdfPath)
    // ... actual PDF parsing logic here
    
    return sampleMenuText
  } catch (error) {
    throw new Error(`Failed to extract PDF text: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Check if PDF file has been modified since last extraction
 */
async function isPdfModified(pdfPath: string, lastExtracted: string): Promise<boolean> {
  try {
    const stats = await fs.stat(pdfPath)
    return stats.mtime.getTime() > new Date(lastExtracted).getTime()
  } catch {
    return true // If we can't check, assume it's modified
  }
}

/**
 * GET /api/extract-menu
 * Extract menu content from PDF with caching
 */
export async function GET(request: NextRequest): Promise<NextResponse<MenuExtractionResponse>> {
  try {
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('refresh') === 'true'
    const pdfPath = path.join(process.cwd(), 'public', 'menu.pdf')

    // Check if PDF file exists
    try {
      await fs.access(pdfPath)
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Menu PDF file not found'
      }, { status: 404 })
    }

    // Try to load cached data first (unless force refresh)
    if (!forceRefresh) {
      const cachedMenu = await loadCachedMenu()
      if (cachedMenu) {
        // Check if PDF has been modified since last extraction
        const pdfModified = await isPdfModified(pdfPath, cachedMenu.lastUpdated)
        
        if (!pdfModified) {
          const cacheInfo = await getCacheInfo()
          const cacheAge = cacheInfo.lastModified 
            ? Date.now() - new Date(cacheInfo.lastModified).getTime()
            : 0

          return NextResponse.json({
            success: true,
            data: cachedMenu,
            cached: true,
            cacheAge
          })
        }
      }
    }

    // Extract text from PDF
    console.log('Extracting text from PDF...')
    const rawText = await extractPdfText(pdfPath)

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No text could be extracted from the PDF'
      }, { status: 422 })
    }

    // Parse the extracted text
    console.log('Parsing menu content...')
    const menuData = menuParser.parseMenuText(rawText, pdfPath)

    // Save to cache
    await saveCachedMenu(menuData)

    // Log extraction results
    console.log(`Menu extraction completed:`)
    console.log(`- Categories: ${menuData.categories.length}`)
    console.log(`- Total items: ${menuData.extractionMetadata.totalItems}`)
    console.log(`- Extraction time: ${menuData.extractionMetadata.extractionTime}ms`)
    console.log(`- Errors: ${menuData.extractionMetadata.errors.length}`)
    console.log(`- Warnings: ${menuData.extractionMetadata.warnings.length}`)

    return NextResponse.json({
      success: true,
      data: menuData,
      cached: false
    })

  } catch (error) {
    console.error('Menu extraction error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown extraction error'
    }, { status: 500 })
  }
}

/**
 * DELETE /api/extract-menu
 * Clear menu cache
 */
export async function DELETE(): Promise<NextResponse<{ success: boolean; message: string }>> {
  try {
    const cacheInfo = await getCacheInfo()
    
    if (cacheInfo.exists) {
      await fs.unlink(CACHE_FILE)
      return NextResponse.json({
        success: true,
        message: 'Menu cache cleared successfully'
      })
    } else {
      return NextResponse.json({
        success: true,
        message: 'No cache to clear'
      })
    }
  } catch (error) {
    console.error('Error clearing cache:', error)
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to clear cache'
    }, { status: 500 })
  }
}

/**
 * POST /api/extract-menu
 * Force refresh menu extraction
 */
export async function POST(): Promise<NextResponse<MenuExtractionResponse>> {
  // Redirect to GET with refresh parameter
  const url = new URL('/api/extract-menu?refresh=true', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
  
  try {
    const response = await fetch(url.toString())
    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to refresh menu'
    }, { status: 500 })
  }
}