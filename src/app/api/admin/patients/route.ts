import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { patients, appointments, appointmentHistory, notifications } from "@/db/schema";
import { requireUser, audit } from "@/lib/auth";
import { hashPatientPassword } from "@/lib/patientAuth";
import { normalizePhone, isValidIndianPhone } from "@/lib/booking";
import { addMinutesToTime } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { user, error } = await requireUser("patients");
  if (error || !user) {
    return NextResponse.json({ message: error || "Unauthorized" }, { status: error === "unauthenticated" ? 401 : 403 });
  }

  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const phone = normalizePhone(String(body.phone || ""));
    const email = String(body.email || "").trim();
    const gender = String(body.gender || "other");
    const age = body.age ? Number(body.age) : null;
    const bloodGroup = String(body.bloodGroup || "").trim();
    const address = String(body.address || "").trim();
    const medicalHistory = String(body.medicalHistory || "").trim();
    const emergencyContact = String(body.emergencyContact || "").trim();
    const notes = String(body.notes || "").trim();
    const customPassword = String(body.password || "").trim();

    if (!name) {
      return NextResponse.json({ message: "Patient name is required" }, { status: 400 });
    }
    if (!phone || !isValidIndianPhone(phone)) {
      return NextResponse.json({ message: "A valid 10-digit mobile number is required" }, { status: 400 });
    }

    // Default password is their mobile number if not customized
    const finalPassword = customPassword || phone;
    const passwordHash = hashPatientPassword(finalPassword);

    // Check if patient already exists
    const existing = await db
      .select()
      .from(patients)
      .where(or(eq(patients.phone, phone), email ? eq(patients.email, email) : undefined))
      .limit(1);

    let patientId: number;
    let isNew = false;

    if (existing[0]) {
      patientId = existing[0].id;
      await db
        .update(patients)
        .set({
          name,
          email: email || existing[0].email,
          gender: gender || existing[0].gender,
          age: age ?? existing[0].age,
          bloodGroup: bloodGroup || existing[0].bloodGroup,
          address: address || existing[0].address,
          medicalHistory: medicalHistory || existing[0].medicalHistory,
          emergencyContact: emergencyContact || existing[0].emergencyContact,
          notes: notes || existing[0].notes,
          passwordHash: existing[0].passwordHash || passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(patients.id, patientId));

      await audit(user, "update_patient", "patients", patientId, "", `Updated patient ${name} via Offline Desk`);
    } else {
      isNew = true;
      const inserted = await db
        .insert(patients)
        .values({
          name,
          phone,
          email,
          passwordHash,
          gender,
          age,
          bloodGroup,
          address,
          medicalHistory,
          emergencyContact,
          notes,
          source: "offline_desk",
        })
        .returning({ id: patients.id });

      patientId = inserted[0].id;
      await audit(user, "register_offline_patient", "patients", patientId, "", `Registered offline walk-in patient ${name} (${phone})`);
    }

    // If receptionist opted to create a walk-in appointment immediately:
    let createdAppointment = null;
    if (body.createAppointment && body.doctorId && body.serviceId) {
      const doctorId = Number(body.doctorId);
      const serviceId = Number(body.serviceId);
      const date = String(body.appointmentDate || new Date().toISOString().slice(0, 10));
      const startTime = String(body.startTime || "10:00");
      const endTime = addMinutesToTime(startTime, 30);
      const rand = Math.floor(1000 + Math.random() * 9000);
      const apptNum = `DDC-${date.replace(/-/g, "")}-${rand}`;

      const insertedAppt = await db
        .insert(appointments)
        .values({
          appointmentNumber: apptNum,
          patientId,
          doctorId,
          serviceId,
          patientName: name,
          phone,
          email,
          age,
          appointmentDate: date,
          startTime,
          endTime,
          status: body.appointmentStatus || "checked_in",
          patientType: isNew ? "new" : "existing",
          patientMessage: "Walk-in registration at reception desk",
          internalNotes: `Registered by ${user.name} (${user.role})`,
          source: "offline_desk",
        })
        .returning();

      createdAppointment = insertedAppt[0];

      if (createdAppointment) {
        await db.insert(appointmentHistory).values({
          appointmentId: createdAppointment.id,
          action: "registered_walkin",
          oldValue: "",
          newValue: createdAppointment.status,
          actor: user.name,
        });

        await db.insert(notifications).values({
          type: "walkin_registered",
          title: `Walk-in Patient: ${name}`,
          body: `Registered at front desk by ${user.name} for ${date} at ${startTime}.`,
          link: `/admin/appointments`,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      patientId,
      isNew,
      credentials: {
        phone,
        password: finalPassword,
      },
      appointment: createdAppointment,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to register patient";
    return NextResponse.json({ message }, { status: 500 });
  }
}
