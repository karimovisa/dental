/**
 * Pick a bilingual/trilingual DB field for the active locale, falling back to
 * the English base column when the requested translation is empty — so the site
 * is never blank. Base column = English; `uz`/`ru` are the translations.
 */
export function localized(
  locale: string,
  base: string | null | undefined,
  ru: string | null | undefined,
  uz: string | null | undefined
): string {
  if (locale === "ru" && ru && ru.trim() !== "") return ru;
  if (locale === "uz" && uz && uz.trim() !== "") return uz;
  return base ?? "";
}
