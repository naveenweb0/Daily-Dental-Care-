import { asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { services } from "@/db/schema";
import ServicesClient from "@/components/admin/ServicesClient";
import { can, getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!can(user.role, "services")) {
    return <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">You do not have permission to manage services.</p>;
  }
  const rows = await db.select().from(services).orderBy(asc(services.sortOrder));
  return <ServicesClient services={rows.map((r) => ({
    id: r.id, name: r.name, slug: r.slug, shortDescription: r.shortDescription, description: r.description,
    image: r.image, durationMinutes: r.durationMinutes, price: r.price, active: r.active,
    seoTitle: r.seoTitle, seoDescription: r.seoDescription,
  }))} />;
}
