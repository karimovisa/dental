"use client";

import * as React from "react";
import {
  EntityManager,
  type EntityConfig,
  type ContentRow,
} from "./entity-manager";
import { cn } from "@/lib/utils";

const str = (v: unknown): string => (v == null ? "" : String(v));

/** Options for the service icon picker — must match the DentalIcon set. */
const ICON_OPTIONS = [
  { value: "tooth", label: "Tooth" },
  { value: "filling", label: "Filling" },
  { value: "braces", label: "Braces" },
  { value: "implant", label: "Implant" },
  { value: "whitening", label: "Whitening" },
  { value: "veneer", label: "Veneer" },
];

const SOURCE_OPTIONS = [
  { value: "google", label: "Google" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "telegram", label: "Telegram" },
  { value: "manual", label: "Manual" },
];

const doctorsConfig: EntityConfig = {
  table: "doctors",
  singular: "Doctor",
  description: "Team members shown on the public site. Delete the demo doctor and add real ones.",
  publishField: "is_active",
  imageFields: ["image_url"],
  fields: [
    { name: "name", label: "Full name", type: "text", required: true, placeholder: "Dr. Jane Doe" },
    { name: "specialization", label: "Specialization (UZ)", type: "text", placeholder: "Ortodont" },
    { name: "specialization_ru", label: "Specialization (RU)", type: "text", placeholder: "Ортодонт" },
    { name: "experience_years", label: "Years of experience", type: "number", min: 0, fullWidth: true },
    { name: "bio", label: "Short bio (UZ)", type: "textarea" },
    { name: "bio_ru", label: "Short bio (RU)", type: "textarea" },
    { name: "image_url", label: "Photo", type: "image", folder: "doctors", aspectClassName: "aspect-[4/5]", hint: "Portrait works best." },
  ],
  primary: (r) => str(r.name),
  secondary: (r) => str(r.specialization),
  thumb: (r) => (r.image_url as string) ?? null,
};

const servicesConfig: EntityConfig = {
  table: "services",
  singular: "Service",
  description: "Treatments offered. Duration and buffer drive the booking calendar.",
  publishField: "is_published",
  imageFields: [],
  fields: [
    { name: "title", label: "Title (UZ)", type: "text", required: true, placeholder: "Teeth Whitening" },
    { name: "title_ru", label: "Title (RU)", type: "text", placeholder: "Отбеливание зубов" },
    { name: "description", label: "Description (UZ)", type: "textarea" },
    { name: "description_ru", label: "Description (RU)", type: "textarea" },
    { name: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, defaultValue: "tooth" },
    { name: "duration_minutes", label: "Duration (minutes)", type: "number", required: true, min: 5, defaultValue: 30, hint: "Includes safety padding." },
    { name: "buffer_minutes", label: "Buffer after (minutes)", type: "number", min: 0, defaultValue: 10 },
    { name: "booking_type", label: "Booking type", type: "select", options: [
      { value: "direct", label: "Direct treatment" },
      { value: "consultation", label: "Consultation" },
    ], defaultValue: "direct" },
    { name: "price", label: "Price (USD)", type: "number", min: 0, hint: "Leave blank to hide price." },
  ],
  primary: (r) => str(r.title),
  secondary: (r) =>
    [
      r.price != null ? `$${r.price}` : null,
      r.duration_minutes != null ? `${r.duration_minutes} min` : null,
    ]
      .filter(Boolean)
      .join(" · ") || null,
};

const certificatesConfig: EntityConfig = {
  table: "certificates",
  singular: "Certificate",
  description: "Accreditations and awards shown in the credentials gallery.",
  publishField: "is_published",
  imageFields: ["image_url"],
  fields: [
    { name: "title", label: "Title (UZ)", type: "text", placeholder: "ISO 9001 sertifikati" },
    { name: "title_ru", label: "Title (RU)", type: "text", placeholder: "Сертификат ISO 9001" },
    { name: "image_url", label: "Image", type: "image", required: true, folder: "certificates", aspectClassName: "aspect-[3/4]" },
  ],
  primary: (r) => str(r.title) || "Certificate",
  thumb: (r) => (r.image_url as string) ?? null,
};

