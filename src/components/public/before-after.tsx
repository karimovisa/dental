"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Container, SectionHeading } from "@/components/shared";
import { localized } from "@/lib/i18n-content";
import type { BeforeAfterRow } from "@/types";
import { cn } from "@/lib/utils";

/** Before/after results with pill labels and functional dot pagination.
 * Structured slider-ready — a full carousel can be wired later. */
export function BeforeAfter({ cases }: { cases: BeforeAfterRow[] }) {
  const t = useTranslations("beforeAfter");
  const locale = useLocale();
  const [active, setActive] = React.useState(0);
  if (cases.length === 0) return null;
  const current = cases[Math.min(active, cases.length - 1)];
  const caption = localized(locale, current.caption, current.caption_ru) || t("title");

  return (
    <section className="scroll-mt-24 py-20 lg:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading title={t("title")} description={t("description")} underline />

        <div className="flex flex-col gap-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {(
              [
                { url: current.before_image_url, label: t("before") },
                { url: current.after_image_url, label: t("after") },
              ] as const
            ).map((item) => (
              <div
                key={item.label}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted shadow-card"
              >
                <Image
                  src={item.url}
                  alt={`${caption} — ${item.label}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute bottom-4 left-4 rounded-full bg-foreground/75 px-3 py-1 text-xs font-semibold text-background backdrop-blur-sm">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {cases.length > 1 && (
            <div className="flex items-center justify-center gap-2">
              {cases.map((caseItem, index) => (
                <button
                  key={caseItem.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show case ${index + 1}`}
                  aria-current={index === active}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    index === active
                      ? "w-6 bg-primary"
                      : "w-2.5 bg-primary/30 hover:bg-primary/50"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
