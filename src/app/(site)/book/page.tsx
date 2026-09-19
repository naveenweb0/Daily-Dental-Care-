import type { Metadata } from "next";
import { Suspense } from "react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { doctors, services } from "@/db/schema";
import BookingForm from "@/components/site/BookingForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Dental Appointment in Mohali",
  description: "Book an appointment online at Daily Dental Care, Phase 7, Sector 61, Mohali. Real-time slot availability.",
  alternates: { canonical: "/book" },
};

export default async function BookPage() {
  const [svc, docs] = await Promise.all([
    db.select().from(services).where(eq(services.active, true)).orderBy(asc(services.sortOrder)),
    db.select().from(doctors).where(eq(doctors.active, true)).orderBy(asc(doctors.id)),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Book an Appointment</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Choose your treatment, dentist, date and an available time slot. You will receive a unique appointment ID.
      </p>
      <div className="mt-10">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-slate-100" />}>
          <BookingForm
            services={svc.map((s) => ({ id: s.id, name: s.name, slug: s.slug, durationMinutes: s.durationMinutes }))}
            doctors={docs.map((d) => ({ id: d.id, name: d.name, qualification: d.qualification, specialization: d.specialization, photo: d.photo }))}
          />
        </Suspense>
      </div>
    </div>
  );
}
