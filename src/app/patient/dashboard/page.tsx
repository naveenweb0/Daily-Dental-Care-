import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  appointments,
  clinicalRecords,
  doctors,
  patientReports,
  services,
} from "@/db/schema";
import { getSessionPatient } from "@/lib/patientAuth";
import PatientDashboardClient from "@/components/patient/PatientDashboardClient";

export const dynamic = "force-dynamic";

export default async function PatientDashboardPage() {
  const sessionPatient = await getSessionPatient();
  if (!sessionPatient) {
    redirect("/patient/login");
  }

  // Fetch patient appointments
  const appts = await db
    .select({
      id: appointments.id,
      appointmentNumber: appointments.appointmentNumber,
      appointmentDate: appointments.appointmentDate,
      startTime: appointments.startTime,
      endTime: appointments.endTime,
      status: appointments.status,
      doctorName: doctors.name,
      doctorSpecialization: doctors.specialization,
      serviceName: services.name,
      patientMessage: appointments.patientMessage,
      createdAt: appointments.createdAt,
    })
    .from(appointments)
    .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
    .leftJoin(services, eq(services.id, appointments.serviceId))
    .where(eq(appointments.patientId, sessionPatient.id))
    .orderBy(desc(appointments.appointmentDate), desc(appointments.startTime));

  // Fetch clinical notes & doctor remarks
  const clinRecords = await db
    .select()
    .from(clinicalRecords)
    .where(eq(clinicalRecords.patientId, sessionPatient.id))
    .orderBy(desc(clinicalRecords.visitDate), desc(clinicalRecords.createdAt));

  // Fetch patient reports and X-rays
  const repList = await db
    .select()
    .from(patientReports)
    .where(eq(patientReports.patientId, sessionPatient.id))
    .orderBy(desc(patientReports.createdAt));

  // Fetch active doctors & services for in-dashboard self-booking
  const docList = await db
    .select({
      id: doctors.id,
      name: doctors.name,
      specialization: doctors.specialization,
    })
    .from(doctors)
    .where(eq(doctors.active, true));

  const serviceList = await db
    .select({
      id: services.id,
      name: services.name,
      price: services.price,
    })
    .from(services)
    .where(eq(services.active, true));

  return (
    <PatientDashboardClient
      patient={sessionPatient}
      appointments={appts}
      clinicalRecords={clinRecords}
      reports={repList}
      doctors={docList}
      services={serviceList}
    />
  );
}
