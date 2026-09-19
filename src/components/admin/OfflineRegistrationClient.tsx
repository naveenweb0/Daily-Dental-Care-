"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Doctor = { id: number; name: string; specialization: string };
type Service = { id: number; name: string };

export default function OfflineRegistrationClient({
  doctors,
  services,
}: {
  doctors: Doctor[];
  services: Service[];
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdData, setCreatedData] = useState<{
    patientId: number;
    phone: string;
    name: string;
    password: string;
    appointmentNumber?: string;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "male",
    age: "",
    bloodGroup: "",
    address: "",
    medicalHistory: "",
    emergencyContact: "",
    notes: "",
    password: "",
    // Walk-in booking options
    createAppointment: true,
    doctorId: doctors[0]?.id ? String(doctors[0].id) : "",
    serviceId: services[0]?.id ? String(services[0].id) : "",
    appointmentDate: new Date().toISOString().slice(0, 10),
    startTime: "10:30",
    appointmentStatus: "checked_in", // 'checked_in' | 'confirmed' | 'in_chair'
  });

  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register patient");

      setCreatedData({
        patientId: data.patientId,
        phone: data.credentials.phone,
        name: form.name,
        password: data.credentials.password,
        appointmentNumber: data.appointment?.appointmentNumber,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error submitting form");
    } finally {
      setSubmitting(false);
    }
  }

  const patientLoginUrl = typeof window !== "undefined" ? `${window.location.origin}/patient/login` : "https://dailydentalcare.in/patient/login";
  const whatsappMsg = createdData
    ? `Hello ${createdData.name}! Welcome to Daily Dental Care Mohali.\n\nYour Patient Portal account has been created:\n🔗 Portal Login: ${patientLoginUrl}\n📱 Mobile / Username: ${createdData.phone}\n🔑 Password: ${createdData.password}\n\nYou can log in anytime to view your doctor clinical notes, prescriptions, reports & book upcoming appointments.`
    : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/patients" className="text-xs font-semibold text-sky-700 hover:underline">
            ← Back to All Patients
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            🏥 Register Offline Walk-In Patient
          </h1>
          <p className="text-xs text-slate-500">
            Create in-clinic patient file, auto-generate website portal login credentials, and optionally queue immediate appointment.
          </p>
        </div>
      </div>

      {createdData ? (
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white p-8 shadow-md space-y-6">
          <div className="flex items-center gap-3 text-emerald-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-2xl text-white shadow-sm">
              ✓
            </div>
            <div>
              <h2 className="text-xl font-bold">Patient Registered Successfully!</h2>
              <p className="text-xs text-emerald-700">
                Patient record saved. Portal account is ready for online login and report viewing.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              🔑 Patient Website Login Credentials
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Patient Name</span>
                <span className="font-bold text-slate-900">{createdData.name}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Login Phone / Identifier</span>
                <span className="font-mono font-bold text-slate-900">{createdData.phone}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Portal Password</span>
                <span className="font-mono font-bold text-sky-700">{createdData.password}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Portal Access Link</span>
                <a href="/patient/login" target="_blank" className="font-semibold text-sky-600 hover:underline">
                  /patient/login ↗
                </a>
              </div>
            </div>

            {createdData.appointmentNumber && (
              <div className="mt-2 rounded-xl bg-sky-50 p-3 text-xs text-sky-900 border border-sky-100 flex items-center justify-between">
                <span>Walk-in Appointment Queued: <strong>{createdData.appointmentNumber}</strong></span>
                <span className="rounded-full bg-sky-600 px-2.5 py-0.5 font-bold text-white uppercase text-[10px]">Checked-In</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/91${createdData.phone}?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              💬 Send Credentials via WhatsApp
            </a>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(whatsappMsg);
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              {copied ? "✓ Copied to Clipboard" : "📋 Copy Login Details"}
            </button>

            <Link
              href={`/admin/patients/${createdData.patientId}`}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              Open Patient Medical File →
            </Link>

            <button
              type="button"
              onClick={() => {
                setCreatedData(null);
                setForm({
                  name: "",
                  phone: "",
                  email: "",
                  gender: "male",
                  age: "",
                  bloodGroup: "",
                  address: "",
                  medicalHistory: "",
                  emergencyContact: "",
                  notes: "",
                  password: "",
                  createAppointment: true,
                  doctorId: doctors[0]?.id ? String(doctors[0].id) : "",
                  serviceId: services[0]?.id ? String(services[0].id) : "",
                  appointmentDate: new Date().toISOString().slice(0, 10),
                  startTime: "10:30",
                  appointmentStatus: "checked_in",
                });
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition ml-auto"
            >
              + Register Another Walk-in
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800">
              ⚠️ {error}
            </div>
          )}

          {/* Patient Details Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm font-bold text-sky-700">
                1
              </span>
              <h2 className="text-base font-bold text-slate-900">Patient Personal & Contact Information</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Patient Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (10 Digits) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100">
                  <span className="pl-3 pr-1 text-xs font-bold text-slate-500">+91</span>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-r-xl px-2 py-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  placeholder="e.g. 34"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">Unknown / Not Tested</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Phone</label>
                <input
                  placeholder="e.g. 9811122233 (Spouse / Parent)"
                  value={form.emergencyContact}
                  onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address / City</label>
                <input
                  placeholder="e.g. House #142, Phase 7, Mohali"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>
          </div>

          {/* Medical History & Portal Password */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">
                2
              </span>
              <h2 className="text-base font-bold text-slate-900">Medical History & Patient Portal Access</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Medical Alerts / Allergies / Conditions
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Penicillin allergy, Diabetic, Hypertension, Bleeding tendencies..."
                  value={form.medicalHistory}
                  onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Portal Login Password (Optional Custom)
                </label>
                <input
                  type="text"
                  placeholder="Leave empty to default to patient's phone number"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
                <p className="mt-1.5 text-[11px] text-slate-500">
                  💡 By default, the patient can log in at <code className="bg-slate-100 px-1 rounded">/patient/login</code> using their 10-digit mobile number as both Username and Password.
                </p>
              </div>
            </div>
          </div>

          {/* Walk-in Booking Integration */}
          <div className="rounded-3xl border border-sky-200 bg-sky-50/40 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-600 text-sm font-bold text-white">
                  3
                </span>
                <h2 className="text-base font-bold text-slate-900">Queue Walk-in Appointment Now?</h2>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-sky-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.createAppointment}
                  onChange={(e) => setForm({ ...form, createAppointment: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Create walk-in slot today
              </label>
            </div>

            {form.createAppointment && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Doctor</label>
                  <select
                    value={form.doctorId}
                    onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Treatment / Service</label>
                  <select
                    value={form.serviceId}
                    onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Appointment Time</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={form.appointmentStatus}
                    onChange={(e) => setForm({ ...form, appointmentStatus: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none font-bold text-sky-800"
                  >
                    <option value="checked_in">Checked-In (Waiting in Lounge)</option>
                    <option value="in_chair">In-Chair (Under Consultation)</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed Today</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/admin/patients"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-7 py-3 text-sm font-bold text-white shadow-md hover:from-sky-700 hover:to-blue-800 transition disabled:opacity-50"
            >
              {submitting ? "Registering & Creating Account..." : "✓ Register Offline Patient"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
