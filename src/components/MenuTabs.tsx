'use client'

import { useState, useRef, useEffect } from 'react'
import { Star, Leaf, Cherry } from 'lucide-react'

interface MenuItem {
  id: string;
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
  price: number;
  volume?: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_popular: boolean;
  is_available: boolean;
}

interface MenuCategory {
  id: string;
  name_de: string;
  name_en: string;
  is_active: boolean;
  items: MenuItem[];
}

interface MenuTabsProps {
  categories: MenuCategory[];
  language?: 'de' | 'en';
}

export default function MenuTabs({ categories, language = 'de' }: MenuTabsProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?.id || '')
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle URL hash for direct category linking (e.g., #oktoberfest)
  useEffect(() => {
    const hash = window.location.hash.slice(1) // Remove the #
    if (hash) {
      // Find category by name (case-insensitive)
      const targetCategory = categories.find(cat =>
        cat.name_de.toLowerCase().includes(hash.toLowerCase()) ||
        cat.name_en.toLowerCase().includes(hash.toLowerCase())
      )
      if (targetCategory) {
        setActiveTab(targetCategory.id)
        // Scroll to content after a short delay to ensure rendering
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            })
          }
        }, 100)
      }
    }
  }, [categories])

  // Function to handle tab change and scroll to top of content
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    // Scroll to the content area smoothly
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  // Function to get short display names for beverage categories
  const getShortCategoryName = (category: MenuCategory, language: 'de' | 'en') => {
    const shortNames: Record<string, { de: string; en: string }> = {
      'Beer': { de: 'Bier', en: 'Beer' },
      'White Wine': { de: 'Weißwein', en: 'White Wine' },
      'Red Wine': { de: 'Rotwein', en: 'Red Wine' },
      'Rosé Wine': { de: 'Rosé', en: 'Rosé' },
      'Apple Wine': { de: 'Apfelwein', en: 'Apple Wine' },
      'Spritz Variations': { de: 'Spritz', en: 'Spritz' },
      'Spirits': { de: 'Spirituosen', en: 'Spirits' },
      'Hot Beverages': { de: 'Heißgetränke', en: 'Hot Drinks' },
      'Juices': { de: 'Säfte', en: 'Juices' },
      'Non-Alcoholic Beverages': { de: 'Softdrinks', en: 'Soft Drinks' }
    };
    
    return shortNames[category.name_en]?.[language] || (language === 'en' ? category.name_en : category.name_de);
  };

  // Separate food and beverages
  // Food categories include traditional food categories plus special food events like Oktoberfest
  const foodCategories = categories.filter(cat => {
    const categoryNameLower = (cat.name_en || '').toLowerCase();
    const categoryNameDeLower = (cat.name_de || '').toLowerCase();
    
    // Explicit food categories
    const explicitFoodCategories = ['food', 'vegetarian dishes', 'weekly menu'];
    
    // Food-related keywords (including Oktoberfest and similar food events)
    const foodKeywords = ['oktoberfest', 'food', 'speisen', 'gerichte', 'menu', 'küche'];
    
    return explicitFoodCategories.includes(categoryNameLower) ||
           foodKeywords.some(keyword => 
             categoryNameLower.includes(keyword) || categoryNameDeLower.includes(keyword)
           );
  });
  
  const beverageCategories = categories.filter(cat => !foodCategories.includes(cat));

  const activeCategory = categories.find(cat => cat.id === activeTab);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Mobile Tab Navigation */}
      <div className="lg:hidden mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4">
            {/* Food Categories */}
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mr-2"></div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  {language === 'en' ? 'Food' : 'Speisen'}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {foodCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleTabChange(category.id)}
                    className={`p-3 rounded-lg text-center transition-all duration-300 ${
                      activeTab === category.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="font-medium text-xs mb-1">
                      {language === 'en' ? category.name_en : category.name_de}
                    </div>
                    <div className={`text-xs ${
                      activeTab === category.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {category.items.length}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Beverage Categories */}
            <div>
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mr-2"></div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  {language === 'en' ? 'Beverages' : 'Getränke'}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {beverageCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleTabChange(category.id)}
                    className={`p-3 rounded-lg text-center transition-all duration-300 ${
                      activeTab === category.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="font-medium text-xs mb-1">
                      {getShortCategoryName(category, language)}
                    </div>
                    <div className={`text-xs ${
                      activeTab === category.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {category.items.length}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-8">
        {/* Sidebar Navigation */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              {/* Food Categories */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mr-3"></div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    {language === 'en' ? 'Food' : 'Speisen'}
                  </h3>
                </div>
                <div className="space-y-2">
                  {foodCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleTabChange(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                        activeTab === category.id
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm">
                          {language === 'en' ? category.name_en : category.name_de}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          activeTab === category.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {category.items.length}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Beverage Categories */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mr-3"></div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    {language === 'en' ? 'Beverages' : 'Getränke'}
                  </h3>
                </div>
                <div className="space-y-2">
                  {beverageCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleTabChange(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                        activeTab === category.id
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm">
                          {getShortCategoryName(category, language)}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          activeTab === category.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {category.items.length}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Desktop */}
        <div className="flex-1 min-w-0">
          {activeCategory && (
            <div ref={contentRef} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {language === 'en' ? activeCategory.name_en : activeCategory.name_de}
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              </div>

              {/* Menu Items */}
              <div className="p-8">
                <div className="grid gap-6">
                  {activeCategory.items.map((item) => {
                    // Extract volume info for beverages
                    const volumeRegex = /(\d{1,3}[,.]?\d{0,2})\s?(ml|cl|l)/i;
                    let volume = item.volume;
                    const isBeverage = beverageCategories.some(cat => cat.id === activeCategory.id);
                    if (!volume && isBeverage) {
                      const sources = [item.name_de, item.name_en, item.description_de, item.description_en];
                      for (const src of sources) {
                        if (src) {
                          let parenMatch = src.match(/\(([^)]+)\)/);
                          if (parenMatch && parenMatch[1]) {
                            const match = parenMatch[1].match(volumeRegex);
                            if (match) {
                              volume = match[0].replace(/\s+/g, '');
                              break;
                            }
                          }
                          const match = src.match(volumeRegex);
                          if (match) {
                            volume = match[0].replace(/\s+/g, '');
                            break;
                          }
                        }
                      }
                    }

                    return (
                      <div key={item.id} className="group border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-amber-200 transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">
                                {language === 'en' ? item.name_en : item.name_de}
                              </h3>
                              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                                <div className="text-right">
                                  <div className="text-xl font-bold text-amber-600">
                                    €{item.price.toFixed(2)}
                                  </div>
                                  {volume && (
                                    <div className="text-xs text-gray-500 mt-1">{volume}</div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {item.is_popular && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  <Star className="w-3 h-3 mr-1" />
                                  {language === 'en' ? 'Popular' : 'Beliebt'}
                                </span>
                              )}
                              {item.is_vegetarian && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Leaf className="w-3 h-3 mr-1" />
                                  {language === 'en' ? 'Vegetarian' : 'Vegetarisch'}
                                </span>
                              )}
                              {item.is_vegan && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Cherry className="w-3 h-3 mr-1" />
                                  Vegan
                                </span>
                              )}
                              {!item.is_available && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {language === 'en' ? 'Unavailable' : 'Nicht verfügbar'}
                                </span>
                              )}
                            </div>

                            {/* Description */}
                            {(language === 'en' ? item.description_en : item.description_de) && (
                              <p className="text-gray-600 leading-relaxed mb-2">
                                {language === 'en' ? item.description_en : item.description_de}
                              </p>
                            )}

                            {/* Alternate language name */}
                            <div className="text-sm text-gray-500 italic">
                              {language === 'en' ? item.name_de : item.name_en}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* No items message */}
                {activeCategory.items.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Star className="w-16 h-16 mx-auto" />
                    </div>
                    <p className="text-gray-500 text-lg">
                      {language === 'en' 
                        ? 'No items available in this category.' 
                        : 'Keine Artikel in dieser Kategorie verfügbar.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden">
        {activeCategory && (
          <div ref={contentRef} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Category Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'en' ? activeCategory.name_en : activeCategory.name_de}
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
            </div>

            {/* Menu Items - Mobile */}
            <div className="p-4">
              <div className="space-y-4">
                {activeCategory.items.map((item) => {
                  // Extract volume info for beverages
                  const volumeRegex = /(\d{1,3}[,.]?\d{0,2})\s?(ml|cl|l)/i;
                  let volume = item.volume;
                  const isBeverage = beverageCategories.some(cat => cat.id === activeCategory.id);
                  if (!volume && isBeverage) {
                    const sources = [item.name_de, item.name_en, item.description_de, item.description_en];
                    for (const src of sources) {
                      if (src) {
                        let parenMatch = src.match(/\(([^)]+)\)/);
                        if (parenMatch && parenMatch[1]) {
                          const match = parenMatch[1].match(volumeRegex);
                          if (match) {
                            volume = match[0].replace(/\s+/g, '');
                            break;
                          }
                        }
                        const match = src.match(volumeRegex);
                        if (match) {
                          volume = match[0].replace(/\s+/g, '');
                          break;
                        }
                      }
                    }
                  }

                  return (
                    <div key={item.id} className="border border-gray-100 rounded-lg p-4 hover:border-amber-200 transition-all duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 mb-1">
                            {language === 'en' ? item.name_en : item.name_de}
                          </h3>
                          <div className="text-sm text-gray-500 italic mb-2">
                            {language === 'en' ? item.name_de : item.name_en}
                          </div>
                        </div>
                        <div className="text-right ml-3 flex-shrink-0">
                          <div className="text-lg font-bold text-amber-600">
                            €{item.price.toFixed(2)}
                          </div>
                          {volume && (
                            <div className="text-xs text-gray-500 mt-1">{volume}</div>
                          )}
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.is_popular && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <Star className="w-3 h-3 mr-1" />
                            {language === 'en' ? 'Popular' : 'Beliebt'}
                          </span>
                        )}
                        {item.is_vegetarian && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Leaf className="w-3 h-3 mr-1" />
                            {language === 'en' ? 'Vegetarian' : 'Vegetarisch'}
                          </span>
                        )}
                        {item.is_vegan && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Cherry className="w-3 h-3 mr-1" />
                            Vegan
                          </span>
                        )}
                        {!item.is_available && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {language === 'en' ? 'Unavailable' : 'Nicht verfügbar'}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {(language === 'en' ? item.description_en : item.description_de) && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {language === 'en' ? item.description_en : item.description_de}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* No items message */}
              {activeCategory.items.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Star className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-500">
                    {language === 'en' 
                      ? 'No items available in this category.' 
                      : 'Keine Artikel in dieser Kategorie verfügbar.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
