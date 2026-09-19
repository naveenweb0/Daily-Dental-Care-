import Link from "next/link";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export const dynamic = "force-dynamic";

type Row = Record<string, string | number | null>;

export default async function PatientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const like = `%${q ?? ""}%`;
  const res = await db.execute(sql`
    select p.id, p.name, p.phone, p.email, p.age, p.source, p.created_at,
      (select count(*) from appointments a where a.patient_id = p.id)::int as total_appts,
      (select max(a.appointment_date)::text from appointments a where a.patient_id = p.id) as last_appt
    from patients p
    ${q ? sql`where p.name ilike ${like} or p.phone ilike ${like} or p.email ilike ${like}` : sql``}
    order by p.created_at desc limit 200`);

  const rows = res.rows as Row[];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Database</h1>
          <p className="text-xs text-slate-500">{rows.length} patient record(s) on file</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/patients/new"
            className="rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-sky-700 hover:to-blue-800 transition"
          >
            + Register Offline Walk-In
          </Link>
          <a
            href="/api/export?type=patients"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            ⬇ Export CSV
          </a>
        </div>
      </div>

      <form className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        <input name="q" defaultValue={q ?? ""} placeholder="Search by name, phone or email" className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <button className="rounded-full bg-blue-700 px-5 py-2 text-xs font-semibold text-white">Search</button>
      </form>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          No patients found. Patients are created automatically when a booking or enquiry is received.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="p-3">Patient</th><th className="p-3">Phone</th><th className="p-3">Age</th><th className="p-3">Appointments</th><th className="p-3">Last visit</th><th className="p-3">Source</th><th className="p-3"></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={String(r.id)} className="hover:bg-slate-50">
                  <td className="p-3 font-medium">{String(r.name)}<div className="text-xs text-slate-500">{String(r.email ?? "")}</div></td>
                  <td className="p-3">{String(r.phone)}</td>
                  <td className="p-3">{r.age ? String(r.age) : "—"}</td>
                  <td className="p-3">{String(r.total_appts)}</td>
                  <td className="p-3">{r.last_appt ? String(r.last_appt) : "—"}</td>
                  <td className="p-3 text-xs capitalize">{String(r.source).replace("_", " ")}</td>
                  <td className="p-3 text-right"><Link href={`/admin/patients/${r.id}`} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">Profile</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
