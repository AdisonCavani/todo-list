import { google, handleCallback } from "@lib/auth";
import { OAuth2RequestError } from "arctic";
import { cookies, headers } from "next/headers";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookies().get("google_code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const header = headers();
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const googleUserResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Access-Control-Allow-Origin": header.get("referer")!,
        },
      },
    );
    const googleUser: GoogleUser = await googleUserResponse.json();

    if (!googleUser.email_verified) {
      return new Response("Unverified email", {
        status: 400,
      });
    }

    await handleCallback(
      {
        id: googleUser.sub,
        verifiedEmails: [googleUser.email],
        primaryEmail: googleUser.email,
        name: googleUser.name,
      },
      "google",
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dash",
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

type GoogleUser = {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
};
