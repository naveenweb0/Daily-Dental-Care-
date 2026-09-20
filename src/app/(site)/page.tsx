import Link from "next/link";
import { getActiveServices, getActiveDoctors } from "@/lib/dataProvider";
import { CLINIC, waLink } from "@/lib/clinic";
import BeforeAfterSlider from "@/components/site/BeforeAfterSlider";
import SmileQuiz from "@/components/site/SmileQuiz";
import CostEstimator from "@/components/site/CostEstimator";
import EmergencyBanner from "@/components/site/EmergencyBanner";
import FaqAccordion from "@/components/site/FaqAccordion";
import ReviewsList from "@/components/site/ReviewsList";

export const dynamic = "force-dynamic";

const TRUST_METRICS = [
  { icon: "⭐", value: "5.0 / 5.0", label: "Google Rating", sub: "120+ verified patient reviews" },
  { icon: "🦷", value: "15,000+", label: "Smiles Restored", sub: "Painless implants, RCT & aligners" },
  { icon: "👨‍⚕️", value: "MDS Specialists", label: "Expert Doctors", sub: "Implantologists & Orthodontists" },
  { icon: "✨", value: "100% Painless", label: "Modern Technology", sub: "Laser dentistry & 3D digital scans" },
];

const CLINIC_FEATURES = [
  {
    icon: "🔬",
    title: "Digital 3D Intraoral Scanning",
    desc: "No uncomfortable impression paste. 3D digital impressions rendered in 60 seconds with micron precision.",
  },
  {
    icon: "⚡",
    title: "Single-Sitting Rotary RCT",
    desc: "Computerized apex locators and rotary endodontics for complete painless root canal treatment in one visit.",
  },
  {
    icon: "🛡️",
    title: "Hospital-Grade Class-B Sterilization",
    desc: "Multi-stage autoclaving and individual sealed surgical pouch protocol for 100% infection-free safety.",
  },
  {
    icon: "💎",
    title: "Genuine Lifetime Implant Warranty",
    desc: "FDA-approved international titanium implants (Osstem, Straumann) backed by authenticity warranty cards.",
  },
];

