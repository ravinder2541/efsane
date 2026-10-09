import Image from 'next/image'
import { Sprout, BookOpen, ChefHat } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Point = { icon: LucideIcon; title: string; text: string }

const content: Record<'de' | 'en', {
  eyebrow: string
  heading: [string, string]
  intro: string
  points: Point[]
}> = {
  de: {
    eyebrow: 'UNSER KONZEPT',
    heading: ['Authentische Hessische', 'Hausmannskost'],
    intro:
      'Unser Konzept ist einfach: Wir servieren authentische hessische Hausmannskost – wie in guten alten Zeiten. Dabei greifen wir auf überlieferte Rezepte zurück und bewahren so ein kulinarisches Erbe, das nicht in Vergessenheit geraten darf.',
    points: [
      {
        icon: Sprout,
        title: 'Frisch & Regional',
        text: 'Unsere Zutaten stammen bevorzugt aus Hessen – von regionalen Viehzüchtern, Landwirten und Erzeugern. So garantieren wir Frische, Qualität und Nachhaltigkeit.',
      },
      {
        icon: BookOpen,
        title: 'Überlieferte Rezepte',
        text: 'Wir greifen auf überlieferte Rezepte zurück und bewahren so ein kulinarisches Erbe, das nicht in Vergessenheit geraten darf.',
      },
      {
        icon: ChefHat,
        title: 'Nur im Ausnahmefall',
        text: 'Nur bei Engpässen – etwa wegen Ernteausfällen oder Streiks – setzen wir geprüfte, hochwertige Konvenienz-Produkte ein, die den hohen Standards unseres Küchenchefs entsprechen.',
      },
    ],
  },
  en: {
    eyebrow: 'OUR CONCEPT',
    heading: ['Authentic Hessian', 'Home-Style Cooking'],
    intro:
      'Our concept is simple: we serve authentic Hessian home-style cooking just like in the good old days. We draw on traditional recipes, preserving a culinary heritage that must not be allowed to fade into oblivion.',
    points: [
      {
        icon: Sprout,
        title: 'Fresh & Regional',
        text: 'Our ingredients come primarily from regional livestock farmers, growers, and producers throughout Hesse, ensuring freshness, quality, and sustainability.',
      },
      {
        icon: BookOpen,
        title: 'Traditional Recipes',
        text: 'We draw on traditional recipes, preserving a culinary heritage that must not be allowed to fade into oblivion.',
      },
      {
        icon: ChefHat,
        title: 'Only When Necessary',
        text: 'Only in exceptional situations, such as supply shortages caused by crop failures or strikes, do we use carefully selected, high-quality convenience products that meet the strict standards of our head chef.',
      },
    ],
  },
}

function LeafMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 28" className={className} aria-hidden="true">
      <path d="M20 26 C14 20, 12 12, 20 2 C28 12, 26 20, 20 26 Z" fill="currentColor" />
      <path d="M19 26 C11 25, 5 19, 3 10 C11 11, 17 16, 19 26 Z" fill="currentColor" opacity="0.85" />
      <path d="M21 26 C29 25, 35 19, 37 10 C29 11, 23 16, 21 26 Z" fill="currentColor" opacity="0.85" />
    </svg>
  )
}

