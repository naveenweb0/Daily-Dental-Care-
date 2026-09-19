import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { error } = await requireUser("analytics");
  if (error) return NextResponse.json({ message: error }, { status: error === "unauthenticated" ? 401 : 403 });
  const p = req.nextUrl.searchParams;
  const from = p.get("from") ?? new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
  const to = p.get("to") ?? new Date().toISOString().slice(0, 10);

  const byDay = await db.execute(sql`
    select appointment_date::text as day, count(*)::int as total
    from appointments where appointment_date between ${from} and ${to}
    group by 1 order by 1`);
  const byMonth = await db.execute(sql`
    select to_char(appointment_date, 'YYYY-MM') as month, count(*)::int as total
    from appointments group by 1 order by 1 desc limit 12`);
  const byStatus = await db.execute(sql`
    select status, count(*)::int as total from appointments
    where appointment_date between ${from} and ${to} group by 1`);
  const leadsBySource = await db.execute(sql`
    select source, count(*)::int as total from leads
    where created_at::date between ${from} and ${to} group by 1 order by 2 desc`);
  const leadsByTreatment = await db.execute(sql`
    select coalesce(s.name, 'Not specified') as treatment, count(*)::int as total
    from leads l left join services s on s.id = l.service_id
    where l.created_at::date between ${from} and ${to} group by 1 order by 2 desc`);
  const sourcePerformance = await db.execute(sql`
    select l.source,
      count(*)::int as leads,
      count(a.id)::int as appointments,
      count(*) filter (where l.stage in ('converted','treatment_started','visited'))::int as conversions
    from leads l left join appointments a on a.lead_id = l.id
    where l.created_at::date between ${from} and ${to}
    group by 1 order by 2 desc`);

  return NextResponse.json({
    from,
    to,
    byDay: byDay.rows,
    byMonth: byMonth.rows,
    byStatus: byStatus.rows,
    leadsBySource: leadsBySource.rows,
    leadsByTreatment: leadsByTreatment.rows,
    sourcePerformance: sourcePerformance.rows,
  });
}
