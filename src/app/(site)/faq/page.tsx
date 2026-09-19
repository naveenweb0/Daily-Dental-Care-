import type { Metadata } from "next";
import FaqAccordion from "@/components/site/FaqAccordion";
import { CLINIC } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "Dental FAQ & Patient Care Guides | Daily Dental Care Mohali",
  description: "Answers about dental implants, Invisalign aligners, painless root canal, charges, and recovery tips at Daily Dental Care Mohali.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-800">
          Knowledge Base
        </span>
        <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Frequently Asked Questions &amp; Dental Guides
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          Find transparent answers regarding treatment timelines, pain management, costs, insurance, and post-procedure recovery instructions.
        </p>
      </div>

      <div className="mt-12">
        <FaqAccordion />
      </div>
    </div>
  );
}

