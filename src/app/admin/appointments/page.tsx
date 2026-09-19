import { asc } from "drizzle-orm";
import { db } from "@/db";
import { doctors, services } from "@/db/schema";
import AppointmentsClient from "@/components/admin/AppointmentsClient";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const [docs, svc] = await Promise.all([
    db.select({ id: doctors.id, name: doctors.name }).from(doctors).orderBy(asc(doctors.id)),
    db.select({ id: services.id, name: services.name }).from(services).orderBy(asc(services.sortOrder)),
  ]);
  return <AppointmentsClient doctors={docs} services={svc} initialQuery={sp.q ?? ""} />;
}
