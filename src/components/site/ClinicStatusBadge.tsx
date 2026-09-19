"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

function getIstStatus() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 3600000 * 5.5);

  const day = ist.getDay(); // 0 is Sunday
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const timeNum = hours * 60 + minutes;

  if (day === 0) {
    return {
      isOpen: false,
      isBreak: false,
      text: "Closed Today (Sunday)",
      subtext: "Opens Mon at 10:00 AM",
    };
  }

  const openTime = 10 * 60; // 10:00 AM
  const breakStart = 13 * 60; // 1:00 PM
  const breakEnd = 14 * 60; // 2:00 PM
  const closeTime = 19 * 60; // 7:00 PM

  if (timeNum >= openTime && timeNum < breakStart) {
    return {
      isOpen: true,
      isBreak: false,
      text: "Open Now",
      subtext: "Break at 1:00 PM",
    };
  } else if (timeNum >= breakStart && timeNum < breakEnd) {
    return {
      isOpen: false,
      isBreak: true,
      text: "Lunch Break",
      subtext: "Resumes at 2:00 PM",
    };
  } else if (timeNum >= breakEnd && timeNum < closeTime) {
    return {
      isOpen: true,
      isBreak: false,
      text: "Open Now",
      subtext: "Closes at 7:00 PM",
    };
  } else {
    return {
      isOpen: false,
      isBreak: false,
      text: "Closed Now",
      subtext: "Opens 10:00 AM",
    };
  }
}

export default function ClinicStatusBadge() {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [status, setStatus] = useState(getIstStatus);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(getIstStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Clinic Open (10 AM - 7 PM)</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
        status.isOpen
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : status.isBreak
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-slate-200 bg-slate-100 text-slate-700"
      }`}
    >
      <span
        className={`flex h-2 w-2 rounded-full ${
          status.isOpen
            ? "bg-emerald-500 animate-pulse"
            : status.isBreak
            ? "bg-amber-500"
            : "bg-slate-400"
        }`}
      />
      <span>{status.text}</span>
      <span className="hidden font-normal opacity-80 sm:inline">· {status.subtext}</span>
    </div>
  );
}
