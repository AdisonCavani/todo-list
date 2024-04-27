import * as Sentry from "@sentry/nextjs";

const options: Parameters<typeof Sentry.init>[0] = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
  debug: false,
};

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init(options);
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init(options);
  }
}
