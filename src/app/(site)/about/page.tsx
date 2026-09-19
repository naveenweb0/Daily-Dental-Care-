import type { Metadata } from "next";
import Link from "next/link";
import { CLINIC, waLink } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "About Our Dental Clinic in Mohali | Daily Dental Care",
  description:
    "Daily Dental Care is a multi-specialty dental clinic in Phase 7, Sector 61, Mohali offering advanced, affordable and painless dentistry with 5.0 Google Rating.",
  alternates: { canonical: "/about" },
};

const PILLARS = [
  {
    icon: "💎",
    title: "Painless Patient-First Care",
    desc: "We understand dental anxiety. Our doctors utilize computer-controlled anesthesia, micro-thin needles, and soothing clinical techniques so you feel relaxed throughout.",
  },
  {
    icon: "🔬",
    title: "Digital Precision Dentistry",
    desc: "Equipped with 3D intraoral optical scanners, digital apex locators, and low-radiation digital radiography for accurate diagnosis and long-lasting restorations.",
  },
  {
    icon: "🛡️",
    title: "Class-B Hospital Sterilization",
    desc: "Zero compromise on hygiene. Every single instrument undergoes 6-step ultrasonic cleaning, chemical disinfection, and vacuum autoclaving in sealed pouches.",
  },
  {
    icon: "💳",
    title: "100% Transparent Treatment Plans",
    desc: "No hidden charges or surprise add-ons. You receive a detailed cost breakdown and 0% interest EMI options before treatment begins.",
  },
];

const TIMELINE = [
  { year: "2018", title: "Clinic Founded", desc: "Started in Phase 7 Mohali with a mission for ethical, modern dentistry." },
  { year: "2020", title: "Digital 3D Upgrade", desc: "Integrated digital intraoral scanners and single-sitting rotary RCT systems." },
  { year: "2023", title: "10,000+ Smiles Milestone", desc: "Recognized as the top-rated 5.0 Google reviewed dental center in Tricity." },
  { year: "Today", title: "Full Multi-Specialty Team", desc: "Permanent implantology, Invisalign clear aligners, and aesthetic smile design." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-800">
          About Our Clinic
        </span>
        <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Redefining Modern Dentistry with Care, Precision &amp; Trust
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          Located in Phase 7, Sector 61, Mohali (SAS Nagar), Daily Dental Care is a premier multi-specialty dental clinic dedicated to gentle, predictable, and aesthetic dental treatments for patients of all ages.
        </p>
      </div>

      {/* Hero Visual */}
      <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200/80 shadow-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/6627826/pexels-photo-6627826.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1400"
          alt="Daily Dental Care Mohali clinic interior and treatment operatory"
          className="h-[320px] sm:h-[460px] w-full object-cover"
        />
      </div>

      {/* Clinical Pillars */}
      <div className="mt-16">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          The Daily Dental Care Promise
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-soft transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-2xl">
                {p.icon}
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clinic Details & Timeline */}
      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        {/* Timeline */}
        <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-8 lg:col-span-7">
          <h3 className="font-heading text-xl font-bold text-slate-900">Our Journey in Mohali</h3>
          <div className="mt-6 space-y-6">
            {TIMELINE.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
                    {item.year.slice(-2)}
                  </span>
                  {idx < TIMELINE.length - 1 && <span className="h-full w-0.5 bg-sky-200 my-1"></span>}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{item.year} · {item.title}</div>
                  <div className="mt-1 text-xs text-slate-600">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Facts Card */}
        <div className="rounded-3xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-8 lg:col-span-5 shadow-soft">
          <h3 className="font-heading text-xl font-bold text-slate-900">Clinic Information</h3>
          <ul className="mt-6 space-y-3.5 text-xs text-slate-700">
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Category:</span>
              <span className="font-semibold text-right">{CLINIC.category}</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Location:</span>
              <span className="font-semibold text-right max-w-[200px]">{CLINIC.address}</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Phone Hotline:</span>
              <a href={`tel:${CLINIC.phoneDial}`} className="font-bold text-sky-700">{CLINIC.phone}</a>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Operating Hours:</span>
              <span className="font-semibold text-right">Mon – Sat · 10:00 AM – 7:00 PM</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Break Time:</span>
              <span className="font-semibold text-right">1:00 PM – 2:00 PM</span>
            </li>
            <li className="flex justify-between pb-2">
              <span className="text-slate-500 font-medium">Google Rating:</span>
              <span className="font-bold text-emerald-700">⭐ {CLINIC.rating} ({CLINIC.reviews} Reviews)</span>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/book"
              className="flex-1 rounded-full bg-sky-600 px-4 py-3 text-center text-xs font-bold text-white shadow-sm hover:bg-sky-700"
            >
              Book Consultation
            </Link>
            <a
              href={waLink("Hello Daily Dental Care, I would like to visit your Mohali clinic.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-600 px-4 py-3 text-center text-xs font-bold text-white hover:bg-emerald-700"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

