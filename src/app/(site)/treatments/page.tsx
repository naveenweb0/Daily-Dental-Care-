import type { Metadata } from "next";
import Link from "next/link";
import { getActiveServices } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dental Treatments in Mohali | Daily Dental Care",
  description:
    "Comprehensive dental treatments including Dental Implants, Invisalign Clear Aligners, Single-Sitting RCT, Laser Teeth Whitening, and Zirconia Crowns in Mohali.",
  alternates: { canonical: "/treatments" },
};

export default async function TreatmentsPage() {
  const rows = await getActiveServices();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-800">
          Clinical Treatments
        </span>
        <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Advanced Dental Treatments in Mohali
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          Explore our complete range of general, restorative, surgical, and cosmetic dental treatments. Every procedure is performed with precision equipment and individualized care.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
          No treatments published yet.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((s) => (
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
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition">
                    {s.name}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                    {s.shortDescription}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="font-bold text-sky-700">{s.price}</span>
                    <span className="font-semibold text-emerald-600">✓ 0% EMI Available</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 p-6 pt-0">
                <Link
                  href={`/book?service=${s.slug}`}
                  className="flex-1 rounded-full bg-sky-600 py-2.5 text-center text-xs font-bold text-white shadow-sm transition hover:bg-sky-700"
                >
                  Book Appointment
                </Link>
                <Link
                  href={`/treatments/${s.slug}`}
                  className="rounded-full border border-slate-200 px-4 py-2.5 text-center text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  View Guide →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

