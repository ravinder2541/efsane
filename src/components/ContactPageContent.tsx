"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile } from "@marsidev/react-turnstile";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Home,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Star,
  Users,
  Car,
  Utensils,
  Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const content = {
  de: {
    back: { href: "/", label: "Zurück zur Startseite" },
    title: "Kontakt",
    subtitle: "Wir freuen uns auf Ihre Nachricht",
    formTitle: "Schreiben Sie uns",
    fields: {
      name: { label: "Name", placeholder: "Ihr vollständiger Name" },
      email: { label: "E-Mail", placeholder: "ihre.email@beispiel.de" },
      phone: { label: "Telefon", placeholder: "06196 23640" },
      subject: { label: "Betreff", placeholder: "Worum geht es in Ihrer Nachricht?" },
      message: { label: "Nachricht", placeholder: "Ihre Nachricht an uns..." },
    },
    errors: {
      name: "Name muss mindestens 2 Zeichen haben",
      email: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      subject: "Betreff muss mindestens 5 Zeichen haben",
      message: "Nachricht muss mindestens 10 Zeichen haben",
    },
    send: "Nachricht senden",
    sending: "Wird gesendet...",
    success: "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.",
    failure: "Entschuldigung, beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    infoTitle: "Kontaktinformationen",
    address: "Adresse",
    phone: "Telefon",
    email: "E-Mail",
    hoursTitle: "Öffnungszeiten",
    hours: [
      ["Montag:", "Geschlossen"],
      ["Dienstag - Samstag:", "16:00 - 22:00"],
      ["Sonntag (Mai - Okt):", "12:00 - 22:00"],
      ["Sonntag (Nov - Apr):", "11:00 - 16:00"],
    ],
    whyTitle: "Warum uns wählen?",
    why: ["Bis zu 300 Gäste", "70+ Parkplätze verfügbar", "Traditionelle deutsche Küche", "Perfekt für Geschäfts- und Privatfeiern"],
  },
  en: {
    back: { href: "/en", label: "Back to home" },
    title: "Contact",
    subtitle: "We look forward to hearing from you",
    formTitle: "Get in touch",
    fields: {
      name: { label: "Name", placeholder: "Your full name" },
      email: { label: "Email", placeholder: "your.email@example.com" },
      phone: { label: "Phone", placeholder: "06196 23640" },
      subject: { label: "Subject", placeholder: "What is your message about?" },
      message: { label: "Message", placeholder: "Your message to us..." },
    },
    errors: {
      name: "Name must be at least 2 characters",
      email: "Please enter a valid email address",
      subject: "Subject must be at least 5 characters",
      message: "Message must be at least 10 characters",
    },
    send: "Send message",
    sending: "Sending...",
    success: "Thank you! Your message has been sent successfully.",
    failure: "Sorry, an error occurred while sending. Please try again.",
    infoTitle: "Contact information",
    address: "Address",
    phone: "Phone",
    email: "Email",
    hoursTitle: "Opening hours",
    hours: [
      ["Monday:", "Closed"],
      ["Tuesday - Saturday:", "4:00 PM - 10:00 PM"],
      ["Sunday (May - Oct):", "12:00 PM - 10:00 PM"],
      ["Sunday (Nov - Apr):", "11:00 AM - 4:00 PM"],
    ],
    whyTitle: "Why choose us?",
    why: ["Up to 300 guests", "70+ parking spaces available", "Traditional German cuisine", "Perfect for business and private events"],
  },
};

const whyIcons: LucideIcon[] = [Users, Car, Utensils, Wine];

function makeSchema(e: (typeof content)["de"]["errors"]) {
  return z.object({
    name: z.string().min(2, e.name),
    email: z.string().email(e.email),
    phone: z.string().optional(),
    subject: z.string().min(5, e.subject),
    message: z.string().min(10, e.message),
  });
}

type ContactFormData = z.infer<ReturnType<typeof makeSchema>>;

function Flourish({ className = "" }: { className?: string }) {
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
  );
}

