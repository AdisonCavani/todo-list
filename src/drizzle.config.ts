import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
import { env } from "next-runtime-env";

dotenv.config({
  path: ".env.local",
});

export default defineConfig({
  dialect: "postgresql",
  strict: true,
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dbCredentials: {
    url: env("DATABASE_CONNECTION_STRING")!,
  },
});
