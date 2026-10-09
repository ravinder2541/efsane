import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Utensils, Users, Beer, Apple } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Sizes on lg+ are in vw so the text scales together with the background image,
// which is always shown at its native 1672x941 ratio.

const content = {
  de: {
    alt: 'Festlich gedeckter Saal im Efsane Gasthaus Rudolph',
    tagline: 'TRADITION SEIT 1620',
    subtitle: 'Wo Tradition auf Genuss trifft.',
    intro:
      'Seit 1620 begrüßt Sie das Gasthaus Rudolf mit authentischer deutscher Küche, herzlicher Gastfreundschaft und einer einzigartigen Atmosphäre.',
    reserve: { href: '/reservierung', label: 'Tisch reservieren' },
    menu: { href: '/speisekarte', label: 'Speisekarte entdecken' },
    features: [
      { icon: Utensils, title: ['Authentische', 'Hessische Küche'], text: ['Traditionelle Gerichte,', 'frisch & regional.'] },
      { icon: Users, title: ['Feiern bis', 'zu 300 Gästen'], text: ['Perfekt für Familien-', 'und Firmenevents.'] },
      { icon: Beer, title: ['Wintergarten', '& Biergarten'], text: ['Entspannen Sie in', 'jeder Jahreszeit.'] },
      { icon: Apple, title: ['Eigener', 'Apfelweinkeller'], text: ['Genießen Sie unseren', 'feinen Ebbler.'] },
    ],
  },
  en: {
    alt: 'Festively decorated hall at Efsane Gasthaus Rudolph',
    tagline: 'TRADITION SINCE 1620',
    subtitle: 'Where tradition meets taste.',
    intro:
      'Since 1620, Gasthaus Rudolf has welcomed guests with authentic German cuisine, warm hospitality and a truly unique atmosphere.',
    reserve: { href: '/reservation', label: 'Reserve a Table' },
    menu: { href: '/menu', label: 'Discover the Menu' },
    features: [
      { icon: Utensils, title: ['Authentic', 'Hessian Cuisine'], text: ['Traditional dishes,', 'fresh & regional.'] },
      { icon: Users, title: ['Celebrations for', 'up to 300 Guests'], text: ['Perfect for family', 'and corporate events.'] },
      { icon: Beer, title: ['Winter Garden', '& Beer Garden'], text: ['Relax in', 'every season.'] },
      { icon: Apple, title: ['Our Own', 'Cider Cellar'], text: ['Enjoy our fine', 'house Ebbler.'] },
    ],
  },
} satisfies Record<string, {
  alt: string
  tagline: string
  subtitle: string
  intro: string
  reserve: { href: string; label: string }
  menu: { href: string; label: string }
  features: { icon: LucideIcon; title: string[]; text: string[] }[]
}>

function ArrowOrnament({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 80 12" className={`h-[0.7em] w-auto ${flip ? 'rotate-180' : ''}`} aria-hidden="true">
      <line x1="0" y1="6" x2="62" y2="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M62 1.5 L72 6 L62 10.5 L65 6 Z" fill="currentColor" />
      <path d="M50 6 L56 2.5 L56 9.5 Z" fill="currentColor" />
    </svg>
  )
}

function ScrollDivider() {
  return (
    <svg viewBox="0 0 400 24" className="w-full h-auto text-[#b08a45]" aria-hidden="true">
      <line x1="0" y1="12" x2="165" y2="12" stroke="currentColor" strokeWidth="1.2" />
      <line x1="235" y1="12" x2="400" y2="12" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M165 12 C175 2, 188 2, 192 10 C195 16, 188 19, 184 14 M235 12 C225 2, 212 2, 208 10 C205 16, 212 19, 216 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M200 4 L205 12 L200 20 L195 12 Z" fill="currentColor" />
      <circle cx="150" cy="12" r="2" fill="currentColor" />
      <circle cx="250" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}

function FeatureIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="relative w-16 h-16 hero:w-[calc(var(--u)*3.87)] hero:h-[calc(var(--u)*3.87)] mx-auto">
      <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full text-[#b08a45]" aria-hidden="true">
        <path d="M14 58 A30 30 0 1 1 66 58" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M34 8 L40 2 L46 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 62 C16 66, 20 66, 24 62 M70 62 C64 66, 60 66, 56 62" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="40" cy="74" r="2" fill="currentColor" />
      </svg>
      <Icon className="absolute inset-0 m-auto w-[42%] h-[42%] text-[#7b1a1f]" strokeWidth={2.2} />
    </div>
  )
}

