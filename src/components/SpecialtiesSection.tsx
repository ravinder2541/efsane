import Image from 'next/image'
import { Utensils, CakeSlice, Users, Beer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Card = { image: string; icon: LucideIcon; title: string[]; text: string }

const content: Record<'de' | 'en', {
  eyebrow: string
  title: string
  script: string
  intro: string
  cards: Card[]
}> = {
  de: {
    eyebrow: 'UNSERE BESONDERHEITEN',
    title: 'Tradition, Genuss',
    script: 'Gastfreundschaft',
    intro:
      'Im Gasthaus Rudolph vereinen sich authentische deutsche Küche, herzliche Gastfreundschaft und ein einzigartiges Ambiente.',
    cards: [
      {
        image: '/passionculinarycard.png',
        icon: Utensils,
        title: ['Leidenschaft &', 'Kulinarik'],
        text: 'Im Gasthaus Rudolph erleben Sie authentische deutsche Küche gepaart mit einer eigenen Apfelwein‑Kelterei.',
      },
      {
        image: '/homemadesepcialist.png',
        icon: CakeSlice,
        title: ['Hausgemachte', 'Spezialitäten'],
        text: 'Hausgemachter Apfelkuchen, regionale Speisen wie Wildgerichte oder Grüne Soße, stets frisch von der Tageskarte.',
      },
      {
        image: '/event.png',
        icon: Users,
        title: ['Events bis', '300 Gäste'],
        text: 'Ideal für Familienfeiern, Jubiläen, Hochzeiten oder Firmen‑Events mit vielseitigen Räumlichkeiten.',
      },
      {
        image: '/wintergarden.png',
        icon: Beer,
        title: ['Wintergarten', '& Biergarten'],
        text: 'Überdachter Wintergarten mit öffnungsfähigem Dach sowie großzügiger Biergarten für jede Jahreszeit.',
      },
    ],
  },
  en: {
    eyebrow: 'OUR SPECIALTIES',
    title: 'Tradition, Taste',
    script: 'Hospitality',
    intro:
      'At Gasthaus Rudolph, authentic German cuisine, warm hospitality and a unique ambience come together.',
    cards: [
      {
        image: '/passionculinarycard.png',
        icon: Utensils,
        title: ['Passion &', 'Culinary Arts'],
        text: 'At Gasthaus Rudolph you experience authentic German cuisine paired with our own apple wine cellar.',
      },
      {
        image: '/homemadesepcialist.png',
        icon: CakeSlice,
        title: ['Homemade', 'Specialties'],
        text: 'Homemade apple cake, regional dishes like game or green sauce, always fresh from the daily menu.',
      },
      {
        image: '/event.png',
        icon: Users,
        title: ['Events up to', '300 guests'],
        text: 'Ideal for family celebrations, anniversaries, weddings or corporate events with versatile facilities.',
      },
      {
        image: '/wintergarden.png',
        icon: Beer,
        title: ['Winter Garden', '& Beer Garden'],
        text: 'Covered winter garden with retractable roof and spacious beer garden for every season.',
      },
    ],
  },
}

// Torn paper edge where the cream hero above meets this dark section
function TornEdge() {
  return (
    <svg
      viewBox="0 0 1600 60"
      preserveAspectRatio="none"
      className="absolute top-0 left-0 w-full h-8 hero:h-[calc(var(--u)*4.5)] z-10 drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]"
      aria-hidden="true"
    >
      <path
        fill="#f6eedf"
        d="M0 0 H1600 V30 L1570 36 L1540 28 L1505 40 L1470 31 L1430 42 L1395 33 L1360 38 L1320 27 L1285 39 L1245 30 L1210 44 L1170 34 L1130 41 L1095 29 L1055 37 L1015 31 L980 45 L940 35 L900 40 L860 28 L825 38 L785 32 L745 43 L705 33 L670 39 L630 27 L590 36 L555 30 L515 42 L475 34 L440 40 L400 29 L360 38 L325 31 L285 44 L245 35 L210 39 L170 28 L130 37 L95 32 L55 41 L20 33 L0 37 Z"
      />
    </svg>
  )
}

function LineOrnament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 16" className={className} aria-hidden="true">
      <line x1="0" y1="8" x2="122" y2="8" stroke="currentColor" strokeWidth="1" />
      <line x1="178" y1="8" x2="300" y2="8" stroke="currentColor" strokeWidth="1" />
      <path
        d="M122 8 C130 2, 138 2, 141 7 C143 11, 138 13, 135 10 M178 8 C170 2, 162 2, 159 7 C157 11, 162 13, 165 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M150 3 L154 8 L150 13 L146 8 Z" fill="currentColor" />
    </svg>
  )
}

