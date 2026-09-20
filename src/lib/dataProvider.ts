import { asc, eq, and, ne } from "drizzle-orm";
import { db } from "@/db";
import { services, doctors } from "@/db/schema";
import { DEMO_SERVICES, DEMO_DOCTORS, ServiceItem, DoctorItem } from "./demoData";

export async function getActiveServices(): Promise<ServiceItem[]> {
  try {
    const rows = await db
      .select()
      .from(services)
      .where(eq(services.active, true))
      .orderBy(asc(services.sortOrder));
    if (rows && rows.length > 0) {
      return rows as unknown as ServiceItem[];
    }
  } catch (err) {
    console.warn("DB query for services failed, falling back to demo data:", (err as Error).message);
  }
  return DEMO_SERVICES;
}

export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  try {
    const rows = await db
      .select()
      .from(services)
      .where(and(eq(services.slug, slug), eq(services.active, true)))
      .limit(1);
    if (rows && rows.length > 0) {
      return rows[0] as unknown as ServiceItem;
    }
  } catch (err) {
    console.warn("DB query for service by slug failed, falling back to demo data:", (err as Error).message);
  }
  const match = DEMO_SERVICES.find((s) => s.slug === slug);
  return match ?? null;
}

export async function getOtherServices(currentSlug: string, limitCount = 4): Promise<ServiceItem[]> {
  try {
    const all = await getActiveServices();
    return all.filter((s) => s.slug !== currentSlug).slice(0, limitCount);
  } catch {
    return DEMO_SERVICES.filter((s) => s.slug !== currentSlug).slice(0, limitCount);
  }
}

export async function getActiveDoctors(): Promise<DoctorItem[]> {
  try {
    const rows = await db
      .select()
      .from(doctors)
      .where(eq(doctors.active, true))
      .orderBy(asc(doctors.id));
    if (rows && rows.length > 0) {
      return rows as unknown as DoctorItem[];
    }
  } catch (err) {
    console.warn("DB query for doctors failed, falling back to demo data:", (err as Error).message);
  }
  return DEMO_DOCTORS;
}
