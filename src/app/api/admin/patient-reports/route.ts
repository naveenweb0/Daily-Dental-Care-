import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { patientReports, patients } from "@/db/schema";
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

  const reports = await db
    .select()
    .from(patientReports)
    .where(eq(patientReports.patientId, patientId))
    .orderBy(desc(patientReports.createdAt));

  return NextResponse.json({ reports });
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

    const title = String(body.title || "").trim();
    if (!title) {
      return NextResponse.json({ message: "Report title is required" }, { status: 400 });
    }

    const reportType = String(body.reportType || "lab_report").trim();
    const fileUrl = String(body.fileUrl || "").trim();
    const notes = String(body.notes || "").trim();
    const doctorRemarks = String(body.doctorRemarks || "").trim();
    const issuedDate = String(body.issuedDate || new Date().toISOString().slice(0, 10));
    const appointmentId = body.appointmentId ? Number(body.appointmentId) : null;
    const uploadedBy = user.name || "Doctor";

    const inserted = await db
      .insert(patientReports)
      .values({
        patientId,
        appointmentId,
        title,
        reportType,
        fileUrl,
        notes,
        doctorRemarks,
        issuedDate,
        uploadedBy,
      })
      .returning();

    await audit(
      user,
      "add_patient_report",
      "patients",
      patientId,
      "",
      `Attached ${reportType} report: "${title}" for ${patient[0].name}`
    );

    return NextResponse.json({ ok: true, report: inserted[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save report";
    return NextResponse.json({ message }, { status: 500 });
  }
}
