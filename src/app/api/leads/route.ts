import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, gte, ilike, lte, or, SQL } from "drizzle-orm";
import { db } from "@/db";
import { leads, services, users, notifications } from "@/db/schema";
import { requireUser, audit } from "@/lib/auth";
import { isValidIndianPhone, normalizePhone, upsertPatient } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { error } = await requireUser("leads");
  if (error) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const p = req.nextUrl.searchParams;
  const filters: SQL[] = [];
  if (p.get("stage") && p.get("stage") !== "all") filters.push(eq(leads.stage, p.get("stage")!));
  if (p.get("source") && p.get("source") !== "all") filters.push(eq(leads.source, p.get("source")!));
  if (p.get("serviceId") && p.get("serviceId") !== "all") filters.push(eq(leads.serviceId, Number(p.get("serviceId"))));
  if (p.get("assignedTo") && p.get("assignedTo") !== "all") filters.push(eq(leads.assignedTo, Number(p.get("assignedTo"))));
  if (p.get("from")) filters.push(gte(leads.createdAt, new Date(p.get("from")!)));
  if (p.get("to")) filters.push(lte(leads.createdAt, new Date(`${p.get("to")!}T23:59:59`)));
  const q = p.get("q");
  if (q) {
    const like = `%${q}%`;
    filters.push(or(ilike(leads.name, like), ilike(leads.phone, like), ilike(leads.email, like))!);
  }
  const rows = await db
    .select({ lead: leads, serviceName: services.name, assignee: users.name })
    .from(leads)
    .leftJoin(services, eq(services.id, leads.serviceId))
    .leftJoin(users, eq(users.id, leads.assignedTo))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(leads.createdAt))
    .limit(500);
  return NextResponse.json({ leads: rows });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireUser("leads");
  if (error || !user) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "");
  if (name.length < 2) return NextResponse.json({ message: "Name is required" }, { status: 400 });
  if (!isValidIndianPhone(phone)) return NextResponse.json({ message: "Enter a valid 10-digit Indian mobile number" }, { status: 400 });
  const { patient } = await upsertPatient({
    name,
    phone,
    email: String(body.email ?? ""),
    source: String(body.source ?? "other"),
  });
  const inserted = await db
    .insert(leads)
    .values({
      name,
      phone: normalizePhone(phone),
      email: String(body.email ?? ""),
      serviceId: body.serviceId ? Number(body.serviceId) : null,
      patientId: patient.id,
      source: String(body.source ?? "other"),
      stage: String(body.stage ?? "new"),
      notes: String(body.notes ?? ""),
      message: String(body.message ?? ""),
    })
    .returning();
  await audit(user, "created", "lead", inserted[0].id, "", name);
  await db.insert(notifications).values({
    type: "lead",
    title: "New Lead",
    body: `${name} · ${body.source ?? "other"}`,
    link: `/admin/leads`,
  });
  return NextResponse.json({ ok: true, lead: inserted[0] }, { status: 201 });
}
