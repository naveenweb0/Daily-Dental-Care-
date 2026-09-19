import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments, doctors, services } from "@/db/schema";
import { CLINIC, waLink, label } from "@/lib/clinic";
import { formatTime12 } from "@/lib/time";

export const dynamic = "force-dynamic";

export const metadata = { title: "Appointment Confirmed | Daily Dental Care Mohali", robots: { index: false } };

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const rows = id
    ? await db
        .select({ a: appointments, doctorName: doctors.name, serviceName: services.name })
        .from(appointments)
        .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
        .leftJoin(services, eq(services.id, appointments.serviceId))
        .where(eq(appointments.appointmentNumber, id))
        .limit(1)
    : [];
  const row = rows[0];

  if (!row) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="text-4xl">🔍</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Appointment Reference Not Found</h1>
        <p className="mt-2 text-xs text-slate-600">We could not locate that appointment ID in our clinic records.</p>
        <Link href="/book" className="mt-6 inline-block rounded-full bg-sky-600 px-6 py-3 text-xs font-bold text-white shadow-soft">
          Book an Appointment
        </Link>
      </div>
    );
  }

  const a = row.a;
  const ics = `/api/appointments/ics?id=${a.appointmentNumber}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      {/* Success Badge */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-8 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-3xl text-white shadow-glow-emerald">
          ✓
        </div>
        <span className="mt-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
          Booking Confirmed &amp; Queued
        </span>
        <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Appointment Scheduled Successfully
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          A confirmation SMS &amp; WhatsApp note has been prepared for <strong>{a.phone}</strong>.
        </p>

        {/* Reference ID Pill */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 shadow-sm">
          <span className="text-xs text-slate-400">Appointment ID:</span>
          <span className="font-mono text-sm font-extrabold text-sky-700">{a.appointmentNumber}</span>
        </div>
      </div>

      {/* Digital Appointment Pass */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-soft">
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🦷</span>
            <span className="font-heading font-bold text-sm">Daily Dental Care Pass</span>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
            {label(a.status)}
          </span>
        </div>

        <dl className="divide-y divide-slate-100 text-xs">
          <Row k="Patient Name" v={a.patientName} />
          <Row k="Dental Treatment" v={row.serviceName ?? "Comprehensive Examination"} />
          <Row k="Consulting Doctor" v={row.doctorName ?? "Dental Specialist"} />
          <Row k="Appointment Date" v={a.appointmentDate} />
          <Row k="Scheduled Time" v={`${formatTime12(a.startTime)} – ${formatTime12(a.endTime)}`} highlight />
          <Row k="Clinic Location" v="SCF-124, Phase 7, Sector 61, Mohali (SAS Nagar)" />
        </dl>
      </div>

      {/* Next Step Actions */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <a
          href={ics}
          className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-center text-xs font-bold text-slate-800 shadow-sm hover:border-sky-400 hover:bg-sky-50/50 transition"
        >
          <span>📅 Add to Apple/Google Calendar</span>
        </a>
        <a
          href={waLink(`Hello Daily Dental Care, confirming my appointment ${a.appointmentNumber} on ${a.appointmentDate} at ${formatTime12(a.startTime)}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-center text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
        >
          <span>💬 Open in WhatsApp</span>
        </a>
        <a
          href={CLINIC.mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-center text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
        >
          <span>📍 Get Clinic Directions</span>
        </a>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-center text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
        >
          <span>← Back to Website</span>
        </Link>
      </div>
    </div>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4 px-6 py-3.5">
      <dt className="text-slate-500 font-medium">{k}</dt>
      <dd className={`text-right font-bold ${highlight ? "text-sky-700 font-extrabold" : "text-slate-900"}`}>{v}</dd>
    </div>
  );
}

