import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft, MapPin, Phone, Mail, Clock } from 'lucide-react'

export const metadata = {
  title: 'Impressum',
  description: 'Impressum von Efsane Gasthaus Rudolph - Rechtliche Informationen und Kontaktdaten.',
}

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[#f8f1e6]">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-[#3a2010] via-[#2a1608] to-[#1a0d05] border-b-2 border-[#c9a25e]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,94,0.18),transparent_65%)]"></div>
        <div className="container-max relative z-10">
          <div className="text-center text-[#f3e6cf]">
            <Link
              href="/"
              className="inline-flex items-center px-5 py-1.5 rounded-full border border-[#c9a25e]/70 text-[#e6c27a] hover:text-[#f6dca0] hover:bg-white/5 mb-6 transition-colors font-garamond text-lg no-underline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Startseite
            </Link>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-[#f6dca0] to-[#c9a25e] bg-clip-text text-transparent leading-tight">
              Impressum
            </h1>
            <p className="font-garamond text-xl md:text-2xl text-[#f3e6cf]/90 max-w-3xl mx-auto">
              Rechtliche Informationen und Kontaktdaten
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-[#f8f1e6] text-[#3a332d]">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            {/* Contact Information Card */}
            <div className="bg-[#fffaf1] rounded-2xl shadow-[0_10px_30px_rgba(120,80,30,0.12)] p-6 md:p-8 mb-8 border border-[#e3cfa6]">
              <h2 className="font-serif text-3xl font-bold text-[#2b1a10] mb-6 text-center">
                Angaben gemäß § 5 TMG
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif font-semibold text-xl text-[#7b1a1f] mb-4">
                    Betreiber
                  </h3>
                  <div className="space-y-3">
                    <p className="text-lg font-medium text-[#2b1a10]">
                      Efsane Gasthaus Rudolph
                    </p>
                    <p className="text-[#5a4c40]">Inhaber: Kenan Gebes</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-xl text-[#7b1a1f] mb-4">
                    Adresse
                  </h3>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#a5692a] mt-1 flex-shrink-0" />
                    <div className="text-[#3a332d]">
                      <p>Alt Niederhofheim 30</p>
                      <p>65835 Liederbach am Taunus</p>
                      <p>Deutschland</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="font-serif font-semibold text-xl text-[#7b1a1f] mb-4">
                    Kontakt
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-[#a5692a]" />
                      <a
                        href="tel:+4961962364"
                        className="text-[#3a332d] hover:text-[#7b1a1f] transition-colors"
                      >
                        06196 23640
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-[#a5692a]" />
                      <a
                        href="mailto:info@efsane-events.de"
                        className="text-[#3a332d] hover:text-[#7b1a1f] transition-colors"
                      >
                        info@efsane-events.de
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-xl text-[#7b1a1f] mb-4">
                    Öffnungszeiten
                  </h3>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-[#a5692a] mt-1 flex-shrink-0" />
                    <div className="text-[#3a332d] space-y-1">
                      <p>Montag - Sonntag</p>
                      <p>Nach Vereinbarung</p>
                      <p className="text-sm text-[#8a7a68]">
                        Für Events und Veranstaltungen
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Information */}
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#2b1a10] prose-h2:text-[#7b1a1f] prose-p:text-[#3a332d] prose-li:text-[#3a332d] prose-strong:text-[#2b1a10] prose-a:text-[#7b1a1f] prose-li:marker:text-[#b08a45]">
              <h2>Rechtliche Hinweise</h2>

              <h3>Umsatzsteuer-ID</h3>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a
                Umsatzsteuergesetz:
                <br />
                DE454474303
              </p>

              <h3>Aufsichtsbehörde</h3>
              <p>
                Zuständige Aufsichtsbehörde:
                <br />
                Ordnungsamt Liederbach am Taunus
                <br />
                Frankfurter Straße 37
                <br />
                65835 Liederbach am Taunus
              </p>

              <h3>Berufsbezeichnung und berufsrechtliche Regelungen</h3>
              <p>
                Berufsbezeichnung: Gastronomiebetrieb
                <br />
                Zuständige Kammer: Industrie- und Handelskammer Frankfurt am
                Main
                <br />
                Verliehen in: Deutschland
              </p>

              <h2>Haftung für Inhalte</h2>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht unter der Verpflichtung,
                übermittelte oder gespeicherte fremde Informationen zu
                überwachen oder nach Umständen zu forschen, die auf eine
                rechtswidrige Tätigkeit hinweisen.
              </p>

              <h2>Haftung für Links</h2>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf
                deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
                diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                oder Betreiber der Seiten verantwortlich.
              </p>

              <h2>Urheberrecht</h2>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>

              <h2>Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7b1a1f] hover:text-[#5a1014] underline-offset-2 hover:underline"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>

              <p className="text-sm text-[#6b5d50] mt-8">
                Stand: {new Date().toLocaleDateString("de-DE")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
