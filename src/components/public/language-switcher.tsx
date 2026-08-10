"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Two-pill locale switcher. Changing locale re-routes to the same page in the
 *  other language and persists the choice (next-intl sets the locale cookie). */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  function switchTo(next: string) {
    if (next === locale) return;
    // @ts-expect-error -- params shape is route-dependent; next-intl handles it.
    router.replace({ pathname, params }, { locale: next });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-background/60 p-0.5 text-xs font-semibold",
        className
      )}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-pressed={locale === l}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition-colors",
            locale === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
