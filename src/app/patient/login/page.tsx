"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CLINIC, waLink } from "@/lib/clinic";

export default function PatientLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/patient/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      router.push("/patient/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  }

  // Quick Demo Login Helper
  async function handleDemoLogin(phone: string, pass: string) {
    setIdentifier(phone);
    setPassword(pass);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/patient/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: phone, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Demo login failed");
      router.push("/patient/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error with demo login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-sky-50/40 via-white to-slate-50/50 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-md space-y-6">
        {/* Brand Card Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 text-3xl text-white shadow-lg">
            🦷
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Patient Portal Login
          </h1>
          <p className="mt-1.5 text-xs text-slate-500">
            Access your dental records, doctor clinical notes, prescriptions, and reports.
          </p>
        </div>

        {/* Login Form */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-soft space-y-5">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs font-medium text-rose-800">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number or Email
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  placeholder="e.g. 9876543210 or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <span className="text-[11px] text-slate-400">
                  (Default: Registered Mobile #)
                </span>
              </div>
              <input
                required
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 py-3 text-sm font-bold text-white shadow-soft transition hover:from-sky-700 hover:to-blue-800 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Patient Portal →"}
            </button>
          </form>

          {/* Offline Patient Assistance Notice */}
          <div className="rounded-2xl bg-sky-50/60 p-4 border border-sky-100 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-sky-900 flex items-center gap-1.5">
              <span>🏥 Registered offline at clinic reception?</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Your account was created automatically when you visited our clinic. You can log in using your <strong>10-digit mobile number</strong> as both the Username and Password!
            </p>
          </div>

          {/* Quick Demo Login Preset */}
          <div className="border-t border-slate-100 pt-4 text-center">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">
              ⚡ Quick Demo / Tester Login:
            </span>
            <button
              type="button"
              onClick={() => handleDemoLogin("9876543210", "9876543210")}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Log in as Demo Patient (9876543210)
            </button>
          </div>
        </div>

        {/* Support & Back Links */}
        <div className="text-center space-y-2 text-xs text-slate-500">
          <p>
            Need assistance or forgot password?{" "}
            <a
              href={waLink("Hello Daily Dental Care, I need assistance logging into my Patient Portal.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-700 hover:underline"
            >
              WhatsApp Clinic Helpdesk
            </a>
          </p>
          <div>
            <Link href="/" className="font-semibold text-sky-700 hover:underline">
              ← Return to Clinic Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
