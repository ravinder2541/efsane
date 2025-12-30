'use client'

import { usePathname } from 'next/navigation'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs?: FAQItem[]
}

export default function FAQSchema({ faqs }: FAQSchemaProps) {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith('/en') || pathname === '/contact' || pathname === '/reservation' || pathname === '/menu' || pathname === '/history'
  
  // Default FAQs if none provided
  const defaultFAQs: FAQItem[] = isEnglish ? [
    {
      question: "Do you accept reservations?",
      answer: "Yes, we accept reservations for both dining and events. You can book online through our reservation page or call us at +49 (0) 123 456789. We recommend booking in advance, especially for weekends and special events."
    },
    {
      question: "What is your capacity for events?",
      answer: "We can accommodate up to 300 guests for events. Our historic venue offers multiple spaces that can be configured for weddings, corporate events, birthday parties, and private celebrations."
    },
    {
      question: "Do you offer vegetarian and vegan options?",
      answer: "Yes, we offer vegetarian options and can accommodate vegan dietary requirements with advance notice. Our traditional German menu includes several plant-based dishes and we're happy to customize meals for dietary restrictions."
    },
    {
      question: "Is parking available?",
      answer: "Yes, we provide 70+ free parking spaces for our guests. Our large parking area makes it convenient for both restaurant visits and larger events."
    },
    {
      question: "How long has the restaurant been operating?",
      answer: "Efsane Gasthaus Rudolph has been serving guests since 1620, making us a historic establishment with over 400 years of traditional German hospitality."
    },
    {
      question: "Do you cater events outside the restaurant?",
      answer: "While our primary focus is hosting events at our historic venue, we can discuss catering options for special circumstances. Please contact us to discuss your specific needs."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, credit cards, debit cards, and bank transfers. For large events, we typically require a deposit with final payment arranged according to your preference."
    },
    {
      question: "Is the venue wheelchair accessible?",
      answer: "Yes, our venue is wheelchair accessible. We've made accommodations to ensure all guests can enjoy our restaurant and event spaces comfortably."
    }
  ] : [
    {
      question: "Nehmen Sie Reservierungen an?",
      answer: "Ja, wir nehmen Reservierungen sowohl für das Restaurant als auch für Veranstaltungen an. Sie können online über unsere Reservierungsseite buchen oder uns unter +49 (0) 123 456789 anrufen. Wir empfehlen eine rechtzeitige Buchung, besonders für Wochenenden und besondere Anlässe."
    },
    {
      question: "Wie viele Gäste können Sie bei Veranstaltungen aufnehmen?",
      answer: "Wir können bis zu 300 Gäste für Veranstaltungen empfangen. Unser historisches Gasthaus bietet mehrere Räume, die für Hochzeiten, Firmenfeiern, Geburtstagsfeiern und private Feiern konfiguriert werden können."
    },
    {
      question: "Bieten Sie vegetarische und vegane Optionen an?",
      answer: "Ja, wir bieten vegetarische Optionen an und können vegane Ernährungsanforderungen mit Vorankündigung berücksichtigen. Unsere traditionelle deutsche Speisekarte umfasst mehrere pflanzliche Gerichte und wir passen gerne Mahlzeiten an Ernährungseinschränkungen an."
    },
    {
      question: "Gibt es Parkplätze?",
      answer: "Ja, wir bieten 70+ kostenlose Parkplätze für unsere Gäste. Unser großer Parkplatz macht es sowohl für Restaurantbesuche als auch für größere Veranstaltungen bequem."
    },
    {
      question: "Wie lange gibt es das Restaurant schon?",
      answer: "Das Efsane Gasthaus Rudolph bedient Gäste seit 1620 und ist damit ein historisches Etablissement mit über 400 Jahren traditioneller deutscher Gastlichkeit."
    },
    {
      question: "Beliefern Sie Veranstaltungen außerhalb des Restaurants?",
      answer: "Obwohl unser Hauptfokus darauf liegt, Veranstaltungen in unserem historischen Gasthaus auszurichten, können wir Catering-Optionen für besondere Umstände besprechen. Bitte kontaktieren Sie uns, um Ihre spezifischen Bedürfnisse zu besprechen."
    },
    {
      question: "Welche Zahlungsmethoden akzeptieren Sie?",
      answer: "Wir akzeptieren Bargeld, Kreditkarten, Debitkarten und Banküberweisungen. Für große Veranstaltungen benötigen wir normalerweise eine Anzahlung, wobei die Schlusszahlung nach Ihren Wünschen arrangiert wird."
    },
    {
      question: "Ist das Gasthaus rollstuhlgerecht?",
      answer: "Ja, unser Gasthaus ist rollstuhlgerecht. Wir haben Vorkehrungen getroffen, um sicherzustellen, dass alle Gäste unser Restaurant und unsere Veranstaltungsräume bequem genießen können."
    }
  ]

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (faqs || defaultFAQs).map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData, null, 2)
      }}
    />
  )
}