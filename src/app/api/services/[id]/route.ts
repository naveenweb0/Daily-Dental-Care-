import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { audit, requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser("services");
  if (error || !user) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const { id } = await ctx.params;
  const b = await req.json().catch(() => ({}));
  const updates: Record<string, unknown> = {};
  for (const k of ["name", "slug", "shortDescription", "description", "image", "price", "seoTitle", "seoDescription"] as const) {
    if (typeof b[k] === "string") updates[k] = b[k];
  }
  if (b.durationMinutes !== undefined) updates.durationMinutes = Number(b.durationMinutes);
  if (b.active !== undefined) updates.active = Boolean(b.active);
  if (b.sortOrder !== undefined) updates.sortOrder = Number(b.sortOrder);
  if (!Object.keys(updates).length) return NextResponse.json({ message: "Nothing to update" }, { status: 400 });
  await db.update(services).set(updates).where(eq(services.id, Number(id)));
  await audit(user, "updated", "service", id, "", JSON.stringify(updates).slice(0, 200));
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser("services");
  if (error || !user) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const { id } = await ctx.params;
  await db.delete(services).where(eq(services.id, Number(id)));
  await audit(user, "deleted", "service", id);
  return NextResponse.json({ ok: true });
}
