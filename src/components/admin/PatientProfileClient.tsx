"use client";

import { useState } from "react";
import Link from "next/link";
import { STATUS_COLORS, label, CLINIC } from "@/lib/clinic";
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
  notes: string;
  source: string;
  createdAt: string | Date;
};

type Appointment = {
  id: number;
  appointmentNumber: string;
  appointmentDate: string;
  startTime: string;
  status: string;
  doctorName?: string;
  serviceName?: string;
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

type TimelineEvent = {
  at: Date;
  text: string;
  actor: string;
};

export default function PatientProfileClient({
  patient,
  appointments,
  clinicalRecords: initialClinicalRecords,
  reports: initialReports,
  timeline,
  doctors,
}: {
  patient: Patient;
  appointments: Appointment[];
  clinicalRecords: ClinicalRecord[];
  reports: PatientReport[];
  timeline: TimelineEvent[];
  doctors: { id: number; name: string }[];
}) {
  const [activeTab, setActiveTab] = useState<"records" | "reports" | "appointments" | "timeline">("records");
  const [records, setRecords] = useState<ClinicalRecord[]>(initialClinicalRecords);
  const [reports, setReports] = useState<PatientReport[]>(initialReports);

  // Doctor Remarks Modal / Form State
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [savingRecord, setSavingRecord] = useState(false);
  const [recordForm, setRecordForm] = useState({
    doctorName: doctors[0]?.name || "Dr. Daily Dental",
    doctorId: doctors[0]?.id ? String(doctors[0].id) : "",
    visitDate: new Date().toISOString().slice(0, 10),
    chiefComplaint: "",
    diagnosis: "",
    treatmentDone: "",
    doctorRemarks: "",
    nextRecallDate: "",
    prescription: [
      { medicine: "", dosage: "", frequency: "Twice daily", duration: "5 days", instructions: "After meals" },
    ],
  });

  // Report Modal / Form State
  const [showReportModal, setShowReportModal] = useState(false);
  const [savingReport, setSavingReport] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: "",
    reportType: "xray",
    fileUrl: "",
    issuedDate: new Date().toISOString().slice(0, 10),
    doctorRemarks: "",
    notes: "",
  });

  const [copied, setCopied] = useState(false);

  // Add a new medicine row in prescription form
  function addMedicine() {
    setRecordForm({
      ...recordForm,
      prescription: [
        ...recordForm.prescription,
        { medicine: "", dosage: "", frequency: "Twice daily", duration: "5 days", instructions: "After meals" },
      ],
    });
  }

  function removeMedicine(index: number) {
    const updated = recordForm.prescription.filter((_, i) => i !== index);
    setRecordForm({ ...recordForm, prescription: updated });
  }

  async function handleSaveRecord(e: React.FormEvent) {
    e.preventDefault();
    setSavingRecord(true);
    try {
      const filteredPrescription = recordForm.prescription.filter((p) => p.medicine.trim() !== "");
      const res = await fetch("/api/admin/clinical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          ...recordForm,
          prescription: filteredPrescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save record");
      setRecords([data.record, ...records]);
      setShowRecordModal(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving record");
    } finally {
      setSavingRecord(false);
    }
  }

  async function handleSaveReport(e: React.FormEvent) {
    e.preventDefault();
    setSavingReport(true);
    try {
      const res = await fetch("/api/admin/patient-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          ...reportForm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save report");
      setReports([data.report, ...reports]);
      setShowReportModal(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving report");
    } finally {
      setSavingReport(false);
    }
  }

  const patientLoginUrl = typeof window !== "undefined" ? `${window.location.origin}/patient/login` : "https://dailydentalcare.in/patient/login";
  const whatsappCreds = `Hello ${patient.name}!\n\nYour Patient Portal at Daily Dental Care Mohali is active:\n🔗 Login URL: ${patientLoginUrl}\n📱 Mobile: ${patient.phone}\n🔑 Password: ${patient.phone} (or custom password if updated)\n\nYou can log in to review your doctor's clinical remarks, prescriptions, dental reports & book follow-up appointments.`;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/patients" className="text-xs font-semibold text-sky-700 hover:underline">
            ← All Patients
          </Link>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{patient.name}</h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              ID: #{patient.id}
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
              {label(patient.source)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`tel:+91${patient.phone}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            📞 Call Patient
          </a>
          <a
            href={`https://wa.me/91${patient.phone}?text=${encodeURIComponent(`Hello ${patient.name}, this is ${CLINIC.name} Mohali regarding your dental care.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
          >
            💬 WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(whatsappCreds);
              setCopied(true);
              setTimeout(() => setCopied(false), 3000);
            }}
            className="rounded-full border border-sky-300 bg-sky-50 px-4 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100"
          >
            {copied ? "✓ Copied Credentials" : "🔑 Share Portal Login"}
          </button>
        </div>
      </div>

      {/* Patient Summary Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 text-sm">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 block">Phone</span>
            <span className="font-semibold text-slate-900">{patient.phone}</span>
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 block">Email</span>
            <span className="font-semibold text-slate-900">{patient.email || "—"}</span>
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 block">Age & Gender</span>
            <span className="font-semibold text-slate-900 capitalize">
              {patient.age ? `${patient.age} yrs` : "—"} · {patient.gender || "—"}
            </span>
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 block">Blood Group</span>
            <span className="font-semibold text-slate-900">{patient.bloodGroup || "—"}</span>
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 block">Registered On</span>
            <span className="font-semibold text-slate-900">
              {new Date(patient.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {patient.medicalHistory && (
          <div className="mt-4 rounded-2xl bg-amber-50/80 p-3.5 border border-amber-200/80 flex items-start gap-2.5">
            <span className="text-amber-700 text-sm">⚠️</span>
            <div className="text-xs text-amber-900">
              <strong className="font-bold">Medical Alert & Allergies:</strong> {patient.medicalHistory}
            </div>
          </div>
        )}

        {patient.address && (
          <div className="mt-2 text-xs text-slate-500">
            📍 <strong>Address:</strong> {patient.address}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("records")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
            activeTab === "records"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>🩺 Doctor Remarks & Clinical Notes</span>
          <span className="ml-1 rounded-full bg-sky-500 px-1.5 py-0.2 text-[10px] text-white">
            {records.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
            activeTab === "reports"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>📁 Reports & X-Rays</span>
          <span className="ml-1 rounded-full bg-indigo-500 px-1.5 py-0.2 text-[10px] text-white">
            {reports.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("appointments")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
            activeTab === "appointments"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>📅 Appointments ({appointments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("timeline")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
            activeTab === "timeline"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>⏱ Timeline</span>
        </button>
      </div>

      {/* Tab 1: Doctor Clinical Notes & Remarks */}
      {activeTab === "records" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Doctor Clinical Notes & Observations</h2>
            <button
              type="button"
              onClick={() => setShowRecordModal(true)}
              className="rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition"
            >
              + Add Doctor Remarks / Prescription
            </button>
          </div>

          {records.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              <div className="text-3xl mb-2">🩺</div>
              <p className="font-semibold text-slate-700">No clinical notes recorded yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Doctor remarks and prescriptions added here will immediately appear in the patient&apos;s online portal.
              </p>
              <button
                type="button"
                onClick={() => setShowRecordModal(true)}
                className="mt-4 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white"
              >
                + Add First Clinical Note
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((r) => (
                <div
                  key={r.id}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sm font-bold text-sky-700">
                        👨‍⚕️
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{r.doctorName}</div>
                        <div className="text-xs text-slate-500">Visit Date: {r.visitDate}</div>
                      </div>
                    </div>
                    {r.nextRecallDate && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                        🗓 Next Recall: {r.nextRecallDate}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    {r.chiefComplaint && (
                      <div className="rounded-2xl bg-slate-50 p-3.5">
                        <strong className="block text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                          Chief Complaint
                        </strong>
                        <p className="text-slate-800 text-sm">{r.chiefComplaint}</p>
                      </div>
                    )}
                    {r.diagnosis && (
                      <div className="rounded-2xl bg-sky-50/50 p-3.5 border border-sky-100">
                        <strong className="block text-sky-800 uppercase tracking-wider text-[10px] mb-1">
                          Clinical Diagnosis
                        </strong>
                        <p className="text-slate-900 font-semibold text-sm">{r.diagnosis}</p>
                      </div>
                    )}
                  </div>

                  {r.treatmentDone && (
                    <div className="text-xs">
                      <strong className="block text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                        Procedure / Treatment Performed
                      </strong>
                      <p className="text-slate-800 rounded-xl bg-slate-50 p-3">{r.treatmentDone}</p>
                    </div>
                  )}

                  {r.doctorRemarks && (
                    <div className="rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/50 p-4 border border-sky-200/60">
                      <strong className="block text-sky-900 uppercase tracking-wider text-[10px] mb-1 font-bold">
                        💬 Doctor Remarks & Patient Advice
                      </strong>
                      <p className="text-sm text-slate-900 leading-relaxed font-medium">{r.doctorRemarks}</p>
                    </div>
                  )}

                  {r.prescription && r.prescription.length > 0 && (
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <strong className="block text-slate-700 text-xs font-bold">
                        💊 Prescribed Medications:
                      </strong>
                      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/50">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-100 text-slate-600 font-bold">
                            <tr>
                              <th className="p-2.5">Medicine Name</th>
                              <th className="p-2.5">Dosage</th>
                              <th className="p-2.5">Frequency</th>
                              <th className="p-2.5">Duration</th>
                              <th className="p-2.5">Instructions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 bg-white">
                            {r.prescription.map((m, idx) => (
                              <tr key={idx}>
                                <td className="p-2.5 font-bold text-slate-900">{m.medicine}</td>
                                <td className="p-2.5">{m.dosage || "—"}</td>
                                <td className="p-2.5">{m.frequency}</td>
                                <td className="p-2.5">{m.duration}</td>
                                <td className="p-2.5 text-slate-600">{m.instructions}</td>
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

      {/* Tab 2: Diagnostic Reports & X-Rays */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Diagnostic Reports & X-Ray Scans</h2>
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              + Attach New Report / Scan
            </button>
          </div>

          {reports.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              <div className="text-3xl mb-2">📁</div>
              <p className="font-semibold text-slate-700">No diagnostic reports attached yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Upload or link X-rays, lab findings, scan files, or treatment plans for the patient to view and download.
              </p>
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white"
              >
                + Attach Report
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 uppercase">
                      {rep.reportType.replace("_", " ")}
                    </span>
                    <span className="text-xs text-slate-400">{rep.issuedDate}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{rep.title}</h3>

                  {rep.doctorRemarks && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong>Doctor Note:</strong> {rep.doctorRemarks}
                    </p>
                  )}

                  {rep.fileUrl && (
                    <a
                      href={rep.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline"
                    >
                      📎 View Document / Scan ↗
                    </a>
                  )}

                  <div className="border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                    Uploaded by: {rep.uploadedBy}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Appointments */}
      {activeTab === "appointments" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900">Appointment History</h2>
          {appointments.length === 0 ? (
            <p className="text-sm text-slate-500">No appointments recorded.</p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {appointments.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <div className="font-mono text-xs font-bold text-sky-700">{a.appointmentNumber}</div>
                    <div className="text-slate-900 font-semibold">
                      {a.appointmentDate} · {formatTime12(a.startTime)}
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[a.status]}`}>
                    {label(a.status)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Tab 4: Timeline */}
      {activeTab === "timeline" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900">Audit & Interaction Timeline</h2>
          {timeline.length === 0 ? (
            <p className="text-sm text-slate-500">No events recorded.</p>
          ) : (
            <ul className="space-y-3 text-xs">
              {timeline.map((t, i) => (
                <li key={i} className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                  <div className="font-medium text-slate-800">{t.text}</div>
                  <span className="mt-1 block text-[10px] text-slate-400">
                    {new Date(t.at).toLocaleString()} · {t.actor}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Modal: Add Doctor Remarks & Prescription */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                🩺 Add Doctor Clinical Remarks & Prescription
              </h3>
              <button
                type="button"
                onClick={() => setShowRecordModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Treating Doctor</label>
                  <select
                    value={recordForm.doctorId}
                    onChange={(e) => {
                      const doc = doctors.find((d) => String(d.id) === e.target.value);
                      setRecordForm({
                        ...recordForm,
                        doctorId: e.target.value,
                        doctorName: doc ? doc.name : "Doctor",
                      });
                    }}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Visit Date</label>
                  <input
                    type="date"
                    value={recordForm.visitDate}
                    onChange={(e) => setRecordForm({ ...recordForm, visitDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chief Complaint</label>
                <input
                  placeholder="e.g. Tooth sensitivity on lower right molar"
                  value={recordForm.chiefComplaint}
                  onChange={(e) => setRecordForm({ ...recordForm, chiefComplaint: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Diagnosis</label>
                <input
                  placeholder="e.g. Deep enamel caries with pulp involvement (#46)"
                  value={recordForm.diagnosis}
                  onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Treatment Performed Today</label>
                <input
                  placeholder="e.g. Access opening, biomechanical preparation done, temporary restoration placed"
                  value={recordForm.treatmentDone}
                  onChange={(e) => setRecordForm({ ...recordForm, treatmentDone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  💬 Doctor Remarks & Clinical Advice (Visible to Patient in Portal)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Avoid biting hard food from right side for 24 hours. Maintain salt water gargles 3 times a day."
                  value={recordForm.doctorRemarks}
                  onChange={(e) => setRecordForm({ ...recordForm, doctorRemarks: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* Prescription Builder */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">💊 Prescribe Medications</label>
                  <button
                    type="button"
                    onClick={addMedicine}
                    className="text-xs font-bold text-sky-700 hover:underline"
                  >
                    + Add Medicine
                  </button>
                </div>

                {recordForm.prescription.map((p, idx) => (
                  <div key={idx} className="grid gap-2 sm:grid-cols-5 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                    <input
                      placeholder="Medicine (e.g. Amoxicillin 500mg)"
                      value={p.medicine}
                      onChange={(e) => {
                        const updated = [...recordForm.prescription];
                        updated[idx].medicine = e.target.value;
                        setRecordForm({ ...recordForm, prescription: updated });
                      }}
                      className="sm:col-span-2 rounded-lg border border-slate-200 bg-white p-2"
                    />
                    <input
                      placeholder="Frequency (e.g. 1-0-1)"
                      value={p.frequency}
                      onChange={(e) => {
                        const updated = [...recordForm.prescription];
                        updated[idx].frequency = e.target.value;
                        setRecordForm({ ...recordForm, prescription: updated });
                      }}
                      className="rounded-lg border border-slate-200 bg-white p-2"
                    />
                    <input
                      placeholder="Duration (e.g. 5 days)"
                      value={p.duration}
                      onChange={(e) => {
                        const updated = [...recordForm.prescription];
                        updated[idx].duration = e.target.value;
                        setRecordForm({ ...recordForm, prescription: updated });
                      }}
                      className="rounded-lg border border-slate-200 bg-white p-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedicine(idx)}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Next Recall / Follow-up Date (Optional)
                </label>
                <input
                  type="date"
                  value={recordForm.nextRecallDate}
                  onChange={(e) => setRecordForm({ ...recordForm, nextRecallDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRecord}
                  className="rounded-xl bg-sky-600 px-5 py-2 text-xs font-bold text-white hover:bg-sky-700 disabled:opacity-50"
                >
                  {savingRecord ? "Saving..." : "Save Clinical Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Attach Report / X-Ray */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">📁 Attach Diagnostic Report / X-Ray</h3>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Report Title <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  placeholder="e.g. Digital Full Mouth OPG X-Ray"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Report Type</label>
                  <select
                    value={reportForm.reportType}
                    onChange={(e) => setReportForm({ ...reportForm, reportType: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm"
                  >
                    <option value="xray">X-Ray / Scan</option>
                    <option value="prescription">Prescription Slip</option>
                    <option value="lab_report">Lab Report / Blood Test</option>
                    <option value="treatment_plan">Treatment & Cost Plan</option>
                    <option value="invoice">Invoice / Receipt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date Issued</label>
                  <input
                    type="date"
                    value={reportForm.issuedDate}
                    onChange={(e) => setReportForm({ ...reportForm, issuedDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  File Document / Image Link
                </label>
                <input
                  placeholder="https://... or sample file link"
                  value={reportForm.fileUrl}
                  onChange={(e) => setReportForm({ ...reportForm, fileUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Doctor Findings / Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Normal bone density observed, no periapical lesion found."
                  value={reportForm.doctorRemarks}
                  onChange={(e) => setReportForm({ ...reportForm, doctorRemarks: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReport}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {savingReport ? "Saving..." : "Attach Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
