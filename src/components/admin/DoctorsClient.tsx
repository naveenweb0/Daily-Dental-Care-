"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Hour = { weekday: number; isOpen: boolean; openTime: string; closeTime: string; breakStart: string; breakEnd: string };
type Doctor = {
  id: number; name: string; photo: string; qualification: string; specialization: string;
  bio: string; experience: string; active: boolean; serviceIds: number[]; hours: Hour[];
};
type Option = { id: number; name: string };

const field = "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm";

export default function DoctorsClient({ doctors, services }: { doctors: Doctor[]; services: Option[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<Doctor> | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    if (!editing) return;
    setBusy(true); setMsg("");
    const isNew = !editing.id;
    const res = await fetch(isNew ? "/api/doctors" : `/api/doctors/${editing.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setBusy(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); setMsg(d.message ?? "Something went wrong."); return; }
    setEditing(null);
    router.refresh();
  }

  async function remove(d: Doctor) {
    if (!confirm(`Delete ${d.name}?`)) return;
    const res = await fetch(`/api/doctors/${d.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (data.message) alert(data.message);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Doctors</h1>
          <p className="text-sm text-slate-500">Profiles, assigned services and individual working hours.</p>
        </div>
        <button onClick={() => setEditing({ active: true, serviceIds: [] })} className="rounded-full bg-blue-700 px-4 py-2 text-xs font-semibold text-white">+ Add Doctor</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((d) => (
          <div key={d.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div className="font-semibold">{d.name}</div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${d.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200"}`}>{d.active ? "Active" : "Inactive"}</span>
            </div>
            <div className="mt-1 text-xs text-blue-700">{d.qualification}</div>
            <div className="text-xs text-slate-500">{d.specialization}</div>
            <div className="mt-2 text-[11px] text-slate-500">
              {d.hours.filter((h) => h.isOpen).map((h) => `${DAYS[h.weekday].slice(0, 3)} ${h.openTime}-${h.closeTime}`).join(" · ") || "No working days set"}
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setEditing(d)} className="rounded-full border px-3 py-1 text-[11px] font-semibold">Edit</button>
              <button onClick={() => remove(d)} className="rounded-full border border-rose-200 px-3 py-1 text-[11px] font-semibold text-rose-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onClick={() => setEditing(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">{editing.id ? "Edit doctor" : "New doctor"}</h2>
            {msg && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{msg}</p>}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-medium">Name<input className={field} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label>
              <label className="block text-sm font-medium">Qualification<input className={field} value={editing.qualification ?? ""} onChange={(e) => setEditing({ ...editing, qualification: e.target.value })} /></label>
              <label className="block text-sm font-medium">Specialization<input className={field} value={editing.specialization ?? ""} onChange={(e) => setEditing({ ...editing, specialization: e.target.value })} /></label>
              <label className="block text-sm font-medium">Experience<input className={field} value={editing.experience ?? ""} onChange={(e) => setEditing({ ...editing, experience: e.target.value })} /></label>
              <label className="block text-sm font-medium sm:col-span-2">Photo URL<input className={field} value={editing.photo ?? ""} onChange={(e) => setEditing({ ...editing, photo: e.target.value })} /></label>
              <label className="block text-sm font-medium sm:col-span-2">Bio<textarea rows={3} className={field} value={editing.bio ?? ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} /></label>
              <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active (bookable)</label>
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium">Assigned services</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {services.map((s) => {
                  const on = (editing.serviceIds ?? []).includes(s.id);
                  return (
                    <button key={s.id} type="button" onClick={() => setEditing({ ...editing, serviceIds: on ? (editing.serviceIds ?? []).filter((x) => x !== s.id) : [...(editing.serviceIds ?? []), s.id] })}
                      className={`rounded-full border px-3 py-1 text-[11px] ${on ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200"}`}>{s.name}</button>
                  );
                })}
              </div>
            </div>

            {editing.id && editing.hours && (
              <div className="mt-5">
                <div className="text-sm font-medium">Working hours</div>
                <div className="mt-2 space-y-2">
                  {editing.hours.map((h, i) => (
                    <div key={h.weekday} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-100 p-2 text-xs">
                      <span className="w-20 font-medium">{DAYS[h.weekday]}</span>
                      <label className="flex items-center gap-1"><input type="checkbox" checked={h.isOpen} onChange={(e) => {
                        const hours = [...editing.hours!]; hours[i] = { ...h, isOpen: e.target.checked }; setEditing({ ...editing, hours });
                      }} /> Available</label>
                      {(["openTime", "closeTime", "breakStart", "breakEnd"] as const).map((k) => (
                        <input key={k} type="time" value={h[k]} onChange={(e) => { const hours = [...editing.hours!]; hours[i] = { ...h, [k]: e.target.value }; setEditing({ ...editing, hours }); }} className="rounded-lg border border-slate-200 px-2 py-1" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
