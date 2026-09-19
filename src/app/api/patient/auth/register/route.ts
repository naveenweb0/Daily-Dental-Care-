import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { createPatientSession, hashPatientPassword } from "@/lib/patientAuth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim().replace(/[^0-9]/g, "");
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "").trim();
    const gender = String(body.gender || "other").trim();
    const age = body.age ? Number(body.age) : null;
    const bloodGroup = String(body.bloodGroup || "").trim();
    const address = String(body.address || "").trim();
    const medicalHistory = String(body.medicalHistory || "").trim();
    const emergencyContact = String(body.emergencyContact || "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Please enter a valid full name" }, { status: 400 });
    }
    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number" }, { status: 400 });
    }
    if (!password || password.length < 4) {
      return NextResponse.json({ error: "Password must be at least 4 characters long" }, { status: 400 });
    }

    // Check if phone already registered
    const existing = await db.select().from(patients).where(eq(patients.phone, phone)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A patient record with this phone number already exists. Please log in directly." },
        { status: 409 }
      );
    }

    const passwordHash = hashPatientPassword(password);

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
        source: "patient_portal_signup",
      })
      .returning({ id: patients.id });

    const newPatientId = inserted[0].id;
    await createPatientSession(newPatientId);

    return NextResponse.json({ ok: true, patientId: newPatientId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
