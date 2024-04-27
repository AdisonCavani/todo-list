"use client";

import * as Sentry from "@sentry/nextjs";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function SentryProvider() {
  const session = useSession();

  useEffect(() => {
    const addIntegrations = async () => {
      const { replayIntegration } = await import("@sentry/replay");
      Sentry.addIntegration(replayIntegration());
    };

    addIntegrations();
  }, []);

  useEffect(() => {
    if (session.data) {
      Sentry.setUser({
        id: session.data.user.id,
        email: session.data.user.email!,
        username: session.data.user.name!,
      });
    }
  }, [session.data]);

  return <></>;
}

export default SentryProvider;
