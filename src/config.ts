import { createEnv } from "@t3-oss/env-core";
import { env as runtimeEnv } from "next-runtime-env";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_GITHUB_ID: z.string().min(1),
    AUTH_GITHUB_SECRET: z.string().min(1),
    AUTH_GOOGLE_ID: z.string().min(1),
    AUTH_GOOGLE_SECRET: z.string().min(1),
    DATABASE_CONNECTION_STRING: z.string().url(),
    PRODUCTION_URL: z
      .string()
      .min(1)
      .optional()
      .refine((value) => {
        if (process.env.NODE_ENV === "production") return !!value;

        return true;
      }),
  },
  clientPrefix: "NEXT_PUBLIC",
  client: {
    NEXT_PUBLIC_SENTRY_DSN: z
      .string()
      .min(1)
      .optional()
      .refine((value) => {
        if (process.env.NODE_ENV === "production") return !!value;

        return true;
      }),
  },
  runtimeEnv: {
    AUTH_GITHUB_ID: runtimeEnv("AUTH_GITHUB_ID"),
    AUTH_GITHUB_SECRET: runtimeEnv("AUTH_GITHUB_SECRET"),
    AUTH_GOOGLE_ID: runtimeEnv("AUTH_GOOGLE_ID"),
    AUTH_GOOGLE_SECRET: runtimeEnv("AUTH_GOOGLE_SECRET"),
    DATABASE_CONNECTION_STRING: runtimeEnv("DATABASE_CONNECTION_STRING"),
    PRODUCTION_URL: runtimeEnv("PRODUCTION_URL"),
    NEXT_PUBLIC_SENTRY_DSN: runtimeEnv("NEXT_PUBLIC_SENTRY_DSN"),
  },
  emptyStringAsUndefined: true,
});
