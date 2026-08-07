/**
 * Service — a treatment the clinic offers. `icon` stores a Lucide icon name
 * (resolved to a component at render time) so content is editable without code.
 */
export interface Service {
  id: string; // uuid
  slug: string; // url-safe, e.g. "teeth-whitening"
  title: string;
  description: string;
  icon: string; // Lucide icon name, e.g. "Sparkles"
  category: string | null; // e.g. "Cosmetic", "Surgery"
  price_from: number | null; // starting price, whole currency units
  currency: string; // ISO 4217, e.g. "USD"
  duration_min: number | null; // typical appointment length
  image_url: string | null;
  is_featured: boolean; // surfaced on the landing page
  display_order: number;
  created_at: string; // ISO timestamp
}
