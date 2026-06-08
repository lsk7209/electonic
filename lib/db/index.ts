import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/lib/db/schema";

export function getLibsqlClient() {
  if (!process.env.TURSO_DATABASE_URL) {
    return null;
  }

  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  });
}

export function getDb() {
  const client = getLibsqlClient();
  if (!client) return null;

  return drizzle(client, { schema });
}
