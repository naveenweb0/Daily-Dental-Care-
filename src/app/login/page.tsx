"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data.message ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setMsg("Unable to connect. Please check your connection and try again.");
      setLoading(false);
    }
  }

  const field = "mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-xl text-white">🦷</div>
          <h1 className="mt-4 text-xl font-semibold">Daily Dental Care</h1>
          <p className="text-sm text-slate-500">Staff &amp; Admin Login</p>
        </div>
        {msg && <p className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{msg}</p>}
        <label className="mt-6 block text-sm font-medium">
          Email
          <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Password
          <input className={field} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button disabled={loading} className="mt-6 w-full rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? "Loading..." : "Sign in"}
        </button>
        <Link href="/" className="mt-4 block text-center text-xs text-slate-500">← Back to website</Link>
      </form>
    </div>
  );
}
