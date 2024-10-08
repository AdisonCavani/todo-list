import { accounts, users, type ProviderEnumType } from "@server/db/schema";
import { db } from "@server/db/sql";
import { GitHub, Google } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { env } from "next-runtime-env";
import { cookies } from "next/headers";
import { cache } from "react";
import lucia from "./lucia";

export const auth = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  // Next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}

  return result;
});

export const github = new GitHub(
  env("AUTH_GITHUB_ID")!,
  env("AUTH_GITHUB_SECRET")!,
  {
    redirectURI: getBaseUrl() + "/auth/github/callback",
  },
);

export const google = new Google(
  env("AUTH_GOOGLE_ID")!,
  env("AUTH_GOOGLE_SECRET")!,
  getBaseUrl() + "/auth/google/callback",
);

type CallbackUser = {
  id: string;
  verifiedEmails: string[];
  primaryEmail: string;
  name: string;
};

export async function handleCallback(
  currentUser: CallbackUser,
  currentProvider: ProviderEnumType,
) {
  const existingUser = await db.query.users.findFirst({
    where: (user, { inArray }) =>
      inArray(user.email, currentUser.verifiedEmails),
  });

  let userId, existingAccount;

  if (existingUser) {
    userId = existingUser.id;

    existingAccount = await db.query.accounts.findFirst({
      where: (account, { and, eq }) =>
        and(
          eq(account.providerAccountId, currentUser.id),
          eq(account.provider, currentProvider),
        ),
    });
  } else {
    userId = generateIdFromEntropySize(10);

    await db.insert(users).values({
      id: userId,
      name: currentUser.name,
      email: currentUser.primaryEmail,
    });
  }

  if (!existingAccount) {
    await db.insert(accounts).values({
      provider: currentProvider,
      providerAccountId: currentUser.id,
      userId: userId,
    });
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

function getBaseUrl() {
  if (env("PRODUCTION_URL")) return `https://${env("PRODUCTION_URL")}`;
  return `https://localhost:${process.env.PORT ?? 3000}`;
}