function NumberOrnament({ n }: { n: number }) {
  return (
    <div className="flex items-center justify-center gap-2 hero:gap-[calc(var(--u)*0.8)] text-[#b8904f]">
      <svg viewBox="0 0 80 10" className="w-14 hero:w-[calc(var(--u)*5)] h-auto" aria-hidden="true">
        <line x1="0" y1="5" x2="66" y2="5" stroke="currentColor" strokeWidth="1" />
        <path d="M66 1.5 L74 5 L66 8.5 L68.5 5 Z" fill="currentColor" />
      </svg>
      <span className="font-garamond font-semibold text-sm hero:text-[length:calc(var(--u)*1.05)] tracking-wider">
        {String(n).padStart(2, '0')}
      </span>
      <svg viewBox="0 0 80 10" className="w-14 hero:w-[calc(var(--u)*5)] h-auto rotate-180" aria-hidden="true">
        <line x1="0" y1="5" x2="66" y2="5" stroke="currentColor" strokeWidth="1" />
        <path d="M66 1.5 L74 5 L66 8.5 L68.5 5 Z" fill="currentColor" />
      </svg>
    </div>
  )
}

function SpecialtyCard({ card, index }: { card: Card; index: number }) {
  const Icon = card.icon
  return (
    <article className="relative shrink-0 snap-center w-[78vw] max-w-[340px] hero:w-auto hero:max-w-none flex flex-col">
      {/* Small crest on top of the arch */}
      <svg viewBox="0 0 24 14" className="absolute left-1/2 -translate-x-1/2 -top-2 w-6 hero:w-[calc(var(--u)*1.6)] h-auto text-[#c9a25e] z-20" aria-hidden="true">
        <path d="M12 0 L15 6 L24 7 L15 8 L12 14 L9 8 L0 7 L9 6 Z" fill="currentColor" />
      </svg>

      <div className="flex-1 flex flex-col rounded-t-[50%_16%] rounded-b-md border border-[#9c7a45]/80 bg-gradient-to-b from-[#24170f]/95 to-[#1a100a]/95 shadow-[0_18px_40px_rgba(0,0,0,0.55)] p-1.5 hero:p-[calc(var(--u)*0.45)]">
        {/* Arched photo */}
        <div className="relative shrink-0 h-[22svh] hero:h-[46%] rounded-t-[50%_18%] overflow-hidden border border-[#c9a25e]/70">
          <Image
            src={card.image}
            alt={card.title.join(' ')}
            fill
            sizes="(min-width: 1024px) 25vw, 80vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Icon medallion overlapping the photo */}
        <div className="relative z-10 shrink-0 -mt-7 hero:-mt-[calc(var(--u)*2.4)] mx-auto w-14 h-14 hero:w-[calc(var(--u)*4.6)] hero:h-[calc(var(--u)*4.6)] rounded-full bg-gradient-to-b from-[#6e1a1c] to-[#4a0f12] border-2 border-[#c9a25e] shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
          <Icon className="w-[45%] h-[45%] text-[#f3e6cf]" strokeWidth={1.8} />
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col items-center text-center px-3 pt-2 pb-3 hero:px-[calc(var(--u)*1.4)] hero:pt-[calc(var(--u)*0.8)] hero:pb-[calc(var(--u)*1.1)]">
          <h3 className="font-garamond font-semibold text-[#f3e6cf] text-[length:min(6.5vw,3.1svh)] hero:text-[length:calc(var(--u)*1.85)] leading-[1.1]">
            {card.title[0]}
            <br />
            {card.title[1]}
          </h3>
          <LineOrnament className="mt-2 hero:mt-[calc(var(--u)*0.6)] w-36 hero:w-[calc(var(--u)*13)] h-auto text-[#b8904f]" />
          <p className="mt-2 hero:mt-[calc(var(--u)*0.7)] font-garamond font-medium text-[#eadbc0]/90 text-[length:min(4.2vw,2.1svh)] hero:text-[length:calc(var(--u)*1.12)] leading-[1.35]">
            {card.text}
          </p>
          <div className="mt-auto pt-2 hero:pt-[calc(var(--u)*0.8)]">
            <NumberOrnament n={index + 1} />
          </div>
        </div>
      </div>
    </article>
  )
}

