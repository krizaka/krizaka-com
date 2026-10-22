import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { negotiateLocale } from "@/lib/locale-negotiation";

const locales = ["fr", "en"];
// Loi 96: French is the default. English is served when the visitor chose it (the language
// switch writes NEXT_LOCALE), opened an /en URL, or their browser asks for English and never French.
function getLocale(request: NextRequest): string {
  return negotiateLocale(request.cookies.get("NEXT_LOCALE")?.value, request.headers.get("accept-language"));
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Exclude static assets, api routes, icons, sitemap, robots, etc.
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return;
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // A /fr or /en page remembers its language, so the site's unprefixed links keep it.
  if (!pathnameIsMissingLocale) {
    const current = pathname.split("/")[1];
    if (request.cookies.get("NEXT_LOCALE")?.value === current) return;
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", current, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return response;
  }

  // Redirect if there is no locale prefix
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    const response = NextResponse.redirect(
      new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
    );
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }
}

export const config = {
  // Matcher ignoring API, static files, next internals, etc.
  matcher: ["/((?!api|_next/static|_next/image|assets|maps/v1|favicon.ico|sitemap.xml|robots.txt).*)"],
};
