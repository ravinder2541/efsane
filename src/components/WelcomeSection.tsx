import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChefHat, Apple, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Feature = { icon: LucideIcon; title: string[]; text: string[] }

const content: Record<'de' | 'en', {
  eyebrow: string
  heading: [string, string]
  tagline: [string, string]
  intro: string
  features: Feature[]
  button: { href: string; label: string }
  note: [string, string]
}> = {
  de: {
    eyebrow: 'SEIT 1620',
    heading: ['Willkommen im', 'Gasthaus Rudolph'],
    tagline: ['Tradition schmecken –', 'wie bei Oma.'],
    intro:
      'Seit 1620 heißt das Gasthaus Rudolph seine Gäste mit echter deutscher Gastfreundschaft und traditioneller hessischer Küche willkommen und bewahrt ein kulinarisches Erbe, das über Generationen weitergegeben wurde.',
    features: [
      { icon: ChefHat, title: ['Authentische', 'Deutsche Küche'], text: ['Traditionelle Gerichte', 'frisch zubereitet.'] },
      { icon: Apple, title: ['Eigener', 'Apfelwein'], text: ['Feiner Ebbler', 'aus der Region.'] },
      { icon: Users, title: ['Familiäre', 'Gastlichkeit'], text: ['Herzlich willkommen', 'für jeden Gast.'] },
    ],
    button: { href: '/geschichte', label: 'Unsere Geschichte' },
    note: ['Traditionelle', 'Atmosphäre'],
  },
  en: {
    eyebrow: 'SINCE 1620',
    heading: ['Welcome to', 'Gasthaus Rudolph'],
    tagline: ['Taste Tradition – Just Like', 'Grandma Used to Make.'],
    intro:
      'Since 1620, Gasthaus Rudolph has welcomed guests with authentic German hospitality and traditional Hessian cuisine, preserving a culinary heritage passed down through generations.',
    features: [
      { icon: ChefHat, title: ['Authentic', 'German Cuisine'], text: ['Traditional dishes', 'freshly prepared.'] },
      { icon: Apple, title: ['Our Own', 'Apple Wine'], text: ['Fine local cider', 'from the region.'] },
      { icon: Users, title: ['Family', 'Hospitality'], text: ['Warm welcome', 'for every guest.'] },
    ],
    button: { href: '/history', label: 'Our History' },
    note: ['Traditional', 'Atmosphere'],
  },
}

function SideOrnament({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 140 12" className={`h-[0.6em] w-auto ${flip ? 'rotate-180' : ''}`} aria-hidden="true">
      <line x1="20" y1="6" x2="140" y2="6" stroke="currentColor" strokeWidth="1" />
      <path d="M2 6 L8 2.5 L14 6 L8 9.5 Z" fill="currentColor" />
      <circle cx="18" cy="6" r="1.6" fill="currentColor" />
    </svg>
  )
}

function Divider({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 14" className={className} aria-hidden="true">
      <line x1="0" y1="7" x2="140" y2="7" stroke="currentColor" strokeWidth="1" />
      <line x1="180" y1="7" x2="320" y2="7" stroke="currentColor" strokeWidth="1" />
      <path d="M160 1 L166 7 L160 13 L154 7 Z" fill="currentColor" />
      <path d="M144 7 C148 3, 152 3, 154 7 M176 7 C172 3, 168 3, 166 7" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="140" cy="7" r="1.6" fill="currentColor" />
      <circle cx="180" cy="7" r="1.6" fill="currentColor" />
    </svg>
  )
}

