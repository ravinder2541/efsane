import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ChefHat,
  CalendarDays,
  Sandwich,
  MessagesSquare,
  Award,
  Flower2,
  Beer,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// All texts below are the page's existing content, unchanged — only the layout is new.
const content = {
  de: {
    back: { href: '/', label: 'Zurück zur Startseite' },
    title: ['Unsere', 'Geschichte'],
    subtitle: 'Über 400 Jahre Tradition – seit 1620',
    heroAlt: 'Außenansicht des historischen Gasthaus Rudolph',
    story: {
      title: 'Das Gasthaus Rudolph – über 400 Jahre Tradition',
      paragraphs: [
        'Die Geschichte des Gasthauses Rudolph reicht bis in das Jahr 1620 zurück. Damals wurde das Fachwerkhaus im historischen Ortskern von Liederbach erbaut. Die Amtsrichtsmänner Hofmann lebten hier lange Jahre mit ihren Familien.',
        'Seit 1620 steht das Fachwerkhaus im historischen Ortskern von Niederhofheim – heute Liederbach am Taunus, im Herzen des Rhein‑Main‑Gebiets. Ursprünglich Sitz der Amtsrichte‑Familie Hofmann, hat sich das Gasthaus Rudolph über die Jahrhunderte hinweg als feste Größe der regionalen Gastlichkeit etabliert — und gilt als eines der ältesten Häuser im Ort.',
      ],
      imageAlt: 'Historisches Fachwerkhaus - Gasthaus Rudolph',
    },
    quote: '„Über 400 Jahre Tradition – seit 1620."',
    modern: {
      title: 'Tradition & Moderne vereint',
      paragraphs: [
        'Unser Ebbler ist en gude Schoppe aus der Region. Es erwarten Sie täglich frisch zubereitete Speisen von der Tageskarte, serviert in familiärer Gastlichkeit.',
        'Ob Geburtstag, Jubiläum, Hochzeit, andere Familienfeste, Grillparty oder Firmenfest – das Gasthaus Rudolph bietet für jede Feier und jedes Event den idealen Rahmen. Zudem bietet das Gasthaus einen Partyservice.',
      ],
    },
    expect: {
      title: 'Was Sie bei uns erwartet:',
      items: [
        'Klassische hessische Spezialitäten. Täglich wechselnde Tagesangebote.',
        'Hausgemachter Sonntagsbraten. Individuelle Buffets und Menüs für Hochzeiten, Jubiläen, Feiern für Privat und Gewerbe u.v.m.',
        'Ebenso kleine Speisen und Fingerfood, wie belegte Brötchen, Canapés oder Suppen – z. B. für Trauerfeiern, Büropartys oder Geschäftseröffnungen.',
        'Für zielorientierte und Budgetgerechte Beratungen steht Ihnen unser Küchenchef gerne zur Verfügung.',
        'Unser Küchenchef bringt über 40 Jahre Erfahrung mit und sorgt gemeinsam mit unserem freundlichen Servicepersonal dafür, dass Ihr Besuch bei uns kulinarisch unvergesslich wird.',
      ],
    },
    rooms: {
      title: 'Unsere Räumlichkeiten heute',
      intro: 'Neben dem großen Biergarten bietet das Gasthaus Rudolph zahlreiche Räumlichkeiten im Haus.',
      items: [
        {
          title: 'Wintergarten',
          text: 'Open Air-Gefühl vermittelt der großzügige wetterunabhängige Wintergarten: Das Dach lässt sich öffnen und bietet so den gemütlichen Rahmen für ein geselliges Zusammensein. Bis zu 100 Personen finden hier Platz.',
        },
        {
          title: 'Biergarten',
          text: 'Selbstverständlich können Sie im Sommer auch den nicht überdachten rustikalen Biergarten für Ihre Veranstaltung oder à la carte nutzen.',
        },
      ],
    },
  },
  en: {
    back: { href: '/en', label: 'Back to home' },
    title: ['Our', 'History'],
    subtitle: 'Over 400 years of tradition – since 1620',
    heroAlt: 'Exterior view of historic Gasthaus Rudolph',
    story: {
      title: 'Gasthaus Rudolph – over 400 years of tradition',
      paragraphs: [
        'The history of Gasthaus Rudolph dates back to 1620. At that time, the half-timbered house was built in the historic center of Liederbach. The magistrate officials Hofmann lived here for many years with their families.',
        'Since 1620, the half-timbered house has stood in the historic center of Niederhofheim – now Liederbach am Taunus, in the heart of the Rhine-Main region. Originally the seat of the magistrate Hofmann family, Gasthaus Rudolph has established itself over the centuries as a mainstay of regional hospitality — and is considered one of the oldest houses in the village.',
      ],
      imageAlt: 'Historic half-timbered house - Gasthaus Rudolph',
    },
    quote: '"Over 400 years of tradition – since 1620."',
    modern: {
      title: 'Tradition & Modernity United',
      paragraphs: [
        'Our *Ebbler* is a fine local cider. Fresh daily dishes from the daily menu await you, served with familial hospitality.',
        'Whether birthday, anniversary, wedding, other family celebrations, barbecue party or corporate event – Gasthaus Rudolph offers the ideal setting for every celebration and event. The restaurant also offers catering services.',
      ],
    },
    expect: {
      title: 'What You Can Expect From Us',
      items: [
        'Traditional Hessian specialities, daily changing specials and homemade Sunday roast.',
        'Bespoke buffets and set menus for weddings, anniversaries, private celebrations, corporate events and much more.',
        'We also offer light bites and finger food such as open sandwiches, canapés and soups.',
        'Our head chef is happy to provide tailored advice to suit your needs and budget.',
        'With over 40 years of experience, our head chef and friendly service team ensure a memorable culinary experience.',
      ],
    },
    rooms: {
      title: 'Our facilities today',
      intro: 'In addition to the large beer garden, Gasthaus Rudolph offers numerous rooms in the house.',
      items: [
        {
          title: 'Winter Garden',
          text: 'The spacious weather-independent winter garden conveys an open-air feeling: The roof can be opened and thus provides a cozy setting for a social gathering. Up to 100 people can find space here.',
        },
        {
          title: 'Beer Garden',
          text: 'Of course, in summer you can also use the uncovered rustic beer garden for your event or à la carte dining.',
        },
      ],
    },
  },
}

