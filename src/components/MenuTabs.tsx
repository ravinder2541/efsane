'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star, Leaf, Cherry, Info, ChevronRight, ArrowLeft,
  Utensils, ConciergeBell, Soup, Salad, ChefHat, Ham, Beef, CakeSlice,
  Beer, Wine, Apple, Martini, GlassWater, Coffee, CupSoda, MoreHorizontal,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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
  description_de?: string | null;
  description_en?: string | null;
  is_active: boolean;
  items: MenuItem[];
}

export interface MenuIntro {
  eyebrow: string;
  title: string;
  subtitle: string;
  back: { href: string; label: string };
}

interface MenuTabsProps {
  categories: MenuCategory[];
  language?: 'de' | 'en';
  intro?: MenuIntro;
}

// Picks a fitting icon from the category name; purely decorative
const categoryIcons: [string[], LucideIcon][] = [
  [['vegan', 'vegetar'], Leaf],
  [['starter', 'appetizer', 'vorspeise'], ConciergeBell],
  [['soup', 'suppe'], Soup],
  [['salad', 'salat'], Salad],
  [['hesse', 'hessen', 'hessian', 'hessisch'], ChefHat],
  [['schnitzel', 'pork', 'schwein'], Ham],
  [['beef', 'rind'], Beef],
  [['dessert', 'nachspeise', 'nachtisch', 'süß'], CakeSlice],
  [['special', 'weekly', 'daily', 'woche', 'tages', 'empfehlung', 'oktoberfest'], Star],
  [['miscellaneous', 'verschiedenes'], MoreHorizontal],
  [['apple wine', 'apfelwein', 'ebbel'], Apple],
  [['spritz'], Martini],
  [['wine', 'wein', 'rosé'], Wine],
  [['beer', 'bier'], Beer],
  [['spirit', 'spirituose', 'schnaps'], GlassWater],
  [['hot', 'heiß', 'coffee', 'kaffee', 'tea', 'tee'], Coffee],
  [['juice', 'saft', 'säfte', 'non-alcoholic', 'soft', 'alkoholfrei'], CupSoda],
]

function iconFor(category: MenuCategory): LucideIcon {
  const name = `${category.name_en} ${category.name_de}`.toLowerCase()
  return categoryIcons.find(([keys]) => keys.some((k) => name.includes(k)))?.[1] ?? Utensils
}

