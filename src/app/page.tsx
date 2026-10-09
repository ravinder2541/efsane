import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import FAQSchema from "@/components/FAQSchema";
import ReviewSchema from "@/components/ReviewSchema";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HomeHero from "@/components/HomeHero";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import WelcomeSection from "@/components/WelcomeSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import ConceptSection from "@/components/ConceptSection";

export const metadata: Metadata = {
  title:
    "Efsane Gasthaus Rudolph - Traditionelles deutsches Restaurant & Event Location Liederbach | Rhein-Main",
  description:
    "Traditionelles deutsches Restaurant & Event Location im Rhein-Main-Gebiet seit 1620. Perfekt für Hochzeiten, Firmenfeiern, Geburtstage & Events bis 300 Gäste. Hausgemachter Apfelwein, deutsche Küche & historisches Ambiente in Liederbach am Taunus.",
  keywords:
    "traditionelles deutsches Restaurant, Event Location Rhein-Main, Hochzeitslocation, Firmenfeiern, Geburtstagsfeiern, deutsche Küche, Apfelwein, Gasthaus, Liederbach am Taunus, Frankfurt Umgebung, Eventlocation, Familienfeiern, Oktoberfest, historisches Restaurant",
  alternates: {
    canonical: "https://efsane-events.de",
    languages: {
      en: "https://efsane-events.de/en",
    },
  },
  openGraph: {
    title:
      "Efsane Gasthaus Rudolph - Traditionelles deutsches Restaurant & Event Location",
    description:
      "Traditionelles deutsches Restaurant & Event Location im Rhein-Main-Gebiet seit 1620. Perfekt für Events bis 300 Gäste.",
    url: "https://efsane-events.de",
    siteName: "Efsane Gasthaus Rudolph",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Efsane Gasthaus Rudolph - Traditionelles deutsches Restaurant & Event Location",
    description:
      "Traditionelles deutsches Restaurant & Event Location im Rhein-Main-Gebiet seit 1620.",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <StructuredData type="restaurant" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[{ name: "Home", url: "/" }]}
      />
      <FAQSchema />
      <ReviewSchema />

      {/* Navigation */}
      <Navigation />

      {/* Tradition Hero Section */}
      <HomeHero />

      {/* Specialties Section */}
      <SpecialtiesSection />

      {/* Welcome Section */}
      <WelcomeSection />

      {/* Facilities Section */}
      <FacilitiesSection />

      {/* Concept Section */}
      <ConceptSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
