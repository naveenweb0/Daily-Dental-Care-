import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { eq, and, gt } from "drizzle-orm";
import { db } from "@/db";
import { patientSessions, patients } from "@/db/schema";

export const PATIENT_SESSION_COOKIE = "ddc_patient_session";

export type SessionPatient = {
  id: number;
  name: string;
  phone: string;
  email: string;
  gender: string;
  bloodGroup: string;
  age: number | null;
  address: string;
  medicalHistory: string;
  emergencyContact: string;
};

export function hashPatientPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPatientPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

export async function createPatientSession(patientId: number) {
  const id = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
  await db.insert(patientSessions).values({ id, patientId, expiresAt });
  const jar = await cookies();
  jar.set(PATIENT_SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return id;
}

export async function destroyPatientSession() {
  const jar = await cookies();
  const id = jar.get(PATIENT_SESSION_COOKIE)?.value;
  if (id) {
    await db.delete(patientSessions).where(eq(patientSessions.id, id));
  }
  jar.delete(PATIENT_SESSION_COOKIE);
}

export async function getSessionPatient(): Promise<SessionPatient | null> {
  try {
    const jar = await cookies();
    const id = jar.get(PATIENT_SESSION_COOKIE)?.value;
    if (!id) return null;

    const rows = await db
      .select({
        id: patients.id,
        name: patients.name,
        phone: patients.phone,
        email: patients.email,
        gender: patients.gender,
        bloodGroup: patients.bloodGroup,
        age: patients.age,
        address: patients.address,
        medicalHistory: patients.medicalHistory,
        emergencyContact: patients.emergencyContact,
      })
      .from(patientSessions)
      .innerJoin(patients, eq(patients.id, patientSessions.patientId))
      .where(and(eq(patientSessions.id, id), gt(patientSessions.expiresAt, new Date())))
      .limit(1);

    return rows[0] ?? null;
  } catch {
    return null;
  }
}
