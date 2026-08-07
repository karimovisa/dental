/**
 * Editable site-content models — the pieces a clinic manages from the dashboard
 * without touching code: stats, FAQ, before/after cases, gallery, and the
 * single clinic settings record.
 */

/** A headline metric, e.g. "12+ Years", "8000+ Patients". */
export interface Stat {
  id: string; // uuid
  label: string;
  value: number;
  suffix: string | null; // "+", "%", "k"
  icon: string | null; // Lucide icon name
}

/** A frequently-asked question rendered in the accordion. */
export interface Faq {
  id: string; // uuid
  question: string;
  answer: string;
  category: string | null;
  display_order: number;
}

/** A treatment result shown as a before/after comparison. */
export interface BeforeAfterCase {
  id: string; // uuid
  title: string;
  description: string | null;
  service_id: string | null; // FK -> Service.id
  before_image_url: string;
  after_image_url: string;
  display_order: number;
}

/** A clinic/work photo for the gallery. */
export interface GalleryImage {
  id: string; // uuid
  title: string | null;
  image_url: string;
  category: string | null; // e.g. "Interior", "Team", "Equipment"
  display_order: number;
}

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

/** One row of the clinic's weekly schedule. */
export interface WorkingHours {
  day: Weekday;
  opens: string | null; // "09:00", null when closed
  closes: string | null; // "18:00", null when closed
  is_closed: boolean;
}

/** Single-row clinic configuration edited in Settings. */
export interface ClinicSettings {
  id: string; // uuid
  name: string;
  tagline: string | null;
  logo_url: string | null;
  phone: string;
  email: string | null;
  address: string;
  map_embed_url: string | null; // Google Maps embed src
  telegram_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  working_hours: WorkingHours[];
}
