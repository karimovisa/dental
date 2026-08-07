/**
 * Appointment — a booking request. Created from the public booking form
 * (UI-only in V1) or by staff in the dashboard.
 *
 * `patient_id` is null for a fresh public request not yet linked to a patient
 * record; the denormalized `patient_name`/`patient_phone` capture what the
 * booker typed, exactly as a real intake row would.
 */
export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export interface Appointment {
  id: string; // uuid
  patient_id: string | null; // FK -> Patient.id, null until linked
  patient_name: string;
  patient_phone: string;
  service_id: string; // FK -> Service.id
  doctor_id: string | null; // FK -> Doctor.id, null = "any doctor"
  preferred_date: string; // ISO date, YYYY-MM-DD
  preferred_time: string; // "HH:mm"
  status: AppointmentStatus;
  comment: string | null;
  created_at: string; // ISO timestamp
}
