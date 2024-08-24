import { github, handleCallback } from "@lib/auth";
import { logger } from "@lib/logger";
import { OAuth2RequestError } from "arctic";
import { cookies, headers } from "next/headers";

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
    const header = headers();
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Access-Control-Allow-Origin": header.get("referer")!,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Access-Control-Allow-Origin": header.get("referer")!,
      },
    });
    const emailsObj: GithubUserEmail[] = await emailsResponse.json();

    const verifiedEmails = emailsObj.filter((obj) => obj.verified);

    if (!verifiedEmails) {
      return new Response("Unverified email", {
        status: 400,
      });
    }

    await handleCallback(
      {
        id: githubUser.id,
        verifiedEmails: verifiedEmails.map((emailObj) => emailObj.email),
        primaryEmail: verifiedEmails.find(
          (emailObj) => emailObj.primary && emailObj.verified,
        )!.email,
        name: githubUser.name,
      },
      "github",
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dash",
      },
    });
  } catch (e: any) {
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    )
      return new Response("Invalid code", {
        status: 400,
      });

    if (e instanceof Error && e.message !== "") {
      logger.error(e.message);
    } else {
      logger.error(JSON.stringify(e));
    }

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

type GithubUserEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
};
