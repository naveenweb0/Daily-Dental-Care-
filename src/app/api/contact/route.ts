import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissions, leads, notifications } from "@/db/schema";
import { isValidEmail, isValidIndianPhone, normalizePhone, upsertPatient } from "@/lib/booking";
import { rateLimit } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`contact:${ip}`, 10, 60_000)) {
    return NextResponse.json({ message: "Too many requests. Please try again shortly." }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "");
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name";
  if (!isValidIndianPhone(phone)) errors.phone = "Enter a valid 10-digit Indian mobile number";
  if (email && !isValidEmail(email)) errors.email = "Enter a valid email address";
  if (message.length < 5) errors.message = "Please tell us how we can help";
  if (Object.keys(errors).length) {
    return NextResponse.json({ message: "Please correct the highlighted fields.", errors }, { status: 400 });
  }
  try {
    const { patient } = await upsertPatient({ name, phone, email, source: "contact_form" });
    const lead = await db
      .insert(leads)
      .values({
        name,
        phone: normalizePhone(phone),
        email,
        patientId: patient.id,
        source: "contact_form",
        stage: "new",
        message,
      })
      .returning();
    await db.insert(contactSubmissions).values({ name, phone: normalizePhone(phone), email, message, leadId: lead[0].id });
    await db.insert(notifications).values({
      type: "contact",
      title: "New Contact Enquiry",
      body: `${name} · ${normalizePhone(phone)}`,
      link: "/admin/leads",
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
