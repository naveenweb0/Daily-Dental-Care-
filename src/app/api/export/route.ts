import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { appointments, leads, patients } from "@/db/schema";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}

export async function GET(req: NextRequest) {
  const { error } = await requireUser();
  if (error) return NextResponse.json({ message: error }, { status: 401 });
  const type = req.nextUrl.searchParams.get("type") ?? "appointments";
  let rows: Record<string, unknown>[] = [];
  if (type === "leads") rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5000);
  else if (type === "patients") rows = await db.select().from(patients).orderBy(desc(patients.createdAt)).limit(5000);
  else rows = await db.select().from(appointments).orderBy(desc(appointments.createdAt)).limit(5000);
  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
