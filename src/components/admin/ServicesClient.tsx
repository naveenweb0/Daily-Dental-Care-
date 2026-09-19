"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Service = {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  durationMinutes: number;
  price: string;
  active: boolean;
  seoTitle: string;
  seoDescription: string;
};

const field = "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm";

export default function ServicesClient({ services }: { services: Service[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    if (!editing) return;
    setBusy(true);
    setMsg("");
    const isNew = !editing.id;
    const res = await fetch(isNew ? "/api/services" : `/api/services/${editing.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setMsg(d.message ?? "Something went wrong. Please try again.");
      return;
    }
    setEditing(null);
    router.refresh();
  }

  async function toggle(s: Service) {
    await fetch(`/api/services/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !s.active }) });
    router.refresh();
  }

  async function remove(s: Service) {
    if (!confirm(`Delete "${s.name}"?`)) return;
    const res = await fetch(`/api/services/${s.id}`, { method: "DELETE" });
    if (!res.ok) { alert("Unable to delete this service."); return; }
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-sm text-slate-500">Manage the treatments shown on the website.</p>
        </div>
        <button onClick={() => setEditing({ durationMinutes: 30, price: "Contact for price", active: true })} className="rounded-full bg-blue-700 px-4 py-2 text-xs font-semibold text-white">+ Add Service</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-slate-500">/{s.slug}</div>
              </div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${s.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{s.active ? "Active" : "Hidden"}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-slate-500">{s.shortDescription}</p>
            <div className="mt-3 text-xs text-slate-500">⏱ {s.durationMinutes} min · {s.price}</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setEditing(s)} className="rounded-full border px-3 py-1 text-[11px] font-semibold">Edit</button>
              <button onClick={() => toggle(s)} className="rounded-full border px-3 py-1 text-[11px] font-semibold">{s.active ? "Hide" : "Show"}</button>
              <button onClick={() => remove(s)} className="rounded-full border border-rose-200 px-3 py-1 text-[11px] font-semibold text-rose-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onClick={() => setEditing(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">{editing.id ? "Edit service" : "New service"}</h2>
            {msg && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{msg}</p>}
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-medium">Name<input className={field} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label>
              <label className="block text-sm font-medium">Slug<input className={field} value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></label>
              <label className="block text-sm font-medium">Short description<input className={field} value={editing.shortDescription ?? ""} onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })} /></label>
              <label className="block text-sm font-medium">Description<textarea rows={4} className={field} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
              <label className="block text-sm font-medium">Image URL<input className={field} value={editing.image ?? ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-medium">Duration (min)<input type="number" className={field} value={editing.durationMinutes ?? 30} onChange={(e) => setEditing({ ...editing, durationMinutes: Number(e.target.value) })} /></label>
                <label className="block text-sm font-medium">Price<input className={field} value={editing.price ?? ""} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></label>
              </div>
              <label className="block text-sm font-medium">SEO title<input className={field} value={editing.seoTitle ?? ""} onChange={(e) => setEditing({ ...editing, seoTitle: e.target.value })} /></label>
              <label className="block text-sm font-medium">SEO description<input className={field} value={editing.seoDescription ?? ""} onChange={(e) => setEditing({ ...editing, seoDescription: e.target.value })} /></label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active on website</label>
            </div>
            <div className="mt-5 flex gap-2">
              <button disabled={busy} onClick={save} className="rounded-full bg-blue-700 px-5 py-2 text-xs font-semibold text-white disabled:opacity-60">{busy ? "Saving..." : "Save"}</button>
              <button onClick={() => setEditing(null)} className="rounded-full border px-5 py-2 text-xs font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
