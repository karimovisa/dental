/**
 * Patient — a person in the clinic's records.
 * Fields are snake_case to mirror a future Supabase `patients` table so a row
 * can be consumed by components without any transformation.
 *
 * Privacy note (V1 has no real data): in production this table holds PHI and
 * must be protected by row-level security. Model it that way from the start.
 */
export type Gender = "male" | "female" | "other";

export type PatientStatus = "active" | "inactive";

export interface Patient {
  id: string; // uuid
  name: string;
  phone: string; // E.164 preferred, e.g. +998901234567
  email: string | null;
  date_of_birth: string | null; // ISO date, YYYY-MM-DD
  gender: Gender | null;
  address: string | null;
  avatar_url: string | null;
  status: PatientStatus;
  notes: string | null; // internal, staff-only
  last_visit_at: string | null; // ISO timestamp
  created_at: string; // ISO timestamp
}
