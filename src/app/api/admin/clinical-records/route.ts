import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { clinicalRecords, patients } from "@/db/schema";
import { requireUser, audit } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { user, error } = await requireUser("patients");
  if (error || !user) {
    return NextResponse.json({ message: error || "Unauthorized" }, { status: error === "unauthenticated" ? 401 : 403 });
  }

  const patientId = Number(req.nextUrl.searchParams.get("patientId"));
  if (!patientId) {
    return NextResponse.json({ message: "patientId required" }, { status: 400 });
  }

  const records = await db
    .select()
    .from(clinicalRecords)
    .where(eq(clinicalRecords.patientId, patientId))
    .orderBy(desc(clinicalRecords.visitDate), desc(clinicalRecords.createdAt));

  return NextResponse.json({ records });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireUser("patients");
  if (error || !user) {
    return NextResponse.json({ message: error || "Unauthorized" }, { status: error === "unauthenticated" ? 401 : 403 });
  }

  try {
    const body = await req.json();
    const patientId = Number(body.patientId);
    if (!patientId) {
      return NextResponse.json({ message: "patientId is required" }, { status: 400 });
    }

    const patient = await db.select().from(patients).where(eq(patients.id, patientId)).limit(1);
    if (!patient[0]) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    const doctorName = String(body.doctorName || user.name || "Daily Dental Care Doctor").trim();
    const visitDate = String(body.visitDate || new Date().toISOString().slice(0, 10));
    const chiefComplaint = String(body.chiefComplaint || "").trim();
    const diagnosis = String(body.diagnosis || "").trim();
    const treatmentDone = String(body.treatmentDone || "").trim();
    const doctorRemarks = String(body.doctorRemarks || "").trim();
    const nextRecallDate = String(body.nextRecallDate || "").trim();
    const appointmentId = body.appointmentId ? Number(body.appointmentId) : null;
    const doctorId = body.doctorId ? Number(body.doctorId) : null;
    const prescription = Array.isArray(body.prescription) ? body.prescription : [];

    const inserted = await db
      .insert(clinicalRecords)
      .values({
        patientId,
        appointmentId,
        doctorId,
        doctorName,
        visitDate,
        chiefComplaint,
        diagnosis,
        treatmentDone,
        doctorRemarks,
        prescription,
        nextRecallDate,
      })
      .returning();

    await audit(
      user,
      "add_clinical_record",
      "patients",
      patientId,
      "",
      `Added Doctor Remarks & Clinical Record for ${patient[0].name} (Doctor: ${doctorName})`
    );

    return NextResponse.json({ ok: true, record: inserted[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save clinical record";
    return NextResponse.json({ message }, { status: 500 });
  }
}
