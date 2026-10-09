import Image from 'next/image'
import { Beer, Users } from 'lucide-react'

function GreenhouseIcon({ className = '', strokeWidth = 1.6 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21 V10 L12 4 L21 10 V21 Z" />
      <path d="M3 13 H21 M3 17 H21 M7.5 7 V21 M12 4 V21 M16.5 7 V21" />
    </svg>
  )
}

type Facility = { key: 'beer' | 'winter' | 'event'; title: string; text: string }

const icons = {
  beer: Beer,
  winter: GreenhouseIcon,
  event: Users,
}

const content: Record<'de' | 'en', {
  eyebrow: string
  heading: [string, string]
  intro: string
  facilities: Facility[]
}> = {
  de: {
    eyebrow: 'UNSERE RÄUMLICHKEITEN',
    heading: ['Räume für', 'jeden Anlass'],
    intro:
      'Ob Geburtstag, Jubiläum, Hochzeit, andere Familienfeste, Grillparty oder Firmenfest – das Gasthaus Rudolph bietet für jede Feier den idealen Rahmen.',
    facilities: [
      { key: 'beer', title: 'Biergarten', text: 'Großzügiger Biergarten für entspannte Stunden im Freien.' },
      { key: 'winter', title: 'Wintergarten', text: 'Wetterunabhängiger Wintergarten mit öffnungsfähigem Dach für bis zu 100 Personen.' },
      { key: 'event', title: 'Eventräume', text: 'Vielseitige Räumlichkeiten im historischen Fachwerkhaus für besondere Anlässe.' },
    ],
  },
  en: {
    eyebrow: 'OUR FACILITIES',
    heading: ['Spaces for', 'Every Occasion'],
    intro:
      'Whether birthday, anniversary, wedding, other family celebrations, barbecue party or corporate event – Gasthaus Rudolph offers the ideal setting for every celebration.',
    facilities: [
      { key: 'beer', title: 'Beer Garden', text: 'Spacious beer garden for relaxing hours outdoors.' },
      { key: 'winter', title: 'Winter Garden', text: 'Weather-independent winter garden with retractable roof for up to 100 people.' },
      { key: 'event', title: 'Event Rooms', text: 'Versatile facilities in the historic half-timbered house for special occasions.' },
    ],
  },
}

// Where the photo labels sit in facilitiessection.png (percent of the 1670x942 image).
// We draw our own label on top so it matches the page language.
const labelSpots: Record<Facility['key'], string> = {
  beer: 'left-[76.6%] top-[45.4%] w-[11.1%] h-[5.5%]',
  winter: 'left-[58.7%] top-[73%] w-[12.7%] h-[5.5%]',
  event: 'left-[79.8%] top-[79.2%] w-[11.4%] h-[5.5%]',
}

