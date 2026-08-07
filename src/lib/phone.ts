/** Client-side mirror of the DB `normalize_uz_phone()` — instant feedback.
 * The RPC re-validates server-side; never trust the client alone. */
export function normalizeUzPhone(input: string): string | null {
  const digits = (input || "").replace(/\D/g, "");
  let n: string;
  if (digits.length === 12 && digits.startsWith("998")) n = "+" + digits;
  else if (digits.length === 9) n = "+998" + digits;
  else return null;
  return /^\+998\d{9}$/.test(n) ? n : null;
}

/** "+998901234567" -> "+998 90 123 45 67" */
export function formatUzPhone(normalized: string): string {
  const m = normalized.match(/^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return m ? `+998 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : normalized;
}
