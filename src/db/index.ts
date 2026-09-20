import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/dental_clinic";

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL not set. Running in demo mode with fallback connection.");
}

const isLocalhost =
  databaseUrl.includes("localhost") ||
  databaseUrl.includes("127.0.0.1") ||
  databaseUrl.includes("@postgres:");

const sslConfig =
  process.env.DB_SSL === "false" || isLocalhost
    ? undefined
    : { rejectUnauthorized: false };

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: sslConfig,
    max: process.env.DB_MAX_CONNECTIONS ? Number(process.env.DB_MAX_CONNECTIONS) : 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    allowExitOnIdle: false,
  });

// Handle unexpected errors on idle clients
pool.on("error", (err) => {
  console.error("Unexpected error on idle database client", err);
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
