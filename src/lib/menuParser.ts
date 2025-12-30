import { ExtractedMenuItem, ExtractedMenuCategory, ExtractedMenuData, MenuParserConfig } from '@/types/menu'

// Configuration for parsing German restaurant menus
const DEFAULT_PARSER_CONFIG: MenuParserConfig = {
  categoryKeywords: {
    de: [
      'vorspeisen', 'appetizer', 'starter', 'vorspeise',
      'hauptgerichte', 'hauptgericht', 'main', 'mains', 'hauptspeisen',
      'nachspeisen', 'nachspeise', 'dessert', 'desserts', 'süßspeisen',
      'getränke', 'getränk', 'beverages', 'drinks', 'trinken',
      'suppen', 'suppe', 'soup', 'soups',
      'salate', 'salat', 'salad', 'salads',
      'fleisch', 'meat', 'fleischgerichte',
      'fisch', 'fish', 'fischgerichte',
      'vegetarisch', 'vegetarian', 'veggie',
      'bier', 'beer', 'biere',
      'wein', 'wine', 'weine',
      'alkoholfrei', 'non-alcoholic', 'softdrinks'
    ],
    en: [
      'appetizers', 'starters', 'appetizer', 'starter',
      'main courses', 'mains', 'main dishes', 'entrees',
      'desserts', 'dessert', 'sweets',
      'beverages', 'drinks', 'beverage',
      'soups', 'soup',
      'salads', 'salad',
      'meat dishes', 'meat',
      'fish dishes', 'fish',
      'vegetarian', 'veggie',
      'beer', 'beers',
      'wine', 'wines',
      'non-alcoholic', 'soft drinks'
    ]
  },
  pricePatterns: [
    /(\d+[,.]?\d*)\s*€/g,           // 12.50€ or 12,50€
    /€\s*(\d+[,.]?\d*)/g,          // €12.50
    /(\d+[,.]?\d*)\s*EUR/gi,       // 12.50 EUR
    /(\d+[,.]?\d*)\s*euro/gi,      // 12.50 euro
  ],
  allergenKeywords: [
    'gluten', 'weizen', 'wheat',
    'milch', 'dairy', 'laktose', 'lactose',
    'ei', 'eier', 'egg', 'eggs',
    'nüsse', 'nuts', 'nuss',
    'soja', 'soy', 'soybean',
    'fisch', 'fish',
    'schalentiere', 'shellfish', 'meeresfrüchte',
    'sesam', 'sesame',
    'senf', 'mustard',
    'sellerie', 'celery'
  ],
  dietaryKeywords: [
    'vegetarisch', 'vegetarian', 'veggie',
    'vegan',
    'glutenfrei', 'gluten-free', 'glutenfree',
    'laktosefrei', 'lactose-free', 'lactosefree',
    'bio', 'organic', 'biologisch'
  ],
  skipPatterns: [
    /^(seite|page)\s*\d+/i,        // Page numbers
    /^(tel|telefon|phone)[:.]?\s*/i, // Phone numbers
    /^(email|e-mail)[:.]?\s*/i,    // Email addresses
    /^(www\.|http)/i,              // URLs
    /^(öffnungszeiten|opening hours)/i, // Opening hours
    /^(adresse|address)[:.]?\s*/i, // Address
    /^\s*$/,                       // Empty lines
    /^[-=_]{3,}$/,                 // Separator lines
  ]
}

export class MenuParser {
  private config: MenuParserConfig

  constructor(config?: Partial<MenuParserConfig>) {
    this.config = { ...DEFAULT_PARSER_CONFIG, ...config }
  }

  /**
   * Parse extracted PDF text into structured menu data
   */
  public parseMenuText(rawText: string, pdfPath: string): ExtractedMenuData {
    const startTime = Date.now()
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Clean and normalize the text
      const cleanedText = this.cleanText(rawText)
      const lines = cleanedText.split('\n').filter(line => line.trim())

      // Filter out unwanted lines
      const filteredLines = this.filterLines(lines)

      // Detect categories and parse items
      const categories = this.parseCategories(filteredLines, errors, warnings)

      // Generate unique IDs for items
      this.generateItemIds(categories)

      const extractionTime = Date.now() - startTime
      const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0)

