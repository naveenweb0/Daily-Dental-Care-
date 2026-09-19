import Link from "next/link";
import { CLINIC, waLink } from "@/lib/clinic";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-slate-800 bg-[#061528] text-white">
      {/* Top CTA Strip */}
      <div className="border-b border-white/10 bg-gradient-to-r from-sky-900/80 via-blue-950 to-sky-900/80 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
          <div>
            <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-300 border border-sky-400/30">
              Ready for a healthier smile?
            </span>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Book Your Complete Consultation &amp; 3D Scan in Mohali
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Same-day appointments available for checkup, tooth pain, implants &amp; clear aligners.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/book"
              className="rounded-full bg-sky-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-soft transition hover:bg-sky-400"
            >
              📅 Schedule Appointment
            </Link>
            <a
              href={`tel:${CLINIC.phoneDial}`}
              className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              📞 Call {CLINIC.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-xl font-bold text-white shadow-md">
              🦷
            </div>
            <div>
              <div className="font-heading text-lg font-bold leading-none text-white">Daily Dental Care</div>
              <div className="text-[11px] text-sky-400">Multi-Specialty Dental Clinic</div>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-400">
            {CLINIC.tagline}. Delivering painless, technology-driven dentistry with 5.0 Google Rated patient satisfaction in Mohali, Punjab.
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs text-slate-300 backdrop-blur">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <span>⭐⭐⭐⭐⭐</span>
              <span>{CLINIC.rating} / 5.0</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Verified by <strong>{CLINIC.reviews}+ Google Patient Reviews</strong>
            </div>
          </div>
        </div>

        {/* Treatments column */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400">Dental Treatments</div>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
            <li><Link href="/treatments/dental-implants" className="hover:text-sky-300 transition">Single &amp; Full Mouth Implants</Link></li>
            <li><Link href="/treatments/invisalign-clear-aligners" className="hover:text-sky-300 transition">Invisalign Clear Aligners</Link></li>
            <li><Link href="/treatments/root-canal-treatment" className="hover:text-sky-300 transition">Single-Sitting Root Canal</Link></li>
            <li><Link href="/treatments/teeth-cleaning" className="hover:text-sky-300 transition">Laser Teeth Whitening &amp; Scaling</Link></li>
            <li><Link href="/treatments/dental-crowns-and-bridges" className="hover:text-sky-300 transition">Metal-Free Zirconia Crowns</Link></li>
            <li><Link href="/treatments" className="text-sky-400 font-bold hover:underline">View All 10+ Treatments →</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400">Quick Navigation</div>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
            <li><Link href="/patient/login" className="text-sky-300 font-bold hover:underline">👤 Patient Portal Login</Link></li>
            <li><Link href="/about" className="hover:text-sky-300 transition">About Our Mohali Clinic</Link></li>
            <li><Link href="/doctors" className="hover:text-sky-300 transition">Specialist Doctors &amp; MDS Team</Link></li>
            <li><Link href="/gallery" className="hover:text-sky-300 transition">Before &amp; After Gallery</Link></li>
            <li><Link href="/reviews" className="hover:text-sky-300 transition">Patient Testimonials &amp; Reviews</Link></li>
            <li><Link href="/faq" className="hover:text-sky-300 transition">Frequently Asked Questions</Link></li>
            <li><Link href="/contact" className="hover:text-sky-300 transition">Location &amp; Directions</Link></li>
          </ul>
        </div>

        {/* Visit Us & Hours */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400">Visit Our Clinic</div>
          <p className="mt-4 text-xs leading-relaxed text-slate-300">
            {CLINIC.address}
          </p>

          <div className="mt-3 space-y-1.5 text-xs text-slate-400">
            <div>🕒 <strong>Mon – Sat:</strong> 10:00 AM – 7:00 PM</div>
            <div>☕ <strong>Lunch Break:</strong> 1:00 PM – 2:00 PM</div>
            <div className="text-rose-400 font-medium">⛔ <strong>Sunday:</strong> Closed (Emergency on call)</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={CLINIC.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-500/10 px-3.5 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/20"
            >
              📍 Google Maps Direction
            </a>
            <a
              href={waLink("Hello Daily Dental Care, I have an enquiry.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal */}
      <div className="border-t border-white/10 bg-black/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} Daily Dental Care Mohali. All clinical rights reserved.</span>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/patient/login" className="text-sky-300 font-semibold hover:underline">Patient Portal 👤</Link>
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/admin" className="text-sky-400 font-semibold hover:underline">Staff CRM Login 🔐</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

