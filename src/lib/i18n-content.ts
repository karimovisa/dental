/**
 * Pick a bilingual DB field for the active locale, falling back to the Uzbek
 * (base) value when the Russian value is empty — so the site is never blank.
 * Uzbek lives in the base column, Russian in the `_ru` column.
 */
export function localized(
  locale: string,
  base: string | null | undefined,
  ru: string | null | undefined
): string {
  if (locale === "ru" && ru && ru.trim() !== "") return ru;
  return base ?? "";
}
