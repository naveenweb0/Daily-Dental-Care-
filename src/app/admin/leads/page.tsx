import { asc } from "drizzle-orm";
import { db } from "@/db";
import { services, users } from "@/db/schema";
import LeadsClient from "@/components/admin/LeadsClient";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const [svc, staff] = await Promise.all([
    db.select({ id: services.id, name: services.name }).from(services).orderBy(asc(services.sortOrder)),
    db.select({ id: users.id, name: users.name }).from(users).orderBy(asc(users.id)),
  ]);
  return <LeadsClient services={svc} staff={staff} />;
}
