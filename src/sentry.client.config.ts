import * as Sentry from "@sentry/nextjs";
import { env } from "next-runtime-env";

Sentry.init({
  dsn: env("NEXT_PUBLIC_SENTRY_DSN"),
  tracesSampleRate: 1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [],
});
