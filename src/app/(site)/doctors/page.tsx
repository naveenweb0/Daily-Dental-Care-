import type { Metadata } from "next";
import Link from "next/link";
import { getActiveDoctors } from "@/lib/dataProvider";
import { CLINIC, waLink } from "@/lib/clinic";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Specialist MDS Dental Doctors in Mohali | Daily Dental Care",
  description:
    "Meet our expert MDS dentists, implantologists, orthodontists, and cosmetic surgeons at Daily Dental Care, Phase 7 Mohali.",
  alternates: { canonical: "/doctors" },
};

export default async function DoctorsPage() {
  const rows = await getActiveDoctors();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-800">
          Specialist Team
        </span>
        <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Meet Our Dental Specialists in Mohali
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          Our team comprises seasoned MDS dental surgeons, implantologists, and certified Invisalign orthodontists with thousands of successful clinical procedures.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((d) => (
          <div
            key={d.id}
            className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft transition shadow-hover"
          >
            <div>
              <div className="relative h-72 w-full bg-slate-100">
                {d.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.photo} alt={d.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-sky-100 text-5xl">👨‍⚕️</div>
                )}
                <div className="absolute top-3 left-3 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-white backdrop-blur shadow-sm">
                  {d.qualification}
                </div>
                {d.experience && (
                  <div className="absolute bottom-3 right-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    {d.experience} Experience
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900">{d.name}</h2>
                <div className="mt-1 text-xs font-bold text-sky-700">{d.specialization}</div>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">{d.bio}</p>

                <div className="mt-5 rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Availability:</span>
                    <span className="font-semibold text-slate-800">Mon – Sat (10 AM – 7 PM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Consultation:</span>
                    <span className="font-semibold text-emerald-700">Open for new patients</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 p-6 pt-0">
              <Link
                href={`/book?doctor=${d.id}`}
                className="flex-1 rounded-full bg-sky-600 py-3 text-center text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition"
              >
                📅 Book with {d.name.split(" ")[1] ?? "Doctor"}
              </Link>
              <a
                href={waLink(`Hello Daily Dental Care, I would like to consult with ${d.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-emerald-300 bg-emerald-50 px-4 py-3 text-center text-xs font-bold text-emerald-800 hover:bg-emerald-100"
              >
                💬
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Notice */}
      <div className="mt-16 rounded-3xl border border-sky-100 bg-sky-50/50 p-8 text-center sm:p-12">
        <h3 className="font-heading text-2xl font-bold text-slate-900">Need Guidance on Which Specialist to See?</h3>
        <p className="mx-auto mt-2 max-w-xl text-xs text-slate-600">
          Our front desk triage team will understand your symptoms and connect you with the most appropriate dental specialist.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/book" className="rounded-full bg-sky-600 px-7 py-3 text-xs font-bold text-white shadow-sm hover:bg-sky-700">
            Book General Consultation
          </Link>
          <a href={`tel:${CLINIC.phoneDial}`} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-800 hover:bg-slate-50">
            📞 Call {CLINIC.phone}
          </a>
        </div>
      </div>
    </div>
  );
}

