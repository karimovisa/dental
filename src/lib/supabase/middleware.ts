import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

/**
 * Refreshes the Supabase auth session on every request and guards the
 * dashboard, writing cookies onto the response next-intl already produced.
 * Paths are locale-prefixed (/uz/dashboard, /ru/login), so the locale is
 * stripped before matching and re-applied on redirects.
 */
export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: getUser() revalidates the token with Supabase (not just cookies).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const localeMatch = path.match(/^\/(uz|ru)(?=\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
  const rest = (localeMatch ? path.slice(localeMatch[0].length) : path) || "/";
  const isDashboard = rest.startsWith("/dashboard");
  const isLogin = rest === "/login";

  if (isDashboard && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    if (rest !== "/dashboard") url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return response;
}
