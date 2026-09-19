import { NextResponse } from "next/server";
import { getSessionPatient } from "@/lib/patientAuth";
import { createBooking } from "@/lib/booking";

export async function POST(req: Request) {
  const patient = await getSessionPatient();
  if (!patient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await createBooking({
      name: patient.name,
      phone: patient.phone,
      email: patient.email || String(body.email || ""),
      age: patient.age ?? (body.age ? Number(body.age) : null),
      serviceId: Number(body.serviceId),
      doctorId: Number(body.doctorId),
      date: String(body.date || ""),
      time: String(body.time || ""),
      message: String(body.message || "Booked directly via Patient Portal"),
      patientType: "existing",
      source: "patient_portal",
      consent: true,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.message || "Unable to reserve slot", errors: result.errors },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json({ ok: true, appointment: result.appointment });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Booking failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
