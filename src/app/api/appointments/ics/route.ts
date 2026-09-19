import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { CLINIC } from "@/lib/clinic";

export const dynamic = "force-dynamic";

function stamp(date: string, time: string) {
  return `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
}

export async function GET(req: NextRequest) {
  const number = req.nextUrl.searchParams.get("id") ?? "";
  const rows = await db.select().from(appointments).where(eq(appointments.appointmentNumber, number)).limit(1);
  const a = rows[0];
  if (!a) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Daily Dental Care//EN",
    "BEGIN:VEVENT",
    `UID:${a.appointmentNumber}@dailydentalcare.in`,
    `DTSTART:${stamp(a.appointmentDate, a.startTime)}`,
    `DTEND:${stamp(a.appointmentDate, a.endTime)}`,
    `SUMMARY:Dental appointment - ${CLINIC.name}`,
    `LOCATION:${CLINIC.address}`,
    `DESCRIPTION:Appointment ${a.appointmentNumber}. Contact ${CLINIC.phone}.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": `attachment; filename="${a.appointmentNumber}.ics"`,
    },
  });
}
