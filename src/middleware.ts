import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1) Locale routing first (adds /uz or /ru, sets the locale cookie).
  const response = intlMiddleware(request);
  // If next-intl issued a locale redirect, return it without touching auth.
  if (response.headers.get("location")) return response;
  // 2) Refresh the Supabase session + guard the dashboard, carrying cookies
  //    onto the response next-intl produced.
  return await updateSession(request, response);
}

export const config = {
  matcher: [
    /*
     * Run on all routes except static assets and image files so both locale
     * routing and the auth session stay in sync, while keeping the site fast.
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
