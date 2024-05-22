import { github, lucia } from "@lib/auth";
import { accounts, users } from "@server/db/schema";
import { db } from "@server/db/sql";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    // const emailsResponse = await fetch("https://api.github.com/user/emails", {
    //   headers: {
    //     Authorization: `Bearer ${tokens.accessToken}`,
    //   },
    // });
    // const emailsObj: GithubUserEmail[] = await emailsResponse.json();

    // const verifiedEmails = emailsObj
    //   .filter((obj) => obj.verified)
    //   .map((obj) => obj.email);

    // if (!verifiedEmails) {
    //   return new Response("Unverified email", {
    //     status: 400,
    //   });
    // }

    // const existingUser = await db.query.users.findFirst({
    //   where: (user, { inArray }) => inArray(user.email, verifiedEmails),
    // });

    const existingUser = await db.query.users.findFirst({
      where: (user, { inArray }) => inArray(user.email, [githubUser.email]),
    });

    let userId, existingAccount;

    if (existingUser) {
      userId = existingUser.id;

      existingAccount = await db.query.accounts.findFirst({
        where: (account, { and, eq }) =>
          and(
            eq(account.providerAccountId, githubUser.id),
            eq(account.provider, "Github"),
          ),
      });
    } else {
      userId = generateIdFromEntropySize(10);

      await db.insert(users).values({
        id: userId,
        name: githubUser.name,
        email: githubUser.email,
      });
    }

    if (!existingAccount) {
      await db.insert(accounts).values({
        provider: "Github",
        providerAccountId: githubUser.id,
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

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    )
      return new Response("Invalid code", {
        status: 400,
      });

    return new Response("Internal server error", {
      status: 500,
    });
  }
}

type GitHubUser = {
  id: string;
  email: string;
  name: string;
};

// type GithubUserEmail = {
//   email: string;
//   primary: boolean;
//   verified: boolean;
// };
