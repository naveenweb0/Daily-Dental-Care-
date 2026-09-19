import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  appointmentHistory,
  appointments,
  clinicalRecords,
  doctors,
  leads,
  patientReports,
  patients,
} from "@/db/schema";
import { label } from "@/lib/clinic";
import PatientProfileClient from "@/components/admin/PatientProfileClient";

export const dynamic = "force-dynamic";

export default async function PatientProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pid = Number(id);
  const rows = await db.select().from(patients).where(eq(patients.id, pid)).limit(1);
  const p = rows[0];
  if (!p) notFound();

  const appts = await db
    .select()
    .from(appointments)
    .where(eq(appointments.patientId, pid))
    .orderBy(desc(appointments.appointmentDate));

  const leadRows = await db
    .select()
    .from(leads)
    .where(eq(leads.patientId, pid))
    .orderBy(desc(leads.createdAt));

  const clinRecords = await db
    .select()
    .from(clinicalRecords)
    .where(eq(clinicalRecords.patientId, pid))
    .orderBy(desc(clinicalRecords.visitDate), desc(clinicalRecords.createdAt));

  const repList = await db
    .select()
    .from(patientReports)
    .where(eq(patientReports.patientId, pid))
    .orderBy(desc(patientReports.createdAt));

  const docList = await db
    .select({ id: doctors.id, name: doctors.name })
    .from(doctors)
    .where(eq(doctors.active, true));

  const timeline: { at: Date; text: string; actor: string }[] = [];
  for (const l of leadRows) {
    timeline.push({
      at: l.createdAt,
      text: `Lead created via ${label(l.source)} (stage: ${label(l.stage)})`,
      actor: "system",
    });
  }
  for (const a of appts) {
    const hist = await db
      .select()
      .from(appointmentHistory)
      .where(eq(appointmentHistory.appointmentId, a.id));
    for (const h of hist) {
      timeline.push({
        at: h.createdAt,
        text: `${a.appointmentNumber}: ${label(h.action)} ${h.oldValue ? `${h.oldValue} → ` : ""}${h.newValue}`,
        actor: h.actor,
      });
    }
  }
  timeline.sort((a, b) => b.at.getTime() - a.at.getTime());

  return (
    <PatientProfileClient
      patient={p}
      appointments={appts}
      clinicalRecords={clinRecords}
      reports={repList}
      timeline={timeline}
      doctors={docList}
    />
  );
}
