import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HomeHero from "@/components/HomeHero";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import WelcomeSection from "@/components/WelcomeSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import ConceptSection from "@/components/ConceptSection";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Efsane Gasthaus Rudolph - Traditional German cuisine since 1620. Perfect for business meetings and private celebrations with up to 300 guests.",
  alternates: {
    canonical: "https://efsane-events.de/en",
    languages: {
      de: "https://efsane-events.de",
    },
  },
};

export default function EnglishHomePage() {
  return (
    <div className="min-h-screen">
      <StructuredData type="restaurant" />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HomeHero locale="en" />

      {/* Specialties Section */}
      <SpecialtiesSection locale="en" />

      {/* Welcome Section */}
      <WelcomeSection locale="en" />

      {/* Facilities Section */}
      <FacilitiesSection locale="en" />

      {/* Concept Section */}
      <ConceptSection locale="en" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
