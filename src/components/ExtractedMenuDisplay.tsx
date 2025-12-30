'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Euro, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { ExtractedMenuData, ExtractedMenuCategory, ExtractedMenuItem } from '@/types/menu'

interface ExtractedMenuDisplayProps {
  language?: 'de' | 'en'
  className?: string
}

export default function ExtractedMenuDisplay({ language = 'de', className = '' }: ExtractedMenuDisplayProps) {
  const [menuData, setMenuData] = useState<ExtractedMenuData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Localized text
  const texts = {
    de: {
      loading: 'Speisekarte wird geladen...',
      error: 'Fehler beim Laden der Speisekarte',
      searchPlaceholder: 'Gerichte suchen...',
      allCategories: 'Alle Kategorien',
      noResults: 'Keine Gerichte gefunden',
      extractedFrom: 'Automatisch aus PDF extrahiert',
      lastUpdated: 'Zuletzt aktualisiert',
      totalItems: 'Gerichte insgesamt',
      categories: 'Kategorien',
      allergens: 'Allergene',
      dietary: 'Ernährung',
      fallbackToPdf: 'PDF-Ansicht verwenden'
    },
    en: {
      loading: 'Loading menu...',
      error: 'Error loading menu',
      searchPlaceholder: 'Search dishes...',
      allCategories: 'All Categories',
      noResults: 'No dishes found',
      extractedFrom: 'Automatically extracted from PDF',
      lastUpdated: 'Last updated',
      totalItems: 'Total items',
      categories: 'Categories',
      allergens: 'Allergens',
      dietary: 'Dietary',
      fallbackToPdf: 'Use PDF view'
    }
  }

  const t = texts[language]

  // Fetch menu data
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/extract-menu')
        const result = await response.json()
        
        if (result.success) {
          setMenuData(result.data)
        } else {
          setError(result.error || 'Unknown error')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error')
      } finally {
        setLoading(false)
      }
    }

    fetchMenuData()
  }, [])

  // Filter menu items based on search and category
  const filteredCategories = menuData?.categories.filter(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) {
      return false
    }

    if (!searchTerm) return true

    // Check if category name matches
    if (category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true
    }

    // Check if any item in category matches
    return category.items.some(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }) || []

  // Filter items within categories
  const getFilteredItems = (items: ExtractedMenuItem[]) => {
    if (!searchTerm) return items
    
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    )
  }

  if (error || !menuData) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-red-800">{t.error}</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Extraction Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium">{t.extractedFrom}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-green-700">
          <div>
            <span className="font-medium">{t.lastUpdated}:</span>
            <br />
            {new Date(menuData.lastUpdated).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
          </div>
          <div>
            <span className="font-medium">{t.categories}:</span>
            <br />
            {menuData.extractionMetadata.totalCategories}
          </div>
          <div>
            <span className="font-medium">{t.totalItems}:</span>
            <br />
            {menuData.extractionMetadata.totalItems}
          </div>
          <div>
            <span className="font-medium">Extraction:</span>
            <br />
            {menuData.extractionMetadata.extractionTime}ms
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
          >
            <option value="all">{t.allCategories}</option>
            {menuData.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Categories */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">{t.noResults}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredCategories.map((category) => {
            const filteredItems = getFilteredItems(category.items)
            
            if (filteredItems.length === 0) return null

            return (
              <div key={category.id} className="animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="font-serif text-3xl font-bold text-primary-700 mb-4">
                    {category.name}
                  </h2>
                  <div className="w-24 h-1 bg-secondary-500 mx-auto"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="menu-item-card animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="menu-item-image bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                        <p className="text-primary-700 font-serif text-lg text-center px-4">
                          {item.name}
                        </p>
                      </div>
                      
                      <div className="menu-item-content">
                        <h3 className="menu-item-title">
                          {item.name}
                        </h3>
                        
                        {item.description && (
                          <p className="menu-item-description">
                            {item.description}
                          </p>
                        )}
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="menu-item-price">
                            {language === 'de' ? `${item.price.toFixed(2)} €` : `€${item.price.toFixed(2)}`}
                          </span>
                        </div>

                        {/* Allergens and Dietary Info */}
                        <div className="mt-3 space-y-2">
                          {item.allergens && item.allergens.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs text-gray-500 mr-1">{t.allergens}:</span>
                              {item.allergens.map((allergen) => (
                                <span
                                  key={allergen}
                                  className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {allergen}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {item.dietary && item.dietary.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs text-gray-500 mr-1">{t.dietary}:</span>
                              {item.dietary.map((diet) => (
                                <span
                                  key={diet}
                                  className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {diet}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}