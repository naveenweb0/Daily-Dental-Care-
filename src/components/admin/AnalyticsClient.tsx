"use client";

import { useCallback, useEffect, useState } from "react";
import { label } from "@/lib/clinic";

type Row = Record<string, string | number>;
type Data = {
  byDay: Row[]; byMonth: Row[]; byStatus: Row[];
  leadsBySource: Row[]; leadsByTreatment: Row[]; sourcePerformance: Row[];
};

function iso(d: Date) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }

export default function AnalyticsClient() {
  const [range, setRange] = useState("30");
  const [custom, setCustom] = useState({ from: "", to: "" });
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const now = new Date();
    let from = iso(new Date(now.getTime() - 29 * 86400000));
    let to = iso(now);
    if (range === "today") from = to = iso(now);
    if (range === "7") from = iso(new Date(now.getTime() - 6 * 86400000));
    if (range === "month") { from = iso(new Date(now.getFullYear(), now.getMonth(), 1)); to = iso(new Date(now.getFullYear(), now.getMonth() + 1, 0)); }
    if (range === "lastmonth") { from = iso(new Date(now.getFullYear(), now.getMonth() - 1, 1)); to = iso(new Date(now.getFullYear(), now.getMonth(), 0)); }
    if (range === "custom" && custom.from && custom.to) { from = custom.from; to = custom.to; }
    try {
      const res = await fetch(`/api/analytics?from=${from}&to=${to}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setError("Unable to load analytics. Please try again.");
    } finally { setLoading(false); }
  }, [range, custom]);

  useEffect(() => { void load(); }, [load]);

  const statusTotal = (data?.byStatus ?? []).reduce((a, b) => a + Number(b.total), 0);
  const pick = (s: string) => Number((data?.byStatus ?? []).find((r) => r.status === s)?.total ?? 0);
  const pct = (n: number) => (statusTotal ? Math.round((n / statusTotal) * 100) : 0);

  const sel = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <div className="flex flex-wrap gap-2">
          <select className={sel} value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="today">Today</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="month">This month</option>
            <option value="lastmonth">Last month</option>
            <option value="custom">Custom range</option>
          </select>
          {range === "custom" && (
            <>
              <input type="date" className={sel} value={custom.from} onChange={(e) => setCustom({ ...custom, from: e.target.value })} />
              <input type="date" className={sel} value={custom.to} onChange={(e) => setCustom({ ...custom, to: e.target.value })} />
            </>
          )}
        </div>
      </div>

      {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {loading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-100" />)}</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Conversion rate (confirmed+)" value={`${pct(pick("confirmed") + pick("completed"))}%`} />
            <Stat label="Cancellation rate" value={`${pct(pick("cancelled"))}%`} />
            <Stat label="No-show rate" value={`${pct(pick("no_show"))}%`} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Chart title="Appointments by day" rows={data.byDay.map((r) => ({ k: String(r.day), v: Number(r.total) }))} />
            <Chart title="Appointments by month" rows={data.byMonth.map((r) => ({ k: String(r.month), v: Number(r.total) }))} />
            <Chart title="Leads by source" rows={data.leadsBySource.map((r) => ({ k: label(String(r.source)), v: Number(r.total) }))} />
            <Chart title="Leads by treatment" rows={data.leadsByTreatment.map((r) => ({ k: String(r.treatment), v: Number(r.total) }))} />
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Lead source performance</h2>
            {data.sourcePerformance.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No leads in this period.</p>
            ) : (
              <table className="mt-3 w-full text-sm">
                <thead className="text-left text-xs uppercase text-slate-500"><tr><th className="py-2">Source</th><th>Leads</th><th>Appointments</th><th>Conversions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {data.sourcePerformance.map((r) => (
                    <tr key={String(r.source)}><td className="py-2">{label(String(r.source))}</td><td>{String(r.leads)}</td><td>{String(r.appointments)}</td><td>{String(r.conversions)}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ label: l, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-xs uppercase tracking-wide text-slate-500">{l}</div>
      <div className="mt-2 text-3xl font-semibold text-blue-800">{value}</div>
    </div>
  );
}

function Chart({ title, rows }: { title: string; rows: { k: string; v: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.v));
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No data for this period.</p>
      ) : (
        <div className="mt-4 space-y-2">
          {rows.slice(0, 12).map((r) => (
            <div key={r.k} className="flex items-center gap-3 text-xs">
              <span className="w-28 shrink-0 truncate text-slate-500">{r.k}</span>
              <div className="h-3 flex-1 rounded-full bg-slate-100">
                <div className="h-3 rounded-full bg-blue-600" style={{ width: `${(r.v / max) * 100}%` }} />
              </div>
              <span className="w-8 text-right font-semibold">{r.v}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
