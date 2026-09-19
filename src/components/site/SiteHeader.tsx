"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CLINIC, waLink } from "@/lib/clinic";
import ClinicStatusBadge from "@/components/site/ClinicStatusBadge";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/treatments", label: "Treatments" },
  { href: "/doctors", label: "Specialists" },
  { href: "/gallery", label: "Before & After" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Top Bar with Live Status & Quick Hotline */}
      <div className="border-b border-slate-100 bg-slate-50/90 px-4 py-1.5 text-xs text-slate-600 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ClinicStatusBadge />
            <span className="hidden text-slate-400 md:inline">|</span>
            <span className="hidden items-center gap-1.5 text-slate-600 md:flex">
              📍 Phase 7, Sector 61, Mohali (SAS Nagar)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="hidden text-emerald-700 sm:inline">⭐ 5.0 Rating (120+ Reviews)</span>
            <a
              href={`tel:${CLINIC.phoneDial}`}
              className="flex items-center gap-1 text-sky-700 hover:text-sky-800"
            >
              <span>📞 Hotline:</span> {CLINIC.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 text-2xl text-white shadow-md transition group-hover:scale-105">
              🦷
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white border-2 border-white">
                ✓
              </span>
            </div>
            <div className="leading-tight">
              <span className="block font-heading text-lg font-bold tracking-tight text-slate-900 group-hover:text-sky-700 transition">
                Daily Dental Care
              </span>
              <span className="block text-[11px] font-medium text-slate-500">
                Multi-Specialty Clinic · Mohali
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => {
              const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-sky-50 text-sky-700 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden items-center gap-2.5 md:flex">
            <Link
              href="/patient/login"
              className="flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50/80 px-3.5 py-2 text-xs font-bold text-sky-800 transition hover:bg-sky-100 hover:border-sky-300"
            >
              <span>👤 Patient Portal</span>
            </Link>
            <a
              href={waLink("Hello Daily Dental Care, I would like to enquire about dental treatments.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50/80 px-3.5 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
            >
              <span>💬 WhatsApp</span>
            </a>
            <Link
              href="/book"
              className="rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:from-sky-700 hover:to-blue-800 hover:shadow-glow-blue"
            >
              📅 Book Slot
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 lg:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {open && (
          <div className="animate-fade-up border-t border-slate-200 bg-white px-4 py-5 shadow-2xl lg:hidden">
            <div className="grid gap-1">
              {NAV.map((n) => {
                const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      active ? "bg-sky-50 text-sky-700" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
              <Link
                href="/patient/login"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-sky-50 px-3 py-2.5 text-sm font-bold text-sky-800"
              >
                👤 Patient Portal Login
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
              <a
                href={waLink("Hello Daily Dental Care, I would like to book an appointment.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2.5 text-center text-xs font-bold text-white shadow-sm"
              >
                💬 WhatsApp
              </a>
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-full bg-sky-600 px-4 py-2.5 text-center text-xs font-bold text-white shadow-sm"
              >
                📅 Book Now
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

