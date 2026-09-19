import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { blockedDates } from "@/db/schema";
import { audit, requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { user, error } = await requireUser("appointments");
  if (error || !user) return NextResponse.json({ message: error }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(b.blockDate ?? ""))) {
    return NextResponse.json({ message: "Valid date required" }, { status: 400 });
  }
  const rows = await db
    .insert(blockedDates)
    .values({
      blockDate: String(b.blockDate),
      doctorId: b.doctorId ? Number(b.doctorId) : null,
      startTime: b.startTime ? String(b.startTime) : null,
      endTime: b.endTime ? String(b.endTime) : null,
      reason: String(b.reason ?? ""),
    })
    .returning();
  await audit(user, "created", "blocked_date", rows[0].id, "", String(b.blockDate));
  return NextResponse.json({ ok: true, block: rows[0] }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { user, error } = await requireUser("appointments");
  if (error || !user) return NextResponse.json({ message: error }, { status: 401 });
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ message: "id required" }, { status: 400 });
  await db.delete(blockedDates).where(eq(blockedDates.id, id));
  await audit(user, "deleted", "blocked_date", id);
  return NextResponse.json({ ok: true });
}
