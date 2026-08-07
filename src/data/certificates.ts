import type { Certificate } from "@/types";

/** Accreditations and awards, shown in the public gallery (lightbox-ready). */
export const certificates: Certificate[] = [
  {
    id: "cert-implant-academy",
    title: "Advanced Implantology Certification",
    image_url: "/images/certificates/cert-implant-academy.jpg",
    issuer: "International Congress of Oral Implantologists",
    issued_year: 2022,
    display_order: 1,
  },
  {
    id: "cert-invisalign",
    title: "Certified Aligner Provider",
    image_url: "/images/certificates/cert-invisalign.jpg",
    issuer: "Align Technology",
    issued_year: 2021,
    display_order: 2,
  },
  {
    id: "cert-cosmetic",
    title: "Aesthetic & Cosmetic Dentistry Diploma",
    image_url: "/images/certificates/cert-cosmetic.jpg",
    issuer: "European Academy of Cosmetic Dentistry",
    issued_year: 2020,
    display_order: 3,
  },
  {
    id: "cert-endodontics",
    title: "Endodontics Excellence Award",
    image_url: "/images/certificates/cert-endodontics.jpg",
    issuer: "American Association of Endodontists",
    issued_year: 2023,
    display_order: 4,
  },
  {
    id: "cert-iso",
    title: "ISO 9001 Clinic Quality Standard",
    image_url: "/images/certificates/cert-iso.jpg",
    issuer: "International Organization for Standardization",
    issued_year: 2024,
    display_order: 5,
  },
  {
    id: "cert-pediatric",
    title: "Pediatric Dental Care Certification",
    image_url: "/images/certificates/cert-pediatric.jpg",
    issuer: "Academy of Pediatric Dentistry",
    issued_year: 2022,
    display_order: 6,
  },
];
