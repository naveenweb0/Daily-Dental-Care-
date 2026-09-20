import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, getOtherServices } from "@/lib/dataProvider";
import { CLINIC, waLink } from "@/lib/clinic";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getServiceBySlug(slug);
  if (!s) return { title: "Treatment not found" };
  return {
    title: s.seoTitle || `${s.name} in Mohali | Daily Dental Care`,
    description: s.seoDescription || s.shortDescription,
    alternates: { canonical: `/treatments/${s.slug}` },
    openGraph: { title: s.seoTitle || s.name, description: s.seoDescription || s.shortDescription, images: s.image ? [s.image] : [] },
  };
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getServiceBySlug(slug);
  if (!s) notFound();
  const others = await getOtherServices(s.slug, 4);

  return (
    <div>
      {/* Hero */}
      <div className="gradient-hero border-b border-slate-100">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Link href="/treatments" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800">
              ← Back to all treatments
            </Link>
            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {s.name}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{s.shortDescription}</p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-slate-700">
              <span className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sky-900">
                ⏱ {s.durationMinutes} minutes session
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-900">
                💰 {s.price}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-800">
                ⭐ 100% Painless Protocol
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/book?service=${s.slug}`}
                className="rounded-full bg-sky-600 px-7 py-3.5 text-xs font-bold text-white shadow-soft transition hover:bg-sky-700"
              >
                📅 Book Consultation
              </Link>
              <a
                href={waLink(`Hello Daily Dental Care, I would like to know more about ${s.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white transition hover:bg-emerald-700"
              >
                💬 Ask on WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            {s.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.image}
                alt={s.name}
                className="h-72 sm:h-96 w-full rounded-3xl object-cover shadow-soft border border-slate-200/80"
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-8">
          {/* Overview */}
          <section>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900">Treatment Overview</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{s.description}</p>
          </section>

          {/* Benefits */}
          {s.benefits.length > 0 && (
            <section>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900">Key Benefits</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {s.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/40 p-4 text-xs font-medium text-slate-800">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Step by Step Procedure */}
          {s.procedure.length > 0 && (
            <section>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900">How The Procedure Works</h2>
              <div className="mt-4 space-y-3">
                {s.procedure.map((p, i) => (
                  <div key={p} className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 text-xs leading-relaxed text-slate-700 shadow-sm">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-sky-600 font-bold text-white text-xs">
                      {i + 1}
                    </span>
                    <div className="pt-0.5">{p}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Suitable for */}
          {s.suitableFor.length > 0 && (
            <section className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-6">
              <h2 className="font-heading text-xl font-bold text-slate-900">Who Is This Suitable For?</h2>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                {s.suitableFor.map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <span className="text-sky-600 font-bold">•</span> {x}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[11px] text-slate-400">
                *Suitability is confirmed during your clinical examination by our dental surgeon.
              </p>
            </section>
          )}

          {/* FAQs */}
          {s.faqs.length > 0 && (
            <section>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
              <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
                {s.faqs.map((f) => (
                  <details key={f.q} className="group p-5">
                    <summary className="cursor-pointer list-none text-sm font-bold text-slate-900 hover:text-sky-600 flex justify-between items-center">
                      <span>{f.q}</span>
                      <span className="text-sky-600 transition group-open:rotate-180">▾</span>
                    </summary>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-3xl border border-sky-200 bg-gradient-to-b from-sky-50/60 to-white p-6 shadow-soft">
              <span className="rounded-md bg-sky-100 px-2.5 py-1 text-[11px] font-bold text-sky-800">
                Mohali Clinic
              </span>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Book Your {s.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Schedule a consultation with our MDS specialists for a comprehensive exam and digital treatment plan.
              </p>
              <div className="mt-4 rounded-xl bg-white p-3 border border-slate-100 text-xs">
                <div className="text-slate-500">Starting Price:</div>
                <div className="text-lg font-bold text-sky-700">{s.price}</div>
              </div>
              <Link
                href={`/book?service=${s.slug}`}
                className="mt-4 block w-full rounded-full bg-sky-600 py-3 text-center text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition"
              >
                📅 Book Appointment
              </Link>
              <a
                href={`tel:${CLINIC.phoneDial}`}
                className="mt-2 block w-full rounded-full border border-slate-300 bg-white py-2.5 text-center text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                📞 Call {CLINIC.phone}
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Other Treatments</h4>
              <ul className="mt-3 space-y-2 text-xs">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link href={`/treatments/${o.slug}`} className="flex justify-between text-slate-700 hover:text-sky-600">
                      <span>{o.name}</span>
                      <span className="text-slate-400">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

