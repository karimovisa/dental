import { useTranslations, useLocale } from "next-intl";
import { Container, SectionHeading, Accordion } from "@/components/shared";
import { localized } from "@/lib/i18n-content";
import type { FaqRow } from "@/types";

/** Frequently asked questions in an animated single-open accordion. */
export function FaqSection({ faqs }: { faqs: FaqRow[] }) {
  const t = useTranslations("faq");
  const locale = useLocale();
  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="scroll-mt-24 py-20 lg:py-28">
      <Container className="flex max-w-3xl flex-col gap-12">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <div className="rounded-3xl border border-border bg-card px-6 shadow-card">
          <Accordion
            items={faqs.map((faq) => ({
              id: faq.id,
              title: localized(locale, faq.question, faq.question_ru),
              content: localized(locale, faq.answer, faq.answer_ru),
            }))}
          />
        </div>
      </Container>
    </section>
  );
}
