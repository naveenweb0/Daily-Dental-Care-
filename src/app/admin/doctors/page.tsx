import { asc, isNotNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { clinicHours, doctors, services } from "@/db/schema";
import DoctorsClient from "@/components/admin/DoctorsClient";
import { can, getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDoctorsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!can(user.role, "doctors")) {
    return <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">You do not have permission to manage doctors.</p>;
  }
  const [docs, svc, hours] = await Promise.all([
    db.select().from(doctors).orderBy(asc(doctors.id)),
    db.select({ id: services.id, name: services.name }).from(services).orderBy(asc(services.sortOrder)),
    db.select().from(clinicHours).where(isNotNull(clinicHours.doctorId)).orderBy(asc(clinicHours.weekday)),
  ]);
  return (
    <DoctorsClient
      services={svc}
      doctors={docs.map((d) => ({
        id: d.id, name: d.name, photo: d.photo, qualification: d.qualification, specialization: d.specialization,
        bio: d.bio, experience: d.experience, active: d.active, serviceIds: d.serviceIds,
        hours: hours.filter((h) => h.doctorId === d.id).map((h) => ({
          weekday: h.weekday, isOpen: h.isOpen, openTime: h.openTime, closeTime: h.closeTime, breakStart: h.breakStart, breakEnd: h.breakEnd,
        })),
      }))}
    />
  );
}
