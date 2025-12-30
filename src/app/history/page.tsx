import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'History',
  description: 'Learn more about the over 400-year history of Efsane Gasthaus Rudolph. Traditional German hospitality since 1620.',
  alternates: {
    canonical: 'https://efsane-events.de/history',
    languages: {
      'de': 'https://efsane-events.de/geschichte',
    },
  },
}

export default function HistoryPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-gray-900 to-gray-700">
        <Image
          src="/images/outside.jpeg"
          alt="Exterior view of historic Gasthaus Rudolph"
          fill
          className="object-cover opacity-30"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <Link href="/en" className="inline-flex items-center text-amber-300 hover:text-amber-200 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Our History
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Over 400 years of tradition – since 1620
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
                    Gasthaus Rudolph – over 400 years of tradition
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    The history of Gasthaus Rudolph dates back to 1620. At that time, the half-timbered house was built in the historic center of Liederbach. The magistrate officials Hofmann lived here for many years with their families.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    Since 1620, the half-timbered house has stood in the historic center of Niederhofheim – now Liederbach am Taunus, in the heart of the Rhine-Main region. Originally the seat of the magistrate Hofmann family, Gasthaus Rudolph has established itself over the centuries as a mainstay of regional hospitality — and is considered one of the oldest houses in the village.
                  </p>
                </div>
                <div>
                  <Image
                    src="/images/outside.jpeg"
                    alt="Historic half-timbered house - Gasthaus Rudolph"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl object-cover w-full h-96"
                  />
                </div>
              </div>

              <div className="bg-amber-50 p-8 rounded-lg mb-16">
                <blockquote className="text-2xl font-serif italic text-amber-800 text-center">
                  "Over 400 years of tradition – since 1620."
                </blockquote>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="order-2 md:order-1">
                  <Image
                    src="/images/inside4.jpeg"
                    alt="Traditional dining room at Gasthaus Rudolph"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl object-cover w-full h-96"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
                    Tradition & Modernity United
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    Gasthaus Rudolph produces its Taunus apple wine in its own cider mill. Fresh daily dishes from the daily menu await you, served with familial hospitality.
                  </p>
                  <p className="text-lg text-gray-700">
                    Whether birthday, anniversary, wedding, other family celebrations, barbecue party or corporate event – Gasthaus Rudolph offers the ideal setting for every celebration and event. The restaurant also offers catering services.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6 text-center">
                  Our facilities today
                </h2>
                <p className="text-lg text-gray-700 mb-6 text-center">
                  In addition to the large beer garden, Gasthaus Rudolph offers numerous rooms in the house.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Winter Garden</h3>
                    <p className="text-gray-700">
                      The spacious weather-independent winter garden conveys an open-air feeling: The roof can be opened and thus provides a cozy setting for a social gathering. Up to 100 people can find space here.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Beer Garden</h3>
                    <p className="text-gray-700">
                      Of course, in summer you can also use the uncovered rustic beer garden for your event or à la carte dining.
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
