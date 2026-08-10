"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { locales } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = { uz: "UZ", ru: "RU", en: "EN" };

/** Language button: switches between Uzbek, Russian and English on the SAME
 *  URL by writing the NEXT_LOCALE cookie and refreshing. No page prefix. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();

  function switchTo(next: string) {
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-background/60 p-0.5 text-xs font-semibold",
        className
      )}
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-pressed={locale === l}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            locale === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {LABELS[l] ?? l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
