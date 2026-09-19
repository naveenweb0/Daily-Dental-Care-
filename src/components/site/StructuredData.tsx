import { CLINIC } from "@/lib/clinic";

export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${CLINIC.website}/#dentist`,
    name: CLINIC.name,
    legalName: "Daily Dental Care Clinic Mohali",
    url: CLINIC.website,
    logo: `${CLINIC.website}/icon.png`,
    image: [
      "https://images.pexels.com/photos/6627575/pexels-photo-6627575.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    ],
    telephone: CLINIC.phoneDial,
    email: "contact@dailydentalcare.in",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Credit Card, Debit Card, 0% EMI",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Phase 7, Sector 61",
      addressLocality: "Mohali",
      addressRegion: "Punjab",
      postalCode: "160062",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.7046,
      longitude: 76.7179,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "19:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "128",
      bestRating: "5",
      worstRating: "1",
    },
    medicalSpecialty: [
      "Dentistry",
      "Endodontics",
      "Orthodontics",
      "Periodontics",
      "Prosthodontics",
      "Oral Surgery",
    ],
    availableService: [
      {
        "@type": "MedicalProcedure",
        name: "Dental Implants",
      },
      {
        "@type": "MedicalProcedure",
        name: "Invisalign Clear Aligners",
      },
      {
        "@type": "MedicalProcedure",
        name: "Root Canal Treatment",
      },
      {
        "@type": "MedicalProcedure",
        name: "Laser Teeth Whitening & Scaling",
      },
      {
        "@type": "MedicalProcedure",
        name: "Zirconia Dental Crowns & Bridges",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
