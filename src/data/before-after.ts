import type { BeforeAfterCase } from "@/types";

/** Real-result comparisons for the Before & After section (slider-ready).
 * Add more pairs here as the clinic provides them. */
export const beforeAfterCases: BeforeAfterCase[] = [
  {
    id: "ba-veneers",
    title: "Smile Makeover",
    description: "A complete transformation with our cosmetic treatment.",
    service_id: "svc-veneers",
    before_image_url: "/images/before-after/ba-veneers-before.png",
    after_image_url: "/images/before-after/ba-veneers-after.png",
    display_order: 1,
  },
];
