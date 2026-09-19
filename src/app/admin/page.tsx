import Link from "next/link";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { STATUS_COLORS, label, waLink } from "@/lib/clinic";
import { formatTime12, todayISO } from "@/lib/time";

export const dynamic = "force-dynamic";

type Row = Record<string, string | number | null>;

export default async function AdminDashboard() {
  const today = todayISO();
  const stats = await db.execute(sql`
    select
      (select count(*) from appointments where appointment_date = ${today})::int as today_appts,
      (select count(*) from leads where stage = 'new')::int as new_leads,
      (select count(*) from appointments where status in ('new','pending'))::int as pending,
      (select count(*) from appointments where status = 'confirmed')::int as confirmed,
      (select count(*) from appointments where status = 'completed')::int as completed,
      (select count(*) from appointments where status = 'cancelled')::int as cancelled,
      (select count(*) from appointments where to_char(appointment_date,'YYYY-MM') = to_char(current_date,'YYYY-MM'))::int as this_month,
      (select count(*) from leads)::int as total_leads,
      (select count(*) from leads where stage in ('appointment_confirmed','visited','treatment_started','converted'))::int as converted_leads
  `);
  const s = (stats.rows[0] ?? {}) as Row;
  const conv = Number(s.total_leads) > 0 ? Math.round((Number(s.converted_leads) / Number(s.total_leads)) * 100) : 0;

  const todays = await db.execute(sql`
    select a.id, a.appointment_number, a.patient_name, a.start_time, a.status, a.phone,
           d.name as doctor, s.name as service
    from appointments a
    left join doctors d on d.id = a.doctor_id
    left join services s on s.id = a.service_id
    where a.appointment_date = ${today}
    order by a.start_time`);

  const recentLeads = await db.execute(sql`
    select id, name, phone, source, stage, created_at from leads order by created_at desc limit 6`);

  const cards = [
    { label: "Today's Appointments", value: s.today_appts, href: "/admin/appointments", color: "text-sky-700", bg: "bg-sky-50", icon: "📅" },
    { label: "New Incoming Leads", value: s.new_leads, href: "/admin/leads?stage=new", color: "text-amber-700", bg: "bg-amber-50", icon: "👥" },
    { label: "Pending Confirmation", value: s.pending, href: "/admin/appointments?status=pending", color: "text-purple-700", bg: "bg-purple-50", icon: "⏳" },
    { label: "Confirmed Slots", value: s.confirmed, href: "/admin/appointments?status=confirmed", color: "text-blue-700", bg: "bg-blue-50", icon: "✅" },
    { label: "Completed Patients", value: s.completed, href: "/admin/appointments?status=completed", color: "text-emerald-700", bg: "bg-emerald-50", icon: "🏆" },
    { label: "Cancelled / No-Shows", value: s.cancelled, href: "/admin/appointments?status=cancelled", color: "text-rose-700", bg: "bg-rose-50", icon: "❌" },
    { label: "Appointments This Month", value: s.this_month, href: "/admin/analytics", color: "text-indigo-700", bg: "bg-indigo-50", icon: "📈" },
    { label: "Lead ➔ Patient Conversion", value: `${conv}%`, href: "/admin/analytics", color: "text-teal-700", bg: "bg-teal-50", icon: "🎯" },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="rounded-md bg-sky-100 px-2.5 py-1 text-[11px] font-bold text-sky-800">
            Real-time Clinic Overview
          </span>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-slate-900">
            Clinic Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500">Live monitoring of today&apos;s appointments, lead conversions, and clinic queue.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/book"
            target="_blank"
            className="rounded-full bg-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-sky-700"
          >
            + Quick Patient Booking
          </Link>
          <a
            href="/api/export?type=appointments"
            className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            ⬇ Export Data
          </a>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-soft transition shadow-hover hover:border-sky-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{c.label}</span>
              <span className={`flex h-9 w-9 items-center justify-center rounded-2xl ${c.bg} text-lg`}>
                {c.icon}
              </span>
            </div>
            <div className={`mt-3 text-3xl font-extrabold ${c.color}`}>{String(c.value ?? 0)}</div>
          </Link>
        ))}
      </div>

      {/* Main Grid: Today's Schedule & CRM Leads */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Today's Schedule */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">Today&apos;s Patient Queue</h2>
              <p className="text-xs text-slate-400">Scheduled appointments for today in Mohali</p>
            </div>
            <Link href="/admin/appointments" className="text-xs font-bold text-sky-700 hover:underline">
              View Calendar →
            </Link>
          </div>

          {todays.rows.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-10 text-center">
              <div className="text-3xl">☕</div>
              <p className="mt-2 text-xs text-slate-500 font-medium">No appointments scheduled for today yet.</p>
              <Link
                href="/book"
                target="_blank"
                className="mt-4 inline-block rounded-full bg-sky-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-700"
              >
                + Book Patient Slot
              </Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {(todays.rows as Row[]).map((r) => (
                <li key={String(r.id)} className="flex items-center justify-between gap-3 py-3.5 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{String(r.patient_name)}</div>
                    <div className="text-[11px] text-slate-500">
                      {String(r.service ?? "Consultation")} · {String(r.doctor ?? "Specialist")}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="font-mono font-bold text-slate-800">{formatTime12(String(r.start_time))}</div>
                      <span className={`mt-0.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_COLORS[String(r.status)] ?? "bg-slate-100"}`}>
                        {label(String(r.status))}
                      </span>
                    </div>

                    <a
                      href={waLink(`Hello ${r.patient_name}, this is Daily Dental Care Mohali confirming your appointment today at ${formatTime12(String(r.start_time))}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                      title="Send WhatsApp Reminder"
                    >
                      💬
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent CRM Leads */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">Recent Inquiries &amp; Leads</h2>
              <p className="text-xs text-slate-400">Prospective patients from web &amp; WhatsApp</p>
            </div>
            <Link href="/admin/leads" className="text-xs font-bold text-sky-700 hover:underline">
              Open CRM →
            </Link>
          </div>

          {recentLeads.rows.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
              No new inquiries logged yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {(recentLeads.rows as Row[]).map((r) => (
                <li key={String(r.id)} className="flex items-center justify-between py-3.5 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{String(r.name)}</div>
                    <div className="text-[11px] text-slate-500">
                      {String(r.phone)} · {label(String(r.source))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                      {label(String(r.stage))}
                    </span>
                    <a
                      href={waLink(`Hello ${r.name}, thank you for contacting Daily Dental Care Mohali. How can we assist you with your dental care?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    >
                      💬
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

