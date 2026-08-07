import { Container, SectionHeading, Accordion } from "@/components/shared";
import { faqs } from "@/data";

const sortedFaqs = [...faqs].sort((a, b) => a.display_order - b.display_order);

/** Frequently asked questions in an animated single-open accordion. */
export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 py-20 lg:py-28">
      <Container className="flex max-w-3xl flex-col gap-12">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Everything you need to know before your visit."
        />
        <div className="rounded-3xl border border-border bg-card px-6 shadow-card">
          <Accordion
            items={sortedFaqs.map((faq) => ({
              id: faq.id,
              title: faq.question,
              content: faq.answer,
            }))}
          />
        </div>
      </Container>
    </section>
  );
}