export default async function HomePage() {
  const [allSvc, docs] = await Promise.all([
    getActiveServices(),
    getActiveDoctors(),
  ]);
  const svc = allSvc.slice(0, 6);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden gradient-hero pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Content */}
            <div className="animate-fade-up lg:col-span-7">
              {/* Trust Pill */}
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-sky-200 bg-white/95 px-4 py-1.5 text-xs font-bold text-sky-900 shadow-sm backdrop-blur">
                <span className="flex items-center text-amber-500">★★★★★</span>
                <span>{CLINIC.rating} Google Rating</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-600">Mohali&apos;s Trusted Dental Clinic</span>
              </div>

              {/* Main Headline */}
              <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-[#061528] sm:text-5xl lg:text-6xl">
                Advanced, Painless <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-sky-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
                  Dentistry for Your
                </span>{" "}
                Perfect Smile
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Experience world-class dental care in Phase 7, Mohali. From permanent dental implants and invisible aligners to gentle single-sitting root canals, our MDS specialists prioritize your comfort and confidence.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/book"
                  className="rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-blue-700 px-8 py-4 text-sm font-bold text-white shadow-soft shadow-glow-blue transition hover:from-sky-700 hover:to-blue-800"
                >
                  📅 Book an Appointment
                </Link>
                <a
                  href={`tel:${CLINIC.phoneDial}`}
                  className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-bold text-slate-800 shadow-sm transition hover:border-sky-400 hover:bg-sky-50/50"
                >
                  📞 {CLINIC.phone}
                </a>
                <a
                  href={waLink("Hello Daily Dental Care, I would like to book a consultation in Mohali.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  💬 WhatsApp
                </a>
              </div>

              {/* Quick Trust Highlights */}
              <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> Zero Consultation Waiting
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> 0% Interest EMI Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> Same-Day Emergency Care
                </span>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="relative animate-fade-up lg:col-span-5">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.pexels.com/photos/19976607/pexels-photo-19976607.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
                  alt="Modern Dental Clinic at Daily Dental Care Mohali"
                  className="h-[340px] sm:h-[420px] w-full object-cover"
                />

                {/* Floating Stat Card */}
                <div className="absolute top-4 left-4 rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-lg">
                      ✨
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Dr. Available Today</div>
                      <div className="text-[11px] font-medium text-emerald-700">Slots ready in Mohali</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Hours Overlay */}
                <div className="absolute bottom-4 inset-x-4 rounded-2xl border border-slate-100/90 bg-white/95 p-4 shadow-lg backdrop-blur">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">Phase 7, Sector 61, Mohali</div>
                      <div className="text-slate-500">Mon – Sat · 10:00 AM – 7:00 PM</div>
                    </div>
                    <Link
                      href="/book"
                      className="rounded-full bg-sky-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-sky-700"
                    >
                      Book Slot →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMERGENCY HELPLINE BANNER */}
      <EmergencyBanner />

      {/* TRUST METRICS STRIP */}
      <section className="border-b border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_METRICS.map((m) => (
              <div
                key={m.label}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 transition shadow-hover hover:border-sky-300 hover:bg-white"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-2xl group-hover:scale-110 transition-transform">
                  {m.icon}
                </div>
                <div>
                  <div className="text-xl font-extrabold text-slate-900">{m.value}</div>
                  <div className="text-xs font-bold text-sky-800">{m.label}</div>
                  <div className="text-[11px] text-slate-500">{m.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE & AFTER INTERACTIVE TRANSFORMATION SLIDER */}
      <section className="bg-slate-50/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <BeforeAfterSlider />
        </div>
      </section>

      {/* INTERACTIVE SMILE MATCHER QUIZ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <SmileQuiz />
      </section>

      {/* SERVICES SHOWCASE */}
      <section className="bg-gradient-to-b from-white via-sky-50/30 to-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-800">
                Specialized Care
              </span>
              <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Comprehensive Dental Treatments in Mohali
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                From preventive oral care to advanced surgical and cosmetic reconstructions, all treatments are executed under strict clinical protocols.
              </p>
            </div>
            <Link
              href="/treatments"
              className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-xs font-bold text-slate-800 shadow-sm hover:border-sky-400 hover:text-sky-700"
            >
              Explore All Treatments →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {svc.map((s) => (
              <div
                key={s.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft transition shadow-hover hover:border-sky-300"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    {s.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.image}
                        alt={s.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-sky-100 to-blue-200" />
                    )}
                    <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-800 shadow-sm backdrop-blur">
                      ⏱ {s.durationMinutes} mins
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition">
                      {s.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
                      {s.shortDescription}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <span className="font-bold text-sky-700">{s.price}</span>
                      <span className="font-semibold text-emerald-600">✓ Painless Tech</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 p-6 pt-0">
                  <Link
                    href={`/book?service=${s.slug}`}
                    className="flex-1 rounded-full bg-sky-600 py-2.5 text-center text-xs font-bold text-white shadow-sm transition hover:bg-sky-700"
                  >
                    Book Slot
                  </Link>
                  <Link
                    href={`/treatments/${s.slug}`}
                    className="rounded-full border border-slate-200 px-4 py-2.5 text-center text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLINICAL TECHNOLOGY & STERILIZATION STANDARDS */}
      <section className="bg-[#0A1E3B] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="rounded-full bg-sky-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-300 border border-sky-400/30">
              Modern Clinical Infrastructure
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              State-of-the-Art Dental Technology &amp; Safety
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              We invest in next-generation medical equipment to guarantee maximum precision, zero cross-contamination, and comfortable procedures.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CLINIC_FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-sky-400/50 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 text-2xl border border-sky-400/30">
                  {feat.icon}
                </div>
                <h3 className="mt-4 font-bold text-white text-base">{feat.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COST ESTIMATOR & 0% EMI CALCULATOR */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <CostEstimator />
      </section>

      {/* DOCTORS TEAM */}
      <section className="bg-slate-50/70 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-800">
                Meet The Doctors
              </span>
              <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Our Specialist MDS Team
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Highly qualified dentists dedicated to clinical perfection and patient comfort.
              </p>
            </div>
            <Link
              href="/doctors"
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-800 shadow-sm hover:border-sky-400 hover:text-sky-700"
            >
              View Full Clinical Team →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((d) => (
              <div
                key={d.id}
                className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft transition shadow-hover"
              >
                <div className="relative h-64 w-full bg-slate-100">
                  {d.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.photo} alt={d.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-sky-100 text-4xl">👨‍⚕️</div>
                  )}
                  <div className="absolute top-3 left-3 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                    {d.qualification}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900">{d.name}</h3>
                  <div className="mt-1 text-xs font-semibold text-sky-700">{d.specialization}</div>
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600">{d.bio}</p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <Link
                      href={`/book?doctor=${d.id}`}
                      className="block w-full rounded-full bg-slate-900 py-2.5 text-center text-xs font-bold text-white transition hover:bg-sky-600"
                    >
                      Book with {d.name.split(" ")[1] ?? "Doctor"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PATIENT REVIEWS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 text-center">
          <span className="rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
            Real Patient Experiences
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Why Tricity Loves Daily Dental Care
          </h2>
        </div>
        <ReviewsList />
      </section>

      {/* FAQ HUB */}
      <section className="bg-slate-50/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <span className="rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-800">
              Got Questions?
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions &amp; Care Guides
            </h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* LOCATION & DIRECTIONS */}
      <section className="bg-[#061528] py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-300 border border-sky-400/30">
              Convenient Location
            </span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
              Visit Our Dental Clinic in Mohali
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {CLINIC.address}. Located conveniently in Phase 7 Market with ample car parking space and elevator access.
            </p>

            <div className="mt-6 space-y-2 text-xs text-slate-300">
              <div>📍 <strong>Landmark:</strong> Near Phase 7 Market, Sector 61 Mohali</div>
              <div>🕒 <strong>Timings:</strong> Mon – Sat · 10:00 AM – 7:00 PM (Break 1–2 PM)</div>
              <div>📞 <strong>Phone:</strong> {CLINIC.phone}</div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="rounded-full bg-sky-500 px-7 py-3.5 text-xs font-bold text-slate-950 shadow-soft transition hover:bg-sky-400"
              >
                📅 Book Appointment Online
              </Link>
              <a
                href={CLINIC.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-xs font-bold text-white transition hover:bg-white/20"
              >
                🗺️ Get Directions in Maps
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <iframe
              src={CLINIC.mapsEmbed}
              title="Daily Dental Care Location Map"
              className="h-80 w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}

