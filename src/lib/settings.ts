import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { CLINIC } from "./clinic";

export type BookingSettings = {
  slotMinutes: number;
  advanceBookingDays: number;
  minimumNoticeHours: number;
  cancellationPolicy: string;
};

export type ClinicInfoSettings = {
  name: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
};

export type NotificationSettings = {
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  smsEnabled: boolean;
  reminder24h: boolean;
  reminder2h: boolean;
};

const DEFAULTS: Record<string, Record<string, unknown>> = {
  booking: {
    slotMinutes: 30,
    advanceBookingDays: 60,
    minimumNoticeHours: 2,
    cancellationPolicy: "Please inform the clinic at least 4 hours before your appointment.",
  },
  clinic_info: {
    name: CLINIC.name,
    address: CLINIC.address,
    phone: CLINIC.phone,
    email: CLINIC.email,
    whatsapp: CLINIC.whatsapp,
    website: CLINIC.website,
  },
  notifications: {
    emailEnabled: false,
    whatsappEnabled: false,
    smsEnabled: false,
    reminder24h: true,
    reminder2h: true,
  },
};

export async function getSetting<T>(key: string): Promise<T> {
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  const stored = rows[0]?.value ?? {};
  return { ...(DEFAULTS[key] ?? {}), ...stored } as T;
}

export async function setSetting(key: string, value: Record<string, unknown>) {
  const current = await getSetting<Record<string, unknown>>(key);
  const merged = { ...current, ...value };
  await db
    .insert(settings)
    .values({ key, value: merged, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: merged, updatedAt: new Date() },
    });
  return merged;
}

export const getBookingSettings = () => getSetting<BookingSettings>("booking");
export const getClinicInfo = () => getSetting<ClinicInfoSettings>("clinic_info");
export const getNotificationSettings = () =>
  getSetting<NotificationSettings>("notifications");
