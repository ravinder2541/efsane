import { Metadata } from 'next'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
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
    <div className="min-h-screen">
      <StructuredData type="menu" />
      <Navigation />

      {categories.length === 0 ? (
        <section className="bg-[#f8f0e2] pt-32 pb-16 px-5 text-center">
          <AlertCircle className="w-16 h-16 text-[#c9a25e] mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-[#3b2416] mb-2">
            Loading menu...
          </h2>
          <p className="text-[#6b5d50]">
            Please wait a moment.
          </p>
        </section>
      ) : (
        <MenuTabs
          categories={categories}
          language="en"
          intro={{
            eyebrow: 'Our',
            title: 'Menu',
            subtitle: 'Traditional German cuisine with authentic regional specialties',
            back: { href: '/en', label: 'Back to home' },
          }}
        />
      )}

      <section className="section-padding bg-gradient-to-b from-[#7b1a1f] to-[#5a1014] text-[#fbf3e4] text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#f6dca0] mb-4">
          Ready to Experience Our Cuisine?
        </h2>
        <p className="font-garamond text-xl text-[#fbf3e4]/90 mb-8 max-w-2xl mx-auto">
          Reserve your table today and enjoy traditional German specialties in our cozy atmosphere.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/reservation"
            className="font-garamond font-bold text-xl px-8 py-3.5 rounded-xl bg-gradient-to-b from-[#f6dca0] to-[#d9b06c] text-[#2b1a10] shadow-lg hover:brightness-105 transition no-underline"
          >
            Reserve a Table
          </Link>
          <Link
            href="/contact"
            className="font-garamond font-bold text-xl px-8 py-3.5 rounded-xl border-2 border-[#e6c27a] text-[#f6dca0] hover:bg-white/10 transition no-underline"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}