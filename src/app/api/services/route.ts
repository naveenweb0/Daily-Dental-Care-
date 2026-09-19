import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { audit, requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all") === "1";
  const rows = await db
    .select()
    .from(services)
    .where(all ? undefined : eq(services.active, true))
    .orderBy(asc(services.sortOrder), asc(services.name));
  return NextResponse.json({ services: rows });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireUser("services");
  if (error || !user) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const b = await req.json().catch(() => ({}));
  const name = String(b.name ?? "").trim();
  if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });
  const slug = String(b.slug ?? name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  try {
    const rows = await db
      .insert(services)
      .values({
        name,
        slug,
        shortDescription: String(b.shortDescription ?? ""),
        description: String(b.description ?? ""),
        image: String(b.image ?? ""),
        durationMinutes: Number(b.durationMinutes ?? 30),
        price: String(b.price ?? "Contact for price"),
        active: b.active !== false,
        seoTitle: String(b.seoTitle ?? ""),
        seoDescription: String(b.seoDescription ?? ""),
      })
      .returning();
    await audit(user, "created", "service", rows[0].id, "", name);
    return NextResponse.json({ ok: true, service: rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "A service with this slug already exists." }, { status: 409 });
  }
}
