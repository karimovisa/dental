import { defineRouting } from "next-intl/routing";

/** Locale routing: Uzbek is the default, Russian the alternative. Both are
 *  always prefixed (/uz, /ru). next-intl persists the choice in a cookie. */
export const routing = defineRouting({
  locales: ["uz", "ru"],
  defaultLocale: "uz",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
