import postgres from "postgres";
import { shouldUseSsl } from "@/lib/db-config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

export const sql = postgres(connectionString, {
  ssl: shouldUseSsl(connectionString) ? "require" : undefined,
  max: 10,
});
