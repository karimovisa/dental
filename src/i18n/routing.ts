/** Supported languages. Uzbek is the default; English holds the base content
 *  in the database. There is NO locale prefix in the URL — the active language
 *  is stored in a cookie and switched with the header language button. */
export const locales = ["uz", "ru", "en"] as const;
export const defaultLocale = "uz";

export type Locale = (typeof locales)[number];
