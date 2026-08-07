/**
 * Doctor — a clinician shown on the public site and managed in the dashboard.
 * `certificate_ids` references Certificate.id (a future join table / FK array).
 */
export interface Doctor {
  id: string; // uuid
  name: string;
  title: string | null; // e.g. "DDS", "PhD"
  specialization: string; // e.g. "Orthodontist"
  experience_years: number;
  bio: string;
  image_url: string;
  rating: number; // 0–5, aggregate
  reviews_count: number;
  languages: string[]; // e.g. ["Uzbek", "Russian", "English"]
  certificate_ids: string[]; // FK -> Certificate.id
  is_active: boolean; // hidden from public site when false
  display_order: number; // manual ordering on the site
  created_at: string; // ISO timestamp
}
