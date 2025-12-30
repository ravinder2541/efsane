import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy of Efsane Gasthaus Rudolph - Information about how we handle your data.',
}

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Information about how we handle your data
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto prose prose-lg">
            
            <h2>1. Privacy at a Glance</h2>
            
            <h3>General Information</h3>
            <p>
              The following information provides a simple overview of what happens to your personal data when you 
              visit this website. Personal data is any data that can be used to personally identify you.
            </p>

            <h3>Data Collection on this Website</h3>
            <p>
              <strong>Who is responsible for data collection on this website?</strong><br />
              Data processing on this website is carried out by the website operator. You can find their contact 
              details in the "Information about the Responsible Party" section of this privacy policy.
            </p>

            <h2>2. Hosting</h2>
            <p>
              This website is hosted externally. The personal data collected on this website is stored on the 
              servers of the hosting provider. This may include IP addresses, contact requests, meta and 
              communication data, contract data, contact details, names, website access data and other data 
              generated via a website.
            </p>

            <h2>3. General Information and Mandatory Information</h2>
            
            <h3>Data Protection</h3>
            <p>
              The operators of this website take the protection of your personal data very seriously. We treat 
              your personal data confidentially and in accordance with statutory data protection regulations and 
              this privacy policy.
            </p>

            <h3>Information about the Responsible Party</h3>
            <p>
              The responsible party for data processing on this website is:
            </p>
            <p>
              <strong>Efsane Gasthaus Rudolph</strong><br />
              Alt Niederhofheim 30<br />
              65835 Liederbach am Taunus<br />
              Germany
            </p>
            <p>
              Phone: +49 6196 23640<br />
              Email: info@efsane-events.de
            </p>

            <h2>4. Data Collection on this Website</h2>
            
            <h3>Cookies</h3>
            <p>
              Our website uses so-called "cookies". Cookies are small data packets and do not cause any damage 
              to your device. They are stored either temporarily for the duration of a session (session cookies) 
              or permanently (permanent cookies) on your device.
            </p>
            
            <p>
              You can configure your browser to inform you about the setting of cookies and only allow cookies 
              in individual cases, exclude the acceptance of cookies for certain cases or in general, and activate 
              the automatic deletion of cookies when closing the browser.
            </p>

            <h3>Contact Form</h3>
            <p>
              If you send us inquiries via the contact form, your details from the inquiry form, including the 
              contact data you provide there, will be stored by us for the purpose of processing the inquiry and 
              in case of follow-up questions.
            </p>

            <h3>Reservation Requests</h3>
            <p>
              For reservation requests via our online form, we collect the following data:
            </p>
            <ul>
              <li>Name and contact details</li>
              <li>Desired date and time</li>
              <li>Number of guests</li>
              <li>Type of event</li>
              <li>Special requests</li>
            </ul>
            <p>
              This data is used exclusively to process your reservation request and is deleted after the event 
              or after an appropriate period of time.
            </p>

            <h2>5. Your Rights</h2>
            <p>
              You have the right at any time to:
            </p>
            <ul>
              <li>receive information free of charge about the origin, recipient and purpose of your stored personal data</li>
              <li>request correction or deletion of this data</li>
              <li>request a restriction of data processing</li>
              <li>object to data processing</li>
              <li>receive your data in a structured, common and machine-readable format (data portability)</li>
            </ul>

            <h2>6. Contact</h2>
            <p>
              If you have any questions about data protection, you can contact us at any time:
            </p>
            <p>
              <strong>Efsane Gasthaus Rudolph</strong><br />
              Email: info@efsane-events.de<br />
              Phone: +49 6196 23640
            </p>

            <p className="text-sm text-gray-600 mt-8">
              Last updated: {new Date().toLocaleDateString('en-US')}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
