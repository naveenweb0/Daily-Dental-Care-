import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const doctorId = Number(req.nextUrl.searchParams.get("doctorId"));
  const date = req.nextUrl.searchParams.get("date") ?? "";
  if (!doctorId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ message: "doctorId and date are required" }, { status: 400 });
  }
  try {
    const result = await getAvailableSlots(doctorId, date);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "Unable to load availability" }, { status: 500 });
  }
}
