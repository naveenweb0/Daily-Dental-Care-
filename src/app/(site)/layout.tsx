import type { ReactNode } from "react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import StickyCTA from "@/components/site/StickyCTA";
import WhatsAppFloatingWidget from "@/components/site/WhatsAppFloatingWidget";
import { CLINIC } from "@/lib/clinic";

const schema = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: CLINIC.name,
  description: CLINIC.tagline,
  url: CLINIC.website,
  telephone: CLINIC.phoneDial,
  address: {
    "@type": "PostalAddress",
    streetAddress: "SCF-124, 1st Floor, Phase 7, Sector 61",
    addressLocality: "Sahibzada Ajit Singh Nagar (Mohali)",
    addressRegion: "Punjab",
    postalCode: "160062",
    addressCountry: "IN",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "120" },
  openingHours: "Mo-Sa 10:00-19:00",
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteHeader />
      <main className="pb-20 md:pb-0">{children}</main>
      <SiteFooter />
      <StickyCTA />
      <WhatsAppFloatingWidget />
    </>
  );
}

