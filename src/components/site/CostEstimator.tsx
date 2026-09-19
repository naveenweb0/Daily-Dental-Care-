"use client";

import { useState } from "react";
import Link from "next/link";

function formatINR(n: number): string {
  const str = Math.round(n).toString();
  const lastThree = str.slice(-3);
  const otherNumbers = str.slice(0, -3);
  if (otherNumbers !== "") {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  }
  return lastThree;
}

type TreatmentPricing = {
  id: string;
  name: string;
  costMin: number;
  costMax: number;
  category: string;
  unit: string;
  includes: string[];
  serviceSlug: string;
};

const TREATMENTS: TreatmentPricing[] = [
  {
    id: "consultation",
    name: "Complete Oral Exam & Digital X-Ray",
    costMin: 300,
    costMax: 500,
    category: "General",
    unit: "per visit",
    includes: ["Doctor consultation", "Full mouth digital X-ray", "Treatment plan"],
    serviceSlug: "teeth-cleaning",
  },
  {
    id: "cleaning",
    name: "Ultrasonic Scaling & Deep Polishing",
    costMin: 1200,
    costMax: 2000,
    category: "Preventive",
    unit: "full mouth",
    includes: ["Plaque & tartar removal", "Stain removal", "High-gloss fluoridated polish"],
    serviceSlug: "teeth-cleaning",
  },
  {
    id: "rct",
    name: "Single-Sitting Rotary Root Canal",
    costMin: 3500,
    costMax: 5500,
    category: "Endodontics",
    unit: "per tooth",
    includes: ["Painless computerized rotary RCT", "Medicated obturation", "Digital post-op X-ray"],
    serviceSlug: "root-canal-treatment",
  },
  {
    id: "crown-zirconia",
    name: "Metal-Free 3D Zirconia Crown",
    costMin: 6000,
    costMax: 10000,
    category: "Prosthodontics",
    unit: "per crown",
    includes: ["10-15 Year Warranty", "CAD/CAM precision fit", "Natural translucency"],
    serviceSlug: "dental-crowns-and-bridges",
  },
  {
    id: "implant",
    name: "Single Dental Implant (Osstem / Straumann)",
    costMin: 22000,
    costMax: 35000,
    category: "Implants",
    unit: "per implant unit",
    includes: ["Grade-5 Titanium Implant", "Abutment & Zirconia Crown", "Lifetime warranty card"],
    serviceSlug: "dental-implants",
  },
  {
    id: "aligners",
    name: "Invisalign® Clear Aligners Package",
    costMin: 65000,
    costMax: 140000,
    category: "Orthodontics",
    unit: "full treatment",
    includes: ["3D iTero Digital Scan", "Unlimited aligner trays", "Free retainers & refinement"],
    serviceSlug: "invisalign-clear-aligners",
  },
  {
    id: "whitening",
    name: "Laser Teeth Whitening (In-Office)",
    costMin: 4500,
    costMax: 7500,
    category: "Cosmetic",
    unit: "full mouth",
    includes: ["Instant 6-8 shades lighter", "Gum barrier protection", "Home maintenance gel"],
    serviceSlug: "teeth-cleaning",
  },
];

export default function CostEstimator() {
  const [selectedId, setSelectedId] = useState<string>("implant");
  const [emiTenure, setEmiTenure] = useState<number>(6); // 3, 6, 9, 12 months

  const item = TREATMENTS.find((t) => t.id === selectedId) || TREATMENTS[0];
  const avgCost = Math.round((item.costMin + item.costMax) / 2);
  const monthlyEmi = Math.round(avgCost / emiTenure);

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            100% Transparent Pricing
          </span>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Treatment Cost &amp; 0% Interest EMI Estimator
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            No hidden charges. Transparent upfront quotes with flexible easy EMI financing.
          </p>
        </div>

        <div className="rounded-2xl bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-800 border border-sky-100">
          💳 0% Interest EMI on all treatments above ₹5,000
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Treatment Selector */}
        <div className="space-y-2 lg:col-span-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Dental Treatment:
          </label>
          <div className="grid gap-2 sm:grid-cols-1">
            {TREATMENTS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(t.id)}
                className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-sm transition ${
                  selectedId === t.id
                    ? "border-sky-500 bg-sky-50/60 font-semibold text-sky-900 shadow-sm"
                    : "border-slate-200/80 bg-slate-50/40 text-slate-700 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs font-normal text-slate-500">{t.category} · {t.unit}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">
                    ₹{formatINR(t.costMin)} – ₹{formatINR(t.costMax)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Summary & EMI Calculator */}
        <div className="flex flex-col justify-between rounded-2xl border border-sky-200/80 bg-gradient-to-b from-sky-50/50 to-white p-6 shadow-sm lg:col-span-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">
                {item.category}
              </span>
              <span className="text-xs text-slate-500">Mohali Clinic Rate</span>
            </div>

            <h4 className="mt-3 text-xl font-bold text-slate-900">{item.name}</h4>

            {/* Estimated Price Range */}
            <div className="mt-4 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
              <div className="text-xs font-medium text-slate-500">Estimated Price Range ({item.unit})</div>
              <div className="mt-1 text-3xl font-extrabold text-sky-700">
                ₹{formatINR(item.costMin)} – ₹{formatINR(item.costMax)}*
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                *Exact cost confirmed upon clinical exam &amp; 3D scan complexity.
              </div>
            </div>

            {/* What's included */}
            <div className="mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600">What&apos;s Included:</div>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                {item.includes.map((inc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> {inc}
                  </li>
                ))}
              </ul>
            </div>

            {/* EMI Tenures if above 5k */}
            {avgCost >= 5000 && (
              <div className="mt-5 rounded-xl bg-emerald-50/80 p-4 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950">Flexible 0% Interest EMI</span>
                  <span className="text-xs font-semibold text-emerald-700">₹{formatINR(monthlyEmi)}/month</span>
                </div>

                <div className="mt-3 flex gap-2">
                  {[3, 6, 9, 12].map((tenure) => (
                    <button
                      key={tenure}
                      type="button"
                      onClick={() => setEmiTenure(tenure)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                        emiTenure === tenure
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      {tenure} Mos
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
            <Link
              href={`/book?service=${item.serviceSlug}`}
              className="flex-1 rounded-full bg-sky-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-sky-700"
            >
              Book for ₹{formatINR(item.costMin)}
            </Link>
            <Link
              href={`/treatments/${item.serviceSlug}`}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 hover:border-slate-300"
            >
              Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

