import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Container, SectionHeading, Reveal } from "@/components/shared";

/** "Why choose us" — value proposition with a checklist and a supporting image. */
export function WhyChooseUs() {
  const t = useTranslations("why");
  const reasons = [t("r1"), t("r2"), t("r3"), t("r4")];
  return (
    <section id="why" className="scroll-mt-24 py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} underline />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-6">
            <p className="text-lg text-pretty text-muted-foreground">
              {t("body")}
            </p>
            <ul className="flex flex-col gap-4">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-4" />
                  </span>
                  <span className="text-base font-medium text-foreground">
                    {reason}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} y={24}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted shadow-card">
              <Image
                src="/images/why-choose-us.png"
                alt="Modern dental treatment equipment"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
