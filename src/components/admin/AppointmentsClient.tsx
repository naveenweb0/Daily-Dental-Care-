"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { APPOINTMENT_STATUSES, STATUS_COLORS, label, CLINIC } from "@/lib/clinic";
import { formatTime12 } from "@/lib/time";

type Appt = {
  id: number;
  appointmentNumber: string;
  patientName: string;
  phone: string;
  email: string;
  age: number | null;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  patientType: string;
  patientMessage: string;
  internalNotes: string;
  cancellationReason: string;
  source: string;
  doctorId: number;
  serviceId: number | null;
  createdAt: string;
  updatedAt: string;
};
type Row = { appointment: Appt; doctorName: string | null; serviceName: string | null };
type Option = { id: number; name: string };

function iso(d: Date) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export default function AppointmentsClient({
  doctors,
  services,
  initialQuery,
}: {
  doctors: Option[];
  services: Option[];
  initialQuery: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<"list" | "day" | "week" | "month">("list");
  const [anchor, setAnchor] = useState(iso(new Date()));
  const [filters, setFilters] = useState({
    range: "all",
    status: "all",
    doctorId: "all",
    serviceId: "all",
    q: initialQuery,
    from: "",
    to: "",
  });
  const [selected, setSelected] = useState<Row | null>(null);
  const [history, setHistory] = useState<{ id: number; action: string; oldValue: string; newValue: string; actor: string; createdAt: string }[]>([]);

  const range = useMemo(() => {
    const today = new Date();
    const d = (n: number) => iso(new Date(today.getTime() + n * 86400000));
    switch (filters.range) {
      case "today": return { from: d(0), to: d(0) };
      case "tomorrow": return { from: d(1), to: d(1) };
      case "week": return { from: d(0), to: d(7) };
      case "month": return { from: iso(new Date(today.getFullYear(), today.getMonth(), 1)), to: iso(new Date(today.getFullYear(), today.getMonth() + 1, 0)) };
      case "custom": return { from: filters.from, to: filters.to };
      default: return { from: "", to: "" };
    }
  }, [filters.range, filters.from, filters.to]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (range.from) p.set("from", range.from);
    if (range.to) p.set("to", range.to);
    if (filters.status !== "all") p.set("status", filters.status);
    if (filters.doctorId !== "all") p.set("doctorId", filters.doctorId);
    if (filters.serviceId !== "all") p.set("serviceId", filters.serviceId);
    if (filters.q) p.set("q", filters.q);
    try {
      const res = await fetch(`/api/appointments?${p.toString()}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRows(data.appointments ?? []);
    } catch {
      setError("Unable to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [range, filters.status, filters.doctorId, filters.serviceId, filters.q]);

  useEffect(() => {
    void load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

  async function openDetail(r: Row) {
    setSelected(r);
    setHistory([]);
    const res = await fetch(`/api/appointments/${r.appointment.id}`);
    if (res.ok) {
      const data = await res.json();
      setHistory(data.history ?? []);
    }
  }

  async function patch(id: number, body: Record<string, unknown>) {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.message ?? "Something went wrong. Please try again.");
      return false;
    }
    await load();
    if (selected) {
      const fresh = await fetch(`/api/appointments/${id}`);
      if (fresh.ok) {
        const d = await fresh.json();
        setHistory(d.history ?? []);
        setSelected((s) => (s ? { ...s, appointment: d.appointment } : s));
      }
    }
    return true;
  }

  const calDays = useMemo(() => {
    const base = new Date(`${anchor}T00:00:00`);
    if (view === "day") return [iso(base)];
    if (view === "week") {
      const start = new Date(base);
      start.setDate(base.getDate() - base.getDay());
      return Array.from({ length: 7 }, (_, i) => iso(new Date(start.getTime() + i * 86400000)));
    }
    const first = new Date(base.getFullYear(), base.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, i) => iso(new Date(start.getTime() + i * 86400000)));
  }, [anchor, view]);

  const byDay = useMemo(() => {
    const m = new Map<string, Row[]>();
    for (const r of rows) {
      const arr = m.get(r.appointment.appointmentDate) ?? [];
      arr.push(r);
      m.set(r.appointment.appointmentDate, arr);
    }
    for (const arr of m.values()) arr.sort((a, b) => a.appointment.startTime.localeCompare(b.appointment.startTime));
    return m;
  }, [rows]);

  const sel = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Appointments</h1>
          <p className="text-sm text-slate-500">{rows.length} record(s) loaded</p>
        </div>
        <div className="flex gap-2">
          <a href="/api/export?type=appointments" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold">⬇ Export CSV</a>
          {(["list", "day", "week", "month"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${view === v ? "bg-blue-700 text-white" : "border border-slate-200 bg-white"}`}>{v}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        <select className={sel} value={filters.range} onChange={(e) => setFilters({ ...filters, range: e.target.value })}>
          <option value="all">All dates</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="custom">Custom</option>
        </select>
        {filters.range === "custom" && (
          <>
            <input type="date" className={sel} value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
            <input type="date" className={sel} value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
          </>
        )}
        <select className={sel} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="all">All statuses</option>
          {APPOINTMENT_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select>
        <select className={sel} value={filters.doctorId} onChange={(e) => setFilters({ ...filters, doctorId: e.target.value })}>
          <option value="all">All doctors</option>
          {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className={sel} value={filters.serviceId} onChange={(e) => setFilters({ ...filters, serviceId: e.target.value })}>
          <option value="all">All treatments</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input className={`${sel} min-w-[200px] flex-1`} placeholder="Search name, phone, appointment ID" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
      </div>

      {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : view === "list" ? (
        rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            No appointments match these filters.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="hidden w-full text-sm md:table">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr><th className="p-3">Appointment</th><th className="p-3">Patient</th><th className="p-3">Treatment</th><th className="p-3">Doctor</th><th className="p-3">Date / Time</th><th className="p-3">Status</th><th className="p-3"></th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.appointment.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-xs">{r.appointment.appointmentNumber}</td>
                    <td className="p-3"><div className="font-medium">{r.appointment.patientName}</div><div className="text-xs text-slate-500">{r.appointment.phone}</div></td>
                    <td className="p-3">{r.serviceName ?? "—"}</td>
                    <td className="p-3">{r.doctorName ?? "—"}</td>
                    <td className="p-3">{r.appointment.appointmentDate}<div className="text-xs text-slate-500">{formatTime12(r.appointment.startTime)}</div></td>
                    <td className="p-3"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${STATUS_COLORS[r.appointment.status]}`}>{label(r.appointment.status)}</span></td>
                    <td className="p-3 text-right"><button onClick={() => openDetail(r)} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="divide-y divide-slate-100 md:hidden">
              {rows.map((r) => (
                <button key={r.appointment.id} onClick={() => openDetail(r)} className="block w-full p-4 text-left">
                  <div className="flex justify-between"><span className="font-medium">{r.appointment.patientName}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[r.appointment.status]}`}>{label(r.appointment.status)}</span></div>
                  <div className="mt-1 text-xs text-slate-500">{r.serviceName ?? "—"} · {r.doctorName ?? "—"}</div>
                  <div className="mt-1 text-xs text-slate-500">{r.appointment.appointmentDate} · {formatTime12(r.appointment.startTime)}</div>
                </button>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => setAnchor(iso(new Date(new Date(`${anchor}T00:00:00`).getTime() - (view === "month" ? 30 : view === "week" ? 7 : 1) * 86400000)))} className="rounded-full border px-3 py-1 text-xs">← Prev</button>
            <div className="text-sm font-semibold">{anchor}</div>
            <button onClick={() => setAnchor(iso(new Date(new Date(`${anchor}T00:00:00`).getTime() + (view === "month" ? 30 : view === "week" ? 7 : 1) * 86400000)))} className="rounded-full border px-3 py-1 text-xs">Next →</button>
          </div>
          <div className={`grid gap-2 ${view === "day" ? "grid-cols-1" : "grid-cols-7"}`}>
            {calDays.map((d) => (
              <div key={d} className="min-h-24 rounded-xl border border-slate-100 p-2">
                <div className="text-[11px] font-semibold text-slate-500">{d.slice(8)}/{d.slice(5, 7)}</div>
                <div className="mt-1 space-y-1">
                  {(byDay.get(d) ?? []).map((r) => (
                    <button key={r.appointment.id} onClick={() => openDetail(r)} className={`block w-full rounded-lg px-2 py-1 text-left text-[10px] ${STATUS_COLORS[r.appointment.status]}`}>
                      <span className="font-semibold">{formatTime12(r.appointment.startTime)}</span> {r.appointment.patientName}
                      <span className="block truncate">{r.serviceName ?? ""} · {r.doctorName ?? ""}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">Calendar shows appointments matching the current filters. Use &quot;All dates&quot; to see everything.</p>
        </div>
      )}

      {selected && (
        <Drawer row={selected} history={history} onClose={() => setSelected(null)} onPatch={patch} />
      )}
    </div>
  );
}

function Drawer({
  row,
  history,
  onClose,
  onPatch,
}: {
  row: Row;
  history: { id: number; action: string; oldValue: string; newValue: string; actor: string; createdAt: string }[];
  onClose: () => void;
  onPatch: (id: number, body: Record<string, unknown>) => Promise<boolean>;
}) {
  const a = row.appointment;
  const [notes, setNotes] = useState(a.internalNotes);
  const [date, setDate] = useState(a.appointmentDate);
  const [slots, setSlots] = useState<{ time: string; label: string; available: boolean }[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setNotes(a.internalNotes);
  }, [a.internalNotes]);

  const loadSlots = useCallback(async () => {
    const res = await fetch(`/api/availability?doctorId=${a.doctorId}&date=${date}`);
    if (res.ok) {
      const d = await res.json();
      setSlots(d.slots ?? []);
    }
  }, [a.doctorId, date]);

  useEffect(() => { void loadSlots(); }, [loadSlots]);

  async function setStatus(status: string) {
    let reason = "";
    if (status === "cancelled") {
      reason = window.prompt("Cancellation reason (Patient requested / Doctor unavailable / Clinic closed / Other)") ?? "";
      if (!reason.trim()) return;
    }
    setBusy(true);
    await onPatch(a.id, { status, cancellationReason: reason });
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="h-full w-full max-w-lg overflow-y-auto bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-xs text-slate-500">{a.appointmentNumber}</div>
            <h2 className="mt-1 text-xl font-semibold">{a.patientName}</h2>
            <span className={`mt-2 inline-block rounded-full px-2 py-1 text-[10px] font-semibold ${STATUS_COLORS[a.status]}`}>{label(a.status)}</span>
          </div>
          <button onClick={onClose} className="rounded-full border px-3 py-1 text-sm">✕</button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <Info k="Phone" v={a.phone} />
          <Info k="Email" v={a.email || "—"} />
          <Info k="Age" v={a.age ? String(a.age) : "—"} />
          <Info k="Patient type" v={label(a.patientType)} />
          <Info k="Treatment" v={row.serviceName ?? "—"} />
          <Info k="Doctor" v={row.doctorName ?? "—"} />
          <Info k="Date" v={a.appointmentDate} />
          <Info k="Time" v={`${formatTime12(a.startTime)} – ${formatTime12(a.endTime)}`} />
          <Info k="Source" v={label(a.source)} />
          <Info k="Created" v={new Date(a.createdAt).toLocaleString()} />
        </div>

        {a.patientMessage && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">“{a.patientMessage}”</p>}
        {a.cancellationReason && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">Cancellation: {a.cancellationReason}</p>}

        <div className="mt-5 flex flex-wrap gap-2">
          <a href={`tel:+91${a.phone}`} className="rounded-full border px-4 py-2 text-xs font-semibold">📞 Call</a>
          <a href={`https://wa.me/91${a.phone}?text=${encodeURIComponent(`Hello ${a.patientName}, this is ${CLINIC.name} regarding your dental appointment.`)}`} target="_blank" rel="noopener" className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">💬 WhatsApp</a>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {["confirmed", "checked_in", "completed", "no_show", "pending", "cancelled"].map((s) => (
            <button key={s} disabled={busy} onClick={() => setStatus(s)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50">
              {label(s)}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 p-4">
          <div className="text-sm font-semibold">Reschedule</div>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <div className="mt-3 grid grid-cols-4 gap-1">
            {slots.filter((s) => s.available || s.time === a.startTime).map((s) => (
              <button key={s.time} disabled={busy} onClick={async () => { setBusy(true); await onPatch(a.id, { date, time: s.time }); setBusy(false); }} className="rounded-lg border border-slate-200 px-1 py-1.5 text-[10px] hover:border-blue-400">
                {s.label}
              </button>
            ))}
            {slots.length === 0 && <span className="col-span-4 text-xs text-slate-500">No slots available on this date.</span>}
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm font-semibold">Internal notes</div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm" />
          <button disabled={busy} onClick={async () => { setBusy(true); await onPatch(a.id, { internalNotes: notes }); setBusy(false); }} className="mt-2 rounded-full bg-blue-700 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">
            {busy ? "Saving..." : "Save note"}
          </button>
        </div>

        <div className="mt-6">
          <div className="text-sm font-semibold">Appointment history</div>
          <ul className="mt-2 space-y-2 text-xs text-slate-600">
            {history.length === 0 && <li className="text-slate-400">No history yet.</li>}
            {history.map((h) => (
              <li key={h.id} className="rounded-lg bg-slate-50 p-2">
                <span className="font-semibold">{label(h.action)}</span> · {h.oldValue && `${h.oldValue} → `}{h.newValue}
                <span className="block text-[10px] text-slate-400">{new Date(h.createdAt).toLocaleString()} · {h.actor}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{k}</div>
      <div className="font-medium">{v}</div>
    </div>
  );
}