      return {
        lastUpdated: new Date().toISOString(),
        source: 'pdf',
        version: '1.0.0',
        categories,
        rawText,
        extractionMetadata: {
          pdfPath,
          extractionTime,
          totalItems,
          totalCategories: categories.length,
          errors,
          warnings
        }
      }
    } catch (error) {
      errors.push(`Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      return {
        lastUpdated: new Date().toISOString(),
        source: 'pdf',
        version: '1.0.0',
        categories: [],
        rawText,
        extractionMetadata: {
          pdfPath,
          extractionTime: Date.now() - startTime,
          totalItems: 0,
          totalCategories: 0,
          errors,
          warnings
        }
      }
    }
  }

  /**
   * Clean and normalize text
   */
  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')           // Normalize line endings
      .replace(/\r/g, '\n')            // Handle old Mac line endings
      .replace(/\t/g, ' ')             // Replace tabs with spaces
      .replace(/[ \t]+/g, ' ')         // Normalize horizontal whitespace only
      .replace(/\n\s+/g, '\n')         // Remove leading spaces on lines
      .replace(/\n+/g, '\n')           // Normalize multiple line breaks
      .trim()
  }

  /**
   * Filter out unwanted lines
   */
  private filterLines(lines: string[]): string[] {
    return lines.filter(line => {
      const trimmedLine = line.trim()
      return !this.config.skipPatterns.some(pattern => pattern.test(trimmedLine))
    })
  }

  /**
   * Parse categories and their items
   */
  private parseCategories(lines: string[], errors: string[], warnings: string[]): ExtractedMenuCategory[] {
    const categories: ExtractedMenuCategory[] = []
    let currentCategory: ExtractedMenuCategory | null = null
    let categoryOrder = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Check if this line is a category header
      const categoryName = this.detectCategory(line)
      if (categoryName) {
        // Save previous category if exists
        if (currentCategory && currentCategory.items.length > 0) {
          categories.push(currentCategory)
        }

        // Start new category
        currentCategory = {
          id: this.generateCategoryId(categoryName),
          name: categoryName,
          items: [],
          order: categoryOrder++
        }
        continue
      }

      // If we have a current category, try to parse this line as a menu item
      if (currentCategory) {
        const item = this.parseMenuItem(line, currentCategory.name, i)
        if (item) {
          currentCategory.items.push(item)
        } else if (line.length > 10) { // Only warn for substantial lines
          warnings.push(`Could not parse line ${i + 1}: "${line}"`)
        }
      } else if (line.length > 5) {
        // We have content but no category - try to create a default category
        if (!currentCategory) {
          currentCategory = {
            id: 'general',
            name: 'Allgemeine Speisen',
            items: [],
            order: categoryOrder++
          }
        }
        
        const item = this.parseMenuItem(line, currentCategory.name, i)
        if (item) {
          currentCategory.items.push(item)
        }
      }
    }

    // Don't forget the last category
    if (currentCategory && currentCategory.items.length > 0) {
      categories.push(currentCategory)
    }

    return categories
  }

  /**
   * Detect if a line is a category header
   */
  private detectCategory(line: string): string | null {
    const lowerLine = line.toLowerCase()
    
    // Check against known category keywords
    const allKeywords = [...this.config.categoryKeywords.de, ...this.config.categoryKeywords.en]
    
    for (const keyword of allKeywords) {
      if (lowerLine.includes(keyword.toLowerCase())) {
        // Return the original line as category name (preserves capitalization)
        return line
      }
    }

    // Check if line looks like a header (all caps, centered, etc.)
    if (line.length < 50 && line === line.toUpperCase() && line.length > 3) {
      return line
    }

    // Check if line is standalone and looks like a section header
    if (line.length < 30 && !this.extractPrice(line) && line.split(' ').length <= 4) {
      return line
    }

    return null
  }

  /**
   * Parse a single menu item from a line
   */
  private parseMenuItem(line: string, categoryName: string, lineNumber: number): ExtractedMenuItem | null {
    // Extract price first
    const price = this.extractPrice(line)
    if (!price) {
      return null // No price found, probably not a menu item
    }

    // Remove price from line to get name and description
    const lineWithoutPrice = this.removePriceFromLine(line)
    if (!lineWithoutPrice.trim()) {
      return null
    }

    // Clean up the line - remove trailing dashes and extra spaces
    const cleanedLine = lineWithoutPrice.replace(/\s*-\s*$/, '').trim()
    
    // Split name and description (usually separated by dots, dashes, or line breaks)
    const { name, description } = this.splitNameAndDescription(cleanedLine)

    if (!name.trim()) {
      return null
    }

    // Extract allergens and dietary info
    const allergens = this.extractAllergens(line)
    const dietary = this.extractDietary(line)

    return {
      id: '', // Will be generated later
      name: name.trim(),
      description: description?.trim() || undefined,
      price,
      category: categoryName,
      allergens: allergens.length > 0 ? allergens : undefined,
      dietary: dietary.length > 0 ? dietary : undefined,
      originalText: line
    }
  }

  /**
   * Extract price from a line
   */
  private extractPrice(line: string): number | null {
    for (const pattern of this.config.pricePatterns) {
      const matches = Array.from(line.matchAll(pattern))
      if (matches.length > 0) {
        // Get the last price match (in case there are multiple)
        const lastMatch = matches[matches.length - 1]
        const priceStr = lastMatch[1].replace(',', '.')
        const price = parseFloat(priceStr)
        if (!isNaN(price) && price > 0) {
          return price
        }
      }
    }
    return null
  }

  /**
   * Remove price from line
   */
  private removePriceFromLine(line: string): string {
    let result = line
    for (const pattern of this.config.pricePatterns) {
      result = result.replace(pattern, '').trim()
    }
    return result
  }

  /**
   * Split name and description
   */
  private splitNameAndDescription(text: string): { name: string; description?: string } {
    // Common separators between name and description
    const separators = [' - ', ' – ', ' ... ', ' .. ', '  ']
    
    for (const separator of separators) {
      if (text.includes(separator)) {
        const parts = text.split(separator, 2)
        return {
          name: parts[0].trim(),
          description: parts[1].trim()
        }
      }
    }

    // If no separator found, treat the whole text as name
    return { name: text.trim() }
  }

  /**
   * Extract allergen information
   */
  private extractAllergens(line: string): string[] {
    const allergens: string[] = []
    const lowerLine = line.toLowerCase()

    for (const allergen of this.config.allergenKeywords) {
      if (lowerLine.includes(allergen.toLowerCase())) {
        allergens.push(allergen)
      }
    }

    return allergens
  }

  /**
   * Extract dietary information
   */
  private extractDietary(line: string): string[] {
    const dietary: string[] = []
    const lowerLine = line.toLowerCase()

    for (const diet of this.config.dietaryKeywords) {
      if (lowerLine.includes(diet.toLowerCase())) {
        dietary.push(diet)
      }
    }

    return dietary
  }

  /**
   * Generate category ID
   */
  private generateCategoryId(name: string): string {
    return name
      .toLowerCase()
      .replace(/[äöüß]/g, (char) => {
        const map: { [key: string]: string } = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }
        return map[char] || char
      })
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  /**
   * Generate unique IDs for all items
   */
  private generateItemIds(categories: ExtractedMenuCategory[]): void {
    categories.forEach((category, catIndex) => {
      category.items.forEach((item, itemIndex) => {
        item.id = `${category.id}-${itemIndex + 1}`
      })
    })
  }
}

// Export default instance
export const menuParser = new MenuParser()