import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: ".env.local",
});

export default defineConfig({
  driver: "mysql2",
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dbCredentials: {
    uri: process.env.DATABASE_CONNECTION_STRING,
  },
});
