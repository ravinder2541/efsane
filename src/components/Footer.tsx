"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, Users, Car, ConciergeBell, CalendarDays, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const messages = {
  de: {
    navigation: "Navigation",
    contact: "Kontakt",
    openingHours: "Öffnungszeiten",
    home: "Startseite",
    history: "Geschichte",
    menu: "Speisekarte",
    contactPage: "Kontakt",
    reservation: "Reservierung",
    copyright: "Alle Rechte vorbehalten.",
    developedBy: "Developed by",
    privacy: "Datenschutz",
    legal: "Impressum",
    description:
      "Traditionelle deutsche Küche seit 1620. Perfekt für Geschäftstermine und private Feiern mit bis zu 300 Gästen.",
    openingHoursData: [
      { day: "Montag", time: "Geschlossen" },
      { day: "Dienstag - Samstag", time: "16:00 - 22:00" },
      { day: "Sonntag Mai - Oktober", time: "12:00 - 22:00" },
      { day: "Sonntag November - April", time: "11:00 - 16:00" },
    ],
    features: [
      { icon: Users, before: "Bis zu ", highlight: "300", after: " Gäste" },
      { icon: Car, before: "", highlight: "70+", after: " Parkplätze" },
      { icon: ConciergeBell, before: "", highlight: "Regionale", after: " Spezialitäten" },
      { icon: CalendarDays, before: "Geschäfts- & Privatfeiern", highlight: "", after: "" },
    ],
  },
  en: {
    navigation: "Navigation",
    contact: "Contact",
    openingHours: "Opening Hours",
    home: "Home",
    history: "History",
    menu: "Menu",
    contactPage: "Contact",
    reservation: "Reservation",
    copyright: "All rights reserved.",
    developedBy: "Developed by",
    privacy: "Privacy Policy",
    legal: "Legal Notice",
    description:
      "Traditional German cuisine since 1620. Perfect for business meetings and private celebrations with up to 300 guests.",
    openingHoursData: [
      { day: "Monday", time: "Closed" },
      { day: "Tuesday - Saturday", time: "4:00 PM - 10:00 PM" },
      { day: "Sunday May - October", time: "12:00 PM - 10:00 PM" },
      { day: "Sunday November - April", time: "11:00 AM - 4:00 PM" },
    ],
    features: [
      { icon: Users, before: "Up to ", highlight: "300", after: " guests" },
      { icon: Car, before: "", highlight: "70+", after: " parking spaces" },
      { icon: ConciergeBell, before: "", highlight: "Regional", after: " specialties" },
      { icon: CalendarDays, before: "Business & private events", highlight: "", after: "" },
    ],
  },
} satisfies Record<string, {
  features: { icon: LucideIcon; before: string; highlight: string; after: string }[];
  [key: string]: unknown;
}>;

