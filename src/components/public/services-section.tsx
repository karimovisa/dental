import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import {
  Container,
  SectionHeading,
  Card,
  DentalIcon,
  RevealGroup,
  RevealItem,
  type DentalIconName,
} from "@/components/shared";
import { localized } from "@/lib/i18n-content";
import type { ServiceRow } from "@/types";

/** Grid of published dental services with custom icons and hover lift. */
export function ServicesSection({ services }: { services: ServiceRow[] }) {
  const t = useTranslations("services");
  const locale = useLocale();
  if (services.length === 0) return null;

  return (
    <section id="services" className="scroll-mt-24 bg-secondary/40 py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading title={t("title")} description={t("description")} />

        <RevealGroup className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {services.map((service) => {
            const description = localized(locale, service.description, service.description_ru);
            return (
            <RevealItem key={service.id}>
              <Card hoverable className="h-full">
                <div className="flex h-full flex-col items-center gap-4 p-6 text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <DentalIcon
                      name={(service.icon ?? "tooth") as DentalIconName}
                      className="size-7"
                    />
                  </span>
                  <h3 className="text-base font-semibold text-foreground">
                    {localized(locale, service.title, service.title_ru)}
                  </h3>
                  {description && (
                    <p className="text-sm text-pretty text-muted-foreground">
                      {description}
                    </p>
                  )}
                  <a
                    href="#appointment"
                    className="group mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary"
                  >
                    {t("learnMore")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </Card>
            </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
