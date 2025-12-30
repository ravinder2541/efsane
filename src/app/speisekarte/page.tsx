import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Euro,
  Clock,
  MapPin,
  AlertCircle
} from 'lucide-react'
import StructuredData from '@/components/StructuredData'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import MenuTabs from '@/components/MenuTabs'

export const metadata: Metadata = {
  title: 'Speisekarte',
  description: 'Entdecken Sie unsere traditionelle deutsche Speisekarte mit regionalen Spezialitäten. Authentische Küche seit 1620 im Efsane Gasthaus Rudolph.',
  alternates: {
    canonical: 'https://efsane-events.de/speisekarte',
    languages: {
      'en': 'https://efsane-events.de/menu',
    },
  },
}

// Supabase types
interface MenuItem {
  id: string;
  category_id: string;
  name_de: string;
  name_en: string;
  description_de: string | null;
  description_en: string | null;
  price: number;
  volume?: string | null;
  image_url: string | null;
  allergens: string[] | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  is_popular: boolean;
  is_available: boolean;
  sort_order: number;
  categories: {
    id: string;
    name_de: string;
    name_en: string;
    description_de?: string;
    description_en?: string;
  };
}

interface Category {
  id: string;
  name_de: string;
  name_en: string;
  description_de?: string;
  description_en?: string;
  sort_order: number;
  is_active: boolean;
}

// Data fetching function
async function getMenuData() {
  try {
    // Use direct Supabase client for server-side rendering
    const { supabase } = await import('@/lib/supabase');

    // Fetch categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (categoriesError) {
      console.error('Categories error:', categoriesError);
      // Return empty categories if database not set up yet
      return [];
    }

    // Fetch menu items with category data
    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select(`
        *,
        categories (
          id,
          name_de,
          name_en,
          description_de,
          description_en
        )
      `)
      .eq('is_available', true)
      .order('sort_order');

    if (itemsError) {
      console.error('Menu items error:', itemsError);
      return categories || [];
    }

    // Group items by category
    const categoriesWithItems = (categories || []).map((category: any) => ({
      ...category,
      items: (items || []).filter((item: any) => item.category_id === category.id)
    }));

    return categoriesWithItems;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    // Return empty data as fallback
    return [];
  }
}

// Disable static generation to ensure fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SpeisekartePage() {
  const categoriesWithItems = await getMenuData();



  return (
    <div className="min-h-screen">
        <StructuredData type="menu" />
        <StructuredData 
          type="breadcrumb" 
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Speisekarte', url: '/speisekarte' }
          ]} 
        />      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/menu_hero.jpg"
          alt="Traditionelle deutsche Küche - Speisekarte"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
        <div className="relative z-20 text-center text-white px-4">
          <Link href="/" className="inline-flex items-center text-amber-300 hover:text-amber-200 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Unsere <span className="text-amber-400">Speisekarte</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Entdecken Sie unsere vollständige Auswahl an traditionellen deutschen Spezialitäten
          </p>
        </div>
      </section>

      {/* Menu Tabs Section */}
      <section className="section-padding">
        <div className="container-max">
          {categoriesWithItems.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-bold text-gray-600 mb-2">
                Speisekarte wird geladen...
              </h2>
              <p className="text-gray-500">
                Bitte haben Sie einen Moment Geduld.
              </p>
            </div>
          ) : (
            <MenuTabs categories={categoriesWithItems} />
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-neutral-50">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h2 className="font-serif text-4xl font-bold text-primary-700 mb-6">
              Reservieren Sie noch heute
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Erleben Sie unsere traditionelle deutsche Küche in gemütlicher Atmosphäre. 
              Perfekt für Geschäftstermine, private Feiern und besondere Anlässe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/reservierung" className="btn-primary text-lg px-8 py-4 hover-glow">
                Tisch reservieren
              </Link>
              <Link href="/kontakt" className="btn-outline text-lg px-8 py-4 hover-lift">
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Features */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-glow">
                <Euro className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-primary-700 mb-2">
                Faire Preise
              </h3>
              <p className="text-gray-600">
                Authentische deutsche Küche zu fairen Preisen für jeden Anlass.
              </p>
            </div>
            
            <div className="p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-glow">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-primary-700 mb-2">
                Täglich frisch
              </h3>
              <p className="text-gray-600">
                Alle Gerichte werden täglich frisch mit regionalen Zutaten zubereitet.
              </p>
            </div>
            
            <div className="p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-glow">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-primary-700 mb-2">
                Zentrale Lage
              </h3>
              <p className="text-gray-600">
                Gut erreichbar mit über 70 Parkplätzen direkt vor dem Restaurant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}