"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Fatal Error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white px-4 font-sans text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="text-4xl">🦷</div>
          <h1 className="text-2xl font-bold">Daily Dental Care</h1>
          <p className="text-xs text-slate-400">
            A critical system error occurred. Please refresh or contact support if the issue persists.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-sky-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-400 transition"
          >
            ↻ Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
