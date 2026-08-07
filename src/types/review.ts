/**
 * Review — a patient testimonial. `source` records where it came from so the
 * UI can badge it (e.g. a Google logo). `photo_url` is the reviewer's avatar.
 */
export type ReviewSource =
  | "google"
  | "facebook"
  | "instagram"
  | "telegram"
  | "website";

export interface Review {
  id: string; // uuid
  patient_name: string;
  rating: number; // 1–5
  text: string;
  photo_url: string | null; // reviewer avatar
  source: ReviewSource;
  is_verified: boolean; // verified real patient
  is_published: boolean; // shown on the public site
  created_at: string; // ISO timestamp
}
