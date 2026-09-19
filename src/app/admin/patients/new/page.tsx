import { db } from "@/db";
import { doctors, services } from "@/db/schema";
import { eq } from "drizzle-orm";
import OfflineRegistrationClient from "@/components/admin/OfflineRegistrationClient";

export const dynamic = "force-dynamic";

export default async function NewPatientPage() {
  const doctorList = await db.select().from(doctors).where(eq(doctors.active, true));
  const serviceList = await db.select().from(services).where(eq(services.active, true));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <OfflineRegistrationClient doctors={doctorList} services={serviceList} />
    </div>
  );
}
