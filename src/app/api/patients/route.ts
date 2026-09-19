import { NextRequest, NextResponse } from "next/server";
import { desc, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { error } = await requireUser("patients");
  if (error) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const q = req.nextUrl.searchParams.get("q");
  const like = `%${q ?? ""}%`;
  const rows = await db
    .select()
    .from(patients)
    .where(q ? or(ilike(patients.name, like), ilike(patients.phone, like), ilike(patients.email, like)) : undefined)
    .orderBy(desc(patients.createdAt))
    .limit(300);
  return NextResponse.json({ patients: rows });
}
