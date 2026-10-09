import { Metadata } from "next";
import Link from "next/link";
import { Euro, Clock, MapPin, AlertCircle } from "lucide-react";
import StructuredData from "@/components/StructuredData";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MenuTabs from "@/components/MenuTabs";

export const metadata: Metadata = {
  title: "Speisekarte",
  description:
    "Entdecken Sie unsere traditionelle deutsche Speisekarte mit regionalen Spezialitäten. Authentische Küche seit 1620 im Efsane Gasthaus Rudolph.",
  alternates: {
    canonical: "https://efsane-events.de/speisekarte",
    languages: {
      en: "https://efsane-events.de/menu",
    },
  },
};

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
    const { supabase } = await import("@/lib/supabase");

    // Fetch categories
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (categoriesError) {
      console.error("Categories error:", categoriesError);
      // Return empty categories if database not set up yet
      return [];
    }

    // Fetch menu items with category data
    const { data: items, error: itemsError } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        categories (
          id,
          name_de,
          name_en,
          description_de,
          description_en
        )
      `,
      )
      .eq("is_available", true)
      .order("sort_order");

    if (itemsError) {
      console.error("Menu items error:", itemsError);
      return categories || [];
    }

    // Group items by category
    const categoriesWithItems = (categories || []).map((category: any) => ({
      ...category,
      items: (items || []).filter(
        (item: any) => item.category_id === category.id,
      ),
    }));

    return categoriesWithItems;
  } catch (error) {
    console.error("Error fetching menu data:", error);
    // Return empty data as fallback
    return [];
  }
}

// Disable static generation to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SpeisekartePage() {
  const categoriesWithItems = await getMenuData();

  return (
    <div className="min-h-screen">
      <StructuredData type="menu" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Speisekarte", url: "/speisekarte" },
        ]}
      />{" "}
      {/* Navigation */}
      <Navigation />
      {/* Menu */}
      {categoriesWithItems.length === 0 ? (
        <section className="bg-[#f8f0e2] pt-32 pb-16 px-5 text-center">
          <AlertCircle className="w-16 h-16 text-[#c9a25e] mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-[#3b2416] mb-2">
            Speisekarte wird geladen...
          </h2>
          <p className="text-[#6b5d50]">
            Bitte haben Sie einen Moment Geduld.
          </p>
        </section>
      ) : (
        <MenuTabs
          categories={categoriesWithItems}
          intro={{
            eyebrow: "Unsere",
            title: "Speisekarte",
            subtitle:
              "Entdecken Sie unsere vollständige Auswahl an traditionellen deutschen Spezialitäten",
            back: { href: "/", label: "Zurück zur Startseite" },
          }}
        />
      )}
      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-b from-[#7b1a1f] to-[#5a1014] text-[#fbf3e4]">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h2 className="font-serif text-4xl font-bold text-[#f6dca0] mb-6">
              Reservieren Sie noch heute
            </h2>
            <p className="font-garamond text-xl text-[#fbf3e4]/90 mb-8">
              Erleben Sie unsere traditionelle deutsche Küche in gemütlicher
              Atmosphäre. Perfekt für Geschäftstermine, private Feiern und
              besondere Anlässe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/reservierung"
                className="font-garamond font-bold text-xl px-8 py-3.5 rounded-xl bg-gradient-to-b from-[#f6dca0] to-[#d9b06c] text-[#2b1a10] shadow-lg hover:brightness-105 transition no-underline"
              >
                Tisch reservieren
              </Link>
              <Link
                href="/kontakt"
                className="font-garamond font-bold text-xl px-8 py-3.5 rounded-xl border-2 border-[#e6c27a] text-[#f6dca0] hover:bg-white/10 transition no-underline"
              >
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Restaurant Features */}
      <section className="section-padding bg-[#f8f0e2]">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div
              className="p-6 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-16 h-16 rounded-full border-2 border-[#c9a25e] bg-[#fbf3e3] flex items-center justify-center mx-auto mb-4">
                <Euro className="w-8 h-8 text-[#7b1a1f]" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#2b1a10] mb-2">
                Faire Preise
              </h3>
              <p className="font-garamond text-lg text-[#4a4038]">
                Authentische deutsche Küche zu fairen Preisen für jeden Anlass.
              </p>
            </div>

            <div
              className="p-6 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-16 h-16 rounded-full border-2 border-[#c9a25e] bg-[#fbf3e3] flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-[#7b1a1f]" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#2b1a10] mb-2">
                Täglich frisch
              </h3>
              <p className="font-garamond text-lg text-[#4a4038]">
                Alle Gerichte werden täglich frisch mit regionalen Zutaten
                zubereitet.
              </p>
            </div>

            <div
              className="p-6 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-16 h-16 rounded-full border-2 border-[#c9a25e] bg-[#fbf3e3] flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-[#7b1a1f]" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#2b1a10] mb-2">
                Zentrale Lage
              </h3>
              <p className="font-garamond text-lg text-[#4a4038]">
                Gut erreichbar mit über 70 Parkplätzen direkt vor dem
                Restaurant.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}
