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
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-primary-800 to-primary-600">
        <div className="absolute inset-0 german-pattern opacity-20"></div>
        <div className="container-max relative z-10">
          <div className="text-center text-white">
            <Link href="/en" className="inline-flex items-center text-secondary-300 hover:text-secondary-200 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Legal Notice
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Legal information and contact details
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            
            {/* Contact Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <h2 className="font-serif text-3xl font-bold text-primary-700 mb-6 text-center">
                Information according to § 5 TMG
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-xl text-primary-700 mb-4">Operator</h3>
                  <div className="space-y-3">
                    <p className="text-lg font-medium text-gray-800">
                      Efsane Gasthaus Rudolph
                    </p>
                    <p className="text-gray-600">
                      Owner: Kenan Gebes
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-xl text-primary-700 mb-4">Address</h3>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                    <div className="text-gray-700">
                      <p>Alt Niederhofheim 30</p>
                      <p>65835 Liederbach am Taunus</p>
                      <p>Germany</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="font-semibold text-xl text-primary-700 mb-4">Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-primary-600" />
                      <a href="tel:+4961962364" className="text-gray-700 hover:text-primary-600 transition-colors">
                        +49 6196 23640
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-primary-600" />
                      <a href="mailto:info@efsane-events.de" className="text-gray-700 hover:text-primary-600 transition-colors">
                        info@efsane-events.de
                      </a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-xl text-primary-700 mb-4">Opening Hours</h3>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                    <div className="text-gray-700 space-y-1">
                      <p>Monday - Sunday</p>
                      <p>By appointment</p>
                      <p className="text-sm text-gray-500">For events and celebrations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Information */}
            <div className="prose prose-lg max-w-none">
              
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
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>
                We are not willing or obliged to participate in dispute resolution procedures before a consumer 
                arbitration board.
              </p>

              <p className="text-sm text-gray-600 mt-8">
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
