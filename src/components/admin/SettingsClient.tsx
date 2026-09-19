"use client";

import { useCallback, useEffect, useState } from "react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const field = "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm";

type Hour = { weekday: number; isOpen: boolean; openTime: string; closeTime: string; breakStart: string; breakEnd: string };
type Block = { id: number; blockDate: string; doctorId: number | null; startTime: string | null; endTime: string | null; reason: string };
type UserRow = { id: number; name: string; email: string; role: string; active: boolean };

export default function SettingsClient({ role, doctors }: { role: string; doctors: { id: number; name: string }[] }) {
  const readOnly = role === "receptionist";
  const [data, setData] = useState<{
    booking: { slotMinutes: number; advanceBookingDays: number; minimumNoticeHours: number; cancellationPolicy: string };
    clinic: { name: string; address: string; phone: string; email: string; whatsapp: string; website: string };
    notifications: { emailEnabled: boolean; whatsappEnabled: boolean; smsEnabled: boolean; reminder24h: boolean; reminder2h: boolean };
    hours: Hour[];
    blocks: Block[];
  } | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [block, setBlock] = useState({ blockDate: "", doctorId: "", startTime: "", endTime: "", reason: "" });
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "receptionist" });

  const load = useCallback(async () => {
    const [s, u] = await Promise.all([fetch("/api/settings"), fetch("/api/users")]);
    if (s.ok) setData(await s.json());
    if (u.ok) setUsers((await u.json()).users ?? []);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function save() {
    if (!data) return;
    setBusy(true); setMsg("");
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking: data.booking, clinic: data.clinic, notifications: data.notifications, hours: data.hours }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    setMsg(res.ok ? "Settings saved." : (d.message ?? "Something went wrong."));
  }

  if (!data) return <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
        {!readOnly && <button disabled={busy} onClick={save} className="rounded-full bg-blue-700 px-5 py-2 text-xs font-semibold text-white disabled:opacity-60">{busy ? "Saving..." : "Save changes"}</button>}
      </div>
      {readOnly && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Your role (Receptionist) has read-only access to clinic settings.</p>}
      {msg && <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm">{msg}</p>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Clinic information</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(["name", "address", "phone", "email", "whatsapp", "website"] as const).map((k) => (
            <label key={k} className="block text-sm font-medium capitalize">{k}
              <input disabled={readOnly} className={field} value={data.clinic[k] ?? ""} onChange={(e) => setData({ ...data, clinic: { ...data.clinic, [k]: e.target.value } })} />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Working hours</h2>
        <div className="mt-3 space-y-2">
          {data.hours.map((h, i) => (
            <div key={h.weekday} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-100 p-2 text-xs">
              <span className="w-20 font-medium">{DAYS[h.weekday]}</span>
              <label className="flex items-center gap-1"><input disabled={readOnly} type="checkbox" checked={h.isOpen} onChange={(e) => { const hours = [...data.hours]; hours[i] = { ...h, isOpen: e.target.checked }; setData({ ...data, hours }); }} /> Open</label>
              {(["openTime", "closeTime", "breakStart", "breakEnd"] as const).map((k) => (
                <span key={k} className="flex items-center gap-1">
                  <span className="text-slate-400">{k.replace("Time", "").replace("break", "break ")}</span>
                  <input disabled={readOnly} type="time" value={h[k]} onChange={(e) => { const hours = [...data.hours]; hours[i] = { ...h, [k]: e.target.value }; setData({ ...data, hours }); }} className="rounded-lg border border-slate-200 px-2 py-1" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Booking rules</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="block text-sm font-medium">Appointment duration (min)
            <select disabled={readOnly} className={field} value={data.booking.slotMinutes} onChange={(e) => setData({ ...data, booking: { ...data.booking, slotMinutes: Number(e.target.value) } })}>
              {[15, 30, 45, 60].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Advance booking (days)
            <input disabled={readOnly} type="number" className={field} value={data.booking.advanceBookingDays} onChange={(e) => setData({ ...data, booking: { ...data.booking, advanceBookingDays: Number(e.target.value) } })} />
          </label>
          <label className="block text-sm font-medium">Minimum notice (hours)
            <input disabled={readOnly} type="number" className={field} value={data.booking.minimumNoticeHours} onChange={(e) => setData({ ...data, booking: { ...data.booking, minimumNoticeHours: Number(e.target.value) } })} />
          </label>
          <label className="block text-sm font-medium sm:col-span-3">Cancellation policy
            <textarea disabled={readOnly} rows={2} className={field} value={data.booking.cancellationPolicy} onChange={(e) => setData({ ...data, booking: { ...data.booking, cancellationPolicy: e.target.value } })} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Notifications</h2>
        <p className="mt-1 text-xs text-slate-500">No messaging provider is connected yet — outbound messages are queued and shown as <span className="font-semibold">Not Connected</span>.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {([["emailEnabled", "Email"], ["whatsappEnabled", "WhatsApp"], ["smsEnabled", "SMS"], ["reminder24h", "24-hour reminder"], ["reminder2h", "2-hour reminder"]] as const).map(([k, l]) => (
            <label key={k} className="flex items-center gap-2 text-sm">
              <input disabled={readOnly} type="checkbox" checked={data.notifications[k]} onChange={(e) => setData({ ...data, notifications: { ...data.notifications, [k]: e.target.checked } })} />
              {l}
              <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">Not Connected</span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Blocked dates &amp; holidays</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input type="date" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={block.blockDate} onChange={(e) => setBlock({ ...block, blockDate: e.target.value })} />
          <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={block.doctorId} onChange={(e) => setBlock({ ...block, doctorId: e.target.value })}>
            <option value="">Whole clinic</option>
            {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <input type="time" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={block.startTime} onChange={(e) => setBlock({ ...block, startTime: e.target.value })} />
          <input type="time" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={block.endTime} onChange={(e) => setBlock({ ...block, endTime: e.target.value })} />
          <input placeholder="Reason" className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" value={block.reason} onChange={(e) => setBlock({ ...block, reason: e.target.value })} />
          <button
            onClick={async () => {
              const res = await fetch("/api/blocked-dates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(block) });
              if (!res.ok) { const d = await res.json().catch(() => ({})); alert(d.message ?? "Unable to add block."); return; }
              setBlock({ blockDate: "", doctorId: "", startTime: "", endTime: "", reason: "" });
              await load();
            }}
            className="rounded-full bg-blue-700 px-5 py-2 text-xs font-semibold text-white"
          >Block</button>
        </div>
        <ul className="mt-4 divide-y divide-slate-100 text-sm">
          {data.blocks.length === 0 && <li className="py-3 text-slate-500">No blocked dates.</li>}
          {data.blocks.map((b) => (
            <li key={b.id} className="flex items-center justify-between py-2">
              <span>{b.blockDate} {b.startTime ? `${b.startTime}–${b.endTime}` : "(whole day)"} · {b.doctorId ? doctors.find((d) => d.id === b.doctorId)?.name : "Whole clinic"} {b.reason && `· ${b.reason}`}</span>
              <button onClick={async () => { await fetch(`/api/blocked-dates?id=${b.id}`, { method: "DELETE" }); await load(); }} className="rounded-full border border-rose-200 px-3 py-1 text-[11px] text-rose-600">Remove</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Users &amp; roles</h2>
        <table className="mt-3 w-full text-sm">
          <thead className="text-left text-xs uppercase text-slate-500"><tr><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="py-2">{u.name}</td>
                <td>{u.email}</td>
                <td>
                  {role === "super_admin" ? (
                    <select value={u.role} onChange={async (e) => { await fetch("/api/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: u.id, role: e.target.value }) }); await load(); }} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">
                      {["super_admin", "admin", "receptionist"].map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
                    </select>
                  ) : <span className="capitalize">{u.role.replace("_", " ")}</span>}
                </td>
                <td>{u.active ? "Active" : "Disabled"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {role === "super_admin" && (
          <div className="mt-4 flex flex-wrap gap-2">
            <input placeholder="Name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            <input placeholder="Email" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            <input placeholder="Password (min 8)" type="password" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              {["super_admin", "admin", "receptionist"].map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
            </select>
            <button
              onClick={async () => {
                const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newUser) });
                const d = await res.json().catch(() => ({}));
                if (!res.ok) { alert(d.message ?? "Unable to create user."); return; }
                setNewUser({ name: "", email: "", password: "", role: "receptionist" });
                await load();
              }}
              className="rounded-full bg-blue-700 px-5 py-2 text-xs font-semibold text-white"
            >Add user</button>
          </div>
        )}
      </section>
    </div>
  );
}