function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 14" className={className} aria-hidden="true">
      <line x1="0" y1="7" x2="64" y2="7" stroke="currentColor" strokeWidth="1" />
      <line x1="96" y1="7" x2="160" y2="7" stroke="currentColor" strokeWidth="1" />
      <path d="M80 1 L84 7 L80 13 L76 7 Z" fill="currentColor" />
      <path d="M66 7 C70 2, 74 3, 76 7 M94 7 C90 2, 86 3, 84 7" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="64" cy="7" r="1.5" fill="currentColor" />
      <circle cx="96" cy="7" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4 className="font-garamond font-bold text-[#d9b06c] text-[1.75rem] leading-tight">{children}</h4>
      <Flourish className="mt-2 w-36 h-auto text-[#c9a25e]" />
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const englishPaths = ["/en", "/history", "/menu", "/contact", "/reservation", "/privacy", "/legal"];
  const locale = englishPaths.some((p) => pathname === p || pathname.startsWith(p + "/")) ? "en" : "de";
  const t = messages[locale];

  const navigationLinks = [
    { href: locale === "en" ? "/en" : "/", label: t.home },
    { href: locale === "en" ? "/history" : "/geschichte", label: t.history },
    { href: locale === "en" ? "/menu" : "/speisekarte", label: t.menu },
    { href: locale === "en" ? "/contact" : "/kontakt", label: t.contactPage },
    { href: locale === "en" ? "/reservation" : "/reservierung", label: t.reservation },
  ];

  const contactIcon = "shrink-0 w-9 h-9 rounded-full bg-[#c9a25e] text-[#1c120b] flex items-center justify-center";

  return (
    <footer className="relative overflow-hidden bg-[#140d08] text-[#f3e6cf] font-garamond [font-variant-numeric:lining-nums]">

      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-[6vw] pt-16 lg:pt-24">
        {/* Main columns */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1.1fr_1.15fr] lg:gap-0 lg:divide-x lg:divide-[#c9a25e]/30">
          {/* Brand */}
          <div className="lg:pr-10 text-center md:text-left">
            <Link href={locale === "en" ? "/en" : "/"} className="inline-block no-underline">
              <Image
                src="/logo.png?v=2"
                alt="Efsane Gasthaus Rudolph"
                width={2172}
                height={724}
                className="w-64 lg:w-[min(100%,340px)] h-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
              />
            </Link>
            <Flourish className="mx-auto md:mx-0 mt-5 w-56 h-auto text-[#c9a25e]" />
            <p className="mt-5 text-[1.2rem] leading-relaxed text-[#f3e6cf]/95 max-w-sm mx-auto md:mx-0">
              {t.description}
            </p>
          </div>

          {/* Navigation */}
          <nav className="lg:px-10">
            <ColumnHeading>{t.navigation}</ColumnHeading>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-3 text-[1.25rem] text-[#f3e6cf] hover:text-[#d9b06c] transition-colors no-underline"
                  >
                    <ChevronRight className="w-4 h-4 text-[#c9a25e] transition-transform group-hover:translate-x-1" strokeWidth={2} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:px-10">
            <ColumnHeading>{t.contact}</ColumnHeading>
            <div className="space-y-5 text-[1.2rem] leading-snug">
              <div className="flex items-start gap-4">
                <span className={contactIcon}>
                  <MapPin className="w-5 h-5" fill="currentColor" stroke="#c9a25e" />
                </span>
                <address className="not-italic">
                  Efsane Gasthaus Rudolph
                  <br />
                  Alt Niederhofheim 30
                  <br />
                  65835 Liederbach am Taunus
                  <br />
                  Deutschland
                </address>
              </div>
              <a href="tel:+4961962364" className="flex items-center gap-4 text-[#f3e6cf] hover:text-[#d9b06c] transition-colors no-underline">
                <span className={contactIcon}>
                  <Phone className="w-[18px] h-[18px]" fill="currentColor" strokeWidth={0} />
                </span>
                06196 23640
              </a>
              <a href="mailto:info@efsane-events.de" className="flex items-center gap-4 text-[#f3e6cf] hover:text-[#d9b06c] transition-colors no-underline break-all">
                <span className={contactIcon}>
                  <Mail className="w-[18px] h-[18px]" strokeWidth={2} />
                </span>
                info@efsane-events.de
              </a>
            </div>
          </div>

          {/* Opening hours */}
          <div className="lg:pl-10">
            <ColumnHeading>{t.openingHours}</ColumnHeading>
            <dl className="text-[1.15rem]">
              {t.openingHoursData.map((item) => (
                <div key={item.day} className="flex justify-between gap-4 py-3.5 border-b border-[#c9a25e]/30 first:pt-0">
                  <dt>{item.day}</dt>
                  <dd className="whitespace-nowrap">{item.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 flex items-center gap-3 text-[#c9a25e] px-[6%]" aria-hidden="true">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a25e]/70"></span>
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M12 3 C13 8, 16 11, 21 12 C16 13, 13 16, 12 21 C11 16, 8 13, 3 12 C8 11, 11 8, 12 3 Z" fill="currentColor" />
          </svg>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a25e]/70"></span>
        </div>

        {/* Features */}
        <ul className="mt-10 grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-[#c9a25e]/30 lg:px-[6%]">
          {t.features.map((f) => {
            const Icon = f.icon;
            return (
              <li key={f.before + f.highlight} className="flex flex-col items-center text-center px-3">
                <span className="w-16 h-16 lg:w-[74px] lg:h-[74px] rounded-full border-2 border-[#c9a25e] flex items-center justify-center">
                  <Icon className="w-8 h-8 text-[#d9b06c]" strokeWidth={1.8} />
                </span>
                <p className="mt-4 text-[1.2rem] lg:text-[1.45rem] leading-tight">
                  {f.before}
                  {f.highlight && <span className="text-[#d9b06c] font-semibold text-[1.15em]">{f.highlight}</span>}
                  {f.after}
                </p>
              </li>
            );
          })}
        </ul>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-[#c9a25e]/60">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 py-7 text-[1.1rem] text-center md:text-left">
            <p>
              © {new Date().getFullYear()} Efsane Gasthaus Rudolph. {t.copyright}{" "}
              <span className="whitespace-nowrap">
                {t.developedBy}{" "}
                <a
                  href="https://neosoftix.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d9b06c] hover:text-[#f0cf8f] underline-offset-4 hover:underline transition-colors"
                >
                  Neosoftix Pvt. Ltd.
                </a>
              </span>
            </p>
            <div className="flex items-center gap-4">
              <Link href={locale === "en" ? "/privacy" : "/datenschutz"} className="text-[#f3e6cf] hover:text-[#d9b06c] transition-colors no-underline">
                {t.privacy}
              </Link>
              <span className="h-5 w-px bg-[#f3e6cf]/50"></span>
              <Link href={locale === "en" ? "/legal" : "/impressum"} className="text-[#f3e6cf] hover:text-[#d9b06c] transition-colors no-underline">
                {t.legal}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