const expectIcons: LucideIcon[] = [ChefHat, CalendarDays, Sandwich, MessagesSquare, Award]
const roomIcons: LucideIcon[] = [Flower2, Beer]

function Flourish({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 12" className={className} aria-hidden="true">
      <line x1="0" y1="6" x2="88" y2="6" stroke="currentColor" strokeWidth="1" />
      <line x1="132" y1="6" x2="220" y2="6" stroke="currentColor" strokeWidth="1" />
      <path d="M110 1 L115 6 L110 11 L105 6 Z" fill="currentColor" />
      <path d="M90 6 C95 1, 101 1, 104 5 M130 6 C125 1, 119 1, 116 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

/** Heading with the second half in gold, split on the first " – " / " & " so it reads like the design */
function SplitHeading({ text, className = '' }: { text: string; className?: string }) {
  const m = text.match(/^(.*?)(\s[–&]\s)(.*)$/)
  return (
    <h2 className={`font-serif font-bold text-[#1f1a16] leading-[1.1] ${className}`}>
      {m ? (
        <>
          {m[1]}
          {m[2]}
          <span className="text-[#a5692a]">{m[3]}</span>
        </>
      ) : (
        text
      )}
    </h2>
  )
}

function Accent() {
  return <span className="block w-10 h-[3px] rounded-full bg-[#c9a25e]" aria-hidden="true" />
}

export default function HistoryPageContent({ locale = 'de' }: { locale?: 'de' | 'en' }) {
  const t = content[locale]

  return (
    <div className="bg-[#f8f1e6] text-[#3a332d] [font-variant-numeric:lining-nums]">
      {/* ---------- Hero ---------- */}
      {/* herohistory.png already holds the cream left side, the house and the gold wave — shown whole at its own ratio */}
      <section className="relative overflow-hidden bg-[#fbf3e6] aspect-[1024/1536] max-h-[min(1000px,150vw)] w-full lg:max-h-none lg:mt-24 lg:aspect-[1890/806]">
        {/* Portrait artwork for phones/tablets: cream sky on top for the text, house at the bottom */}
        <Image src="/mobille/historyhero-mobile.png" alt={t.heroAlt} fill priority sizes="100vw" className="object-cover object-bottom lg:hidden" />
        <Image src="/herohistory.png" alt={t.heroAlt} fill priority sizes="100vw" className="hidden lg:block object-cover object-right-top" />

        <div className="relative z-10 h-full px-6 sm:px-10 lg:pl-[7.5vw] lg:pr-0 pt-28 sm:pt-32 lg:pt-[2vw] lg:pb-[5vw] flex flex-col justify-start lg:justify-center">
          <div className="lg:w-[45vw]">
            <Link
              href={t.back.href}
              className="inline-flex items-center gap-2 text-[#a5692a] hover:text-[#7b1a1f] text-sm lg:text-[max(0.85rem,0.9vw)] font-medium transition-colors no-underline"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.back.label}
            </Link>
            <h1 className="mt-5 lg:mt-[1.6vw] font-serif font-bold leading-[0.95] text-[3.4rem] sm:text-7xl lg:text-[min(5.6vw,8.5svh)]">
              <span className="block text-[#1f1a16]">{t.title[0]}</span>
              <span className="block bg-gradient-to-b from-[#b07a35] to-[#8a5520] bg-clip-text text-transparent pb-[0.1em]">{t.title[1]}</span>
            </h1>
            <Flourish className="mt-2 w-56 lg:w-[15vw] h-auto text-[#b08a45]" />
            <p className="mt-4 lg:mt-[1.4vw] max-w-md text-lg sm:text-xl lg:text-[max(1.05rem,1.35vw)] text-[#3a332d]">{t.subtitle}</p>
          </div>
        </div>
      </section>

      {/* ---------- Story + "Since 1620" ---------- */}
      {/* Starts in the hero artwork's bottom colour so there is no visible seam */}
      <section className="relative bg-gradient-to-b from-[#f8f5f0] to-[#f8f1e6] lg:-mt-px">
        <div className="grid lg:grid-cols-[1fr_min(41vw,620px)] items-center">
          <div className="px-6 sm:px-10 lg:pl-[7.5vw] lg:pr-12 pt-10 pb-6 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a5692a]">Gasthaus Rudolph</p>
            <div className="mt-3"><Accent /></div>
            <SplitHeading text={t.story.title} className="mt-5 text-[2rem] sm:text-4xl lg:text-5xl" />
            <div className="mt-6 space-y-5 text-lg leading-relaxed max-w-2xl">
              {t.story.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="relative">
            <Image
              src="/1620right.png"
              alt={t.story.imageAlt}
              width={348}
              height={423}
              sizes="(min-width: 1024px) 41vw, 100vw"
              className="w-full h-auto max-w-sm mx-auto lg:max-w-none"
            />
            {/* Soften the left edge into the page background */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#f8f1e6] to-transparent hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* ---------- Tradition & modernity + quote ---------- */}
      <section className="bg-gradient-to-b from-[#f1e3cf] to-[#f6ead9]">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-0 px-6 sm:px-10 lg:px-[7.5vw] py-12 lg:py-20">
          <div className="lg:pr-14 lg:border-r lg:border-[#c9a25e]/60">
            <Accent />
            <SplitHeading text={t.modern.title} className="mt-5 text-[2rem] sm:text-4xl lg:text-5xl" />
            <div className="mt-6 space-y-5 text-lg leading-relaxed max-w-2xl">
              {t.modern.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center lg:pl-14 pt-6 lg:pt-0 border-t border-[#c9a25e]/50 lg:border-t-0">
            <Flourish className="w-48 h-auto text-[#b08a45]" />
            <blockquote className="my-5 max-w-sm font-serif italic text-[1.75rem] sm:text-3xl lg:text-4xl leading-snug text-[#a5692a]">
              {t.quote}
            </blockquote>
            <Flourish className="w-48 h-auto text-[#b08a45]" />
          </div>
        </div>
      </section>

      {/* ---------- What to expect ---------- */}
      <section className="px-6 sm:px-10 lg:px-[5vw] py-12 lg:py-20">
        <div className="text-center">
          <h2 className="font-serif font-bold text-[#1f1a16] text-[2rem] sm:text-4xl lg:text-5xl">{t.expect.title}</h2>
          <Flourish className="mx-auto mt-3 w-56 h-auto text-[#b08a45]" />
        </div>
        <ul className="mt-8 lg:mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {t.expect.items.map((text, i) => {
            const Icon = expectIcons[i]
            return (
              <li
                key={text.slice(0, 24)}
                className="flex flex-row sm:flex-col items-start sm:items-center gap-4 sm:gap-0 text-left sm:text-center rounded-2xl border border-[#ead9bb] bg-[#fffaf1] px-5 py-5 sm:py-7 shadow-[0_8px_24px_rgba(120,80,30,0.08)]"
              >
                <span className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#c08a45] to-[#9a6526] text-[#fbf3e4] flex items-center justify-center shadow-[0_4px_10px_rgba(120,70,20,0.3)]">
                  <Icon className="w-6 h-6" strokeWidth={1.8} />
                </span>
                <p className="sm:mt-5 text-base leading-relaxed text-[#4a4038]">{text}</p>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ---------- Rooms today ---------- */}
      <section className="bg-gradient-to-b from-[#f1e3cf] to-[#f6ead9] px-6 sm:px-10 lg:px-[7.5vw] py-12 lg:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif font-bold text-[#1f1a16] text-[2rem] sm:text-4xl lg:text-5xl">{t.rooms.title}</h2>
          <Flourish className="mx-auto mt-3 w-56 h-auto text-[#b08a45]" />
          <p className="mt-5 text-lg leading-relaxed">{t.rooms.intro}</p>
        </div>
        <div className="mt-8 lg:mt-10 grid gap-5 lg:gap-6 lg:grid-cols-2">
          {t.rooms.items.map((room, i) => {
            const Icon = roomIcons[i]
            return (
              <div key={room.title} className="flex gap-4 sm:gap-5 rounded-2xl border border-[#ead9bb] bg-[#fffaf1] p-5 sm:p-6 lg:p-8 shadow-[0_8px_24px_rgba(120,80,30,0.08)]">
                <span className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#c9a25e] bg-[#fbf3e3] text-[#a5692a] flex items-center justify-center">
                  <Icon className="w-6 h-6" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#1f1a16]">{room.title}</h3>
                  <p className="mt-2 text-lg leading-relaxed">{room.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
