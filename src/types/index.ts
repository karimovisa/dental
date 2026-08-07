/** Barrel export for all shared domain types. Import via `@/types`. */
export type { Patient, Gender, PatientStatus } from "./patient";
export type { Doctor } from "./doctor";
export type { Service } from "./service";
export type { Appointment, AppointmentStatus } from "./appointment";
export type { Review, ReviewSource } from "./review";
export type { Certificate } from "./certificate";
export type {
  Stat,
  Faq,
  BeforeAfterCase,
  GalleryImage,
  Weekday,
  WorkingHours,
  ClinicSettings,
} from "./content";

// Database-aligned types (Supabase). Authoritative for booking + dashboard.
export type {
  DoctorRow,
  ServiceRow,
  AppointmentRow,
  ClinicSettingsRow,
  WeeklyScheduleRow,
  AvailabilityOverrideRow,
  AppointmentInsert,
  AppointmentUpdate,
  WeeklyScheduleInsert,
  AvailabilityOverrideInsert,
  AvailableSlot,
  BookingResult,
  ServiceBookingType,
  AppointmentDbStatus,
} from "./db";
