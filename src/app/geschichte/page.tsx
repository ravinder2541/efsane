import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Geschichte',
  description: 'Erfahren Sie mehr über die über 400-jährige Geschichte des Efsane Gasthaus Rudolph. Seit 1620 traditionelle deutsche Gastlichkeit.',
  alternates: {
    canonical: 'https://efsane-events.de/geschichte',
    languages: {
      'en': 'https://efsane-events.de/history',
    },
  },
}

export default function GeschichtePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-gray-900 to-gray-700">
        <Image
          src="/images/outside.jpeg"
          alt="Außenansicht des historischen Gasthaus Rudolph"
          fill
          className="object-cover opacity-30"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <Link href="/" className="inline-flex items-center text-amber-300 hover:text-amber-200 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Startseite
            </Link>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Unsere Geschichte
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Über 400 Jahre Tradition – seit 1620
            </p>
          </div>
        </div>
      </section>

      {/* History Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Main Story */}
            <div className="prose prose-lg max-w-none">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
                    Das Gasthaus Rudolph – über 400 Jahre Tradition
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    Die Geschichte des Gasthauses Rudolph reicht bis in das Jahr 1620 zurück. Damals wurde das Fachwerkhaus im historischen Ortskern von Liederbach erbaut. Die Amtsrichtsmänner Hofmann lebten hier lange Jahre mit ihren Familien.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    Seit 1620 steht das Fachwerkhaus im historischen Ortskern von Niederhofheim – heute Liederbach am Taunus, im Herzen des Rhein‑Main‑Gebiets. Ursprünglich Sitz der Amtsrichte‑Familie Hofmann, hat sich das Gasthaus Rudolph über die Jahrhunderte hinweg als feste Größe der regionalen Gastlichkeit etabliert — und gilt als eines der ältesten Häuser im Ort.
                  </p>
                </div>
                <div>
                  <Image
                    src="/images/outside.jpeg"
                    alt="Historisches Fachwerkhaus - Gasthaus Rudolph"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl object-cover w-full h-96"
                  />
                </div>
              </div>

              <div className="bg-amber-50 p-8 rounded-lg mb-16">
                <blockquote className="text-2xl font-serif italic text-amber-800 text-center">
                  „Über 400 Jahre Tradition – seit 1620."
                </blockquote>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="order-2 md:order-1">
                  <Image
                    src="/images/inside4.jpeg"
                    alt="Traditioneller Gastraum im Gasthaus Rudolph"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl object-cover w-full h-96"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
                    Tradition & Moderne vereint
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    Das Gasthaus Rudolph stellt seinen Taunus-Apfelwein in der hauseigenen Kelterei her. Es erwarten Sie täglich frisch zubereitete Speisen von der Tageskarte, serviert in familiärer Gastlichkeit.
                  </p>
                  <p className="text-lg text-gray-700">
                    Ob Geburtstag, Jubiläum, Hochzeit, andere Familienfeste, Grillparty oder Firmenfest – das Gasthaus Rudolph bietet für jede Feier und jedes Event den idealen Rahmen. Zudem bietet das Gasthaus einen Partyservice.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6 text-center">
                  Unsere Räumlichkeiten heute
                </h2>
                <p className="text-lg text-gray-700 mb-6 text-center">
                  Neben dem großen Biergarten bietet das Gasthaus Rudolph zahlreiche Räumlichkeiten im Haus.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Wintergarten</h3>
                    <p className="text-gray-700">
                      Open Air-Gefühl vermittelt der großzügige wetterunabhängige Wintergarten: Das Dach lässt sich öffnen und bietet so den gemütlichen Rahmen für ein geselliges Zusammensein. Bis zu 100 Personen finden hier Platz.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Biergarten</h3>
                    <p className="text-gray-700">
                      Selbstverständlich können Sie im Sommer auch den nicht überdachten rustikalen Biergarten für Ihre Veranstaltung oder à la carte nutzen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
