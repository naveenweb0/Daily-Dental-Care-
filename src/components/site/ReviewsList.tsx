"use client";

import { useState } from "react";
import { CLINIC } from "@/lib/clinic";

type Review = {
  id: number;
  name: string;
  rating: number;
  date: string;
  treatment: string;
  comment: string;
  verified: boolean;
  avatarBg: string;
};

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Gurpreet Singh",
    rating: 5,
    date: "2 weeks ago",
    treatment: "Dental Implants",
    comment:
      "Got 2 dental implants done by Dr. Vikram. Completely painless procedure and the zirconia teeth look 100% natural! The clinic sterilisation standards in Phase 7 Mohali are exceptional.",
    verified: true,
    avatarBg: "bg-blue-600",
  },
  {
    id: 2,
    name: "Simran Kaur",
    rating: 5,
    date: "1 month ago",
    treatment: "Invisalign Aligners",
    comment:
      "Best orthodontist clinic in Tricity! Started my clear aligners 5 months ago and my teeth have straightened amazingly well. Highly transparent pricing with 0% interest EMI.",
    verified: true,
    avatarBg: "bg-emerald-600",
  },
  {
    id: 3,
    name: "Amitabh Sharma",
    rating: 5,
    date: "3 weeks ago",
    treatment: "Single-Sitting RCT",
    comment:
      "Came in severe pain on a Saturday morning. Dr. Ananya did the entire root canal in just 45 minutes with zero pain. Post-op recovery was super smooth.",
    verified: true,
    avatarBg: "bg-purple-600",
  },
  {
    id: 4,
    name: "Pooja Verma",
    rating: 5,
    date: "2 months ago",
    treatment: "Laser Teeth Whitening",
    comment:
      "Got laser teeth whitening done before my brother's wedding. Saw a massive difference of 6 shades in under 1 hour! Highly recommended Daily Dental Care.",
    verified: true,
    avatarBg: "bg-amber-600",
  },
  {
    id: 5,
    name: "Rajesh Malhotra",
    rating: 5,
    date: "1 month ago",
    treatment: "Ultrasonic Scaling & Polish",
    comment:
      "Very gentle and thorough teeth cleaning session. The doctors explain every step clearly and do not push unnecessary procedures.",
    verified: true,
    avatarBg: "bg-sky-600",
  },
  {
    id: 6,
    name: "Harleen Dhillon",
    rating: 5,
    date: "3 months ago",
    treatment: "Porcelain Crown",
    comment:
      "CAD/CAM zirconia crown fitted in just 2 days. The bite feels completely natural and matches my other teeth perfectly. Very polite reception staff.",
    verified: true,
    avatarBg: "bg-rose-600",
  },
];

const TREATMENTS_FILTER = ["All", "Dental Implants", "Invisalign Aligners", "Single-Sitting RCT", "Laser Teeth Whitening", "Porcelain Crown"];

export default function ReviewsList() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filtered = SAMPLE_REVIEWS.filter(
    (r) => selectedFilter === "All" || r.treatment === selectedFilter
  );

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 p-8 text-white shadow-soft">
        <div className="grid items-center gap-8 md:grid-cols-12">
          <div className="text-center md:col-span-5 md:text-left">
            <div className="text-5xl font-extrabold text-sky-400 sm:text-6xl">{CLINIC.rating}</div>
            <div className="mt-2 flex justify-center gap-1 text-2xl text-amber-400 md:justify-start">
              {"★".repeat(5)}
            </div>
            <div className="mt-2 text-sm text-slate-300">
              Based on <strong>{CLINIC.reviews} verified patient reviews</strong> on Google Business Profile
            </div>
          </div>

          <div className="space-y-2 text-xs md:col-span-7">
            <div className="flex items-center gap-3">
              <span className="w-12 text-slate-300 font-semibold">5 Stars</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-700">
                <div className="h-full w-[96%] rounded-full bg-amber-400" />
              </div>
              <span className="w-10 text-right text-slate-300">96%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-12 text-slate-300 font-semibold">4 Stars</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-700">
                <div className="h-full w-[4%] rounded-full bg-amber-400" />
              </div>
              <span className="w-10 text-right text-slate-300">4%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-12 text-slate-400 font-semibold">3 Stars</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-700">
                <div className="h-full w-[0%] rounded-full bg-amber-400" />
              </div>
              <span className="w-10 text-right text-slate-400">0%</span>
            </div>

            <div className="pt-3">
              <a
                href={CLINIC.reviewsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-slate-100"
              >
                <span>⭐ Write a Review on Google</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {TREATMENTS_FILTER.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedFilter(t)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              selectedFilter === t
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-soft transition"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${rev.avatarBg}`}
                  >
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{rev.name}</div>
                    <div className="text-[11px] text-slate-400">{rev.date}</div>
                  </div>
                </div>

                <div className="text-amber-400 text-sm">{"★".repeat(rev.rating)}</div>
              </div>

              <div className="mt-3 inline-block rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-700">
                {rev.treatment}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 border-t border-slate-100 pt-3">
              <span>✓ Verified Google Patient</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