export default function ConceptSection({ locale = 'de' }: { locale?: 'de' | 'en' }) {
  const t = content[locale]

  return (
    <section
      className="relative overflow-hidden bg-[#f7efe0] min-h-[85svh] hero:min-h-0 hero:h-[max(min(82svh,46vw),500px)] flex flex-col [font-variant-numeric:lining-nums]"
      // Layout unit for the text column: scales with width, capped by height and by the cream area right of the photos
      style={{ '--u': 'min(0.85vw, 1.3svh, calc((100vw - 76svh) / 52))' } as React.CSSProperties}
    >
      {/* Background at its native ratio, scaled like object-cover and anchored left (photos sit on the left) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[max(100%,calc(max(min(82svh,46vw),500px)*1.7728))] aspect-[1670/942]">
        <Image src="/conceptbg.png" alt="" fill sizes="100vw" className="object-cover" />
      </div>

      {/* Cream wash on portrait / small screens so the text stays readable */}
      <div className="absolute inset-0 bg-[#f7efe0]/85 hero:hidden"></div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-5 pt-14 pb-8 hero:items-end hero:pt-[calc(var(--u)*2)] hero:pb-[calc(var(--u)*7)] hero:pr-[calc(var(--u)*5.5)] hero:pl-0">
        <div className="max-w-xl mx-auto hero:mx-0 hero:max-w-none hero:w-[calc(var(--u)*46)] text-center hero:text-left">
          {/* Eyebrow, centred over the heading like in the design */}
          <div className="flex flex-col items-center hero:w-[calc(var(--u)*30)] hero:mx-auto hero:-translate-x-[calc(var(--u)*3)] text-[#a5762f]">
            <div className="flex items-center gap-3 hero:gap-[calc(var(--u)*1.2)] w-full">
              <span className="h-px flex-1 bg-[#c9a25e]"></span>
              <LeafMark className="w-7 hero:w-[calc(var(--u)*2.4)] h-auto" />
              <span className="h-px flex-1 bg-[#c9a25e]"></span>
            </div>
            <p className="mt-1 hero:mt-[calc(var(--u)*0.6)] font-sans font-medium tracking-[0.18em] text-sm hero:text-[length:calc(var(--u)*1.55)]">
              {t.eyebrow}
            </p>
          </div>

          <h2 className="mt-[2svh] hero:mt-[calc(var(--u)*2.2)] font-garamond font-medium leading-[1.05] text-[length:min(8vw,4svh)] hero:text-[length:calc(var(--u)*3.9)]">
            <span className="block text-[#1f1a16]">{t.heading[0]}</span>
            <span className="block text-[#a5692a]">{t.heading[1]}</span>
          </h2>

          <span className="block mx-auto hero:mx-0 mt-[1.6svh] hero:mt-[calc(var(--u)*1.4)] w-20 hero:w-[calc(var(--u)*7)] h-[3px] rounded-full bg-[#d4ab68]"></span>

          <p className="mt-[2svh] hero:mt-[calc(var(--u)*2.2)] font-sans text-[#2f2925] text-[length:min(3.6vw,1.8svh)] hero:text-[length:calc(var(--u)*1.32)] leading-[1.5]">
            {t.intro}
          </p>

          <div className="mt-[3svh] hero:mt-[calc(var(--u)*3)] grid grid-cols-3 gap-2 hero:gap-0 hero:divide-x hero:divide-[#d9bf8f]">
            {t.points.map((p, i) => {
              const Icon = p.icon
              return (
                <div
                  key={p.title}
                  className={`text-center hero:px-[calc(var(--u)*1.2)] ${i === 0 ? 'hero:pl-0' : ''} ${i === t.points.length - 1 ? 'hero:pr-0' : ''}`}
                >
                  <div className="mx-auto w-12 h-12 hero:w-[calc(var(--u)*5.2)] hero:h-[calc(var(--u)*5.2)] rounded-full border border-[#d4ab68] bg-[#fbf5ea]/70 flex items-center justify-center">
                    <Icon className="w-[50%] h-[50%] text-[#a5692a]" strokeWidth={1.4} />
                  </div>
                  <h3 className="mt-2 hero:mt-[calc(var(--u)*1.2)] font-garamond font-semibold text-[#a5692a] text-[length:min(3.8vw,2.1svh)] hero:text-[length:calc(var(--u)*1.55)] leading-tight">
                    {p.title}
                  </h3>
                  <p className="hidden sm:block mt-1 hero:mt-[calc(var(--u)*0.6)] font-sans text-[#3a332d] text-xs hero:text-[length:calc(var(--u)*0.98)] leading-[1.45]">
                    {p.text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
