"use client";

import { useState } from "react";
import { CLINIC, waLink } from "@/lib/clinic";

const INTENTS = [
  {
    icon: "📅",
    title: "Book an Appointment",
    desc: "Quickly book a slot today",
    msg: "Hello Daily Dental Care, I would like to book a dental checkup appointment.",
  },
  {
    icon: "✨",
    title: "Invisalign / Aligners Enquiry",
    desc: "Cost, duration & 3D scan details",
    msg: "Hello Daily Dental Care, I want to enquire about Invisalign Clear Aligners and pricing.",
  },
  {
    icon: "🦷",
    title: "Dental Implants Enquiry",
    desc: "Single tooth or full jaw replacement",
    msg: "Hello Daily Dental Care, I would like information regarding Dental Implants.",
  },
  {
    icon: "🚨",
    title: "Urgent Pain / Emergency",
    desc: "Speak immediately with staff",
    msg: "Hello Daily Dental Care, I am having acute dental pain and need immediate assistance.",
  },
  {
    icon: "📍",
    title: "Clinic Location & Directions",
    desc: "Phase 7, Sector 61 Mohali",
    msg: "Hello Daily Dental Care, please send me exact location and clinic directions.",
  },
];

export default function WhatsAppFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-[320px] sm:w-[360px] animate-fade-up overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl font-bold">
                  🦷
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400"></span>
                </div>
                <div>
                  <div className="font-bold leading-tight">Daily Dental Care</div>
                  <div className="text-[11px] text-emerald-100">Usually replies in &lt; 5 mins</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 rounded-xl bg-emerald-800/40 p-2.5 text-xs text-emerald-50">
              👋 Hi there! How can our Mohali dental team assist you today?
            </div>
          </div>

          {/* Intent list */}
          <div className="max-h-[300px] overflow-y-auto p-3 space-y-1.5">
            {INTENTS.map((intent, idx) => (
              <a
                key={idx}
                href={waLink(intent.msg)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-3 rounded-2xl p-2.5 text-left transition hover:bg-emerald-50/80 border border-transparent hover:border-emerald-100"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100/70 text-lg group-hover:scale-110 transition-transform">
                  {intent.icon}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                    {intent.title}
                  </div>
                  <div className="text-[11px] text-slate-500">{intent.desc}</div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </a>
            ))}
          </div>

          {/* Quick Call Alternative */}
          <div className="border-t border-slate-100 bg-slate-50 p-3 text-center text-xs">
            Prefer calling?{" "}
            <a href={`tel:${CLINIC.phoneDial}`} className="font-bold text-sky-700 hover:underline">
              📞 {CLINIC.phone}
            </a>
          </div>
        </div>
      )}

      {/* Trigger Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open WhatsApp Chat Assistance"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-glow-emerald transition-transform hover:scale-105 active:scale-95"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-600 border-2 border-white"></span>
        </span>

        {isOpen ? (
          <span className="text-xl font-bold">✕</span>
        ) : (
          <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z" />
          </svg>
        )}
      </button>
    </div>
  );
}
