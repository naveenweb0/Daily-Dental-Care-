"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STATUS_COLORS, label, CLINIC, waLink } from "@/lib/clinic";
import { formatTime12 } from "@/lib/time";

type Patient = {
  id: number;
  name: string;
  phone: string;
  email: string;
  gender: string;
  bloodGroup: string;
  age: number | null;
  address: string;
  medicalHistory: string;
  emergencyContact: string;
};

type Appointment = {
  id: number;
  appointmentNumber: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  doctorName: string | null;
  doctorSpecialization: string | null;
  serviceName: string | null;
  patientMessage: string;
  createdAt: string | Date;
};

type ClinicalRecord = {
  id: number;
  visitDate: string;
  doctorName: string;
  chiefComplaint: string;
  diagnosis: string;
  treatmentDone: string;
  doctorRemarks: string;
  prescription: { medicine: string; dosage: string; frequency: string; duration: string; instructions: string }[];
  nextRecallDate: string;
  createdAt: string | Date;
};

type PatientReport = {
  id: number;
  title: string;
  reportType: string;
  fileUrl: string;
  notes: string;
  doctorRemarks: string;
  issuedDate: string;
  uploadedBy: string;
  createdAt: string | Date;
};

type DoctorOption = { id: number; name: string; specialization: string };
type ServiceOption = { id: number; name: string; price: string };

