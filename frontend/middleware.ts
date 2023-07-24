import { match } from "@formatjs/intl-localematcher";
import { auth } from "@lib/auth";
import { i18n } from "i18n-config";
import Negotiator from "negotiator";
import { NextResponse, type NextRequest } from "next/server";

function getLocale(request: NextRequest) {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  return match(languages, locales, i18n.defaultLocale);
}

export async function middleware(request: NextRequest, response: NextResponse) {
  const pathname = request.nextUrl.pathname;

  // Ignore public folder
  if (
    pathname.startsWith("/static") ||
    ["/sw.js", "/workbox-8637ed29.js"].includes(pathname)
  )
    return NextResponse.next();

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }

  if (pathname.substring(pathname.indexOf("/", 1)).startsWith("/app"))
    // @ts-expect-error
    return await auth(request, response);

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  runtime: "experimental-edge",
};
