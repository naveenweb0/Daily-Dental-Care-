"use client";

import { useState } from "react";

type Errors = Record<string, string>;

const PRESETS = [
  "General Dental Checkup",
  "Dental Implants Consultation",
  "Invisalign / Clear Aligners",
  "Severe Tooth Pain Relief",
  "Teeth Cleaning & Whitening",
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function appendPreset(preset: string) {
    setForm((f) => ({
      ...f,
      message: f.message ? `${f.message}\nRegarding: ${preset}` : `Hello, I would like to enquire about ${preset}.`,
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrors({});
    setMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setMsg(data.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setMsg("Unable to connect. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/90 p-10 text-center shadow-soft animate-fade-up">
        <div className="text-5xl">✅</div>
        <h2 className="mt-4 font-heading text-2xl font-bold text-emerald-950">Thank You! Your Enquiry Was Received</h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-emerald-800">
          Our Mohali clinic reception team will call you shortly at <strong>{form.phone}</strong> to confirm your slot or answer your questions.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setForm({ name: "", phone: "", email: "", message: "" });
          }}
          className="mt-6 rounded-full bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800"
        >
          Send another message
        </button>
      </div>
    );
  }

  const field = "mt-1.5 w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-xs outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 transition";

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft sm:p-8">
      <span className="rounded-md bg-sky-100 px-2.5 py-1 text-[11px] font-bold text-sky-800">
        Quick Online Enquiry
      </span>
      <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">Send Us a Direct Message</h2>
      <p className="mt-1 text-xs text-slate-500">
        Fill out your details below and our clinical team will get back to you within 30 minutes during clinic hours.
      </p>

      {/* Quick Presets */}
      <div className="mt-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick Topics:</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => appendPreset(p)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 hover:border-sky-300 hover:bg-sky-50/60 transition"
            >
              + {p}
            </button>
          ))}
        </div>
      </div>

      {msg && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 border border-rose-100">{msg}</p>}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-bold text-slate-700">
          Full Name*
          <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="e.g. Gurpreet Singh" />
          {errors.name && <span className="text-xs font-normal text-rose-600">{errors.name}</span>}
        </label>

        <label className="block text-xs font-bold text-slate-700">
          Phone Number*
          <input className={field} inputMode="numeric" placeholder="10-digit mobile number" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
          {errors.phone && <span className="text-xs font-normal text-rose-600">{errors.phone}</span>}
        </label>

        <label className="block text-xs font-bold text-slate-700 sm:col-span-2">
          Email Address (Optional)
          <input className={field} type="email" placeholder="name@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
          {errors.email && <span className="text-xs font-normal text-rose-600">{errors.email}</span>}
        </label>

        <label className="block text-xs font-bold text-slate-700 sm:col-span-2">
          How Can We Help You?*
          <textarea className={field} rows={4} placeholder="Describe your dental concern, preferred day/time, or questions..." value={form.message} onChange={(e) => set("message", e.target.value)} required />
          {errors.message && <span className="text-xs font-normal text-rose-600">{errors.message}</span>}
        </label>
      </div>

      <button
        disabled={status === "loading"}
        className="mt-6 w-full rounded-full bg-sky-600 py-3.5 text-xs font-bold text-white shadow-soft transition hover:bg-sky-700 disabled:opacity-60"
      >
        {status === "loading" ? "Sending Request..." : "Submit Enquiry"}
      </button>
    </form>
  );
}

