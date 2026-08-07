import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Browser Supabase client for Client Components (e.g. the public booking form).
 * Uses the public anon/publishable key — safe to expose. The public site only
 * ever calls the two SECURITY DEFINER RPCs, never tables directly.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
