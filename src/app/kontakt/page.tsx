import StructuredData from "@/components/StructuredData";
import FAQSchema from "@/components/FAQSchema";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactPageContent from "@/components/ContactPageContent";

export default function KontaktPage() {
  return (
    <div className="min-h-screen">
      <StructuredData type="contact" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Kontakt", url: "/kontakt" },
        ]}
      />
      <FAQSchema />

      {/* Navigation */}
      <Navigation />

      <ContactPageContent />

      {/* Footer */}
      <Footer />
    </div>
  );
}
