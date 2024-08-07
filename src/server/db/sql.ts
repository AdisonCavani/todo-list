import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const queryClient = postgres(process.env.DATABASE_CONNECTION_STRING);

export const db = drizzle(queryClient, {
  schema: schema,
});