export default function PatientDashboardClient({
  patient,
  appointments,
  clinicalRecords,
  reports,
  doctors,
  services,
}: {
  patient: Patient;
  appointments: Appointment[];
  clinicalRecords: ClinicalRecord[];
  reports: PatientReport[];
  doctors: DoctorOption[];
  services: ServiceOption[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "remarks" | "reports" | "appointments" | "book" | "profile">("overview");
  const [loggingOut, setLoggingOut] = useState(false);

  // Booking Form State inside dashboard
  const [bookingDocId, setBookingDocId] = useState(doctors[0]?.id ? String(doctors[0].id) : "");
  const [bookingServiceId, setBookingServiceId] = useState(services[0]?.id ? String(services[0].id) : "");
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [bookingTime, setBookingTime] = useState("10:30");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/patient/auth/logout", { method: "POST" });
      router.push("/patient/login");
      router.refresh();
    } catch {
      router.push("/patient/login");
    }
  }

  async function handleBookAppointment(e: React.FormEvent) {
    e.preventDefault();
    setBookingSubmitting(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      const res = await fetch("/api/patient/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: bookingDocId,
          serviceId: bookingServiceId,
          date: bookingDate,
          time: bookingTime,
          message: bookingMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to reserve slot");
      setBookingSuccess(`Your appointment (${data.appointment.appointmentNumber}) has been booked for ${bookingDate} at ${bookingTime}. Our team will welcome you!`);
      router.refresh();
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Failed to book slot");
    } finally {
      setBookingSubmitting(false);
    }
  }

  const upcomingAppts = appointments.filter(
    (a) => a.status === "confirmed" || a.status === "new" || a.status === "checked_in" || a.status === "in_chair"
  );
  const nextVisit = upcomingAppts[0];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Banner */}
      <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-2xl font-bold shadow-md">
                👤
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Welcome, {patient.name}
                  </h1>
                  <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 text-[11px] font-bold text-sky-300 border border-sky-400/30">
                    Patient ID #{patient.id}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Daily Dental Care · Health & Clinical Records Portal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setTab("book")}
                className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:from-sky-600 hover:to-cyan-600"
              >
                📅 Book New Visit
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-full border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                {loggingOut ? "Signing out..." : "Sign Out ↪"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white p-2 rounded-2xl shadow-xs">
          <button
            type="button"
            onClick={() => setTab("overview")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              tab === "overview"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>📊 Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setTab("remarks")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              tab === "remarks"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>🩺 Doctor Remarks & Notes</span>
            <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${tab === "remarks" ? "bg-white/20 text-white" : "bg-sky-100 text-sky-800"}`}>
              {clinicalRecords.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab("reports")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              tab === "reports"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>📁 Reports & X-Rays</span>
            <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${tab === "reports" ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-800"}`}>
              {reports.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab("appointments")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              tab === "appointments"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>📅 My Appointments</span>
            <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${tab === "appointments" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
              {appointments.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab("book")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              tab === "book"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>✨ Book Appointment</span>
          </button>

          <button
            type="button"
            onClick={() => setTab("profile")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              tab === "profile"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>👤 Medical Profile</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Next Visit Banner */}
            {nextVisit ? (
              <div className="relative overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-r from-sky-600 to-blue-700 p-6 text-white shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-wide uppercase backdrop-blur">
                      ⏰ Upcoming Appointment
                    </span>
                    <h2 className="mt-2 text-2xl font-bold">{nextVisit.serviceName || "Dental Consultation"}</h2>
                    <p className="mt-1 text-xs text-sky-100">
                      With <strong>{nextVisit.doctorName || "Dental Specialist"}</strong> on{" "}
                      <strong>{nextVisit.appointmentDate}</strong> at{" "}
                      <strong>{formatTime12(nextVisit.startTime)}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-sky-900 shadow-sm">
                      {label(nextVisit.status)}
                    </span>
                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello Daily Dental Care, I am contacting regarding my upcoming appointment ${nextVisit.appointmentNumber}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/40 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition backdrop-blur"
                    >
                      💬 Reschedule on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">No Upcoming Appointments Scheduled</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Maintain optimal oral health with a 6-month routine scaling and checkup.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTab("book")}
                  className="rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition"
                >
                  Schedule Checkup →
                </button>
              </div>
            )}

            {/* Quick Metrics Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div
                onClick={() => setTab("remarks")}
                className="cursor-pointer rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md"
              >
                <div className="text-2xl mb-2">🩺</div>
                <div className="text-xs font-bold uppercase text-slate-400">Clinical Records</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{clinicalRecords.length}</div>
                <div className="text-[11px] text-sky-700 font-semibold mt-1">View Doctor Remarks →</div>
              </div>

              <div
                onClick={() => setTab("reports")}
                className="cursor-pointer rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="text-2xl mb-2">📁</div>
                <div className="text-xs font-bold uppercase text-slate-400">Diagnostic Reports</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{reports.length}</div>
                <div className="text-[11px] text-indigo-700 font-semibold mt-1">View X-Rays & Slips →</div>
              </div>

              <div
                onClick={() => setTab("appointments")}
                className="cursor-pointer rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="text-2xl mb-2">📅</div>
                <div className="text-xs font-bold uppercase text-slate-400">Total Visits</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{appointments.length}</div>
                <div className="text-[11px] text-blue-700 font-semibold mt-1">View Visit Log →</div>
              </div>

              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
                <div className="text-2xl mb-2">📞</div>
                <div className="text-xs font-bold uppercase text-emerald-800">Clinic Emergency Line</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{CLINIC.phone}</div>
                <a
                  href={`tel:${CLINIC.phoneDial}`}
                  className="text-[11px] text-emerald-700 font-bold mt-1 block hover:underline"
                >
                  Call Now (Emergency Triage) ↗
                </a>
              </div>
            </div>

            {/* Latest Doctor Remark Highlight */}
            {clinicalRecords[0] && (
              <div className="rounded-3xl border border-sky-200/80 bg-gradient-to-b from-sky-50/40 to-white p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-600 text-xs font-bold text-white">
                      💬
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">Latest Doctor Clinical Advice</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Visit Date: {clinicalRecords[0].visitDate}
                  </span>
                </div>

                <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">
                    Prescribed by <strong>{clinicalRecords[0].doctorName}</strong>:
                  </div>
                  <p className="mt-1 text-sm text-slate-800 font-medium leading-relaxed">
                    &ldquo;{clinicalRecords[0].doctorRemarks}&rdquo;
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setTab("remarks")}
                    className="text-xs font-bold text-sky-700 hover:underline"
                  >
                    View Full Clinical History & Prescriptions →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DOCTOR REMARKS & CLINICAL RECORDS */}
        {tab === "remarks" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Doctor Remarks & Clinical Notes</h2>
                <p className="text-xs text-slate-500">
                  Detailed diagnoses, treatments performed, and doctors&apos; oral care instructions for each of your visits.
                </p>
              </div>
            </div>

            {clinicalRecords.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
                <div className="text-4xl mb-2">🩺</div>
                <p className="font-semibold text-slate-700">No clinical notes on file yet.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Once your doctor completes a consultation at our clinic, clinical remarks and prescriptions will be published here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {clinicalRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-lg font-bold text-sky-700">
                          👨‍⚕️
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-base">{rec.doctorName}</div>
                          <div className="text-xs text-slate-500">Consultation Date: {rec.visitDate}</div>
                        </div>
                      </div>

                      {rec.nextRecallDate && (
                        <div className="rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                          🗓 Next Recommended Checkup: {rec.nextRecallDate}
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                      {rec.chiefComplaint && (
                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Reported Symptoms / Chief Complaint
                          </span>
                          <p className="text-slate-800 text-sm">{rec.chiefComplaint}</p>
                        </div>
                      )}

                      {rec.diagnosis && (
                        <div className="rounded-2xl bg-sky-50/60 p-4 border border-sky-100">
                          <span className="text-[10px] uppercase font-bold text-sky-800 block mb-1">
                            Clinical Diagnosis
                          </span>
                          <p className="text-slate-900 text-sm font-semibold">{rec.diagnosis}</p>
                        </div>
                      )}
                    </div>

                    {rec.treatmentDone && (
                      <div className="rounded-2xl bg-slate-50/70 p-4 text-xs border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Procedures Completed
                        </span>
                        <p className="text-slate-800 text-sm">{rec.treatmentDone}</p>
                      </div>
                    )}

                    {rec.doctorRemarks && (
                      <div className="rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/50 p-4 border border-sky-200/70">
                        <span className="text-[10px] uppercase font-bold text-sky-900 block mb-1">
                          💬 Doctor Remarks & Home Care Instructions
                        </span>
                        <p className="text-sm font-medium leading-relaxed text-slate-900">
                          {rec.doctorRemarks}
                        </p>
                      </div>
                    )}

                    {/* Prescribed Medications */}
                    {rec.prescription && rec.prescription.length > 0 && (
                      <div className="space-y-2 border-t border-slate-100 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">
                            💊 Prescribed Medications
                          </span>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="text-[11px] font-semibold text-sky-700 hover:underline"
                          >
                            🖨 Print Prescription Slip
                          </button>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-600 font-bold">
                              <tr>
                                <th className="p-3">Medicine</th>
                                <th className="p-3">Dosage</th>
                                <th className="p-3">Frequency</th>
                                <th className="p-3">Duration</th>
                                <th className="p-3">Instructions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {rec.prescription.map((m, i) => (
                                <tr key={i}>
                                  <td className="p-3 font-bold text-slate-900">{m.medicine}</td>
                                  <td className="p-3">{m.dosage || "—"}</td>
                                  <td className="p-3 font-semibold text-sky-800">{m.frequency}</td>
                                  <td className="p-3">{m.duration}</td>
                                  <td className="p-3 text-slate-600">{m.instructions}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REPORTS & X-RAYS */}
        {tab === "reports" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Diagnostic Reports & X-Rays</h2>
              <p className="text-xs text-slate-500">
                View or download your digital X-ray scans, OPG images, lab findings, and treatment plans.
              </p>
            </div>

            {reports.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
                <div className="text-4xl mb-2">📁</div>
                <p className="font-semibold text-slate-700">No reports uploaded yet.</p>
                <p className="text-xs text-slate-400 mt-1">
                  When our clinic takes digital X-rays or diagnostic scans, your file will be uploaded here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase text-indigo-700">
                          {rep.reportType.replace("_", " ")}
                        </span>
                        <span className="text-xs text-slate-400">{rep.issuedDate}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base">{rep.title}</h3>

                      {rep.doctorRemarks && (
                        <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <strong>Doctor Note:</strong> {rep.doctorRemarks}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">By {rep.uploadedBy}</span>
                      {rep.fileUrl ? (
                        <a
                          href={rep.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
                        >
                          View Document ↗
                        </a>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700">✓ On Clinic File</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MY APPOINTMENTS */}
        {tab === "appointments" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Appointment History</h2>
                <p className="text-xs text-slate-500">Track current queue status, upcoming visits, and past consultations.</p>
              </div>
              <button
                type="button"
                onClick={() => setTab("book")}
                className="rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition"
              >
                + Book New Slot
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
                <p className="font-semibold text-slate-700">No appointments recorded yet.</p>
                <button
                  type="button"
                  onClick={() => setTab("book")}
                  className="mt-4 rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white"
                >
                  Book Your First Visit
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-4">Appt #</th>
                      <th className="p-4">Service</th>
                      <th className="p-4">Doctor</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/60">
                        <td className="p-4 font-mono text-xs font-bold text-sky-700">
                          {a.appointmentNumber}
                        </td>
                        <td className="p-4 font-semibold text-slate-900">
                          {a.serviceName || "Dental Care"}
                        </td>
                        <td className="p-4 text-xs text-slate-600">{a.doctorName || "Specialist"}</td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">{a.appointmentDate}</div>
                          <div className="text-xs text-slate-500">{formatTime12(a.startTime)}</div>
                        </td>
                        <td className="p-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[a.status]}`}>
                            {label(a.status)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={waLink(`Hello Daily Dental Care, I have a query about appointment ${a.appointmentNumber}.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            WhatsApp Help
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: IN-PORTAL BOOKING */}
        {tab === "book" && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                📅 Book a Follow-Up Appointment
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your patient details (<strong>{patient.name}</strong> · {patient.phone}) are already linked!
              </p>
            </div>

            {bookingSuccess ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-4 shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-2xl text-white">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-emerald-900">Appointment Confirmed!</h3>
                <p className="text-xs text-emerald-700 leading-relaxed">{bookingSuccess}</p>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingSuccess(null);
                      setTab("appointments");
                    }}
                    className="rounded-full bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800"
                  >
                    View in Appointments List →
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleBookAppointment}
                className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-soft space-y-5"
              >
                {bookingError && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800">
                    ⚠️ {bookingError}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Select Treatment / Service
                    </label>
                    <select
                      value={bookingServiceId}
                      onChange={(e) => setBookingServiceId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-sky-500 focus:outline-none"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Specialist Doctor
                    </label>
                    <select
                      value={bookingDocId}
                      onChange={(e) => setBookingDocId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-sky-500 focus:outline-none"
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.specialization})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
                    <input
                      required
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-sky-500 focus:outline-none"
                    >
                      <option value="10:00">10:00 AM</option>
                      <option value="10:30">10:30 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="12:30">12:30 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                      <option value="18:00">06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specific Symptoms / Doctor Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Follow-up for capping, experiencing slight gum sensitivity..."
                    value={bookingMessage}
                    onChange={(e) => setBookingMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 py-3 text-sm font-bold text-white shadow-soft transition hover:from-sky-700 hover:to-blue-800 disabled:opacity-50"
                >
                  {bookingSubmitting ? "Confirming Slot..." : "Confirm & Reserve Appointment →"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 6: MEDICAL & PERSONAL PROFILE */}
        {tab === "profile" && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Patient Medical & Personal Profile</h2>
              <p className="text-xs text-slate-500">
                Your clinical records and health warnings recorded on file with Daily Dental Care.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block">Full Name</span>
                  <span className="font-semibold text-slate-900">{patient.name}</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block">Mobile Number</span>
                  <span className="font-semibold text-slate-900">{patient.phone}</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block">Email Address</span>
                  <span className="font-semibold text-slate-900">{patient.email || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block">Age & Gender</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {patient.age ? `${patient.age} yrs` : "—"} · {patient.gender || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block">Blood Group</span>
                  <span className="font-semibold text-slate-900">{patient.bloodGroup || "—"}</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block">Emergency Contact</span>
                  <span className="font-semibold text-slate-900">{patient.emergencyContact || "—"}</span>
                </div>
              </div>

              {patient.medicalHistory && (
                <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>⚠️ Recorded Medical Allergies / Alerts:</span>
                  </div>
                  <p className="text-sm font-medium">{patient.medicalHistory}</p>
                </div>
              )}

              {patient.address && (
                <div className="border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <strong>Residential Address:</strong> {patient.address}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
