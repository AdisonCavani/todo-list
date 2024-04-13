import { validateRequest } from "@lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { user } = await validateRequest();

  if (!user) return NextResponse.redirect(new URL("/auth", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/app"],
  runtime: "experimental-edge",
};
