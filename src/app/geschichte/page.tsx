import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HistoryPageContent from "@/components/HistoryPageContent";

export const metadata: Metadata = {
  title: "Geschichte",
  description:
    "Erfahren Sie mehr über die über 400-jährige Geschichte des Efsane Gasthaus Rudolph. Seit 1620 traditionelle deutsche Gastlichkeit.",
  alternates: {
    canonical: "https://efsane-events.de/geschichte",
    languages: {
      en: "https://efsane-events.de/history",
    },
  },
};

export default function GeschichtePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <HistoryPageContent />

      {/* Footer */}
      <Footer />
    </div>
  );
}
