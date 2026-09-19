import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import {
  appointmentHistory,
  appointments,
  leads,
  notificationQueue,
  notifications,
  services,
} from "@/db/schema";
import { audit, requireUser } from "@/lib/auth";
import { addMinutesToTime, getAvailableSlots, formatTime12 } from "@/lib/availability";
import { APPOINTMENT_STATUSES } from "@/lib/clinic";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { error } = await requireUser("appointments");
  if (error) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const { id } = await ctx.params;
  const rows = await db.select().from(appointments).where(eq(appointments.id, Number(id))).limit(1);
  if (!rows[0]) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const history = await db
    .select()
    .from(appointmentHistory)
    .where(eq(appointmentHistory.appointmentId, Number(id)))
    .orderBy(appointmentHistory.createdAt);
  return NextResponse.json({ appointment: rows[0], history });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser("appointments");
  if (error || !user) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const { id } = await ctx.params;
  const apptId = Number(id);
  const body = await req.json().catch(() => ({}));
  const rows = await db.select().from(appointments).where(eq(appointments.id, apptId)).limit(1);
  const current = rows[0];
  if (!current) return NextResponse.json({ message: "Appointment not found" }, { status: 404 });

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  const historyRows: { action: string; oldValue: string; newValue: string }[] = [];

  if (body.status) {
    const status = String(body.status);
    if (!(APPOINTMENT_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }
    if (status === "cancelled" && !String(body.cancellationReason ?? "").trim()) {
      return NextResponse.json({ message: "Cancellation reason is required." }, { status: 400 });
    }
    updates.status = status;
    if (status === "cancelled") updates.cancellationReason = String(body.cancellationReason);
    historyRows.push({
      action: "status_changed",
      oldValue: current.status,
      newValue: status + (status === "cancelled" ? ` · ${body.cancellationReason}` : ""),
    });
  }

  if (body.date && body.time) {
    const date = String(body.date);
    const time = String(body.time);
    if (date !== current.appointmentDate || time !== current.startTime) {
      const { slots } = await getAvailableSlots(current.doctorId, date);
      const conflict = await db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.doctorId, current.doctorId),
            eq(appointments.appointmentDate, date),
            eq(appointments.startTime, time),
            ne(appointments.id, apptId),
          ),
        );
      if (conflict.length || !slots.find((s) => s.time === time)) {
        return NextResponse.json(
          { message: "This appointment slot is no longer available. Please select another time." },
          { status: 409 },
        );
      }
      const svc = current.serviceId
        ? await db.select().from(services).where(eq(services.id, current.serviceId)).limit(1)
        : [];
      const duration = svc[0]?.durationMinutes ?? 30;
      updates.appointmentDate = date;
      updates.startTime = time;
      updates.endTime = addMinutesToTime(time, duration);
      if (!body.status) updates.status = "rescheduled";
      historyRows.push({
        action: "rescheduled",
        oldValue: `${current.appointmentDate} ${formatTime12(current.startTime)}`,
        newValue: `${date} ${formatTime12(time)}`,
      });
      await db.insert(notifications).values({
        type: "appointment",
        title: "Appointment Rescheduled",
        body: `${current.patientName} moved to ${date} ${formatTime12(time)}`,
        link: `/admin/appointments?id=${apptId}`,
      });
    }
  }

  if (typeof body.internalNotes === "string") {
    updates.internalNotes = body.internalNotes;
    historyRows.push({ action: "note_added", oldValue: current.internalNotes, newValue: body.internalNotes });
  }

  await db.update(appointments).set(updates).where(eq(appointments.id, apptId));

  for (const h of historyRows) {
    await db.insert(appointmentHistory).values({ ...h, appointmentId: apptId, actor: user.name });
    await audit(user, h.action, "appointment", apptId, h.oldValue, h.newValue);
  }

  if (updates.status === "confirmed") {
    await db.insert(notificationQueue).values({
      appointmentId: apptId,
      channel: "whatsapp",
      kind: "confirmation",
      recipient: current.phone,
      payload: `Your appointment ${current.appointmentNumber} is confirmed.`,
      status: "not_connected",
    });
    if (current.leadId) {
      await db.update(leads).set({ stage: "appointment_confirmed", updatedAt: new Date() }).where(eq(leads.id, current.leadId));
    }
  }
  if (updates.status === "cancelled") {
    await db.insert(notifications).values({
      type: "appointment",
      title: "Appointment Cancelled",
      body: `${current.patientName} · ${current.appointmentDate}`,
      link: `/admin/appointments?id=${apptId}`,
    });
  }
  if (updates.status === "completed" && current.leadId) {
    await db.update(leads).set({ stage: "visited", updatedAt: new Date() }).where(eq(leads.id, current.leadId));
  }

  const updated = await db.select().from(appointments).where(eq(appointments.id, apptId)).limit(1);
  return NextResponse.json({ ok: true, appointment: updated[0] });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser("appointments");
  if (error || !user) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  if (user.role === "receptionist") {
    return NextResponse.json({ message: "Not permitted" }, { status: 403 });
  }
  const { id } = await ctx.params;
  await db.delete(appointments).where(eq(appointments.id, Number(id)));
  await audit(user, "deleted", "appointment", id);
  return NextResponse.json({ ok: true });
}
