import { auth } from "@lib/auth";
import { NextRequest, NextResponse } from "next/server";

export default auth((req: NextRequest & { auth: any }) => {
  if (req.auth.user && new Date(req.auth.expires) > new Date())
    return NextResponse.next();

  const url = new URL("/auth", req.url);
  url.searchParams.append("callbackUrl", req.url);

  return NextResponse.redirect(url);
});

export const config = {
  matcher: ["/app"],
  runtime: "experimental-edge",
};
