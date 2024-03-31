import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: ".env.local",
});

const dbPrefix = process.env.NODE_ENV === "production" ? "prod" : "dev";

export default defineConfig({
  driver: "pg",
  strict: true,
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dbCredentials: {
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  },
  tablesFilter: [`todo-list-${dbPrefix}_*`],
});