function Flourish({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 12" className={className} aria-hidden="true">
      <line x1="0" y1="6" x2="88" y2="6" stroke="currentColor" strokeWidth="1" />
      <line x1="132" y1="6" x2="220" y2="6" stroke="currentColor" strokeWidth="1" />
      <path d="M110 1 L115 6 L110 11 L105 6 Z" fill="currentColor" />
      <path d="M90 6 C95 1, 101 1, 104 5 M130 6 C125 1, 119 1, 116 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export default function MenuTabs({ categories, language = 'de', intro }: MenuTabsProps) {
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
  const showMiscellaneousNote = activeCategory?.name_en === 'Miscellaneous' || activeCategory?.name_de === 'Verschiedenes';
  const activeIsBeverage = beverageCategories.some(cat => cat.id === activeCategory?.id);

  const groups = [
    { key: 'food', label: language === 'en' ? 'Food' : 'Speisen', list: foodCategories, short: false },
    { key: 'drinks', label: language === 'en' ? 'Beverages' : 'Getränke', list: beverageCategories, short: true },
  ].filter((g) => g.list.length > 0)

  const categoryLabel = (category: MenuCategory, short: boolean) =>
    short ? getShortCategoryName(category, language) : (language === 'en' ? category.name_en : category.name_de)

  // Extract volume info for beverages
  const volumeFor = (item: MenuItem) => {
    const volumeRegex = /(\d{1,3}[,.]?\d{0,2})\s?(ml|cl|l)/i;
    let volume = item.volume;
    if (!volume && activeIsBeverage) {
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
    return volume
  }

  const description = activeCategory
    ? (language === 'en' ? activeCategory.description_en : activeCategory.description_de)
    : null

  return (
    <div className="relative w-full lg:flex lg:pt-24 bg-[#f8f0e2] font-garamond [font-variant-numeric:lining-nums]">
      {/* ---------- Left panel: title + categories ---------- */}
      <aside className="relative lg:w-[31%] lg:min-w-[340px] lg:max-w-[480px] shrink-0">
        <div className="relative lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] overflow-hidden lg:rounded-tr-[90px] border-r-0 lg:border-r-[3px] lg:border-t-[3px] border-[#c9a25e] bg-[radial-gradient(ellipse_at_20%_60%,#5a3416,#2a1608_65%,#1a0d05)] lg:bg-[#2a1608]">
          <Image src="/menubg.png" alt="" fill sizes="(min-width: 1024px) 35vw, 100vw" className="hidden lg:block object-cover object-left-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/55"></div>

          <div className="relative h-full flex flex-col px-5 sm:px-8 lg:px-[2.4vw] pt-24 lg:pt-8 pb-6">
            {intro && (
              <div className="shrink-0">
                <Link
                  href={intro.back.href}
                  className="inline-flex items-center gap-2 text-[#e6c27a] hover:text-[#f6dca0] text-base transition-colors no-underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {intro.back.label}
                </Link>
                <p className="mt-4 font-sans text-[#f3e6cf] uppercase tracking-[0.35em] text-sm">{intro.eyebrow}</p>
                <h1 className="font-serif font-bold text-[#fbf3e4] text-5xl xl:text-6xl leading-tight">{intro.title}</h1>
                <Flourish className="mt-1 w-40 h-auto text-[#c9a25e]" />
                <p className="mt-3 font-sans text-[#f3e6cf]/90 text-[0.95rem] leading-relaxed">{intro.subtitle}</p>
              </div>
            )}

            {/* Category list (scrolls inside the panel on desktop) */}
            <nav
              aria-label={language === 'en' ? 'Menu categories' : 'Kategorien'}
              className="mt-6 lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:pr-2 [scrollbar-width:thin] [scrollbar-color:#c9a25e55_transparent]"
            >
              {groups.map((group) => (
                <div key={group.key} className="mb-5 last:mb-0">
                  <h3 className="flex items-center gap-3 mb-2 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#e6c27a]">
                    {group.label}
                    <span className="h-px flex-1 bg-[#c9a25e]/40"></span>
                  </h3>
                  <ul className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-1 lg:gap-1.5 lg:overflow-visible">
                    {group.list.map((category) => {
                      const active = activeTab === category.id
                      const Icon = iconFor(category)
                      return (
                        <li key={category.id} className="shrink-0 lg:shrink">
                          <button
                            onClick={() => handleTabChange(category.id)}
                            aria-current={active ? 'true' : undefined}
                            className={`group w-full flex items-center gap-2.5 lg:gap-3 rounded-full lg:rounded-xl pl-1.5 pr-3 lg:px-2.5 py-1.5 lg:py-2 text-left whitespace-nowrap transition-all duration-300 ${
                              active
                                ? 'bg-gradient-to-r from-[#f6dca0] to-[#d9b06c] text-[#2b1a10] shadow-[0_6px_16px_rgba(0,0,0,0.35)]'
                                : 'bg-black/20 lg:bg-transparent text-[#f3e6cf] hover:bg-white/10'
                            }`}
                          >
                            <span
                              className={`shrink-0 w-9 h-9 lg:w-10 lg:h-10 rounded-full border flex items-center justify-center ${
                                active ? 'border-[#8a5a2b] bg-[#fbf3e4]/60 text-[#7b4a1f]' : 'border-[#c9a25e] text-[#e6c27a]'
                              }`}
                            >
                              <Icon className="w-[50%] h-[50%]" strokeWidth={1.8} />
                            </span>
                            <span className="lg:flex-1 lg:min-w-0 lg:whitespace-normal font-sans text-sm lg:text-[0.95rem] font-medium leading-tight">
                              {categoryLabel(category, group.short)}
                            </span>
                            <span
                              className={`shrink-0 min-w-[1.75rem] h-7 px-1.5 rounded-full font-sans text-xs font-semibold flex items-center justify-center ${
                                active ? 'bg-[#fbf3e4] text-[#2b1a10] ring-1 ring-[#8a5a2b]/40' : 'bg-[#c9a25e]/25 text-[#f6dca0]'
                              }`}
                            >
                              {category.items.length}
                            </span>
                            <ChevronRight
                              className={`hidden lg:block shrink-0 w-4 h-4 transition-transform group-hover:translate-x-0.5 ${active ? 'text-[#2b1a10]' : 'text-[#c9a25e]'}`}
                            />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* ---------- Right panel: active category ---------- */}
      <div
        ref={contentRef}
        className="relative flex-1 min-w-0 lg:min-h-[calc(100vh-96px)] scroll-mt-20 bg-[#f8f0e2] bg-[url('/menubg.png')] bg-no-repeat bg-[length:150%_auto] bg-[position:100%_0]"
      >
        {activeCategory && (
          <div className="relative px-5 sm:px-8 lg:px-[3.5vw] pt-10 lg:pt-10 pb-12">
            {/* Category header */}
            <div className="flex items-start gap-6">
              <div className="flex-1 min-w-0">
                <p className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#a5692a]">
                  {activeIsBeverage ? (language === 'en' ? 'Beverages' : 'Getränke') : (language === 'en' ? 'Food' : 'Speisen')}
                </p>
                <h2 className="mt-1 font-serif font-bold text-[#1f1a16] text-4xl sm:text-5xl lg:text-6xl leading-tight">
                  {language === 'en' ? activeCategory.name_en : activeCategory.name_de}
                </h2>
                <Flourish className="mt-1 w-52 h-auto text-[#b08a45]" />
                {description && (
                  <p className="mt-3 max-w-2xl font-sans text-[#3a332d] text-base leading-relaxed">{description}</p>
                )}
              </div>
              <div className="hidden md:flex items-center gap-0 pt-6 text-[#b08a45]" aria-hidden="true">
                <span className="h-px w-24 xl:w-40 bg-current"></span>
                <span className="w-16 h-16 rounded-full border-2 border-current bg-[#fbf5ea]/80 flex items-center justify-center">
                  <Utensils className="w-7 h-7" strokeWidth={1.8} />
                </span>
                <span className="h-px w-24 xl:w-40 bg-current"></span>
              </div>
            </div>

            {/* Menu items */}
            <ol className="mt-8 space-y-4">
              {activeCategory.items.map((item, index) => {
                const volume = volumeFor(item)
                const itemDescription = language === 'en' ? item.description_en : item.description_de
                return (
                  <li
                    key={item.id}
                    className="group flex items-stretch gap-4 sm:gap-6 rounded-2xl border border-[#ead9bb] bg-[#fffaf1]/90 px-4 sm:px-7 py-5 shadow-[0_6px_20px_rgba(120,80,30,0.08)] hover:shadow-[0_10px_28px_rgba(120,80,30,0.16)] hover:border-[#d9b878] transition-all duration-300"
                  >
                    <div className="hidden sm:flex shrink-0 items-start gap-5">
                      <span className="pt-1 font-serif text-[2rem] leading-none text-[#a5692a] w-10">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="w-px self-stretch bg-gradient-to-b from-[#c9a25e] to-transparent"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-serif font-bold text-[#1f1a16] text-xl sm:text-2xl leading-snug group-hover:text-[#7b1a1f] transition-colors">
                          {language === 'en' ? item.name_en : item.name_de}
                        </h3>
                        <div className="shrink-0 text-right">
                          <div className="inline-block rounded-xl bg-[#f3dfb8] px-3 sm:px-4 py-1.5 font-sans font-bold text-[#6b3e12] text-lg sm:text-2xl leading-none">
                            €{item.price.toFixed(2)}
                          </div>
                          {volume && <div className="mt-1 font-sans text-xs text-[#8a7a68]">{volume}</div>}
                        </div>
                      </div>

                      {/* Badges */}
                      {(item.is_popular || item.is_vegetarian || item.is_vegan || !item.is_available) && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.is_popular && (
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full font-sans text-xs font-medium bg-[#f6e3c2] text-[#8a4b12]">
                              <Star className="w-3 h-3 mr-1" />
                              {language === 'en' ? 'Popular' : 'Beliebt'}
                            </span>
                          )}
                          {item.is_vegetarian && (
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full font-sans text-xs font-medium bg-green-100 text-green-800">
                              <Leaf className="w-3 h-3 mr-1" />
                              {language === 'en' ? 'Vegetarian' : 'Vegetarisch'}
                            </span>
                          )}
                          {item.is_vegan && (
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full font-sans text-xs font-medium bg-green-100 text-green-800">
                              <Cherry className="w-3 h-3 mr-1" />
                              Vegan
                            </span>
                          )}
                          {!item.is_available && (
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full font-sans text-xs font-medium bg-red-100 text-red-800">
                              {language === 'en' ? 'Unavailable' : 'Nicht verfügbar'}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Description */}
                      {itemDescription && (
                        <p className="mt-2 max-w-3xl font-sans text-[#4a4038] text-[0.95rem] sm:text-base leading-relaxed">
                          {itemDescription}
                        </p>
                      )}

                      {/* Alternate language name */}
                      <p className="mt-1.5 font-sans italic text-[#b0782f] text-sm sm:text-base">
                        {language === 'en' ? item.name_de : item.name_en}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>

            {showMiscellaneousNote && (
              <div className="mt-6 flex items-start gap-2 border-t border-[#d9bf8f] pt-4 font-sans text-sm italic text-[#6b5d50]">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#a5692a]" />
                <p>
                  {language === 'en'
                    ? 'These offers are available whilst stocks last. We reserve the right to make changes.'
                    : 'Diese Angebote gelten nur solange der Vorrat reicht. Änderungen vorbehalten.'}
                </p>
              </div>
            )}

            {/* No items message */}
            {activeCategory.items.length === 0 && (
              <div className="text-center py-12">
                <Star className="w-16 h-16 mx-auto mb-4 text-[#d9bf8f]" />
                <p className="font-sans text-[#6b5d50] text-lg">
                  {language === 'en'
                    ? 'No items available in this category.'
                    : 'Keine Artikel in dieser Kategorie verfügbar.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
