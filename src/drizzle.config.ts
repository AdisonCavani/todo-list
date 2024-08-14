import { env } from "config";
import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: ".env.local",
});

export default defineConfig({
  dialect: "postgresql",
  strict: true,
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dbCredentials: {
    url: env.DATABASE_CONNECTION_STRING,
  },
});
