/**
 * Database-aligned types, derived from the generated Supabase schema
 * (`@/lib/supabase/database.types`). These are the authoritative shapes for
 * anything read from or written to Supabase (booking flow + dashboard).
 *
 * The hand-written mock types in this folder (Doctor, Service, …) remain for
 * the display sections still backed by mock data; they are migrated to these
 * Row types as each section moves onto Supabase.
 */
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
  Database,
} from "@/lib/supabase/database.types";

export type DoctorRow = Tables<"doctors">;
export type ServiceRow = Tables<"services">;
export type AppointmentRow = Tables<"appointments">;
export type ClinicSettingsRow = Tables<"clinic_settings">;
export type WeeklyScheduleRow = Tables<"doctor_weekly_schedule">;
export type AvailabilityOverrideRow = Tables<"doctor_availability_override">;

export type AppointmentInsert = TablesInsert<"appointments">;
export type AppointmentUpdate = TablesUpdate<"appointments">;
export type WeeklyScheduleInsert = TablesInsert<"doctor_weekly_schedule">;
export type AvailabilityOverrideInsert =
  TablesInsert<"doctor_availability_override">;

/** One bookable slot returned by the `get_available_slots` RPC. */
export type AvailableSlot =
  Database["public"]["Functions"]["get_available_slots"]["Returns"][number];

/** Result row from the `create_booking` RPC. */
export type BookingResult =
  Database["public"]["Functions"]["create_booking"]["Returns"][number];

/** Booking type of a service — drives whether it's a direct treatment or a
 * short consultation the dentist follows up on. */
export type ServiceBookingType = "direct" | "consultation";

/** Appointment lifecycle status (mirrors the DB check constraint). */
export type AppointmentDbStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";
