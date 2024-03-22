import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

dotenv.config({
  path: [".env", ".env.local"],
});

export const db = drizzle(neon(process.env.DATABASE_CONNECTION_STRING), {
  schema: schema,
});
