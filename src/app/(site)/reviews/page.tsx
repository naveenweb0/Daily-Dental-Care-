import type { Metadata } from "next";
import Link from "next/link";
import ReviewsList from "@/components/site/ReviewsList";
import { CLINIC } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "Patient Reviews & Testimonials | Daily Dental Care Mohali",
  description: "Daily Dental Care is rated 5.0 on Google with 120+ verified patient reviews in Phase 7 Mohali.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
          Patient Stories
        </span>
        <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Verified Patient Reviews &amp; Experiences
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          Read genuine feedback from patients who visited Daily Dental Care for dental implants, clear aligners, pain-free root canals, and cosmetic smile designs in Mohali.
        </p>
      </div>

      <div className="mt-12">
        <ReviewsList />
      </div>

      <div className="mt-16 rounded-3xl bg-slate-50 p-8 text-center sm:p-12 border border-slate-200/80">
        <h3 className="font-heading text-2xl font-bold text-slate-900">Experience 5-Star Dental Care in Mohali</h3>
        <p className="mx-auto mt-2 max-w-lg text-xs text-slate-600">
          Book your consultation today and join thousands of satisfied smiles across Tricity.
        </p>
        <Link
          href="/book"
          className="mt-6 inline-block rounded-full bg-sky-600 px-8 py-3.5 text-xs font-bold text-white shadow-soft hover:bg-sky-700"
        >
          📅 Book Your Visit Now
        </Link>
      </div>
    </div>
  );
}

