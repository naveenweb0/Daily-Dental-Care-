import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  appointmentHistory,
  appointments,
  leads,
  notificationQueue,
  notifications,
  patients,
  services,
} from "@/db/schema";
import { addMinutesToTime, getAvailableSlots, formatTime12 } from "./availability";
import { getNotificationSettings } from "./settings";

export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function isValidIndianPhone(raw: string) {
  const p = normalizePhone(raw);
  return /^[6-9]\d{9}$/.test(p);
}

export function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function upsertPatient(input: {
  name: string;
  phone: string;
  email?: string;
  age?: number | null;
  source?: string;
}) {
  const phone = normalizePhone(input.phone);
  const existing = await db
    .select()
    .from(patients)
    .where(eq(patients.phone, phone))
    .limit(1);
  if (existing[0]) {
    await db
      .update(patients)
      .set({
        name: input.name || existing[0].name,
        email: input.email || existing[0].email,
        age: input.age ?? existing[0].age,
        updatedAt: new Date(),
      })
      .where(eq(patients.id, existing[0].id));
    return { patient: existing[0], created: false };
  }
  const inserted = await db
    .insert(patients)
    .values({
      name: input.name,
      phone,
      email: input.email ?? "",
      age: input.age ?? null,
      source: input.source ?? "website",
    })
    .returning();
  return { patient: inserted[0], created: true };
}

export async function generateAppointmentNumber(dateISO: string) {
  const compact = dateISO.replace(/-/g, "");
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(appointments)
    .where(eq(appointments.appointmentDate, dateISO));
  const next = (rows[0]?.count ?? 0) + 1;
  return `DDC-${compact}-${String(next).padStart(3, "0")}`;
}

export type BookingInput = {
  name: string;
  phone: string;
  email: string;
  age?: number | null;
  serviceId: number;
  doctorId: number;
  date: string;
  time: string;
  message?: string;
  patientType?: string;
  source?: string;
  consent?: boolean;
};

export async function createBooking(input: BookingInput, actor = "patient") {
  const errors: Record<string, string> = {};
  if (!input.name || input.name.trim().length < 2) errors.name = "Please enter your full name";
  if (!isValidIndianPhone(input.phone || "")) errors.phone = "Enter a valid 10-digit Indian mobile number";
  if (input.email && !isValidEmail(input.email)) errors.email = "Enter a valid email address";
  if (!input.serviceId) errors.serviceId = "Select a treatment";
  if (!input.doctorId) errors.doctorId = "Select a doctor";
  if (!input.date) errors.date = "Select a date";
  if (!input.time) errors.time = "Select a time slot";
  if (actor === "patient" && !input.consent) errors.consent = "Please accept the consent";
  if (input.age != null && (input.age < 1 || input.age > 120)) errors.age = "Enter a valid age";
  if (Object.keys(errors).length) return { ok: false as const, errors, status: 400 };

  // server-side availability re-check
  const { slots } = await getAvailableSlots(input.doctorId, input.date);
  const slot = slots.find((s) => s.time === input.time);
  if (!slot || !slot.available) {
    return {
      ok: false as const,
      status: 409,
      message:
        "This appointment slot is no longer available. Please select another time.",
    };
  }

  const svc = await db
    .select()
    .from(services)
    .where(eq(services.id, input.serviceId))
    .limit(1);
  const duration = svc[0]?.durationMinutes ?? 30;

  const { patient, created } = await upsertPatient({
    name: input.name,
    phone: input.phone,
    email: input.email,
    age: input.age ?? null,
    source: input.source ?? "website",
  });

  const leadRow = await db
    .insert(leads)
    .values({
      name: input.name,
      phone: normalizePhone(input.phone),
      email: input.email ?? "",
      serviceId: input.serviceId,
      patientId: patient.id,
      source: input.source ?? "appointment_form",
      stage: "appointment_requested",
      message: input.message ?? "",
    })
    .returning();

  const number = await generateAppointmentNumber(input.date);
  let appt;
  try {
    const rows = await db
      .insert(appointments)
      .values({
        appointmentNumber: number,
        patientId: patient.id,
        leadId: leadRow[0].id,
        doctorId: input.doctorId,
        serviceId: input.serviceId,
        patientName: input.name,
        phone: normalizePhone(input.phone),
        email: input.email ?? "",
        age: input.age ?? null,
        appointmentDate: input.date,
        startTime: input.time,
        endTime: addMinutesToTime(input.time, duration),
        status: "pending",
        patientType: created ? "new" : input.patientType || "existing",
        patientMessage: input.message ?? "",
        source: input.source ?? "website",
      })
      .returning();
    appt = rows[0];
  } catch {
    return {
      ok: false as const,
      status: 409,
      message:
        "This slot was just booked by another patient. Please choose another time.",
    };
  }

  await db.insert(appointmentHistory).values({
    appointmentId: appt.id,
    action: "created",
    newValue: `pending · ${input.date} ${input.time}`,
    actor,
  });

  await db.insert(notifications).values({
    type: "appointment",
    title: "New Appointment",
    body: `${input.name} · ${svc[0]?.name ?? "Consultation"} · ${input.date} ${formatTime12(input.time)}`,
    link: `/admin/appointments?id=${appt.id}`,
  });

  const notif = await getNotificationSettings();
  await db.insert(notificationQueue).values({
    appointmentId: appt.id,
    channel: notif.whatsappEnabled ? "whatsapp" : "email",
    kind: "confirmation",
    recipient: input.email || normalizePhone(input.phone),
    payload: `Appointment ${number} received for ${input.date} ${formatTime12(input.time)}`,
    status: "not_connected",
  });

  return { ok: true as const, appointment: appt, service: svc[0] ?? null };
}
