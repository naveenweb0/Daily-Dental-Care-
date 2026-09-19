"use client";

import { useState } from "react";
import Link from "next/link";

type FaqItem = {
  q: string;
  a: string;
  cat: string;
};

const FAQS: FaqItem[] = [
  {
    cat: "Implants",
    q: "Is dental implant surgery painful?",
    a: "Not at all. The procedure is performed under precision local anesthesia and computerized guidance. Most patients report that getting a dental implant causes less discomfort than a standard tooth extraction, and normal eating can resume within 24–48 hours.",
  },
  {
    cat: "Implants",
    q: "How long do dental implants last?",
    a: "Dental implants are designed to be a permanent, lifelong solution. With proper brushing, flossing, and regular 6-month checkups, titanium implants boast a clinical success rate of over 98% for life.",
  },
  {
    cat: "Aligners",
    q: "How do Invisalign clear aligners work vs traditional metal braces?",
    a: "Invisalign uses a series of custom 3D printed medical-grade transparent polymer trays that apply gentle, controlled force to gradually move your teeth. Unlike metal braces, there are no painful brackets or wires, and you can remove them while eating and brushing.",
  },
  {
    cat: "Aligners",
    q: "How many hours a day must I wear my clear aligners?",
    a: "For optimal results, aligners should be worn for 20 to 22 hours per day, removing them only for eating, drinking non-water beverages, and cleaning your teeth.",
  },
  {
    cat: "Root Canal",
    q: "Can a root canal be completed in a single sitting?",
    a: "Yes! At Daily Dental Care Mohali, over 90% of root canals are completed in a single 45-to-60 minute session using our advanced rotary endodontics and apex locators, eliminating the need for multiple painful visits.",
  },
  {
    cat: "General",
    q: "How often should I get my teeth professionally cleaned?",
    a: "The Indian Dental Association and ADA recommend professional ultrasonic scaling and polishing every 6 months to remove hardened tartar and prevent gum disease and enamel erosion.",
  },
  {
    cat: "General",
    q: "What payment options and EMI plans are available?",
    a: "We accept Cash, UPI, Credit/Debit Cards, and offer 0% Interest EMI options across major banks for treatments such as Implants, Clear Aligners, and full mouth rehabilitations.",
  },
  {
    cat: "Emergency",
    q: "What should I do if a tooth gets knocked out due to an injury?",
    a: "Handle the tooth only by the crown (never touch the root), rinse gently with milk or saline if dirty, and place the tooth in a cup of cold milk or inside the cheek. Call our Mohali emergency line immediately—if seen within 60 minutes, the tooth can often be successfully saved!",
  },
];

const CATEGORIES = ["All", "Implants", "Aligners", "Root Canal", "General", "Emergency"];

export default function FaqAccordion() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = FAQS.filter((f) => {
    const matchCat = activeCategory === "All" || f.cat === activeCategory;
    const matchSearch =
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft sm:p-10">
      {/* Category Pills & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeCategory === cat
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search dental questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Accordion list */}
      <div className="mt-6 divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No questions found matching &ldquo;{searchQuery}&rdquo;. Try asking our doctors directly!
          </div>
        ) : (
          filtered.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-900 transition hover:text-sky-600"
                >
                  <span className="flex items-center gap-3">
                    <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-700">
                      {faq.cat}
                    </span>
                    {faq.q}
                  </span>
                  <span className={`text-lg font-bold text-sky-600 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </button>
                {isOpen && (
                  <div className="mt-3 animate-fade-up pl-1 text-sm leading-relaxed text-slate-600">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still have questions */}
      <div className="mt-8 rounded-2xl bg-sky-50/70 p-5 flex flex-wrap items-center justify-between gap-4 border border-sky-100">
        <div>
          <div className="text-sm font-bold text-slate-900">Have a specific question about your teeth?</div>
          <div className="text-xs text-slate-500">Our chief dental surgeons are ready to assist you.</div>
        </div>
        <Link
          href="/contact"
          className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Ask a Doctor →
        </Link>
      </div>
    </div>
  );
}