export default function SpecialtiesSection({ locale = 'de' }: { locale?: 'de' | 'en' }) {
  const t = content[locale]

  return (
    <section
      className="relative overflow-hidden bg-[#1c120c] [font-variant-numeric:lining-nums] hero:h-[var(--h)] flex flex-col"
      // Same layout unit as the hero: scales with width, capped by the viewport height
      style={{ '--h': 'max(min(82svh,52vw),540px)', '--u': 'min(1vw, calc(var(--h) * 0.0175))' } as React.CSSProperties}
    >
      <Image src="/passionsectionbg.png" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/15"></div>
      <TornEdge />

      <div className="relative z-10 flex-1 flex flex-col justify-center gap-[3svh] pt-14 pb-6 hero:pt-[calc(var(--u)*6.5)] hero:pb-[calc(var(--u)*3)] hero:gap-[calc(var(--u)*2.2)]">
        {/* Heading */}
        <div className="px-5 text-center">
          <p className="flex items-center justify-center gap-3 hero:gap-[calc(var(--u)*1.2)] font-cinzel font-semibold text-[#c9a25e] tracking-[0.3em] text-[11px] sm:text-xs hero:text-[length:calc(var(--u)*1.05)]">
            <span className="block w-6 hero:w-[calc(var(--u)*2.4)] h-px bg-current"></span>
            {t.eyebrow}
            <span className="block w-6 hero:w-[calc(var(--u)*2.4)] h-px bg-current"></span>
          </p>
          <h2 className="mt-2 hero:mt-[calc(var(--u)*0.6)] font-garamond font-bold text-[#f6ead3] text-[length:min(8.5vw,4.4svh)] hero:text-[length:calc(var(--u)*3.6)] leading-[1.1]">
            {t.title} <span className="font-normal italic text-[#c9a25e]">&amp;</span>{' '}
            <span className="font-script font-normal text-[#d4ab68] text-[1.12em] whitespace-nowrap">{t.script}</span>
          </h2>
          <p className="mt-2 hero:mt-[calc(var(--u)*0.8)] mx-auto max-w-xl hero:max-w-[calc(var(--u)*40)] font-garamond font-medium text-[#eadbc0] text-[length:min(4.3vw,2.2svh)] hero:text-[length:calc(var(--u)*1.3)] leading-[1.35]">
            {t.intro}
          </p>
          <LineOrnament className="mx-auto mt-3 hero:mt-[calc(var(--u)*1)] w-48 hero:w-[calc(var(--u)*16)] h-auto text-[#b8904f]" />
        </div>

        {/* Cards: swipeable row on small screens, four columns on wide screens */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-[11vw] pt-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden hero:grid hero:grid-cols-4 hero:gap-[calc(var(--u)*2.2)] hero:overflow-visible hero:px-[calc(var(--u)*5)] hero:pt-[calc(var(--u)*0.6)] hero:pb-0 hero:flex-1 hero:min-h-0">
          {t.cards.map((card, i) => (
            <SpecialtyCard key={card.image} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
