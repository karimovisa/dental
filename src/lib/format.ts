/** Small, dependency-free formatters shared across the app. */

/** Format a whole-unit price with its currency, e.g. formatPrice(120,"USD") -> "$120". */
export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format an ISO date/timestamp as e.g. "Aug 6, 2026". */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

/** Format an ISO timestamp as e.g. "Aug 6, 2026, 2:30 PM". */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

/** Compact number, e.g. 8200 -> "8.2K". */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

/** Build the initials for an avatar fallback, e.g. "Dilnoza Karimova" -> "DK". */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
