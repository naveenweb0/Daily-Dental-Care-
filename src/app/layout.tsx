import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { CLINIC } from "@/lib/clinic";
import StructuredData from "@/components/site/StructuredData";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const fontHeading = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(CLINIC.website),
  title: {
    default: "Daily Dental Care | Advanced Dental Clinic in Mohali (SAS Nagar)",
    template: "%s | Daily Dental Care Mohali",
  },
  description:
    "Daily Dental Care is a top-rated multi-specialty dental clinic in Phase 7, Sector 61, Mohali offering painless implants, invisible aligners, single-sitting RCT, laser whitening with 5.0 Google Rating.",
  keywords: [
    "Dentist in Mohali",
    "Dental Clinic Mohali",
    "Best Dental Clinic Phase 7 Mohali",
    "Dental Implants Mohali",
    "Invisalign Clear Aligners Mohali",
    "Root Canal Treatment Mohali",
    "Teeth Whitening Mohali",
    "Painless Dentistry Chandigarh Tricity",
  ],
  authors: [{ name: "Daily Dental Care Team" }],
  creator: "Daily Dental Care",
  publisher: "Daily Dental Care",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: CLINIC.name,
    url: CLINIC.website,
    title: "Daily Dental Care | Advanced Dental Clinic in Mohali",
    description:
      "Advanced, affordable and painless dentistry with expert MDS specialists and modern 3D digital imaging in Mohali.",
    images: [
      {
        url: "https://images.pexels.com/photos/6627575/pexels-photo-6627575.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        width: 1200,
        height: 627,
        alt: "Daily Dental Care Clinic Mohali",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Dental Care | Advanced Dental Clinic in Mohali",
    description: "Multi-specialty dental clinic offering painless treatments with 5.0 Google Rating.",
    images: ["https://images.pexels.com/photos/6627575/pexels-photo-6627575.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
  },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontHeading.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className="bg-white text-slate-900 antialiased font-sans selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