const card = "rounded-xl border border-[#c9a25e]/60 bg-[#fffaf1]/85 backdrop-blur-sm shadow-[0_18px_40px_rgba(120,80,30,0.18)]";
const solidBadge = "shrink-0 w-12 h-12 rounded-full bg-gradient-to-b from-[#8e1f25] to-[#6c1519] text-[#fbe9c4] flex items-center justify-center shadow-[0_3px_8px_rgba(80,20,20,0.3)]";
const ringBadge = "shrink-0 w-12 h-12 rounded-full border border-[#c9a25e] bg-[#fbf3e3] text-[#7b1a1f] flex items-center justify-center";
const inputClass =
  "w-full rounded-lg border border-[#d6c098] bg-white/90 px-4 py-3 text-[#2b1a10] placeholder:text-[#9a8a78] font-garamond text-lg focus:outline-none focus:border-[#b08a45] focus:ring-2 focus:ring-[#c9a25e]/30 transition-colors";

export default function ContactPageContent({ locale = "de" }: { locale?: "de" | "en" }) {
  const t = content[locale];
  const schema = useMemo(() => makeSchema(t.errors), [t]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Verify CAPTCHA if enabled
      if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && turnstileToken) {
        const captchaResponse = await fetch("/api/verify-turnstile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: turnstileToken }),
        });

        if (!captchaResponse.ok) {
          setSubmitStatus("error");
          setIsSubmitting(false);
          return;
        }
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        reset();
        setTurnstileToken(null);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields: { key: keyof ContactFormData; type: string; required: boolean }[] = [
    { key: "name", type: "text", required: true },
    { key: "email", type: "email", required: true },
    { key: "phone", type: "tel", required: false },
    { key: "subject", type: "text", required: true },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f6eedf] text-[#3b2416] font-garamond [font-variant-numeric:lining-nums]">
      <Image src="/contactbg-light.png" alt="" fill priority sizes="100vw" className="object-cover object-bottom" />

      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-[6.5vw] pt-28 lg:pt-32 pb-28 lg:pb-36">
        {/* Header */}
        <div className="relative text-center">
          <Link
            href={t.back.href}
            className="lg:absolute lg:left-0 lg:top-2 inline-flex items-center gap-3 mb-6 lg:mb-0 px-6 py-2 rounded-full border border-[#b08a45] bg-[#fffaf1]/70 text-[#7b1a1f] text-lg hover:bg-[#f3e6cf] transition-colors no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back.label}
          </Link>
          <h1 className="font-serif font-bold text-5xl md:text-7xl bg-gradient-to-b from-[#8e1f25] to-[#5a1014] bg-clip-text text-transparent leading-tight">
            {t.title}
          </h1>
          <Flourish className="mx-auto mt-2 w-72 md:w-80 h-auto text-[#b08a45]" />
          <p className="mt-3 text-2xl md:text-[2rem] text-[#3b2416]">{t.subtitle}</p>
        </div>

        <div className="mt-10 lg:mt-12 grid gap-8 lg:grid-cols-2 lg:gap-7 items-stretch">
          {/* Form */}
          <div className={`${card} p-6 md:p-8 flex flex-col`}>
            <div className="flex items-center gap-5">
              <span className={solidBadge}>
                <Mail className="w-6 h-6" strokeWidth={2} />
              </span>
              <h2 className="text-3xl md:text-[2.1rem] font-semibold text-[#2b1a10]">{t.formTitle}</h2>
            </div>

            {submitStatus === "success" && (
              <div className="mt-6 p-4 rounded-lg border border-emerald-600/40 bg-emerald-50 text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 shrink-0" />
                {t.success}
              </div>
            )}
            {submitStatus === "error" && (
              <div className="mt-6 p-4 rounded-lg border border-red-600/40 bg-red-50 text-red-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {t.failure}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex-1 flex flex-col gap-5" noValidate>
              {fields.map(({ key, type, required }) => (
                <div key={key}>
                  <label htmlFor={key} className="block mb-1.5 text-xl font-bold text-[#2b1a10]">
                    {t.fields[key].label}
                    {required && <span className="text-[#b3261e] ml-1">*</span>}
                  </label>
                  <input
                    type={type}
                    id={key}
                    {...register(key)}
                    className={inputClass}
                    placeholder={t.fields[key].placeholder}
                  />
                  {errors[key] && <p className="mt-1 text-[#b3261e] text-base">{errors[key]?.message}</p>}
                </div>
              ))}

              <div className="flex-1 flex flex-col">
                <label htmlFor="message" className="block mb-1.5 text-xl font-bold text-[#2b1a10]">
                  {t.fields.message.label}
                  <span className="text-[#b3261e] ml-1">*</span>
                </label>
                <textarea
                  id="message"
                  {...register("message")}
                  className={`${inputClass} resize-y flex-1 min-h-[7rem]`}
                  placeholder={t.fields.message.placeholder}
                  rows={4}
                />
                {errors.message && <p className="mt-1 text-[#b3261e] text-base">{errors.message.message}</p>}
              </div>

              {/* Turnstile CAPTCHA */}
              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onSuccess={setTurnstileToken}
                  onError={() => setTurnstileToken(null)}
                  onExpire={() => setTurnstileToken(null)}
                />
              )}

              <button
                type="submit"
                disabled={isSubmitting || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
                className="w-full flex items-center justify-center gap-4 py-4 rounded-xl bg-gradient-to-b from-[#8e1f25] to-[#6c1519] text-[#fbf3e4] text-2xl font-bold shadow-[0_8px_20px_rgba(80,20,20,0.3)] hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-[#fbf3e4] border-t-transparent"></span>
                    {t.sending}
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" fill="currentColor" />
                    {t.send}
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-7">
            {/* Contact info */}
            <div className={`${card} p-6 md:p-8`}>
              <div className="flex items-center gap-5 pb-4 border-b border-[#c9a25e]/40">
                <span className={solidBadge}>
                  <MapPin className="w-6 h-6" strokeWidth={2} />
                </span>
                <h2 className="text-3xl md:text-[2.1rem] font-semibold text-[#2b1a10]">{t.infoTitle}</h2>
              </div>

              <ul className="divide-y divide-[#c9a25e]/40 text-xl">
                <li className="flex gap-5 py-4">
                  <span className={ringBadge}>
                    <Home className="w-6 h-6" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="font-bold text-[#2b1a10]">{t.address}</h3>
                    <p className="leading-snug">
                      Alt Niederhofheim 30
                      <br />
                      65835 Liederbach am Taunus
                      <br />
                      Deutschland
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-5 py-4">
                  <span className={ringBadge}>
                    <Phone className="w-6 h-6" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="font-bold text-[#2b1a10]">{t.phone}</h3>
                    <a href="tel:+4961962364" className="text-[#3b2416] hover:text-[#7b1a1f] transition-colors no-underline">
                      06196 23640
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-5 py-4">
                  <span className={ringBadge}>
                    <Mail className="w-6 h-6" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#2b1a10]">{t.email}</h3>
                    <a href="mailto:info@efsane-events.de" className="text-[#3b2416] hover:text-[#7b1a1f] transition-colors no-underline break-all">
                      info@efsane-events.de
                    </a>
                  </div>
                </li>
                <li className="flex gap-4 sm:gap-5 pt-4">
                  <span className={ringBadge}>
                    <Clock className="w-6 h-6" strokeWidth={1.8} />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#2b1a10] pb-2 border-b border-[#c9a25e]/40">{t.hoursTitle}</h3>
                    <dl className="mt-2 grid sm:grid-cols-[1fr_auto] gap-x-6 gap-y-1 leading-snug">
                      {t.hours.map(([day, time]) => (
                        <div key={day} className="contents">
                          <dt className="mt-1.5 font-semibold sm:mt-0 sm:font-normal">{day}</dt>
                          <dd className="whitespace-nowrap">{time}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              </ul>
            </div>

            {/* Why us */}
            <div className={`${card} p-6 md:p-8 flex-1 flex flex-col justify-center`}>
              <div className="flex items-center gap-5">
                <span className={solidBadge}>
                  <Star className="w-6 h-6" fill="currentColor" />
                </span>
                <h2 className="text-3xl md:text-[2.1rem] font-semibold text-[#2b1a10]">{t.whyTitle}</h2>
              </div>
              <ul className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-y-6 sm:divide-x sm:divide-[#c9a25e]/45">
                {t.why.map((label, i) => {
                  const Icon = whyIcons[i];
                  return (
                    <li key={label} className="flex flex-col items-center text-center px-2">
                      <span className="w-14 h-14 rounded-full border border-[#c9a25e] bg-[#fbf3e3] text-[#7b1a1f] flex items-center justify-center">
                        <Icon className="w-7 h-7" strokeWidth={1.8} />
                      </span>
                      <span className="mt-3 text-lg leading-snug">{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
