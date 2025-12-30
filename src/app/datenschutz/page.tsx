import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung von Efsane Gasthaus Rudolph - Informationen zum Umgang mit Ihren Daten.',
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-primary-800 to-primary-600">
        <div className="absolute inset-0 german-pattern opacity-20"></div>
        <div className="container-max relative z-10">
          <div className="text-center text-white">
            <Link href="/" className="inline-flex items-center text-secondary-300 hover:text-secondary-200 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Startseite
            </Link>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Datenschutzerklärung
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Informationen zum Umgang mit Ihren Daten
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto prose prose-lg">
            
            <h2>1. Datenschutz auf einen Blick</h2>
            
            <h3>Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
              passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie 
              persönlich identifiziert werden können.
            </p>

            <h3>Datenerfassung auf dieser Website</h3>
            <p>
              <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
              können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen.
            </p>

            <h2>2. Hosting</h2>
            <p>
              Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, 
              werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, 
              Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe 
              und sonstige Daten, die über eine Website generiert werden, handeln.
            </p>

            <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
            
            <h3>Datenschutz</h3>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln 
              Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzbestimmungen 
              sowie dieser Datenschutzerklärung.
            </p>

            <h3>Hinweis zur verantwortlichen Stelle</h3>
            <p>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p>
              <strong>Efsane Gasthaus Rudolph</strong><br />
              Alt Niederhofheim 30<br />
              65835 Liederbach am Taunus<br />
              Deutschland
            </p>
            <p>
              Telefon: 06196 23640<br />
              E-Mail: info@efsane-events.de
            </p>

            <h2>4. Datenerfassung auf dieser Website</h2>
            
            <h3>Cookies</h3>
            <p>
              Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Datenpakete und richten 
              auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung 
              (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
            </p>
            
            <p>
              Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und 
              Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell 
              ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren.
            </p>

            <h3>Kontaktformular</h3>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular 
              inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall 
              von Anschlussfragen bei uns gespeichert.
            </p>

            <h3>Reservierungsanfragen</h3>
            <p>
              Bei Reservierungsanfragen über unser Online-Formular erheben wir folgende Daten:
            </p>
            <ul>
              <li>Name und Kontaktdaten</li>
              <li>Gewünschtes Datum und Uhrzeit</li>
              <li>Anzahl der Gäste</li>
              <li>Art der Veranstaltung</li>
              <li>Besondere Wünsche</li>
            </ul>
            <p>
              Diese Daten werden ausschließlich zur Bearbeitung Ihrer Reservierungsanfrage verwendet und nach 
              Abschluss der Veranstaltung bzw. nach angemessener Zeit gelöscht.
            </p>

            <h2>5. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht:
            </p>
            <ul>
              <li>unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten</li>
              <li>Berichtigung oder Löschung dieser Daten zu verlangen</li>
              <li>eine Einschränkung der Datenverarbeitung zu verlangen</li>
              <li>der Datenverarbeitung zu widersprechen</li>
              <li>Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten (Datenportabilität)</li>
            </ul>

            <h2>6. Kontakt</h2>
            <p>
              Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden:
            </p>
            <p>
              <strong>Efsane Gasthaus Rudolph</strong><br />
              E-Mail: info@efsane-events.de<br />
              Telefon: 06196 23640
            </p>

            <p className="text-sm text-gray-600 mt-8">
              Stand: {new Date().toLocaleDateString('de-DE')}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