const reviewsConfig: EntityConfig = {
  table: "reviews",
  singular: "Review",
  description: "Patient testimonials.",
  publishField: "is_published",
  imageFields: ["photo_url"],
  fields: [
    { name: "patient_name", label: "Patient name", type: "text", required: true, placeholder: "Gulnora M." },
    { name: "rating", label: "Rating (1–5)", type: "number", min: 1, max: 5, defaultValue: 5 },
    { name: "text", label: "Review", type: "textarea" },
    { name: "source", label: "Source", type: "select", options: SOURCE_OPTIONS, defaultValue: "google" },
    { name: "photo_url", label: "Patient photo (optional)", type: "image", folder: "reviews", aspectClassName: "aspect-square" },
  ],
  primary: (r) => str(r.patient_name),
  secondary: (r) => str(r.text),
  thumb: (r) => (r.photo_url as string) ?? null,
};

const beforeAfterConfig: EntityConfig = {
  table: "before_after_cases",
  singular: "Before / after case",
  description: "Treatment result comparisons.",
  publishField: "is_published",
  imageFields: ["before_image_url", "after_image_url"],
  fields: [
    { name: "caption", label: "Caption (UZ)", type: "text", placeholder: "Vinirlar bilan tabassum" },
    { name: "caption_ru", label: "Caption (RU)", type: "text", placeholder: "Преображение улыбки винирами" },
    { name: "before_image_url", label: "Before image", type: "image", required: true, folder: "before-after", aspectClassName: "aspect-[4/3]" },
    { name: "after_image_url", label: "After image", type: "image", required: true, folder: "before-after", aspectClassName: "aspect-[4/3]" },
  ],
  primary: (r) => str(r.caption) || "Before / after",
  thumb: (r) => (r.after_image_url as string) ?? null,
};

const galleryConfig: EntityConfig = {
  table: "gallery_images",
  singular: "Gallery image",
  description: "Clinic and team photos.",
  publishField: "is_published",
  imageFields: ["image_url"],
  fields: [
    { name: "caption", label: "Caption (UZ)", type: "text", placeholder: "Qabulxona" },
    { name: "caption_ru", label: "Caption (RU)", type: "text", placeholder: "Ресепшн" },
    { name: "image_url", label: "Image", type: "image", required: true, folder: "gallery", aspectClassName: "aspect-[4/3]" },
  ],
  primary: (r) => str(r.caption) || "Photo",
  thumb: (r) => (r.image_url as string) ?? null,
};

const faqsConfig: EntityConfig = {
  table: "faqs",
  singular: "FAQ",
  description: "Questions shown in the FAQ accordion.",
  publishField: "is_published",
  imageFields: [],
  fields: [
    { name: "question", label: "Question (UZ)", type: "text", required: true, fullWidth: true },
    { name: "question_ru", label: "Question (RU)", type: "text", fullWidth: true },
    { name: "answer", label: "Answer (UZ)", type: "textarea", required: true },
    { name: "answer_ru", label: "Answer (RU)", type: "textarea" },
  ],
  primary: (r) => str(r.question),
  secondary: (r) => str(r.answer),
};

export type ContentData = {
  doctors: ContentRow[];
  services: ContentRow[];
  certificates: ContentRow[];
  reviews: ContentRow[];
  before_after_cases: ContentRow[];
  gallery_images: ContentRow[];
  faqs: ContentRow[];
};

const TABS: { key: keyof ContentData; label: string; config: EntityConfig }[] = [
  { key: "doctors", label: "Doctors", config: doctorsConfig },
  { key: "services", label: "Services", config: servicesConfig },
  { key: "certificates", label: "Certificates", config: certificatesConfig },
  { key: "reviews", label: "Reviews", config: reviewsConfig },
  { key: "before_after_cases", label: "Before / After", config: beforeAfterConfig },
  { key: "gallery_images", label: "Gallery", config: galleryConfig },
  { key: "faqs", label: "FAQ", config: faqsConfig },
];

export function ContentTabs({ data }: { data: ContentData }) {
  const [active, setActive] = React.useState<keyof ContentData>("doctors");
  const activeTab = TABS.find((t) => t.key === active)!;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
        {TABS.map((tab) => {
          const count = data[tab.key].length;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                active === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  active === tab.key ? "bg-white/20" : "bg-muted"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <EntityManager
        key={activeTab.key}
        config={activeTab.config}
        rows={data[active]}
      />
    </div>
  );
}
