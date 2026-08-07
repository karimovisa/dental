import Image from "next/image";
import { Check } from "lucide-react";
import { Container, SectionHeading, Reveal } from "@/components/shared";

const reasons = [
  "Experienced & Certified Doctors",
  "Advanced Dental Technology",
  "Comfortable & Pain-Free Treatment",
  "Sterilized & Safe Environment",
];

/** "Why choose us" — value proposition with a checklist and a supporting image. */
export function WhyChooseUs() {
  return (
    <section id="why" className="scroll-mt-24 py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Your Smile Is Our Priority"
          underline
        />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-6">
            <p className="text-lg text-pretty text-muted-foreground">
              Our experienced team is dedicated to providing the highest quality
              dental care in a friendly and comforting environment — combining
              precision, technology, and genuine care.
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
                src="/images/why-choose-us.jpg"
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
