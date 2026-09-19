"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Notif = { id: number; type: string; title: string; body: string; link: string; readAt: string | null; createdAt: string };

export default function NotificationsClient() {
  const [rows, setRows] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) setRows((await res.json()).notifications ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [load]);

  async function markAll() {
    await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "mark_all_read" }) });
    await load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-slate-500">Live feed, refreshed automatically every 20 seconds.</p>
        </div>
        <button onClick={markAll} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold">Mark all read</button>
      </div>

      {loading && rows.length === 0 ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          No notifications yet. New bookings and enquiries will show up here.
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((n) => (
            <li key={n.id} className={`rounded-2xl border p-4 ${n.readAt ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">🔔 {n.title}</div>
                  <div className="mt-1 text-sm text-slate-600">{n.body}</div>
                  <div className="mt-1 text-[11px] text-slate-400">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {n.link && <Link href={n.link} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">View Details</Link>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
