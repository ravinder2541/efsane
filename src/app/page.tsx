import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import StructuredData from '@/components/StructuredData'
import FAQSchema from '@/components/FAQSchema'
import ReviewSchema from '@/components/ReviewSchema'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import {
  Users,
  Car,
  ChefHat,
  Calendar, 
  Sparkles, 
  Utensils, 
  Trophy,
} from 'lucide-react'


import { IoRestaurantSharp } from "react-icons/io5";
import { BsMagic } from "react-icons/bs";
import { GiSoccerBall } from "react-icons/gi";
import { LuTvMinimalPlay } from "react-icons/lu";
import { TbDeviceRemote } from "react-icons/tb";


export const metadata: Metadata = {
  title: 'Efsane Gasthaus Rudolph - Traditionelles deutsches Restaurant & Event Location Liederbach | Rhein-Main',
  description: 'Traditionelles deutsches Restaurant & Event Location im Rhein-Main-Gebiet seit 1620. Perfekt für Hochzeiten, Firmenfeiern, Geburtstage & Events bis 300 Gäste. Hausgemachter Apfelwein, deutsche Küche & historisches Ambiente in Liederbach am Taunus.',
  keywords: 'traditionelles deutsches Restaurant, Event Location Rhein-Main, Hochzeitslocation, Firmenfeiern, Geburtstagsfeiern, deutsche Küche, Apfelwein, Gasthaus, Liederbach am Taunus, Frankfurt Umgebung, Eventlocation, Familienfeiern, Oktoberfest, historisches Restaurant',
  alternates: {
    canonical: 'https://efsane-events.de',
    languages: {
      'en': 'https://efsane-events.de/en',
    },
  },
  openGraph: {
    title: 'Efsane Gasthaus Rudolph - Traditionelles deutsches Restaurant & Event Location',
    description: 'Traditionelles deutsches Restaurant & Event Location im Rhein-Main-Gebiet seit 1620. Perfekt für Events bis 300 Gäste.',
    url: 'https://efsane-events.de',
    siteName: 'Efsane Gasthaus Rudolph',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Efsane Gasthaus Rudolph - Traditionelles deutsches Restaurant & Event Location',
    description: 'Traditionelles deutsches Restaurant & Event Location im Rhein-Main-Gebiet seit 1620.',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' }
        ]} 
      />
      <FAQSchema />
      <ReviewSchema />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden hero_banner">
        <Image
          src="/images/main_hero.jpeg"
          alt="Efsane Gasthaus Rudolph - Historisches Fachwerkhaus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
        {/* <div className="relative z-20 text-center text-white px-4">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            Willkommen im<br />
            <span className="text-amber-400">
              Efsane Gasthaus Rudolph
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">
            Über 400 Jahre Tradition – seit 1620
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-80">
            Authentische deutsche Küche mit hausgemachtem Apfelwein aus eigener Kelterei
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservierung" className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
              Jetzt reservieren
            </Link>
            <Link href="/speisekarte" className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg transition-all duration-200">
              Speisekarte ansehen
            </Link>
          </div>
        </div> */}
        {/* Info Cards */}


        {/* Overlay Cards + Overlapping Button */}
       <div className="absolute bottom-20 left-0 right-0 z-30 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto relative text-center">

            {/* Cards */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
             */}
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">

              {/* Silvester with background image */}
              {/* <div className="relative rounded-md overflow-hidden shadow-lg border border-amber-300/40 text-[#3a2a16]"> */}
              
              {/* <div className="relative rounded-md overflow-hidden shadow-lg border border-amber-300/60 text-[#623701]">
                <div className="absolute inset-0">
                  <Image
                    src="/images/card1.png"
                    alt="Silvester Buffet"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>

                
                <div className="relative px-4 sm:px-6 py-6 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
                    <BsMagic className="w-5 h-5 sm:w-6 sm:h-6  text-[#623701]" />
                    <h3 className="font-serif text-lg sm:text-xl font-semibold tracking-wide">
                      SILVESTERBUFFET
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed opacity-95 mb-5">
                    Offenes festliches Buffet<br />
                    Traditionell & edel<br />
                    <span className="font-semibold">31.12. | ab 17 Uhr</span>
                  </p>
                </div>
              </div> */}

              {/* Brunch with card2.png background */}
              <div className="relative rounded-md overflow-hidden shadow-lg border border-amber-300/40 text-[#fef3c7]">
                <div className="absolute inset-0">
                  <Image
                    src="/images/card2.png"
                    alt="Sonntagsbrunch"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="relative px-4 sm:px-6 py-6 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
                    <IoRestaurantSharp className="w-5 h-5 sm:w-6 sm:h-6 text-[#fef3c7]" />
                    <h3 className="font-serif text-lg sm:text-xl font-semibold tracking-wide">
                      SONNTAGSBRUNCH
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed opacity-95 mb-5">
                    Jeden Sonntag<br />
                    Großer Brunch von 10–15 Uhr<br />
                    <span className="font-semibold">17,50 € p. P.</span>
                  </p>
                </div>
              </div>

              {/* Football with card2.png background */}
              <div className="relative rounded-md overflow-hidden shadow-lg border border-amber-300/40 text-[#fef3c7]">
                <div className="absolute inset-0">
                  <Image
                    src="/images/card2.png"
                    alt="Fußball Live"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="relative px-4 sm:px-6 py-6 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
                    <LuTvMinimalPlay className="w-5 h-5 sm:w-6 sm:h-6 text-[#fef3c7]" />
                    <h3 className="font-serif text-lg sm:text-xl font-semibold tracking-wide">
                      FUßBALL LIVE
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed opacity-95 mb-2">
                    Bundesliga & Champions League<br />
                    Live auf großer Leinwand <br />
                  </p>
                  <div className="flex align-center mb-5">
                      <GiSoccerBall className="w-6 h-6 sm:w-9 sm:h-9 text-[#fef3c7] text-center " />
                      <TbDeviceRemote className="w-6 h-6 sm:w-9 sm:h-9 text-[#fef3c7] text-center remote_tv" />
                  </div>
                </div>
              </div>

            </div>

            {/* Overlapping Button */}
            <div className="mt-6 flex justify-center booking_button">
              <Link
                href="/reservierung"
                className="w-full sm:w-2/3 md:w-1/2 px-4 py-3 sm:px-10 sm:py-4 text-[#fef3c7] text-lg sm:text-xl font-semibold rounded-md shadow-xl border border-amber-400/60 transition-all relative overflow-hidden "
                style={{
                  backgroundImage: "url('/images/button.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                Jetzt Tisch reservieren
              </Link>
            </div>


            {/* Note */}
            <p className="mt-4 text-sm sm:text-base text-white/80">
              Reservierung empfohlen · begrenzte Plätze
            </p>

          </div>
        </div>


        
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              Leidenschaft & Kulinarik
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Im Gasthaus Rudolph erleben Sie authentische deutsche Küche gepaart mit einer eigenen Apfelwein‑Kelterei
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hausgemachte Spezialitäten</h3>
              <p className="text-gray-600">
                Hausgemachter Apfelkuchen, regionale Speisen wie Wildgerichte oder Grüne Soße, stets frisch von der Tageskarte
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Events bis 300 Gäste</h3>
              <p className="text-gray-600">
                Ideal für Familienfeiern, Jubiläen, Hochzeiten oder Firmen‑Events mit vielseitigen Räumlichkeiten
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Wintergarten & Biergarten</h3>
              <p className="text-gray-600">
                Überdachter Wintergarten mit öffnungsfähigem Dach sowie großzügiger Biergarten für jede Jahreszeit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
                Unser Gasthaus – Geschichte & Tradition
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Seit 1620 steht das Fachwerkhaus im historischen Ortskern von Niederhofheim – heute Liederbach am Taunus, im Herzen des Rhein‑Main‑Gebiets. Ursprünglich Sitz der Amtsrichte‑Familie Hofmann, hat sich das Gasthaus Rudolph über die Jahrhunderte hinweg als feste Größe der regionalen Gastlichkeit etabliert — und gilt als eines der ältesten Häuser im Ort.
              </p>
              <blockquote className="text-xl text-amber-700 font-serif italic mb-6 border-l-4 border-amber-500 pl-4">
                „Über 400 Jahre Tradition – seit 1620."
              </blockquote>
              <p className="text-lg text-gray-700 mb-8">
                Das Gasthaus Rudolph stellt seinen Taunus-Apfelwein in der hauseigenen Kelterei her. Es erwarten Sie täglich frisch zubereitete Speisen von der Tageskarte, serviert in familiärer Gastlichkeit.
              </p>
              <Link href="/geschichte" className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors duration-200">
                Unsere Geschichte
              </Link>
            </div>
            <div className="relative">
              <Image
                src="/images/inside.jpeg"
                alt="Innenbereich des Gasthaus Rudolph"
                width={600}
                height={400}
                className="rounded-lg shadow-xl object-cover w-full h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Räumlichkeiten Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              Räumlichkeiten
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ob Geburtstag, Jubiläum, Hochzeit, andere Familienfeste, Grillparty oder Firmenfest – das Gasthaus Rudolph bietet für jede Feier den idealen Rahmen
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/images/garden.jpeg"
                alt="Biergarten des Gasthaus Rudolph"
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Biergarten</h3>
                <p className="text-gray-600">
                  Großzügiger Biergarten mit traditionellen Außenbereichen für entspannte Stunden im Freien
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/images/inside2.jpeg"
                alt="Wintergarten des Gasthaus Rudolph"
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Wintergarten</h3>
                <p className="text-gray-600">
                  Wetterunabhängiger Wintergarten mit öffnungsfähigem Dach für bis zu 100 Personen
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/images/inside3.jpeg"
                alt="Innenräume des Gasthaus Rudolph"
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Eventräume</h3>
                <p className="text-gray-600">
                  Vielseitige Räumlichkeiten im historischen Fachwerkhaus für besondere Anlässe
                </p>
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