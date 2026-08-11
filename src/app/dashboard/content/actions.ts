"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { error: string };

/** Tables the content dashboard is allowed to write. An allowlist keeps the
 *  dynamic table name safe — nothing outside this set can be touched. */
const CONTENT_TABLES = [
  "doctors",
  "services",
  "certificates",
  "reviews",
  "before_after_cases",
  "gallery_images",
  "faqs",
] as const;

export type ContentTable = (typeof CONTENT_TABLES)[number];

function assertTable(table: string): asserts table is ContentTable {
  if (!CONTENT_TABLES.includes(table as ContentTable)) {
    throw new Error(`Table not allowed: ${table}`);
  }
}

/** Public site + this dashboard both need refreshing after any content change. */
function revalidateContent() {
  revalidatePath("/");
  revalidatePath("/dashboard/content");
}

const NOT_SAVED = "Not saved — you may be signed out. Please sign in again.";
const NO_SESSION = "Session expired — please sign in again.";

/** Confirm there's an authenticated dentist. Without this, RLS silently filters
 *  writes to 0 rows and the UI would falsely report success. */
async function requireUser(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return Boolean(user);
}

export async function createContent(
  table: string,
  values: Record<string, unknown>
): Promise<ActionResult> {
  assertTable(table);
  const supabase = await createClient();
  if (!(await requireUser(supabase))) return { error: NO_SESSION };
  const { data, error } = await supabase
    .from(table)
    .insert(values as never)
    .select("id");
  if (error) return { error: error.message };
  if (!data || data.length === 0) return { error: NOT_SAVED };
  revalidateContent();
  return { ok: true };
}

export async function updateContent(
  table: string,
  id: string,
  values: Record<string, unknown>
): Promise<ActionResult> {
  assertTable(table);
  const supabase = await createClient();
  if (!(await requireUser(supabase))) return { error: NO_SESSION };
  const { data, error } = await supabase
    .from(table)
    .update(values as never)
    .eq("id", id)
    .select("id");
  if (error) return { error: error.message };
  if (!data || data.length === 0) return { error: NOT_SAVED };
  revalidateContent();
  return { ok: true };
}

export async function deleteContent(
  table: string,
  id: string
): Promise<ActionResult> {
  assertTable(table);
  const supabase = await createClient();
  if (!(await requireUser(supabase))) return { error: NO_SESSION };
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .select("id");
  if (error) return { error: error.message };
  if (!data || data.length === 0) return { error: NOT_SAVED };
  revalidateContent();
  return { ok: true };
}

/** Swap the display_order of two rows (used by the up/down reorder controls). */
export async function swapContentOrder(
  table: string,
  a: { id: string; display_order: number },
  b: { id: string; display_order: number }
): Promise<ActionResult> {
  assertTable(table);
  const supabase = await createClient();
  if (!(await requireUser(supabase))) return { error: NO_SESSION };
  const [r1, r2] = await Promise.all([
    supabase.from(table).update({ display_order: b.display_order } as never).eq("id", a.id),
    supabase.from(table).update({ display_order: a.display_order } as never).eq("id", b.id),
  ]);
  if (r1.error || r2.error) return { error: (r1.error ?? r2.error)!.message };
  revalidateContent();
  return { ok: true };
}