function DiamondSeparator() {
  return (
    <svg viewBox="0 0 12 140" className="h-full w-3 text-[#b08a45]" preserveAspectRatio="none" aria-hidden="true">
      <line x1="6" y1="0" x2="6" y2="56" stroke="currentColor" strokeWidth="1" />
      <path d="M6 58 L11 70 L6 82 L1 70 Z" fill="currentColor" />
      <line x1="6" y1="84" x2="6" y2="140" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export default function HomeHero({ locale = 'de' }: { locale?: 'de' | 'en' }) {
  const t = content[locale]

  return (
    <section
      className="relative overflow-hidden bg-[#f6eedf] [font-variant-numeric:lining-nums] min-h-[100svh] hero:h-[100svh] hero:min-h-[540px] flex flex-col"
      // One layout unit: scales with width, but never so large that the content outgrows the
      // viewport height or the cream area left of the photo.
      style={{ '--h': '100svh', '--u': 'min(1vw, calc(var(--h) * 0.016), calc((100vw - var(--h) * 0.977) / 44))' } as React.CSSProperties}
    >
      <Image
        src="/herobg.png"
        alt={t.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-right hero:object-[right_top]"
      />
      {/* Cream wash on portrait / small screens, where the photo sits behind the text */}
      <div className="absolute inset-0 bg-[#f6eedf]/85 hero:hidden"></div>

      <div className="relative z-10 flex-1 flex flex-col justify-center hero:justify-between gap-[3svh] px-5 pt-20 pb-4 hero:gap-0 hero:pt-24 hero:pb-[calc(var(--u)*1.6)] hero:pl-[calc(var(--u)*7.8)] hero:pr-0">
          {/* Headline block */}
          <div className="hero:flex-1 hero:flex hero:flex-col hero:justify-start hero:pt-[calc(max(var(--h),56.3vw)*0.27-6rem)] hero:w-[calc(var(--u)*38)] text-center hero:text-left">
            <p className="flex items-center justify-center hero:justify-start gap-3 font-cinzel font-semibold text-[#a8803a] whitespace-nowrap tracking-[0.15em] sm:tracking-[0.25em] text-xs sm:text-sm hero:text-[length:calc(var(--u)*1.14)]">
              <ArrowOrnament />
              {t.tagline}
              <ArrowOrnament flip />
            </p>

            <h1 className="mt-1 hero:mt-[calc(var(--u)*0.18)] leading-none">
              <span className="block font-cinzel font-bold text-[#7b1a1f] text-[length:min(15vw,8svh)] sm:text-7xl hero:text-[length:calc(var(--u)*5.98)] leading-[0.9] tracking-[0.01em]">
                <span className="text-[1.18em]">E</span>FSANE
              </span>
              <span className="block mt-1 hero:mt-0 font-garamond font-bold text-[#2b1a10] text-[length:min(11vw,6svh)] sm:text-6xl hero:text-[length:calc(var(--u)*4.4)] leading-[1]">
                Gasthaus Rudolf
              </span>
            </h1>

            <div className="mx-auto hero:mx-0 mt-3 hero:mt-[calc(var(--u)*0.44)] w-64 hero:w-[calc(var(--u)*19.36)]">
              <ScrollDivider />
            </div>

            <p className="mt-3 hero:mt-[calc(var(--u)*0.62)] font-garamond font-semibold text-[#2b1a10] text-[length:min(6vw,3.3svh)] sm:text-2xl hero:text-[length:calc(var(--u)*1.94)] leading-tight">
              {t.subtitle}
            </p>
            <p className="mt-3 hero:mt-[calc(var(--u)*0.44)] font-garamond font-medium text-[#3b2416] text-[length:min(4.5vw,2.5svh)] sm:text-lg sm:leading-[1.3] max-w-2xl mx-auto hero:mx-0 hero:text-[length:calc(var(--u)*1.16)] leading-[1.3] hero:max-w-[calc(var(--u)*30.8)]">
              {t.intro}
            </p>

            <div className="mt-[2.5svh] sm:mt-7 hero:mt-[calc(var(--u)*1.41)] flex flex-col sm:flex-row gap-3 sm:gap-4 hero:gap-[calc(var(--u)*1.41)] justify-center hero:justify-start">
              <Link
                href={t.reserve.href}
                className="group inline-flex items-center justify-center gap-3 hero:gap-[calc(var(--u)*0.97)] whitespace-nowrap px-7 py-[min(14px,1.6svh)] sm:py-3.5 hero:px-[calc(var(--u)*2.11)] hero:py-[calc(var(--u)*0.75)] rounded-lg bg-gradient-to-b from-[#8e1f25] to-[#6c1519] text-[#fbf3e4] font-garamond font-semibold text-xl hero:text-[length:calc(var(--u)*1.28)] shadow-[0_6px_14px_rgba(80,20,20,0.35)] hover:from-[#7b1a1f] hover:to-[#5a1014] transition-colors no-underline"
              >
                <CalendarDays className="w-6 h-6 hero:w-[calc(var(--u)*1.41)] hero:h-[calc(var(--u)*1.41)]" strokeWidth={1.6} />
                {t.reserve.label}
                <ArrowRight className="w-5 h-5 hero:w-[calc(var(--u)*1.14)] hero:h-[calc(var(--u)*1.14)] transition-transform group-hover:translate-x-1" strokeWidth={1.6} />
              </Link>
              <Link
                href={t.menu.href}
                className="group inline-flex items-center justify-center gap-3 hero:gap-[calc(var(--u)*0.88)] whitespace-nowrap px-7 py-[min(14px,1.6svh)] sm:py-3.5 hero:px-[calc(var(--u)*1.58)] hero:py-[calc(var(--u)*0.75)] rounded-lg border border-[#b08a45] bg-[#fbf5ea]/80 text-[#2b1a10] font-garamond font-semibold text-lg hero:text-[length:calc(var(--u)*1.06)] shadow-[0_3px_8px_rgba(80,50,20,0.12)] hover:bg-[#f3e6cf] transition-colors no-underline"
              >
                <Utensils className="w-6 h-6 hero:w-[calc(var(--u)*1.32)] hero:h-[calc(var(--u)*1.32)] text-[#7b1a1f]" strokeWidth={2} />
                {t.menu.label}
                <ArrowRight className="w-4 h-4 hero:w-[calc(var(--u)*0.88)] hero:h-[calc(var(--u)*0.88)] text-[#7b1a1f] transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
              </Link>
            </div>
          </div>

          {/* Feature row */}
          <div className="grid grid-cols-4 gap-1 sm:gap-4 hero:-ml-[calc(var(--u)*1.3)] hero:w-[calc(var(--u)*54)] hero:flex hero:items-stretch hero:justify-between">
            {t.features.map((f, i) => (
              <div key={f.title.join(' ')} className="contents hero:flex hero:flex-1 hero:items-stretch">
                {i > 0 && (
                  <div className="hidden hero:flex items-center">
                    <DiamondSeparator />
                  </div>
                )}
                <div className="flex-1 text-center px-0.5 sm:px-2">
                  <FeatureIcon icon={f.icon} />
                  <h3 className="mt-1.5 hero:mt-[calc(var(--u)*0.26)] font-garamond font-bold text-[#7b1a1f] text-[13px] sm:text-lg hero:text-[length:calc(var(--u)*1.06)] leading-[1.1] sm:leading-[1.1]">
                    {f.title[0]}
                    <br />
                    {f.title[1]}
                  </h3>
                  <p className="mt-1 hero:mt-[calc(var(--u)*0.22)] font-garamond font-medium text-[#3b2416] hidden sm:block text-sm sm:leading-tight hero:text-[length:calc(var(--u)*0.84)] leading-tight">
                    {f.text[0]}
                    <br />
                    {f.text[1]}
                  </p>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  )
}
