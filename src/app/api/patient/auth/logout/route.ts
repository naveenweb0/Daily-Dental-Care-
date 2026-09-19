import { NextResponse } from "next/server";
import { destroyPatientSession } from "@/lib/patientAuth";

export async function POST() {
  await destroyPatientSession();
  return NextResponse.json({ ok: true });
}
