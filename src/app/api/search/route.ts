import { NextRequest, NextResponse } from "next/server";
import { ilike, or, desc } from "drizzle-orm";
import { db } from "@/db";
import { appointments, leads, patients } from "@/db/schema";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { error } = await requireUser();
  if (error) return NextResponse.json({ message: error }, { status: 401 });
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ patients: [], leads: [], appointments: [] });
  const like = `%${q}%`;
  const [p, l, a] = await Promise.all([
    db.select().from(patients).where(or(ilike(patients.name, like), ilike(patients.phone, like), ilike(patients.email, like))).limit(8),
    db.select().from(leads).where(or(ilike(leads.name, like), ilike(leads.phone, like), ilike(leads.email, like))).orderBy(desc(leads.createdAt)).limit(8),
    db
      .select()
      .from(appointments)
      .where(or(ilike(appointments.appointmentNumber, like), ilike(appointments.patientName, like), ilike(appointments.phone, like)))
      .orderBy(desc(appointments.createdAt))
      .limit(8),
  ]);
  return NextResponse.json({ patients: p, leads: l, appointments: a });
}
