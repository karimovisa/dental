import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { UserRound } from "lucide-react";
import {
  Container,
  SectionHeading,
  Card,
  RevealGroup,
  RevealItem,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "@/components/shared";
import { localized } from "@/lib/i18n-content";
import type { DoctorRow } from "@/types";

/** Team grid: portrait, name, specialization, experience, and social links. */
export function DoctorsSection({ doctors }: { doctors: DoctorRow[] }) {
  const t = useTranslations("doctorsSection");
  const locale = useLocale();
  if (doctors.length === 0) return null;

  return (
    <section id="doctors" className="scroll-mt-24 bg-secondary/40 py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading title={t("title")} description={t("description")} />

        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor) => (
            <RevealItem key={doctor.id}>
              <Card hoverable className="h-full overflow-hidden">
                <div className="relative aspect-[4/5] w-full bg-muted">
                  {doctor.image_url ? (
                    <Image
                      src={doctor.image_url}
                      alt={doctor.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <UserRound className="size-16" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1 p-5 text-center">
                  <h3 className="text-base font-semibold text-foreground">
                    {doctor.name}
                  </h3>
                  {doctor.specialization && (
                    <p className="text-sm font-medium text-primary">
                      {localized(locale, doctor.specialization, doctor.specialization_ru, doctor.specialization_uz)}
                    </p>
                  )}
                  {doctor.experience_years != null && (
                    <p className="text-xs text-muted-foreground">
                      {t("experience", { years: doctor.experience_years })}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    {[FacebookIcon, TwitterIcon, LinkedinIcon].map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        aria-label={`${doctor.name} social profile`}
                        className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <Icon className="size-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
