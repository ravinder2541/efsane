import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HistoryPageContent from "@/components/HistoryPageContent";

export const metadata: Metadata = {
  title: "History",
  description:
    "Learn more about the over 400-year history of Efsane Gasthaus Rudolph. Traditional German hospitality since 1620.",
  alternates: {
    canonical: "https://efsane-events.de/history",
    languages: {
      de: "https://efsane-events.de/geschichte",
    },
  },
};

export default function HistoryPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <HistoryPageContent locale="en" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
