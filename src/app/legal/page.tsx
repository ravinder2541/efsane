import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft, MapPin, Phone, Mail, Clock } from 'lucide-react'

export const metadata = {
  title: 'Legal Notice',
  description: 'Legal Notice of Efsane Gasthaus Rudolph - Legal information and contact details.',
}

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#f8f1e6]">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-[#3a2010] via-[#2a1608] to-[#1a0d05] border-b-2 border-[#c9a25e]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,94,0.18),transparent_65%)]"></div>
        <div className="container-max relative z-10">
          <div className="text-center text-[#f3e6cf]">
            <Link href="/en" className="inline-flex items-center px-5 py-1.5 rounded-full border border-[#c9a25e]/70 text-[#e6c27a] hover:text-[#f6dca0] hover:bg-white/5 mb-6 transition-colors font-garamond text-lg no-underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-[#f6dca0] to-[#c9a25e] bg-clip-text text-transparent leading-tight">
              Legal Notice
            </h1>
            <p className="font-garamond text-xl md:text-2xl text-[#f3e6cf]/90 max-w-3xl mx-auto">
              Legal information and contact details
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
                Information according to § 5 TMG
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif font-semibold text-xl text-[#7b1a1f] mb-4">Operator</h3>
                  <div className="space-y-3">
                    <p className="text-lg font-medium text-[#2b1a10]">
                      Efsane Gasthaus Rudolph
                    </p>
                    <p className="text-[#5a4c40]">
                      Owner: Kenan Gebes
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-serif font-semibold text-xl text-[#7b1a1f] mb-4">Address</h3>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#a5692a] mt-1 flex-shrink-0" />
                    <div className="text-[#3a332d]">
                      <p>Alt Niederhofheim 30</p>
                      <p>65835 Liederbach am Taunus</p>
                      <p>Germany</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="font-serif font-semibold text-xl text-[#7b1a1f] mb-4">Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-[#a5692a]" />
                      <a href="tel:+4961962364" className="text-[#3a332d] hover:text-[#7b1a1f] transition-colors">
                        +49 6196 23640
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-[#a5692a]" />
                      <a href="mailto:info@efsane-events.de" className="text-[#3a332d] hover:text-[#7b1a1f] transition-colors">
                        info@efsane-events.de
                      </a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-serif font-semibold text-xl text-[#7b1a1f] mb-4">Opening Hours</h3>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-[#a5692a] mt-1 flex-shrink-0" />
                    <div className="text-[#3a332d] space-y-1">
                      <p>Monday - Sunday</p>
                      <p>By appointment</p>
                      <p className="text-sm text-[#8a7a68]">For events and celebrations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Information */}
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#2b1a10] prose-h2:text-[#7b1a1f] prose-p:text-[#3a332d] prose-li:text-[#3a332d] prose-strong:text-[#2b1a10] prose-a:text-[#7b1a1f] prose-li:marker:text-[#b08a45]">
              
              <h2>Legal Information</h2>
              
              <h3>VAT ID</h3>
              <p>
                VAT identification number according to § 27 a VAT Tax Act:<br />
                DE454474303
              </p>

              <h3>Supervisory Authority</h3>
              <p>
                Responsible supervisory authority:<br />
                Ordnungsamt Liederbach am Taunus<br />
                Frankfurter Straße 37<br />
                65835 Liederbach am Taunus<br />
                Germany
              </p>

              <h3>Professional Title and Professional Regulations</h3>
              <p>
                Professional title: Restaurant Business<br />
                Responsible chamber: Chamber of Commerce and Industry Frankfurt am Main<br />
                Awarded in: Germany
              </p>

              <h2>Liability for Content</h2>
              <p>
                As a service provider, we are responsible for our own content on these pages according to § 7 para. 1 TMG 
                under general laws. According to §§ 8 to 10 TMG, however, we as a service provider are not under the 
                obligation to monitor transmitted or stored third-party information or to investigate circumstances that 
                indicate illegal activity.
              </p>

              <h2>Liability for Links</h2>
              <p>
                Our offer contains links to external third-party websites over whose content we have no influence. 
                Therefore, we cannot assume any liability for this external content. The respective provider or operator 
                of the pages is always responsible for the content of the linked pages.
              </p>

              <h2>Copyright</h2>
              <p>
                The content and works created by the site operators on these pages are subject to German copyright law. 
                Duplication, processing, distribution and any kind of exploitation outside the limits of copyright law 
                require the written consent of the respective author or creator.
              </p>

              <h2>Dispute Resolution</h2>
              <p>
                The European Commission provides a platform for online dispute resolution (ODR): 
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-[#7b1a1f] hover:text-[#5a1014] underline-offset-2 hover:underline">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>
                We are not willing or obliged to participate in dispute resolution procedures before a consumer 
                arbitration board.
              </p>

              <p className="text-sm text-[#6b5d50] mt-8">
                Last updated: {new Date().toLocaleDateString('en-US')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
