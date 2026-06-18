import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Users,
  Car,
  ChefHat,
  Calendar,
  Sparkles,
  Utensils,
  Trophy,
  Megaphone
} from "lucide-react";

import { IoRestaurantSharp } from "react-icons/io5";
import { BsMagic } from "react-icons/bs";
import { GiSoccerBall } from "react-icons/gi";
import { LuTvMinimalPlay } from "react-icons/lu";
import { TbDeviceRemote } from "react-icons/tb";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Efsane Gasthaus Rudolph - Traditional German cuisine since 1620. Perfect for business meetings and private celebrations with up to 300 guests.",
  alternates: {
    canonical: "https://efsane-events.de/en",
    languages: {
      de: "https://efsane-events.de",
    },
  },
};

export default function EnglishHomePage() {
  return (
    <div className="min-h-screen">
      <StructuredData type="restaurant" />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden hero_banner">
        <Image
          src="/images/main_hero.jpeg"
          alt="Efsane Gasthaus Rudolph - Historic Half-Timbered House"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>

        {/* <div className="relative z-20 text-center text-white px-4">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            Welcome to
            <br />
            <span className="text-amber-400">Efsane Gasthaus Rudolph</span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">
            Over 400 years of tradition – since 1620
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-80">
            Authentic German cuisine with homemade apple wine from our own cider
            mill
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Make a reservation
            </Link>
            <Link
              href="/menu"
              className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg transition-all duration-200"
            >
              View menu
            </Link>
          </div>
        </div> */}

        {/* Overlay Cards + Overlapping Button */}
        <div className="absolute bottom-20 left-0 right-0 z-30 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto relative text-center">
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* New Year's Eve Buffet with background image */}

              {/* <div className="relative rounded-md overflow-hidden shadow-lg border border-amber-300/60 text-[#623701]">
              <div className="absolute inset-0">
                <Image
                  src="/images/card1.png"
                  alt="New Year's Eve Buffet"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>

              <div className="relative px-4 sm:px-6 py-6 flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
                  <BsMagic className="w-5 h-5 sm:w-6 sm:h-6 text-[#623701]" />
                  <h3 className="font-serif text-lg sm:text-xl font-semibold tracking-wide">
                    NEW YEAR'S EVE BUFFET
                  </h3>
                </div>
                <p className="text-base sm:text-lg leading-relaxed opacity-95 mb-5">
                  Open festive buffet<br />
                  Traditional & elegant<br />
                  <span className="font-semibold">Dec 31 | from 5 PM</span>
                </p>
              </div>
            </div> */}

              {/* Sunday Brunch with card2.png background */}
              <div className="relative rounded-md overflow-hidden shadow-lg border border-amber-300/40 text-[#fef3c7]">
                <div className="absolute inset-0">
                  <Image
                    src="/images/card2.png"
                    alt="Sunday Brunch"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="relative px-4 sm:px-6 py-6 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
                   <Megaphone className="w-8 h-8 text-[#fef3c7]" />
                    <h3 className="font-serif text-lg sm:text-xl font-semibold tracking-wide">
                      NOW AVAILABLE
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed opacity-95 mb-5">
                    A new menu featuring traditional Hessian dishes.
                    <br />
                    Our kitchen is under new management!
                    <br />
                    {/* <span className="font-semibold">€17.50 per person</span> */}
                  </p>
                </div>
              </div>

              {/* Football Live with card2.png background */}
              <div className="relative rounded-md overflow-hidden shadow-lg border border-amber-300/40 text-[#fef3c7]">
                <div className="absolute inset-0">
                  <Image
                    src="/images/card2.png"
                    alt="Football Live"
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
                      FOOTBALL LIVE
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed opacity-95 mb-2">
                    Bundesliga & Champions League
                    <br />
                    Live on big screen
                  </p>
                  <div className="flex align-center mb-5">
                    <GiSoccerBall className="w-6 h-6 sm:w-9 sm:h-9 text-[#fef3c7] text-center  " />
                    <TbDeviceRemote className="w-6 h-6 sm:w-9 sm:h-9 text-[#fef3c7] text-center remote_tv" />
                  </div>
                </div>
              </div>

              {/* Sunday Buffets with card2.png background */}
              <div className="relative rounded-md overflow-hidden shadow-lg border border-amber-300/40 text-[#fef3c7]">
                <div className="absolute inset-0">
                  <Image
                    src="/images/card2.png"
                    alt="Sunday Buffets"
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
                      SUNDAY BUFFETS
                    </h3>
                  </div>

                  <p className="text-base sm:text-lg leading-relaxed opacity-95 mb-5">
                    On Sundays, we often offer a buffet.
                    <br />
                    Please check our promotional announcements for current
                    offerings.
                    <br />
                    Brunch Buffet, Gala Buffet, Sunday Buffet,
                    <br />
                    Hesse Buffet and more.
                  </p>
                </div>
              </div>
            </div>

            {/* Overlapping Button */}
            <div className="mt-6 flex justify-center booking_button">
              <Link
                href="/reservation"
                className="w-full sm:w-2/3 md:w-1/2 px-4 py-3 sm:px-10 sm:py-4 text-[#fef3c7] text-lg sm:text-xl font-semibold rounded-md shadow-xl border border-amber-400/60 transition-all relative overflow-hidden"
                style={{
                  backgroundImage: "url('/images/button.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                Reserve a Table
              </Link>
            </div>

            {/* Note */}
            <p className="mt-4 text-sm sm:text-base text-white/80">
              Reservation recommended · limited seats
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              Passion & Culinary Arts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              At Gasthaus Rudolph you experience authentic German cuisine paired
              with our own apple wine cellar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Homemade Specialties
              </h3>
              <p className="text-gray-600">
                Homemade apple cake, regional dishes like game or green sauce,
                always fresh from the daily menu
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Events up to 300 guests
              </h3>
              <p className="text-gray-600">
                Ideal for family celebrations, anniversaries, weddings or
                corporate events with versatile facilities
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Winter Garden & Beer Garden
              </h3>
              <p className="text-gray-600">
                Covered winter garden with retractable roof and spacious beer
                garden for every season
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
                Welcome to Gasthaus Rudolph
              </h2>

              <blockquote className="text-xl text-amber-700 font-serif italic mb-6 border-l-4 border-amber-500 pl-4">
                Taste Tradition – Just Like Grandma Used to Make.
              </blockquote>

              <p className="text-lg text-gray-700 mb-8">
                Since 1620, Gasthaus Rudolph has welcomed guests with authentic
                German hospitality and traditional Hessian cuisine, preserving a
                culinary heritage passed down through generations.
              </p>
              <blockquote className="text-xl text-amber-700 font-serif italic mb-6 border-l-4 border-amber-500 pl-4">
                "Over 400 years of tradition – since 1620."
              </blockquote>
              <p className="text-lg text-gray-700 mb-8">
                Our *Ebbler* is a fine local cider. You can expect freshly
                prepared dishes from the daily menu, served with family
                hospitality.
              </p>
              <Link
                href="/history"
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Our History
              </Link>
            </div>
            <div className="relative">
              <Image
                src="/images/inside.jpeg"
                alt="Interior of Gasthaus Rudolph"
                width={600}
                height={400}
                className="rounded-lg shadow-xl object-cover w-full h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              Facilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether birthday, anniversary, wedding, other family celebrations,
              barbecue party or corporate event – Gasthaus Rudolph offers the
              ideal setting for every celebration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/images/garden.jpeg"
                alt="Beer garden of Gasthaus Rudolph"
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Beer Garden
                </h3>
                <p className="text-gray-600">
                  Spacious beer garden for relaxing hours outdoors.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/images/inside2.jpeg"
                alt="Winter garden of Gasthaus Rudolph"
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Winter Garden
                </h3>
                <p className="text-gray-600">
                  Weather-independent winter garden with retractable roof for up
                  to 100 people
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/images/inside3.jpeg"
                alt="Event rooms of Gasthaus Rudolph"
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Event Rooms
                </h3>
                <p className="text-gray-600">
                  Versatile facilities in the historic half-timbered house for
                  special occasions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* our concept section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
            Our Concept
          </h2>

          <blockquote className="text-xl text-amber-700 font-serif italic mb-8">
            Authentic Hessian Home-Style Cooking
          </blockquote>

          <div className="max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed space-y-6">
            <p>
              Our concept is simple: we serve authentic Hessian home-style
              cooking just like in the good old days. We draw on traditional
              recipes, preserving a culinary heritage that must not be allowed
              to fade into oblivion.
            </p>

            <p>
              Freshness and regional sourcing are always our top priorities. Our
              ingredients come primarily from regional livestock farmers,
              growers, and producers throughout Hesse, ensuring freshness,
              quality, and sustainability.
            </p>

            <p>
              Only in exceptional situations, such as supply shortages caused by
              crop failures or strikes, do we use carefully selected,
              high-quality convenience products that meet the strict standards
              of our head chef.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
