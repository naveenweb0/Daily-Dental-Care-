import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { audit, requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser("leads");
  if (error || !user) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const rows = await db.select().from(leads).where(eq(leads.id, Number(id))).limit(1);
  const current = rows[0];
  if (!current) return NextResponse.json({ message: "Lead not found" }, { status: 404 });
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of ["name", "email", "notes", "source", "stage", "message"] as const) {
    if (typeof body[key] === "string") updates[key] = body[key];
  }
  if (body.serviceId !== undefined) updates.serviceId = body.serviceId ? Number(body.serviceId) : null;
  if (body.assignedTo !== undefined) updates.assignedTo = body.assignedTo ? Number(body.assignedTo) : null;
  await db.update(leads).set(updates).where(eq(leads.id, Number(id)));
  await audit(user, "updated", "lead", id, current.stage, String(updates.stage ?? current.stage));
  const updated = await db.select().from(leads).where(eq(leads.id, Number(id))).limit(1);
  return NextResponse.json({ ok: true, lead: updated[0] });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser("leads");
  if (error || !user) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const { id } = await ctx.params;
  await db.delete(leads).where(eq(leads.id, Number(id)));
  await audit(user, "deleted", "lead", id);
  return NextResponse.json({ ok: true });
}
