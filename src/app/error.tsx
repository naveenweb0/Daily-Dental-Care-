"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CLINIC, waLink } from "@/lib/clinic";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50/50 px-4 py-12 text-center">
      <div className="mx-auto max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-3xl text-rose-600">
          ⚠️
        </div>

        <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900">
          Something went wrong
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          We encountered an unexpected issue while loading this page. You can try reloading or reach our clinic front desk directly.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition"
          >
            ↻ Try Again
          </button>
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Return Home
          </Link>
          <a
            href={waLink("Hello Daily Dental Care, I encountered an issue on your website.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
          >
            💬 Support
          </a>
        </div>

        {error.digest && (
          <div className="text-[10px] font-mono text-slate-400">Error Ref: {error.digest}</div>
        )}
      </div>
    </div>
  );
}
