import type { Faq } from "@/types";

/** Questions for the animated FAQ accordion. */
export const faqs: Faq[] = [
  {
    id: "faq-1",
    question: "Do you accept new patients?",
    answer:
      "Yes — we welcome new patients every week. You can request an appointment through the booking form or by phone, and our team will confirm a time that suits you.",
    category: "General",
    display_order: 1,
  },
  {
    id: "faq-2",
    question: "Does the treatment hurt?",
    answer:
      "Patient comfort is our priority. We use modern anesthesia and gentle techniques so that most procedures — including implants and root canals — are virtually painless.",
    category: "Treatment",
    display_order: 2,
  },
  {
    id: "faq-3",
    question: "How much do dental implants cost?",
    answer:
      "Implant treatment starts from $900 per implant and depends on your specific case. We provide a clear, itemized plan after a consultation, with no hidden fees.",
    category: "Pricing",
    display_order: 3,
  },
  {
    id: "faq-4",
    question: "Do you offer payment plans?",
    answer:
      "Yes. For larger treatments such as veneers or full-arch implants we offer flexible installment options. Ask our reception team for details.",
    category: "Pricing",
    display_order: 4,
  },
  {
    id: "faq-5",
    question: "How long does teeth whitening take?",
    answer:
      "In-office whitening takes about one hour and brightens your smile by several shades in a single visit. We also offer take-home kits for gradual results.",
    category: "Treatment",
    display_order: 5,
  },
  {
    id: "faq-6",
    question: "Is the clinic suitable for children?",
    answer:
      "Absolutely. Our pediatric specialist creates a calm, playful environment so children feel safe and actually enjoy their visits.",
    category: "General",
    display_order: 6,
  },
];
