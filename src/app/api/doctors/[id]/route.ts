import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { clinicHours, doctors } from "@/db/schema";
import { audit, requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser("doctors");
  if (error || !user) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const { id } = await ctx.params;
  const docId = Number(id);
  const b = await req.json().catch(() => ({}));
  const updates: Record<string, unknown> = {};
  for (const k of ["name", "photo", "qualification", "specialization", "bio", "experience"] as const) {
    if (typeof b[k] === "string") updates[k] = b[k];
  }
  if (b.active !== undefined) updates.active = Boolean(b.active);
  if (Array.isArray(b.serviceIds)) updates.serviceIds = b.serviceIds.map(Number);
  if (Object.keys(updates).length) {
    await db.update(doctors).set(updates).where(eq(doctors.id, docId));
  }
  if (Array.isArray(b.hours)) {
    for (const h of b.hours) {
      await db
        .update(clinicHours)
        .set({
          isOpen: Boolean(h.isOpen),
          openTime: String(h.openTime),
          closeTime: String(h.closeTime),
          breakStart: String(h.breakStart),
          breakEnd: String(h.breakEnd),
        })
        .where(and(eq(clinicHours.doctorId, docId), eq(clinicHours.weekday, Number(h.weekday))));
    }
  }
  await audit(user, "updated", "doctor", docId);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser("doctors");
  if (error || !user) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const { id } = await ctx.params;
  try {
    await db.delete(doctors).where(eq(doctors.id, Number(id)));
  } catch {
    await db.update(doctors).set({ active: false }).where(eq(doctors.id, Number(id)));
    return NextResponse.json({ ok: true, message: "Doctor has appointments and was deactivated instead." });
  }
  await audit(user, "deleted", "doctor", id);
  return NextResponse.json({ ok: true });
}
