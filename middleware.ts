import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fr", "en"];
const defaultLocale = "fr";

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const prefs = acceptLanguage.split(",").map((part) => {
    const [lang, qVal] = part.split(";q=");
    return {
      lang: lang.trim().toLowerCase().split("-")[0],
      q: qVal ? parseFloat(qVal) : 1.0,
    };
  });

  prefs.sort((a, b) => b.q - a.q);

  for (const pref of prefs) {
    if (pref.lang === "en") return "en";
    if (pref.lang === "fr") return "fr";
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
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

  // Redirect if there is no locale prefix
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    // e.g. /solutions -> /fr/solutions
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname === "/" ? "" : pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  // Matcher ignoring API, static files, next internals, etc.
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)"],
};
