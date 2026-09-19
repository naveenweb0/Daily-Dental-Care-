import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { CLINIC } from "@/lib/clinic";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = CLINIC.website;
  const statics = ["", "/about", "/treatments", "/doctors", "/gallery", "/reviews", "/faq", "/contact", "/book", "/privacy-policy", "/terms"];
  let slugs: string[] = [];
  try {
    const rows = await db.select({ slug: services.slug }).from(services).where(eq(services.active, true));
    slugs = rows.map((r) => `/treatments/${r.slug}`);
  } catch {
    slugs = [];
  }
  return [...statics, ...slugs].map((p) => ({ url: `${base}${p}`, lastModified: new Date() }));
}
