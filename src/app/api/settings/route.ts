import { NextRequest, NextResponse } from "next/server";
import { and, asc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { blockedDates, clinicHours } from "@/db/schema";
import { audit, requireUser } from "@/lib/auth";
import { getBookingSettings, getClinicInfo, getNotificationSettings, setSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireUser();
  if (error) return NextResponse.json({ message: error }, { status: 401 });
  const [booking, clinic, notif, hours, blocks] = await Promise.all([
    getBookingSettings(),
    getClinicInfo(),
    getNotificationSettings(),
    db.select().from(clinicHours).where(isNull(clinicHours.doctorId)).orderBy(asc(clinicHours.weekday)),
    db.select().from(blockedDates).orderBy(asc(blockedDates.blockDate)),
  ]);
  return NextResponse.json({ booking, clinic, notifications: notif, hours, blocks });
}

export async function PATCH(req: NextRequest) {
  const { user, error } = await requireUser();
  if (error || !user) return NextResponse.json({ message: error }, { status: 401 });
  if (user.role === "receptionist") {
    return NextResponse.json({ message: "You do not have permission to change settings." }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  if (body.booking) await setSetting("booking", body.booking);
  if (body.clinic) await setSetting("clinic_info", body.clinic);
  if (body.notifications) await setSetting("notifications", body.notifications);
  if (Array.isArray(body.hours)) {
    for (const h of body.hours) {
      await db
        .update(clinicHours)
        .set({
          isOpen: Boolean(h.isOpen),
          openTime: String(h.openTime),
          closeTime: String(h.closeTime),
          breakStart: String(h.breakStart),
          breakEnd: String(h.breakEnd),
        })
        .where(and(isNull(clinicHours.doctorId), eq(clinicHours.weekday, Number(h.weekday))));
    }
  }
  await audit(user, "updated", "settings", "-", "", Object.keys(body).join(","));
  return NextResponse.json({ ok: true });
}
