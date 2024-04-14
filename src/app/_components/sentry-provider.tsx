"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

function SentryProvider() {
  useEffect(() => {
    const addIntegrations = async () => {
      const { replayIntegration } = await import("@sentry/browser");
      Sentry.addIntegration(replayIntegration());
    };

    addIntegrations();
  }, []);

  return <></>;
}

export default SentryProvider;
