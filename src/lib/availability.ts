import { and, eq, isNull, or } from "drizzle-orm";
import { db } from "@/db";
import { appointments, blockedDates, clinicHours } from "@/db/schema";
import { getBookingSettings } from "./settings";
import { toMinutes, fromMinutes, formatTime12, todayISO, nowMinutes, addMinutesToTime } from "./time";

export { toMinutes, fromMinutes, formatTime12, todayISO, nowMinutes, addMinutesToTime };

type Window = { start: number; end: number; breakStart: number; breakEnd: number };

function intersect(a: Window, b: Window): Window | null {
  const start = Math.max(a.start, b.start);
  const end = Math.min(a.end, b.end);
  if (start >= end) return null;
  return {
    start,
    end,
    breakStart: Math.max(a.breakStart, b.breakStart),
    breakEnd: Math.min(a.breakEnd, b.breakEnd),
  };
}

export type SlotInfo = { time: string; label: string; available: boolean };

export async function getAvailableSlots(doctorId: number, dateISO: string) {
  const booking = await getBookingSettings();
  const slotMinutes = booking.slotMinutes || 30;
  const weekday = new Date(`${dateISO}T00:00:00`).getDay();

  const hours = await db
    .select()
    .from(clinicHours)
    .where(
      and(
        eq(clinicHours.weekday, weekday),
        or(isNull(clinicHours.doctorId), eq(clinicHours.doctorId, doctorId)),
      ),
    );

  const clinicRow = hours.find((h) => h.doctorId === null);
  const doctorRow = hours.find((h) => h.doctorId === doctorId);

  if (!clinicRow || !clinicRow.isOpen) return { slots: [], closed: true, slotMinutes };
  if (doctorRow && !doctorRow.isOpen) return { slots: [], closed: true, slotMinutes };

  let win: Window | null = {
    start: toMinutes(clinicRow.openTime),
    end: toMinutes(clinicRow.closeTime),
    breakStart: toMinutes(clinicRow.breakStart),
    breakEnd: toMinutes(clinicRow.breakEnd),
  };
  if (doctorRow) {
    win = intersect(win, {
      start: toMinutes(doctorRow.openTime),
      end: toMinutes(doctorRow.closeTime),
      breakStart: toMinutes(doctorRow.breakStart),
      breakEnd: toMinutes(doctorRow.breakEnd),
    });
  }
  if (!win) return { slots: [], closed: true, slotMinutes };

  const blocks = await db
    .select()
    .from(blockedDates)
    .where(
      and(
        eq(blockedDates.blockDate, dateISO),
        or(isNull(blockedDates.doctorId), eq(blockedDates.doctorId, doctorId)),
      ),
    );
  if (blocks.some((b) => !b.startTime || !b.endTime)) {
    return { slots: [], closed: true, slotMinutes };
  }

  const booked = await db
    .select({ startTime: appointments.startTime, status: appointments.status })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.appointmentDate, dateISO),
      ),
    );
  const takenSet = new Set(
    booked.filter((b) => b.status !== "cancelled").map((b) => b.startTime),
  );

  const isToday = dateISO === todayISO();
  const minStart = isToday ? nowMinutes() + (booking.minimumNoticeHours || 0) * 60 : -1;

  const slots: SlotInfo[] = [];
  for (let t = win.start; t + slotMinutes <= win.end; t += slotMinutes) {
    const time = fromMinutes(t);
    const endT = t + slotMinutes;
    const inBreak =
      win.breakStart < win.breakEnd && t < win.breakEnd && endT > win.breakStart;
    if (inBreak) continue;
    const inBlock = blocks.some(
      (b) => t < toMinutes(b.endTime!) && endT > toMinutes(b.startTime!),
    );
    if (inBlock) continue;
    if (t < minStart) continue;
    slots.push({ time, label: formatTime12(time), available: !takenSet.has(time) });
  }
  return { slots, closed: false, slotMinutes };
}

