import type { MetadataRoute } from "next";
import { CLINIC } from "@/lib/clinic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${CLINIC.website}/sitemap.xml`,
  };
}
