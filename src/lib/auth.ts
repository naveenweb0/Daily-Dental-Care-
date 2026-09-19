import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { eq, and, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users, auditLogs } from "@/db/schema";

export const SESSION_COOKIE = "ddc_session";

export type Role = "super_admin" | "admin" | "receptionist";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

export async function createSession(userId: number) {
  const id = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await db.insert(sessions).values({ id, userId, expiresAt });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return id;
}

export async function destroySession() {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (id) await db.delete(sessions).where(eq(sessions.id, id));
  jar.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const jar = await cookies();
    const id = jar.get(SESSION_COOKIE)?.value;
    if (!id) return null;
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        active: users.active,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(eq(sessions.id, id), gt(sessions.expiresAt, new Date())))
      .limit(1);
    const row = rows[0];
    if (!row || !row.active) return null;
    return { id: row.id, name: row.name, email: row.email, role: row.role as Role };
  } catch {
    return null;
  }
}

const PERMISSIONS: Record<Role, string[]> = {
  super_admin: ["*"],
  admin: [
    "appointments",
    "leads",
    "patients",
    "doctors",
    "services",
    "analytics",
    "notifications",
    "export",
  ],
  receptionist: ["appointments", "leads", "patients", "notifications"],
};

export function can(role: Role, permission: string) {
  const perms = PERMISSIONS[role] ?? [];
  return perms.includes("*") || perms.includes(permission);
}

export async function requireUser(permission?: string) {
  const user = await getSessionUser();
  if (!user) return { user: null, error: "unauthenticated" as const };
  if (permission && !can(user.role, permission)) {
    return { user, error: "forbidden" as const };
  }
  return { user, error: null };
}

export async function audit(
  user: SessionUser | null,
  action: string,
  entity: string,
  entityId: string | number,
  oldValue = "",
  newValue = "",
) {
  await db.insert(auditLogs).values({
    userId: user?.id ?? null,
    userName: user?.name ?? "system",
    action,
    entity,
    entityId: String(entityId),
    oldValue,
    newValue,
  });
}

// simple in-memory rate limiter
const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}
