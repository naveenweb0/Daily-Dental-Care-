"use client";

import { useState } from "react";
import Link from "next/link";

type QuizOption = {
  id: string;
  label: string;
  icon: string;
  desc: string;
};

const STEP_1_OPTIONS: QuizOption[] = [
  { id: "pain", label: "Toothache or Sensitivity", icon: "⚡", desc: "Sharp pain, sensitivity to hot/cold, or swelling" },
  { id: "alignment", label: "Crooked or Gapped Teeth", icon: "✨", desc: "Want straighter teeth without metal wires" },
  { id: "missing", label: "Missing or Broken Tooth", icon: "🦷", desc: "Need a permanent replacement or root fix" },
  { id: "cosmetic", label: "Stained or Yellow Teeth", icon: "💎", desc: "Want a bright, radiant Hollywood smile" },
  { id: "routine", label: "Routine Cleaning & Checkup", icon: "🛡️", desc: "Regular oral hygiene, tartar removal & X-ray" },
];

const STEP_2_OPTIONS = [
  { id: "fast", label: "Quickest possible relief / single-day fix", icon: "⚡" },
  { id: "invisible", label: "Most discreet & invisible aesthetic solution", icon: "👁️" },
  { id: "permanent", label: "Longest lasting permanent medical durability", icon: "🏆" },
  { id: "gentle", label: "100% painless & gentle comfort care", icon: "🌸" },
];

type ResultMapping = {
  serviceName: string;
  serviceSlug: string;
  doctorSpecialty: string;
  estimatedTime: string;
  priceRange: string;
  explanation: string;
  badge: string;
};

const RESULTS: Record<string, ResultMapping> = {
  pain: {
    serviceName: "Single-Sitting Root Canal & Digital X-Ray",
    serviceSlug: "root-canal-treatment",
    doctorSpecialty: "Endodontist Specialist",
    estimatedTime: "45–60 mins",
    priceRange: "Starting ₹3,500",
    explanation: "Our computer-assisted single-visit root canal removes the infected nerve under localized anesthesia with zero pain, saving your natural tooth.",
    badge: "Immediate Pain Relief",
  },
  alignment: {
    serviceName: "Invisalign® Clear Aligners",
    serviceSlug: "invisalign-clear-aligners",
    doctorSpecialty: "Certified Orthodontist",
    estimatedTime: "6–12 months plan",
    priceRange: "Flexible 0% EMI available",
    explanation: "Custom 3D-scanned invisible aligners gently align your bite with zero metal wires, removable anytime while eating.",
    badge: "100% Invisible & Comfortable",
  },
  missing: {
    serviceName: "Precision Dental Implant with Zirconia Crown",
    serviceSlug: "dental-implants",
    doctorSpecialty: "Implantologist & Oral Surgeon",
    estimatedTime: "Lifelong permanent durability",
    priceRange: "Starting ₹18,000",
    explanation: "Biocompatible medical titanium root anchored securely into the jaw, topped with an unbreakable lifelike zirconia tooth.",
    badge: "Permanent Lifetime Solution",
  },
  cosmetic: {
    serviceName: "Laser Teeth Whitening & Deep Polishing",
    serviceSlug: "teeth-cleaning",
    doctorSpecialty: "Cosmetic Dental Specialist",
    estimatedTime: "45 minutes",
    priceRange: "Starting ₹1,200",
    explanation: "Advanced cold-blue LED and dental laser technology lifts deep stains from coffee, tea and smoking by 4–8 shades safely.",
    badge: "Instant 6-Shade Brighter Smile",
  },
  routine: {
    serviceName: "Ultrasonic Scaling, Stain Removal & Consultation",
    serviceSlug: "teeth-cleaning",
    doctorSpecialty: "General Dental Surgeon",
    estimatedTime: "30 minutes",
    priceRange: "Starting ₹900",
    explanation: "Painless ultrasonic scaling removes tartar, plaque and bad breath bacteria, followed by high-gloss fluoridated polishing.",
    badge: "Preventive Care Standard",
  },
};

export default function SmileQuiz() {
  const [step, setStep] = useState<number>(1);
  const [selectedConcern, setSelectedConcern] = useState<string>("alignment");
  const [selectedPriority, setSelectedPriority] = useState<string>("invisible");

  const result = RESULTS[selectedConcern] || RESULTS.alignment;

  function reset() {
    setStep(1);
    setSelectedConcern("alignment");
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/40 to-blue-50/50 p-6 shadow-soft sm:p-10">
      {/* Progress header */}
      <div className="flex items-center justify-between border-b border-sky-100/80 pb-4">
        <div>
          <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-[11px] font-bold tracking-wide uppercase text-sky-800">
            Interactive Smile Matcher
          </span>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Find Your Ideal Dental Treatment in 30 Seconds
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-700">
          Step {step} of 3
          <div className="flex gap-1 ml-2">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-2 rounded-full transition-all ${
                  step === s ? "w-6 bg-sky-600" : step > s ? "w-2 bg-emerald-500" : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step 1: Main Concern */}
      {step === 1 && (
        <div className="mt-6 animate-fade-up">
          <p className="text-sm font-medium text-slate-600">
            1. What is your primary dental goal or current symptom?
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STEP_1_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setSelectedConcern(opt.id);
                  setStep(2);
                }}
                className={`group flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                  selectedConcern === opt.id
                    ? "border-sky-500 bg-sky-500/10 shadow-sm"
                    : "border-slate-200/80 bg-white hover:border-sky-300 hover:shadow-sm"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-xl group-hover:scale-110 transition-transform">
                  {opt.icon}
                </div>
                <div className="mt-3 font-semibold text-slate-900">{opt.label}</div>
                <div className="mt-1 text-xs text-slate-500">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Priority */}
      {step === 2 && (
        <div className="mt-6 animate-fade-up">
          <p className="text-sm font-medium text-slate-600">
            2. What matters most to you in your dental care?
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {STEP_2_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setSelectedPriority(opt.id);
                  setStep(3);
                }}
                className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                  selectedPriority === opt.id
                    ? "border-sky-500 bg-sky-500/10 shadow-sm"
                    : "border-slate-200/80 bg-white hover:border-sky-300 hover:shadow-sm"
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-xl">
                  {opt.icon}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{opt.label}</div>
                  <div className="text-xs text-slate-500">Tap to select &amp; view recommendation</div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              ← Back to question 1
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Result recommendation */}
      {step === 3 && (
        <div className="mt-6 animate-fade-up">
          <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                ✨ Recommended Match: {result.badge}
              </span>
              <span className="text-xs font-semibold text-sky-700">
                {result.doctorSpecialty}
              </span>
            </div>

            <h4 className="mt-3 text-2xl font-bold text-slate-900">
              {result.serviceName}
            </h4>

            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {result.explanation}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-xs sm:grid-cols-3">
              <div>
                <span className="text-slate-500">Typical Duration:</span>
                <div className="font-semibold text-slate-800">{result.estimatedTime}</div>
              </div>
              <div>
                <span className="text-slate-500">Pricing / Plans:</span>
                <div className="font-semibold text-sky-700">{result.priceRange}</div>
              </div>
              <div>
                <span className="text-slate-500">Comfort Level:</span>
                <div className="font-semibold text-emerald-600">Gentle &amp; Painless</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/book?service=${result.serviceSlug}`}
                className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-700"
              >
                Book This Treatment Now
              </Link>
              <Link
                href={`/treatments/${result.serviceSlug}`}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 hover:border-slate-300"
              >
                View Full Treatment Guide
              </Link>
              <button
                onClick={reset}
                className="ml-auto text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
              >
                Retake assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
