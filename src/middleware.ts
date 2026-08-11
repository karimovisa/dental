import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Old links used a /uz, /ru or /en path prefix. The site is now single-URL with
// the language in a cookie, so redirect those to the stripped path and carry the
// intended language over — no more 404s on shared/bookmarked locale URLs.
const LOCALE_PREFIX = /^\/(uz|ru|en)(\/.*|$)/;

export async function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(LOCALE_PREFIX);
  if (match) {
    const url = request.nextUrl.clone();
    url.pathname = match[2] || "/";
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", match[1], {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
    return response;
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on all routes except static assets and image files so the auth
     * session stays fresh, while keeping the public site fast.
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
