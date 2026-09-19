"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LEAD_SOURCES, LEAD_STAGES, label, CLINIC } from "@/lib/clinic";

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  serviceId: number | null;
  source: string;
  stage: string;
  assignedTo: number | null;
  notes: string;
  message: string;
  createdAt: string;
};
type Row = { lead: Lead; serviceName: string | null; assignee: string | null };
type Option = { id: number; name: string };

export default function LeadsClient({ services, staff }: { services: Option[]; staff: Option[] }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<"table" | "pipeline">("table");
  const [filters, setFilters] = useState({ stage: "all", source: "all", serviceId: "all", assignedTo: "all", q: "", from: "", to: "" });
  const [selected, setSelected] = useState<Row | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v && v !== "all") p.set(k, v); });
    try {
      const res = await fetch(`/api/leads?${p.toString()}`);
      if (!res.ok) throw new Error();
      setRows((await res.json()).leads ?? []);
    } catch {
      setError("Unable to load leads. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { void load(); }, [load]);

  async function patch(id: number, body: Record<string, unknown>) {
    const res = await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.message ?? "Something went wrong. Please try again.");
      return;
    }
    await load();
    setSelected(null);
  }

  async function remove(id: number) {
    if (!confirm("Delete this lead?")) return;
    const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
    if (!res.ok) { alert("Unable to delete lead."); return; }
    await load();
    setSelected(null);
  }

  const sel = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Leads CRM</h1>
          <p className="text-sm text-slate-500">{rows.length} lead(s)</p>
        </div>
        <div className="flex gap-2">
          <a href="/api/export?type=leads" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold">⬇ Export CSV</a>
          <button onClick={() => setView(view === "table" ? "pipeline" : "table")} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold">
            {view === "table" ? "Pipeline view" : "Table view"}
          </button>
          <button onClick={() => setAdding(true)} className="rounded-full bg-blue-700 px-4 py-2 text-xs font-semibold text-white">+ Add Lead</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        <select className={sel} value={filters.stage} onChange={(e) => setFilters({ ...filters, stage: e.target.value })}>
          <option value="all">All stages</option>
          {LEAD_STAGES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select>
        <select className={sel} value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value })}>
          <option value="all">All sources</option>
          {LEAD_SOURCES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select>
        <select className={sel} value={filters.serviceId} onChange={(e) => setFilters({ ...filters, serviceId: e.target.value })}>
          <option value="all">All treatments</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select className={sel} value={filters.assignedTo} onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}>
          <option value="all">Anyone</option>
          {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="date" className={sel} value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
        <input type="date" className={sel} value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
        <input className={`${sel} min-w-[180px] flex-1`} placeholder="Search name, phone, email" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
      </div>

      {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          No leads yet. Website enquiries and bookings will appear here automatically.
        </div>
      ) : view === "table" ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="hidden w-full text-sm md:table">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="p-3">Lead</th><th className="p-3">Phone</th><th className="p-3">Treatment</th><th className="p-3">Source</th><th className="p-3">Stage</th><th className="p-3">Date</th><th className="p-3">Assigned</th><th className="p-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.lead.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium">{r.lead.name}</td>
                  <td className="p-3">{r.lead.phone}</td>
                  <td className="p-3">{r.serviceName ?? "—"}</td>
                  <td className="p-3">{label(r.lead.source)}</td>
                  <td className="p-3">
                    <select value={r.lead.stage} onChange={(e) => patch(r.lead.id, { stage: e.target.value })} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">
                      {LEAD_STAGES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-xs">{new Date(r.lead.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-xs">{r.assignee ?? "—"}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => setSelected(r)} className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white">View</button>
                      <a href={`tel:+91${r.lead.phone}`} className="rounded-full border px-2 py-1 text-[10px]">Call</a>
                      <a href={`https://wa.me/91${r.lead.phone}?text=${encodeURIComponent(`Hello ${r.lead.name}, this is ${CLINIC.name} regarding your dental appointment.`)}`} target="_blank" rel="noopener" className="rounded-full bg-emerald-600 px-2 py-1 text-[10px] text-white">WA</a>
                      <Link href="/book" className="rounded-full border px-2 py-1 text-[10px]">Book</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="divide-y divide-slate-100 md:hidden">
            {rows.map((r) => (
              <div key={r.lead.id} className="p-4">
                <div className="flex justify-between"><span className="font-medium">{r.lead.name}</span><span className="text-xs">{label(r.lead.stage)}</span></div>
                <div className="mt-1 text-xs text-slate-500">{r.lead.phone} · {label(r.lead.source)}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => setSelected(r)} className="rounded-full bg-slate-900 px-3 py-1 text-[10px] text-white">View</button>
                  <a href={`tel:+91${r.lead.phone}`} className="rounded-full border px-3 py-1 text-[10px]">Call</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {LEAD_STAGES.map((stage) => (
            <div
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = Number(e.dataTransfer.getData("text/plain"));
                if (id) void patch(id, { stage });
              }}
              className="min-w-[230px] flex-1 rounded-2xl bg-white p-3 ring-1 ring-slate-200"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                {label(stage)}
                <span className="rounded-full bg-slate-100 px-2">{rows.filter((r) => r.lead.stage === stage).length}</span>
              </div>
              <div className="mt-3 space-y-2">
                {rows.filter((r) => r.lead.stage === stage).map((r) => (
                  <div
                    key={r.lead.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", String(r.lead.id))}
                    onClick={() => setSelected(r)}
                    className="cursor-grab rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs"
                  >
                    <div className="font-semibold">{r.lead.name}</div>
                    <div className="text-slate-500">{r.lead.phone}</div>
                    <div className="mt-1 text-[10px] text-slate-400">{r.serviceName ?? "—"} · {label(r.lead.source)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <LeadDrawer row={selected} services={services} staff={staff} onClose={() => setSelected(null)} onSave={patch} onDelete={remove} />}
      {adding && <AddLead services={services} onClose={() => setAdding(false)} onDone={async () => { setAdding(false); await load(); }} />}
    </div>
  );
}

function LeadDrawer({
  row, services, staff, onClose, onSave, onDelete,
}: {
  row: { lead: Lead; serviceName: string | null };
  services: Option[];
  staff: Option[];
  onClose: () => void;
  onSave: (id: number, body: Record<string, unknown>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const l = row.lead;
  const [form, setForm] = useState({
    name: l.name, email: l.email, stage: l.stage, source: l.source,
    serviceId: l.serviceId ? String(l.serviceId) : "", assignedTo: l.assignedTo ? String(l.assignedTo) : "", notes: l.notes,
  });
  const [busy, setBusy] = useState(false);
  const field = "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">{l.name}</h2>
          <button onClick={onClose} className="rounded-full border px-3 py-1 text-sm">✕</button>
        </div>
        <p className="mt-1 text-sm text-slate-500">{l.phone} · created {new Date(l.createdAt).toLocaleString()}</p>
        {l.message && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">“{l.message}”</p>}
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium">Name<input className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="block text-sm font-medium">Email<input className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label className="block text-sm font-medium">Stage
            <select className={field} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
              {LEAD_STAGES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Source
            <select className={field} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
              {LEAD_SOURCES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Treatment
            <select className={field} value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
              <option value="">Not specified</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Assigned to
            <select className={field} value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
              <option value="">Unassigned</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Notes<textarea rows={4} className={field} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
        </div>
        <div className="mt-5 flex gap-2">
          <button disabled={busy} onClick={async () => { setBusy(true); await onSave(l.id, form); setBusy(false); }} className="rounded-full bg-blue-700 px-5 py-2 text-xs font-semibold text-white disabled:opacity-60">{busy ? "Saving..." : "Save changes"}</button>
          <a href={`https://wa.me/91${l.phone}?text=${encodeURIComponent(`Hello ${l.name}, this is ${CLINIC.name} regarding your dental appointment.`)}`} target="_blank" rel="noopener" className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white">WhatsApp Patient</a>
          <button onClick={() => onDelete(l.id)} className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600">Delete</button>
        </div>
      </div>
    </div>
  );
}

function AddLead({ services, onClose, onDone }: { services: Option[]; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", serviceId: "", source: "phone", notes: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const field = "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold">Add Lead</h2>
        {msg && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{msg}</p>}
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium">Name*<input className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="block text-sm font-medium">Phone*<input className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label className="block text-sm font-medium">Email<input className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label className="block text-sm font-medium">Treatment
            <select className={field} value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
              <option value="">Not specified</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Source
            <select className={field} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
              {LEAD_SOURCES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Notes<textarea rows={3} className={field} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
        </div>
        <div className="mt-5 flex gap-2">
          <button
            disabled={busy}
            onClick={async () => {
              setBusy(true); setMsg("");
              const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
              const d = await res.json().catch(() => ({}));
              setBusy(false);
              if (!res.ok) { setMsg(d.message ?? "Something went wrong."); return; }
              onDone();
            }}
            className="rounded-full bg-blue-700 px-5 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >{busy ? "Saving..." : "Create lead"}</button>
          <button onClick={onClose} className="rounded-full border px-5 py-2 text-xs font-semibold">Cancel</button>
        </div>
      </div>
    </div>
  );
}
