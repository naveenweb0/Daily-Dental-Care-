"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Service = { id: number; name: string; slug: string; durationMinutes: number };
type Doctor = { id: number; name: string; qualification: string; specialization: string; photo: string };
type Slot = { time: string; label: string; available: boolean };

const field =
  "mt-1.5 w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-xs outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 transition";

function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export default function BookingForm({ services, doctors }: { services: Service[]; doctors: Doctor[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const preselectService = params.get("service");
  const preselectDoctor = params.get("doctor");

  const [serviceId, setServiceId] = useState<number | null>(
    services.find((s) => s.slug === preselectService)?.id ?? (services[0]?.id ?? null)
  );
  const [doctorId, setDoctorId] = useState<number | null>(
    preselectDoctor ? Number(preselectDoctor) : (doctors[0]?.id ?? null)
  );
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [closed, setClosed] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    message: "",
    patientType: "new",
    consent: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [maxDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().slice(0, 10);
  });

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!doctorId || !date) {
      return;
    }
    async function fetchSlots() {
      setLoadingSlots(true);
      try {
        const res = await fetch(`/api/availability?doctorId=${doctorId}&date=${date}`);
        const data = await res.json();
        if (active) {
          setSlots(data.slots ?? []);
          setClosed(Boolean(data.closed));
          setTime("");
          setMsg("");
        }
      } catch {
        if (active) {
          setMsg("Unable to connect to availability service. Please check your connection.");
        }
      } finally {
        if (active) setLoadingSlots(false);
      }
    }
    fetchSlots();
    return () => {
      active = false;
    };
  }, [doctorId, date, refreshKey]);

  // Group slots into Morning (10:00 - 13:00) and Afternoon/Evening (14:00 - 19:00)
  const morningSlots = useMemo(
    () => slots.filter((s) => Number(s.time.split(":")[0]) < 13),
    [slots]
  );
  const eveningSlots = useMemo(
    () => slots.filter((s) => Number(s.time.split(":")[0]) >= 14),
    [slots]
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!time) {
      setMsg("Please select an available appointment time slot.");
      return;
    }
    setErrors({});
    setMsg("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: form.age ? Number(form.age) : null,
          serviceId,
          doctorId,
          date,
          time,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setMsg(data.message ?? "Something went wrong. Please try again.");
        if (res.status === 409) setRefreshKey((k) => k + 1);
        setSubmitting(false);
        return;
      }
      router.push(`/book/confirmation?id=${data.appointment.appointmentNumber}`);
    } catch {
      setMsg("Unable to submit appointment. Please try again.");
      setSubmitting(false);
    }
  }

  const selectedService = services.find((s) => s.id === serviceId);
  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-12">
      {/* Steps & Main Form */}
      <div className="space-y-8 lg:col-span-8">
        {/* STEP 1: Treatment */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-xs font-bold text-white shadow-sm">
              1
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">Select Dental Treatment</h2>
              <p className="text-xs text-slate-500">Pick a primary service for your consultation</p>
            </div>
          </div>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {services.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setServiceId(s.id)}
                className={`flex items-center justify-between rounded-2xl border p-4 text-left text-xs transition ${
                  serviceId === s.id
                    ? "border-sky-500 bg-sky-50/80 font-bold text-sky-900 shadow-sm"
                    : "border-slate-200/80 bg-slate-50/40 text-slate-700 hover:border-sky-300 hover:bg-white"
                }`}
              >
                <div>
                  <div className="font-bold">{s.name}</div>
                  <span className="text-[11px] font-normal text-slate-500">{s.durationMinutes} mins</span>
                </div>
                {serviceId === s.id && <span className="text-sky-600 font-bold text-sm">✓</span>}
              </button>
            ))}
          </div>
          {errors.serviceId && <p className="mt-2 text-xs text-rose-600">{errors.serviceId}</p>}
        </section>

        {/* STEP 2: Doctor */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-xs font-bold text-white shadow-sm">
              2
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">Select Treating Doctor</h2>
              <p className="text-xs text-slate-500">Consult with our resident MDS specialists</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => setDoctorId(d.id)}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left text-xs transition ${
                  doctorId === d.id
                    ? "border-sky-500 bg-sky-50/80 font-bold text-sky-900 shadow-sm"
                    : "border-slate-200/80 bg-slate-50/40 text-slate-700 hover:border-sky-300 hover:bg-white"
                }`}
              >
                <div className="font-bold text-slate-900">{d.name}</div>
                <div className="mt-1 text-[11px] font-medium text-sky-700">{d.qualification}</div>
                <div className="mt-1 text-[11px] text-slate-500">{d.specialization}</div>
              </button>
            ))}
          </div>
          {errors.doctorId && <p className="mt-2 text-xs text-rose-600">{errors.doctorId}</p>}
        </section>

        {/* STEP 3: Date & Time Slots */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-xs font-bold text-white shadow-sm">
              3
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">Choose Date &amp; Available Slot</h2>
              <p className="text-xs text-slate-500">Live real-time doctor appointment availability</p>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-xs font-bold text-slate-700">Appointment Date</label>
            <input
              type="date"
              className="mt-1.5 block w-full max-w-xs rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-sky-500 focus:bg-white"
              min={todayISO()}
              max={maxDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <p className="mt-2 text-xs text-rose-600">{errors.date}</p>}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            {!doctorId || !date ? (
              <p className="text-xs text-slate-500">Pick a doctor and date above to see live available slots.</p>
            ) : loadingSlots ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-400">Loading live availability...</div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />
                  ))}
                </div>
              </div>
            ) : closed || slots.length === 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs font-medium text-amber-900">
                Clinic is closed or all slots are booked on this date. Please pick another date.
              </div>
            ) : (
              <div className="space-y-4">
                {morningSlots.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      🌅 Morning Slots (10:00 AM – 1:00 PM)
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                      {morningSlots.map((s) => (
                        <button
                          type="button"
                          key={s.time}
                          disabled={!s.available}
                          onClick={() => setTime(s.time)}
                          className={`rounded-xl border py-2 text-xs font-semibold transition ${
                            time === s.time
                              ? "border-sky-600 bg-sky-600 text-white shadow-sm"
                              : s.available
                              ? "border-slate-200 bg-white text-slate-800 hover:border-sky-400"
                              : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {eveningSlots.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      🌇 Afternoon &amp; Evening Slots (2:00 PM – 7:00 PM)
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                      {eveningSlots.map((s) => (
                        <button
                          type="button"
                          key={s.time}
                          disabled={!s.available}
                          onClick={() => setTime(s.time)}
                          className={`rounded-xl border py-2 text-xs font-semibold transition ${
                            time === s.time
                              ? "border-sky-600 bg-sky-600 text-white shadow-sm"
                              : s.available
                              ? "border-slate-200 bg-white text-slate-800 hover:border-sky-400"
                              : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {errors.time && <p className="mt-2 text-xs text-rose-600">{errors.time}</p>}
          </div>
        </section>

        {/* STEP 4: Patient Details */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-xs font-bold text-white shadow-sm">
              4
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">Patient Details &amp; Contact</h2>
              <p className="text-xs text-slate-500">Your confirmation will be sent to this number</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold text-slate-700">
              Full Patient Name*
              <input className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Navjot Singh" />
              {errors.name && <span className="text-xs font-normal text-rose-600">{errors.name}</span>}
            </label>

            <label className="block text-xs font-bold text-slate-700">
              Mobile Number (WhatsApp Enabled)*
              <input className={field} inputMode="numeric" placeholder="10-digit mobile number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              {errors.phone && <span className="text-xs font-normal text-rose-600">{errors.phone}</span>}
            </label>

            <label className="block text-xs font-bold text-slate-700">
              Email Address (Optional)
              <input className={field} type="email" placeholder="patient@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <span className="text-xs font-normal text-rose-600">{errors.email}</span>}
            </label>

            <label className="block text-xs font-bold text-slate-700">
              Age (Optional)
              <input className={field} inputMode="numeric" placeholder="e.g. 28" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              {errors.age && <span className="text-xs font-normal text-rose-600">{errors.age}</span>}
            </label>

            <label className="block text-xs font-bold text-slate-700 sm:col-span-2">
              Specific Problem or Symptoms
              <textarea className={field} rows={3} placeholder="Describe any pain, previous treatment, or specific concerns..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </label>

            <div className="sm:col-span-2">
              <span className="text-xs font-bold text-slate-700">Patient Status:</span>
              <div className="mt-2 flex gap-2">
                {[
                  { id: "new", label: "New Patient (First Visit)" },
                  { id: "existing", label: "Existing Patient (Follow-up)" },
                ].map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setForm({ ...form, patientType: t.id })}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                      form.patientType === t.id
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 text-[11px] text-slate-600 sm:col-span-2 pt-2">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              />
              <span>I consent to Daily Dental Care contacting me via Call/WhatsApp regarding this appointment request and storing my details according to privacy policies.</span>
            </label>
            {errors.consent && <p className="text-xs text-rose-600 sm:col-span-2">{errors.consent}</p>}
          </div>
        </section>
      </div>

      {/* Sticky Booking Summary Panel */}
      <aside className="lg:col-span-4">
        <div className="sticky top-24 rounded-3xl border border-sky-200/90 bg-gradient-to-b from-sky-50/60 to-white p-6 shadow-soft sm:p-8">
          <span className="rounded-md bg-sky-100 px-2.5 py-1 text-[11px] font-bold text-sky-800">
            Booking Overview
          </span>
          <h3 className="mt-2 font-heading text-xl font-bold text-slate-900">Appointment Summary</h3>

          <dl className="mt-5 space-y-3 text-xs border-y border-slate-100 py-4">
            <div className="flex justify-between">
              <dt className="text-slate-500">Treatment:</dt>
              <dd className="font-bold text-slate-900 text-right">{selectedService?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Specialist:</dt>
              <dd className="font-bold text-slate-900 text-right">{selectedDoctor?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Date:</dt>
              <dd className="font-bold text-slate-900 text-right">{date || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Time Slot:</dt>
              <dd className="font-bold text-sky-700 text-right">
                {slots.find((s) => s.time === time)?.label ?? (time ? time : "Select slot above")}
              </dd>
            </div>
          </dl>

          {msg && (
            <p className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-100">
              {msg}
            </p>
          )}

          <button
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-sky-600 to-blue-700 py-3.5 text-xs font-bold text-white shadow-soft shadow-glow-blue transition hover:from-sky-700 hover:to-blue-800 disabled:opacity-60"
          >
            {submitting ? "Securing Slot..." : "Confirm & Schedule Appointment"}
          </button>

          <p className="mt-3 text-center text-[11px] text-slate-400">
            Instant booking confirmation · Free rescheduling
          </p>
        </div>
      </aside>
    </form>
  );
}

