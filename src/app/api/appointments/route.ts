import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, gte, ilike, lte, or, SQL } from "drizzle-orm";
import { db } from "@/db";
import { appointments, doctors, services } from "@/db/schema";
import { createBooking } from "@/lib/booking";
import { rateLimit, requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`book:${ip}`, 12, 60_000)) {
    return NextResponse.json({ message: "Too many requests. Please try again shortly." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  try {
    const result = await createBooking({
      name: String(body.name ?? "").trim(),
      phone: String(body.phone ?? ""),
      email: String(body.email ?? "").trim(),
      age: body.age ? Number(body.age) : null,
      serviceId: Number(body.serviceId),
      doctorId: Number(body.doctorId),
      date: String(body.date ?? ""),
      time: String(body.time ?? ""),
      message: String(body.message ?? ""),
      patientType: String(body.patientType ?? "new"),
      source: "appointment_form",
      consent: Boolean(body.consent),
    });
    if (!result.ok) {
      return NextResponse.json(
        { message: result.message ?? "Please correct the highlighted fields.", errors: result.errors },
        { status: result.status },
      );
    }
    return NextResponse.json({ ok: true, appointment: result.appointment }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { user, error } = await requireUser("appointments");
  if (error) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  void user;
  const p = req.nextUrl.searchParams;
  const filters: SQL[] = [];
  const from = p.get("from");
  const to = p.get("to");
  const status = p.get("status");
  const doctorId = p.get("doctorId");
  const serviceId = p.get("serviceId");
  const q = p.get("q");
  if (from) filters.push(gte(appointments.appointmentDate, from));
  if (to) filters.push(lte(appointments.appointmentDate, to));
  if (status && status !== "all") filters.push(eq(appointments.status, status));
  if (doctorId && doctorId !== "all") filters.push(eq(appointments.doctorId, Number(doctorId)));
  if (serviceId && serviceId !== "all") filters.push(eq(appointments.serviceId, Number(serviceId)));
  if (q) {
    const like = `%${q}%`;
    filters.push(
      or(
        ilike(appointments.patientName, like),
        ilike(appointments.phone, like),
        ilike(appointments.email, like),
        ilike(appointments.appointmentNumber, like),
      )!,
    );
  }
  const rows = await db
    .select({
      appointment: appointments,
      doctorName: doctors.name,
      serviceName: services.name,
    })
    .from(appointments)
    .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
    .leftJoin(services, eq(services.id, appointments.serviceId))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(appointments.appointmentDate), desc(appointments.startTime))
    .limit(500);
  return NextResponse.json({ appointments: rows });
}
