"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { CalendarDays, ArrowRight, Award, Users, Cpu, BadgeCheck } from "lucide-react";
import { Button, Container, Reveal } from "@/components/shared";

/** Landing hero: headline + CTAs + trust indicators, paired with a hero image. */
export function Hero() {
  const t = useTranslations("hero");
  const trustIndicators = [
    { icon: Award, value: t("trust1Value"), label: t("trust1Label") },
    { icon: Users, value: t("trust2Value"), label: t("trust2Label") },
    { icon: Cpu, value: t("trust3Value"), label: t("trust3Label") },
    { icon: BadgeCheck, value: t("trust4Value"), label: t("trust4Label") },
  ];
  return (
    <section
      id="home"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-accent/60 to-background"
    >
      <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        {/* Left column */}
        <div className="flex flex-col items-start gap-8">
          <Reveal className="flex flex-col gap-6">
            <h1 className="text-display-sm font-bold tracking-tight text-balance text-foreground sm:text-display lg:text-display-lg">
              {t("titleA")} <span className="text-primary">{t("titleB")}</span>
            </h1>
            <p className="max-w-md text-lg text-pretty text-muted-foreground">
              {t("subtitle")}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-wrap items-center gap-3">
            <Button href="#appointment" size="lg" leftIcon={<CalendarDays />}>
              {t("ctaBook")}
            </Button>
            <Button
              href="#services"
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight />}
            >
              {t("ctaServices")}
            </Button>
          </Reveal>

          <Reveal
            delay={0.2}
            className="grid w-full grid-cols-2 gap-x-6 gap-y-5 pt-2 sm:grid-cols-4"
          >
            {trustIndicators.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-foreground">
                    {value}
                  </span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </span>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Right column — hero image */}
        <Reveal delay={0.15} y={24} className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-muted shadow-elevated sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="/images/hero.png"
              alt="Smiling patient receiving dental care"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
