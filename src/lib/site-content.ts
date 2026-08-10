import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ClinicSettingsRow, WorkingHours } from "@/types";

/**
 * Loads all published public-site content from Supabase in one round-trip.
 * Anon RLS returns only published/active rows, so this is exactly what the
 * public site is allowed to show. Called from the home page (a Server
 * Component); the result is passed down to the presentational sections.
 */
export async function getSiteContent() {
  const supabase = await createClient();

  const [services, doctors, certificates, reviews, beforeAfter, gallery, faqs, settings] =
    await Promise.all([
      supabase.from("services").select("*").eq("is_published", true).order("display_order"),
      supabase.from("doctors").select("*").eq("is_active", true).order("display_order"),
      supabase.from("certificates").select("*").eq("is_published", true).order("display_order"),
      supabase.from("reviews").select("*").eq("is_published", true).order("display_order"),
      supabase.from("before_after_cases").select("*").eq("is_published", true).order("display_order"),
      supabase.from("gallery_images").select("*").eq("is_published", true).order("display_order"),
      supabase.from("faqs").select("*").eq("is_published", true).order("display_order"),
      supabase.from("clinic_settings").select("*").eq("id", 1).single(),
    ]);

  return {
    services: services.data ?? [],
    doctors: doctors.data ?? [],
    certificates: certificates.data ?? [],
    reviews: reviews.data ?? [],
    beforeAfter: beforeAfter.data ?? [],
    gallery: gallery.data ?? [],
    faqs: faqs.data ?? [],
    settings: settings.data ?? null,
  };
}

/** Coerce the JSON `working_hours` column into the typed weekly array. */
export function workingHours(settings: ClinicSettingsRow | null): WorkingHours[] {
  const raw = settings?.working_hours;
  return Array.isArray(raw) ? (raw as unknown as WorkingHours[]) : [];
}
