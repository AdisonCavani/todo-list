import lucia from "@lib/lucia";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) return NextResponse.redirect(new URL("/auth", request.url));

  const result = await lucia.validateSession(sessionId);

  if (!result.session)
    return NextResponse.redirect(new URL("/auth", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
