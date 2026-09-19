import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { audit, hashPassword, requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user, error } = await requireUser();
  if (error || !user) return NextResponse.json({ message: error }, { status: 401 });
  const rows = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, active: users.active })
    .from(users)
    .orderBy(asc(users.id));
  return NextResponse.json({ users: rows });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireUser();
  if (error || !user) return NextResponse.json({ message: error }, { status: 401 });
  if (user.role !== "super_admin") {
    return NextResponse.json({ message: "Only a Super Admin can manage users." }, { status: 403 });
  }
  const b = await req.json().catch(() => ({}));
  const email = String(b.email ?? "").toLowerCase().trim();
  const password = String(b.password ?? "");
  if (!email || password.length < 8) {
    return NextResponse.json({ message: "Email and a password of at least 8 characters are required." }, { status: 400 });
  }
  try {
    const rows = await db
      .insert(users)
      .values({
        name: String(b.name ?? email),
        email,
        passwordHash: hashPassword(password),
        role: ["super_admin", "admin", "receptionist"].includes(b.role) ? b.role : "receptionist",
      })
      .returning({ id: users.id });
    await audit(user, "created", "user", rows[0].id, "", email);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "A user with this email already exists." }, { status: 409 });
  }
}

export async function PATCH(req: NextRequest) {
  const { user, error } = await requireUser();
  if (error || !user) return NextResponse.json({ message: error }, { status: 401 });
  if (user.role !== "super_admin") {
    return NextResponse.json({ message: "Only a Super Admin can manage users." }, { status: 403 });
  }
  const b = await req.json().catch(() => ({}));
  const id = Number(b.id);
  if (!id) return NextResponse.json({ message: "id required" }, { status: 400 });
  const updates: Record<string, unknown> = {};
  if (b.role) updates.role = b.role;
  if (b.active !== undefined) updates.active = Boolean(b.active);
  if (b.password) updates.passwordHash = hashPassword(String(b.password));
  await db.update(users).set(updates).where(eq(users.id, id));
  await audit(user, "updated", "user", id);
  return NextResponse.json({ ok: true });
}
