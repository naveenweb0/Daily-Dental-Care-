"use client";

import { CLINIC, waLink } from "@/lib/clinic";

export default function EmergencyBanner() {
  return (
    <div className="border-y border-rose-200/80 bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-lg text-white shadow-sm">
            🚨
          </span>
          <div>
            <div className="text-sm font-bold text-rose-950">
              Dental Emergency in Mohali? Same-Day Priority Slots Available
            </div>
            <div className="text-xs text-rose-800/80">
              Severe toothache, broken tooth, swelling, or knocked-out tooth · Immediate pain relief.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${CLINIC.phoneDial}`}
            className="rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700"
          >
            📞 Call Now {CLINIC.phone}
          </a>
          <a
            href={waLink("EMERGENCY: I have severe toothache / dental emergency and need immediate attention in Mohali.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
          >
            💬 Emergency WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