function Divider({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 14" className={className} aria-hidden="true">
      <line x1="0" y1="7" x2="130" y2="7" stroke="currentColor" strokeWidth="1" />
      <line x1="190" y1="7" x2="320" y2="7" stroke="currentColor" strokeWidth="1" />
      <path d="M160 2 L165 7 L160 12 L155 7 Z" fill="currentColor" />
      <path
        d="M130 7 C136 1, 146 1, 150 6 C152 9, 148 11, 145 9 M190 7 C184 1, 174 1, 170 6 C168 9, 172 11, 175 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function RowDivider() {
  return (
    <div className="flex items-center text-[#b8904f]/70" aria-hidden="true">
      <span className="h-px w-[18%] bg-current"></span>
      <span className="mx-1 w-1.5 h-1.5 rotate-45 bg-current"></span>
      <span className="h-px flex-1 bg-current"></span>
    </div>
  )
}

export default function FacilitiesSection({ locale = 'de' }: { locale?: 'de' | 'en' }) {
  const t = content[locale]

  return (
    <section
      className="relative overflow-hidden bg-[#1a110b] hero:h-[var(--h)] flex flex-col [font-variant-numeric:lining-nums]"
      // Layout unit for the text column: scales with width, capped by height and by the dark area left of the photos
      style={{ '--h': 'max(min(82svh,52vw),540px)', '--u': 'min(1vw, calc(var(--h) * 0.016), calc((100vw - var(--h) * 0.785) / 37))' } as React.CSSProperties}
    >
      {/* Artboard: background at its native ratio, scaled like object-cover and anchored right */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[max(100%,calc(var(--h)*1.7728))] aspect-[1670/942] [container-type:inline-size]">
        <Image src="/facilitiessection.png" alt="" fill sizes="100vw" className="object-cover" />

        {/* Our labels always cover the English ones baked into the image (dimmed by the overlay on small screens) */}
        <div>
          {t.facilities.map((f) => {
            const Icon = icons[f.key]
            return (
              <div
                key={f.key}
                className={`absolute ${labelSpots[f.key]} rounded-full bg-gradient-to-b from-[#fbf3e3] to-[#efe0c4] border border-[#c9a25e] shadow-[0_0.3cqw_0.8cqw_rgba(0,0,0,0.35)] flex items-center justify-center gap-[0.6cqw] text-[#2a1a10]`}
              >
                <Icon className="w-[1.35cqw] h-[1.35cqw]" strokeWidth={1.8} />
                <span className="font-garamond font-bold text-[length:1.08cqw] whitespace-nowrap">{f.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Darken on portrait / small screens so the text stays readable over the photos */}
      <div className="absolute inset-0 bg-[#1a110b]/90 hero:hidden"></div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-5 pt-20 pb-8 hero:pt-[calc(var(--u)*4)] hero:pb-[calc(var(--u)*3)] hero:pl-[calc(max(100vw,var(--h)*1.7728)*0.085)] hero:pr-0">
        <div className="max-w-xl mx-auto hero:mx-0 hero:max-w-none hero:w-[calc(var(--u)*29)] text-center hero:text-left">
          <p className="flex items-center justify-center hero:justify-start gap-3 hero:gap-[calc(var(--u)*1.2)] font-garamond font-semibold text-[#d0a866] whitespace-nowrap tracking-[0.22em] text-sm hero:text-[length:calc(var(--u)*1.3)]">
            <span className="block w-6 hero:w-[calc(var(--u)*2.2)] h-px bg-current"></span>
            {t.eyebrow}
            <span className="block w-6 hero:w-[calc(var(--u)*2.2)] h-px bg-current"></span>
          </p>

          <h2 className="mt-[1.2svh] hero:mt-[calc(var(--u)*1)] font-garamond font-medium leading-[1.05] text-[length:min(10vw,5svh)] hero:text-[length:calc(var(--u)*4.3)]">
            <span className="block text-[#f6ead3]">{t.heading[0]}</span>
            <span className="block text-[#d4ab68]">{t.heading[1]}</span>
          </h2>

          <p className="mt-[1.4svh] hero:mt-[calc(var(--u)*1.3)] font-garamond font-medium text-[#eadbc0] text-[length:min(4.3vw,2.2svh)] hero:text-[length:calc(var(--u)*1.35)] leading-[1.45]">
            {t.intro}
          </p>

          <Divider className="mx-auto hero:mx-0 mt-[1.6svh] hero:mt-[calc(var(--u)*1.6)] w-56 hero:w-[calc(var(--u)*19)] h-auto text-[#b8904f]" />

          <ul className="mt-[1.6svh] hero:mt-[calc(var(--u)*1.6)] text-left">
            {t.facilities.map((f, i) => {
              const Icon = icons[f.key]
              return (
                <li key={f.key}>
                  {i > 0 && (
                    <div className="my-[1.2svh] hero:my-[calc(var(--u)*0.9)]">
                      <RowDivider />
                    </div>
                  )}
                  <div className="flex items-center gap-4 hero:gap-[calc(var(--u)*2.4)]">
                    <div className="shrink-0 w-12 h-12 hero:w-[calc(var(--u)*5.4)] hero:h-[calc(var(--u)*5.4)] rounded-full border border-[#b8904f] flex items-center justify-center">
                      <Icon className="w-[50%] h-[50%] text-[#d4ab68]" strokeWidth={1.6} />
                    </div>
                    <div>
                      <h3 className="font-garamond font-semibold text-[#d4ab68] text-[length:min(5.2vw,2.6svh)] hero:text-[length:calc(var(--u)*1.75)] leading-tight">
                        {f.title}
                      </h3>
                      <p className="mt-0.5 hero:mt-[calc(var(--u)*0.3)] font-garamond font-medium text-[#eadbc0] text-[length:min(3.9vw,2svh)] hero:text-[length:calc(var(--u)*1.25)] leading-[1.35] hero:max-w-[calc(var(--u)*19)]">
                        {f.text}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
