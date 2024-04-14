"use client";

import * as Sentry from "@sentry/nextjs";
import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect } from "react";

type Props = {
  error: Error;
};

function GlobalError({ error }: Props) {
  const session = useSession();

  useEffect(() => {
    if (session.data)
      Sentry.setUser({
        id: session.data.user.id,
        email: session.data.user.email!,
      });

    Sentry.captureException(error);
  }, [error, session.data]);

  return (
    <html>
      <body>
        <Error statusCode={500} />
      </body>
    </html>
  );
}

export default GlobalError;
