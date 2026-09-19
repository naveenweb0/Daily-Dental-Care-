import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, rateLimit, verifyPassword, audit } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`login:${ip}`, 8, 60_000)) {
    return NextResponse.json({ message: "Too many attempts. Try again later." }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const user = rows[0];
  if (!user || !user.active || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }
  await createSession(user.id);
  await audit({ id: user.id, name: user.name, email: user.email, role: user.role as "admin" }, "login", "user", user.id);
  return NextResponse.json({ ok: true, role: user.role });
}
