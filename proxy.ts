import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fr", "en"];
// Unknown-language visitors get English: the international default, matching the
// hreflang x-default and the sitemap. French speakers still get the Québec site.
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
  // A sticky NEXT_LOCALE cookie (set on the first redirect) wins over headers.
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie === "fr" || cookie === "en") return cookie;

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
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)"],
};
