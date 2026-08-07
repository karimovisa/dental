import type { BeforeAfterCase } from "@/types";

/** Real-result comparisons for the Before & After section (slider-ready). */
export const beforeAfterCases: BeforeAfterCase[] = [
  {
    id: "ba-veneers",
    title: "Smile Makeover with Veneers",
    description: "Ten porcelain veneers to restore shape, color, and symmetry.",
    service_id: "svc-veneers",
    before_image_url: "/images/before-after/ba-veneers-before.jpg",
    after_image_url: "/images/before-after/ba-veneers-after.jpg",
    display_order: 1,
  },
  {
    id: "ba-whitening",
    title: "Professional Whitening",
    description: "Six shades brighter after a single in-office session.",
    service_id: "svc-whitening",
    before_image_url: "/images/before-after/ba-whitening-before.jpg",
    after_image_url: "/images/before-after/ba-whitening-after.jpg",
    display_order: 2,
  },
  {
    id: "ba-implants",
    title: "Full-Arch Implant Restoration",
    description: "Fixed implant bridge replacing missing upper teeth.",
    service_id: "svc-implants",
    before_image_url: "/images/before-after/ba-implants-before.jpg",
    after_image_url: "/images/before-after/ba-implants-after.jpg",
    display_order: 3,
  },
  {
    id: "ba-ortho",
    title: "Clear Aligner Correction",
    description: "Crowding resolved over 14 months of aligner therapy.",
    service_id: "svc-orthodontics",
    before_image_url: "/images/before-after/ba-ortho-before.jpg",
    after_image_url: "/images/before-after/ba-ortho-after.jpg",
    display_order: 4,
  },
];
