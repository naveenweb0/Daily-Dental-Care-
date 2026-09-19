import { NextRequest, NextResponse } from "next/server";
import { desc, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireUser("notifications");
  if (error) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const rows = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(50);
  const unread = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(notifications)
    .where(isNull(notifications.readAt));
  return NextResponse.json({ notifications: rows, unread: unread[0]?.c ?? 0 });
}

export async function POST(req: NextRequest) {
  const { error } = await requireUser("notifications");
  if (error) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const body = await req.json().catch(() => ({}));
  if (body.action === "mark_all_read") {
    await db.update(notifications).set({ readAt: new Date() }).where(isNull(notifications.readAt));
  }
  return NextResponse.json({ ok: true });
}
