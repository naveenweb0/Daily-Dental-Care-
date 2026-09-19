import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { clinicHours, doctors } from "@/db/schema";
import { audit, requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all") === "1";
  const rows = await db
    .select()
    .from(doctors)
    .where(all ? undefined : eq(doctors.active, true))
    .orderBy(asc(doctors.id));
  return NextResponse.json({ doctors: rows });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireUser("doctors");
  if (error || !user) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const b = await req.json().catch(() => ({}));
  const name = String(b.name ?? "").trim();
  if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });
  const rows = await db
    .insert(doctors)
    .values({
      name,
      photo: String(b.photo ?? ""),
      qualification: String(b.qualification ?? ""),
      specialization: String(b.specialization ?? ""),
      bio: String(b.bio ?? ""),
      experience: String(b.experience ?? ""),
      active: b.active !== false,
      serviceIds: Array.isArray(b.serviceIds) ? b.serviceIds.map(Number) : [],
    })
    .returning();
  const hours = [];
  for (let d = 0; d < 7; d++) {
    hours.push({
      doctorId: rows[0].id,
      weekday: d,
      isOpen: d !== 0,
      openTime: "10:00",
      closeTime: "19:00",
      breakStart: "13:00",
      breakEnd: "14:00",
    });
  }
  await db.insert(clinicHours).values(hours);
  await audit(user, "created", "doctor", rows[0].id, "", name);
  return NextResponse.json({ ok: true, doctor: rows[0] }, { status: 201 });
}
