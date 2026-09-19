import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { doctors } from "@/db/schema";
import SettingsClient from "@/components/admin/SettingsClient";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const docs = await db.select({ id: doctors.id, name: doctors.name }).from(doctors).orderBy(asc(doctors.id));
  return <SettingsClient role={user.role} doctors={docs} />;
}
