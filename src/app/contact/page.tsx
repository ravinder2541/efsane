import StructuredData from "@/components/StructuredData";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactPageContent from "@/components/ContactPageContent";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <StructuredData type="contact" />

      {/* Navigation */}
      <Navigation />

      <ContactPageContent locale="en" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
