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
import type { ServiceRow } from "@/types";

/** Grid of published dental services with custom icons and hover lift. */
export function ServicesSection({ services }: { services: ServiceRow[] }) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="scroll-mt-24 bg-secondary/40 py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          title="Our Dental Services"
          description="Complete dental care for you and your family."
        />

        <RevealGroup className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {services.map((service) => (
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
                    {service.title}
                  </h3>
                  {service.description && (
                    <p className="text-sm text-pretty text-muted-foreground">
                      {service.description}
                    </p>
                  )}
                  <a
                    href="#appointment"
                    className="group mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary"
                  >
                    Learn More
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
