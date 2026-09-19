import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = performance.now();
  try {
    await db.execute(sql`SELECT 1`);
    const latencyMs = Math.round(performance.now() - start);

    return Response.json(
      {
        status: "healthy",
        database: "connected",
        latencyMs,
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || "development",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Database connection failed";
    return Response.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: message,
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