function VerticalDivider() {
  return (
    <svg viewBox="0 0 12 120" preserveAspectRatio="none" className="h-full w-3 text-[#c39a58]" aria-hidden="true">
      <line x1="6" y1="0" x2="6" y2="50" stroke="currentColor" strokeWidth="1" />
      <path d="M6 52 L10 60 L6 68 L2 60 Z" fill="currentColor" />
      <line x1="6" y1="70" x2="6" y2="120" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

/** Small engraved wooden sign standing on the table */
function WoodenSign() {
  return (
    <div className="relative w-full h-full rounded-[0.5cqw] -rotate-[4deg] bg-[linear-gradient(170deg,#a8763f,#7a4d22_55%,#5e3916)] shadow-[0.4cqw_0.8cqw_1.4cqw_rgba(30,15,5,0.55),inset_0_0_1cqw_rgba(40,20,5,0.6)] overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(176deg,transparent_0,transparent_0.6cqw,rgba(60,30,10,0.35)_0.65cqw,transparent_0.8cqw)]"></div>
      <div className="absolute inset-[6%] rounded-[0.3cqw] border border-[#3b220d]/30"></div>
      <div className="relative h-full flex flex-col items-center justify-center font-fraktur text-[#2a170a] text-[length:2.2cqw] leading-[1.05] [text-shadow:0_1px_0_rgba(255,220,170,0.35)]">
        <span>Gasthaus</span>
        <span>Rudolph</span>
      </div>
    </div>
  )
}

export default function WelcomeSection({ locale = 'de' }: { locale?: 'de' | 'en' }) {
  const t = content[locale]

  return (
    <section
      className="relative overflow-hidden bg-[#f6eedf] min-h-[100svh] hero:h-[var(--h)] flex flex-col [font-variant-numeric:lining-nums]"
      // Layout unit for the text column: scales with width, capped by height and by the cream area
      style={{ '--h': 'max(100svh,600px)', '--u': 'min(1vw, calc(var(--h) * 0.016), calc((100vw - var(--h) * 1.03) / 42))' } as React.CSSProperties}
    >
      {/* Artboard: the background at its native ratio, scaled like object-cover (anchored right),
          so the sign and note stay pinned to the right spots in the picture. */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[max(100%,calc(var(--h)*1.7747))] aspect-[1670/941] [container-type:inline-size]">
        <Image src="/historysectionbg.png" alt="" fill sizes="100vw" className="object-cover" />

        <div className="hidden hero:block">
          <div className="absolute left-[36.6%] top-[76%] w-[10.6%] h-[15%]">
            <WoodenSign />
          </div>

          <div className="absolute left-[64.6%] top-[76.5%] text-[#2d1d12]">
            <svg viewBox="0 0 90 50" className="absolute -top-[3.4cqw] left-[3.6cqw] w-[5.4cqw] h-auto" aria-hidden="true">
              <path d="M4 46 C10 22, 40 8, 82 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M70 3 L84 10 L71 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-script text-[length:1.75cqw] leading-[1.05] -rotate-[17deg] origin-left whitespace-nowrap">
              {t.note[0]}
              <br />
              <span className="pl-[1.6cqw]">{t.note[1]}</span>
            </p>
          </div>

          {/* Gold flourish and burgundy band along the bottom, kept clear of the table */}
          <svg viewBox="0 0 1670 120" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[12.8%]" aria-hidden="true">
            <path d="M1270 22 C1380 30, 1480 52, 1670 64 L1670 120 L1250 120 Z" fill="#6a1418" />
            <path d="M1270 22 C1380 30, 1480 52, 1670 64" fill="none" stroke="#c9a25e" strokeWidth="3" />
          </svg>
        </div>
      </div>

      {/* Cream wash on portrait / small screens so the text stays readable */}
      <div className="absolute inset-0 bg-[#f6eedf]/85 hero:hidden"></div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-5 pt-20 pb-6 hero:pt-24 hero:pb-[calc(var(--u)*3)] hero:pl-[calc(var(--u)*5.6)] hero:pr-0">
        <div className="hero:w-[calc(var(--u)*38)] text-center hero:text-left">
          <p className="flex items-center justify-center hero:justify-start gap-3 hero:gap-[calc(var(--u)*0.9)] font-garamond font-semibold text-[#5a3a22] tracking-[0.18em] text-sm hero:text-[length:calc(var(--u)*1.25)]">
            <SideOrnament />
            {t.eyebrow}
            <SideOrnament flip />
          </p>

          <h2 className="mt-[1svh] hero:mt-[calc(var(--u)*0.6)] font-serif font-bold tracking-[-0.02em] leading-[1.02] text-[length:min(10vw,5svh)] hero:text-[length:calc(var(--u)*4.5)]">
            <span className="block text-[#1c1410]">{t.heading[0]}</span>
            <span className="block text-[#6a1418]">{t.heading[1]}</span>
          </h2>

          <Divider className="mx-auto hero:mx-0 hero:ml-[calc(var(--u)*3.4)] mt-[1.2svh] hero:mt-[calc(var(--u)*1)] w-56 hero:w-[calc(var(--u)*19)] h-auto text-[#8a5a2b]" />

          <p className="mt-[1.6svh] hero:mt-[calc(var(--u)*1.4)] font-serif italic text-[#94642c] text-[length:min(5.6vw,2.8svh)] hero:text-[length:calc(var(--u)*2.05)] leading-[1.3]">
            {t.tagline[0]}
            <br />
            {t.tagline[1]}
          </p>

          <p className="mt-[1.4svh] hero:mt-[calc(var(--u)*1.2)] mx-auto max-w-xl hero:max-w-none font-sans text-[#4a4038] text-[length:min(3.8vw,1.9svh)] hero:text-[length:calc(var(--u)*1.1)] leading-[1.6]">
            {t.intro}
          </p>

          <div className="mt-[2.4svh] hero:mt-[calc(var(--u)*2)] grid grid-cols-3 hero:flex hero:items-stretch hero:w-[calc(var(--u)*36)]">
            {t.features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={f.title.join(' ')} className="contents hero:flex hero:flex-1">
                  {i > 0 && (
                    <div className="hidden hero:flex items-center px-[calc(var(--u)*0.4)] py-[calc(var(--u)*1.2)]">
                      <VerticalDivider />
                    </div>
                  )}
                  <div className="flex-1 text-center px-1">
                    <div className="mx-auto w-12 h-12 hero:w-[calc(var(--u)*4.6)] hero:h-[calc(var(--u)*4.6)] rounded-full bg-[radial-gradient(circle_at_40%_35%,#fffaf0,#f1e2c6)] border-2 border-[#d9b878] shadow-[0_3px_8px_rgba(120,80,30,0.2)] flex items-center justify-center">
                      <Icon className="w-[48%] h-[48%] text-[#6a1418]" strokeWidth={2} />
                    </div>
                    <h3 className="mt-1.5 hero:mt-[calc(var(--u)*0.6)] font-serif font-semibold text-[#1c1410] text-[13px] sm:text-base hero:text-[length:calc(var(--u)*1.1)] leading-[1.2]">
                      {f.title[0]}
                      <br />
                      {f.title[1]}
                    </h3>
                    <p className="hidden sm:block mt-1 hero:mt-[calc(var(--u)*0.4)] font-sans text-[#6b625a] text-xs hero:text-[length:calc(var(--u)*0.85)] leading-[1.45]">
                      {f.text[0]}
                      <br />
                      {f.text[1]}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-[3svh] hero:mt-[calc(var(--u)*2.4)] flex justify-center hero:justify-start">
            <Link
              href={t.button.href}
              className="group inline-flex items-center justify-center gap-3 hero:gap-[calc(var(--u)*1.2)] w-full sm:w-auto hero:w-[calc(var(--u)*21)] px-8 py-3 hero:py-[calc(var(--u)*0.95)] rounded-md bg-gradient-to-b from-[#741a1e] to-[#4e0d10] border border-[#c9a25e] text-[#f6e3b8] font-serif text-lg hero:text-[length:calc(var(--u)*1.15)] shadow-[0_6px_14px_rgba(80,20,20,0.3)] hover:from-[#62161a] hover:to-[#3f0a0d] transition-colors no-underline"
            >
              {t.button.label}
              <ArrowRight className="w-5 h-5 hero:w-[calc(var(--u)*1.4)] hero:h-[calc(var(--u)*1.4)] transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
