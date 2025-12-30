import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import MenuTabs from '@/components/MenuTabs'

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Discover our traditional German menu with regional specialties. Authentic cuisine since 1620 at Efsane Gasthaus Rudolph.',
  alternates: {
    canonical: 'https://efsane-events.de/menu',
    languages: {
      'de': 'https://efsane-events.de/speisekarte',
    },
  },
}

async function getMenuData() {
  try {
    const { supabase } = await import('@/lib/supabase');
    
    const categoryOrder = [
      'Food', 'Vegetarian Dishes', 'Weekly Menu',
      'Beer', 'White Wine', 'Red Wine', 'Rosé Wine', 'Apple Wine', 'Spritz Variations', 'Spirits',
      'Hot Beverages', 'Juices', 'Non-Alcoholic Beverages'
    ];
    
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true);

    if (categoriesError) {
      throw new Error(`Failed to fetch categories: ${categoriesError.message}`);
    }

    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select(`
        *,
        categories (
          id,
          name_de,
          name_en
        )
      `)
      .eq('is_available', true)
      .order('name_en');

    if (itemsError) {
      throw new Error(`Failed to fetch menu items: ${itemsError.message}`);
    }

    const categoriesWithItems = categories.map((category: any) => ({
      ...category,
      items: items.filter((item: any) => item.category_id === category.id)
    }));

    const filteredCategories = categoriesWithItems.filter((cat: any) => cat.items.length > 0);
    
    return filteredCategories.sort((a: any, b: any) => {
      const aIndex = categoryOrder.indexOf(a.name_en);
      const bIndex = categoryOrder.indexOf(b.name_en);
      
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      
      return aIndex - bIndex;
    });
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return [];
  }
}

// Disable static generation to ensure fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MenuPage() {
  const categories = await getMenuData();

  return (
    <div className="min-h-screen bg-gray-50">
      <StructuredData type="menu" />
      <Navigation />

      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/menu_hero.jpg"
          alt="Traditional German cuisine - Menu"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
        <div className="relative z-20 text-center text-white px-4">
          <Link href="/en" className="inline-flex items-center text-amber-300 hover:text-amber-200 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Our <span className="text-amber-400">Menu</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Traditional German cuisine with authentic regional specialties
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-bold text-gray-600 mb-2">
                Loading menu...
              </h2>
              <p className="text-gray-500">
                Please wait a moment.
              </p>
            </div>
          ) : (
            <MenuTabs categories={categories} language="en" />
          )}

          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-8 mt-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Experience Our Cuisine?
            </h2>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Reserve your table today and enjoy traditional German specialties in our cozy atmosphere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/reservation" 
                className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Reserve a Table
              </Link>
              <Link 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}