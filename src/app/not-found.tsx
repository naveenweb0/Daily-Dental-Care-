import Link from "next/link";
import { CLINIC, waLink } from "@/lib/clinic";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50/40 via-white to-slate-50 px-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-100 text-4xl shadow-soft">
          🦷
        </div>

        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 uppercase tracking-wider">
          404 · Page Not Found
        </span>

        <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Looks like this tooth is missing!
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          The page you are looking for may have been moved, renamed, or is temporarily unavailable.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-3 text-xs font-bold text-white shadow-soft hover:from-sky-700 hover:to-blue-800 transition"
          >
            ← Return to Home
          </Link>
          <Link
            href="/book"
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            📅 Book Appointment
          </Link>
          <a
            href={waLink("Hello Daily Dental Care, I was browsing the website and need help.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-emerald-300 bg-emerald-50 px-5 py-3 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
          >
            💬 WhatsApp Help
          </a>
        </div>

        <div className="border-t border-slate-200/80 pt-6 text-xs text-slate-400">
          Daily Dental Care · Phase 7, Mohali · Hotline: {CLINIC.phone}
        </div>
      </div>
    </div>
  );
}
