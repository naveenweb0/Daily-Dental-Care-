"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClinicStatusBadge from "@/components/site/ClinicStatusBadge";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/appointments", label: "Appointments", icon: "📅" },
  { href: "/admin/leads", label: "Leads CRM", icon: "👥" },
  { href: "/admin/patients", label: "Patients", icon: "👤" },
  { href: "/admin/doctors", label: "Specialists", icon: "🧑‍⚕️" },
  { href: "/admin/services", label: "Services", icon: "🦷" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/notifications", label: "Notifications", icon: "🔔" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

type SearchResult = {
  patients: { id: number; name: string; phone: string }[];
  leads: { id: number; name: string; phone: string }[];
  appointments: { id: number; appointmentNumber: string; patientName: string }[];
};

export default function Shell({
  user,
  children,
}: {
  user: { name: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const data = await res.json();
        if (active) setUnread(data.unread ?? 0);
      } catch {}
    };
    void load();
    const t = setInterval(load, 20000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [pathname]);

  useEffect(() => {
    if (q.trim().length < 2) {
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) setResults(await res.json());
      } catch {}
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const effectiveResults = q.trim().length < 2 ? null : results;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-100/70">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-800 bg-[#061528] text-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-xl font-bold text-white shadow-md">
            🦷
          </div>
          <div className="leading-tight">
            <span className="block font-heading text-sm font-bold tracking-tight text-white">
              Daily Dental Care
            </span>
            <span className="block text-[11px] font-medium text-sky-400">Clinic CRM &amp; Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 grid gap-1 px-3">
          {NAV.map((n) => {
            const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition ${
                  active
                    ? "bg-sky-600 font-bold text-white shadow-soft"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-base">{n.icon}</span>
                <span>{n.label}</span>
                {n.href === "/admin/notifications" && unread > 0 && (
                  <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/20 p-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-white">{user.name}</div>
              <div className="text-[11px] capitalize text-sky-400 font-medium">
                {user.role.replace("_", " ")}
              </div>
            </div>
            <Link
              href="/"
              target="_blank"
              title="Open public website"
              className="rounded-full bg-white/10 p-2 text-slate-300 hover:bg-white/20 hover:text-white"
            >
              🌐
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200/90 bg-white/90 px-4 py-3.5 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 lg:hidden"
            >
              {open ? "✕" : "☰"}
            </button>
            <div className="hidden sm:block">
              <ClinicStatusBadge />
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative max-w-md flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search patient, phone, appointment ID... (live)"
              className="w-full rounded-full border border-slate-200 bg-slate-50/70 px-4 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 transition"
            />
            {effectiveResults && (
              <div className="absolute z-40 mt-2 max-h-96 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-fade-up">
                {effectiveResults.appointments.length === 0 && effectiveResults.leads.length === 0 && effectiveResults.patients.length === 0 && (
                  <div className="p-3 text-xs text-slate-500">No matching clinic records found.</div>
                )}
                {effectiveResults.appointments.map((a) => (
                  <Link
                    key={`a${a.id}`}
                    href={`/admin/appointments?q=${a.appointmentNumber}`}
                    onClick={() => setQ("")}
                    className="block rounded-xl px-3 py-2 text-xs hover:bg-sky-50 hover:text-sky-900"
                  >
                    📅 <strong>{a.appointmentNumber}</strong> · {a.patientName}
                  </Link>
                ))}
                {effectiveResults.leads.map((l) => (
                  <Link
                    key={`l${l.id}`}
                    href={`/admin/leads?q=${l.phone}`}
                    onClick={() => setQ("")}
                    className="block rounded-xl px-3 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-900"
                  >
                    👥 <strong>{l.name}</strong> · {l.phone}
                  </Link>
                ))}
                {effectiveResults.patients.map((p) => (
                  <Link
                    key={`p${p.id}`}
                    href={`/admin/patients/${p.id}`}
                    onClick={() => setQ("")}
                    className="block rounded-xl px-3 py-2 text-xs hover:bg-slate-50"
                  >
                    👤 <strong>{p.name}</strong> · {p.phone}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300"
            >
              🔔
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>
            <button
              onClick={logout}
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

