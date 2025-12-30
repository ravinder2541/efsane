// Types for extracted menu data from PDF
export interface ExtractedMenuItem {
  id: string
  name: string
  description?: string
  price: number
  category: string
  allergens?: string[]
  dietary?: string[]
  originalText?: string // For debugging and manual corrections
}

export interface ExtractedMenuCategory {
  id: string
  name: string
  items: ExtractedMenuItem[]
  order: number
}

export interface ExtractedMenuData {
  lastUpdated: string
  source: 'pdf' | 'manual' | 'hybrid'
  version: string
  categories: ExtractedMenuCategory[]
  rawText: string // Full extracted text for debugging
  extractionMetadata: {
    pdfPath: string
    extractionTime: number // milliseconds
    totalItems: number
    totalCategories: number
    errors: string[]
    warnings: string[]
  }
}

// Parser configuration
export interface MenuParserConfig {
  categoryKeywords: {
    de: string[]
    en: string[]
  }
  pricePatterns: RegExp[]
  allergenKeywords: string[]
  dietaryKeywords: string[]
  skipPatterns: RegExp[]
}

// API response types
export interface MenuExtractionResponse {
  success: boolean
  data?: ExtractedMenuData
  error?: string
  cached?: boolean
  cacheAge?: number
}

export interface MenuCacheInfo {
  exists: boolean
  lastModified?: string
  size?: number
  isValid?: boolean
}