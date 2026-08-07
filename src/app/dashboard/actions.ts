"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentDbStatus } from "@/types";

type ActionResult = { ok: true } | { error: string };

/** Add `minutes` to a "HH:MM" or "HH:MM:SS" string, returns "HH:MM:SS". */
function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}:00`;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentDbStatus
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Create a treatment appointment linked to a consultation. */
export async function createFollowUp(input: {
  parentId: string;
  serviceId: string;
  date: string;
  startTime: string; // "HH:MM"
}): Promise<ActionResult> {
  const supabase = await createClient();

  const [{ data: parent }, { data: service }] = await Promise.all([
    supabase
      .from("appointments")
      .select("doctor_id, patient_name, patient_phone")
      .eq("id", input.parentId)
      .single(),
    supabase
      .from("services")
      .select("duration_minutes")
      .eq("id", input.serviceId)
      .single(),
  ]);

  if (!parent || !service) return { error: "Could not load the linked records." };

  const end_time = addMinutes(input.startTime, service.duration_minutes);

  const { error } = await supabase.from("appointments").insert({
    doctor_id: parent.doctor_id,
    service_id: input.serviceId,
    patient_name: parent.patient_name,
    patient_phone: parent.patient_phone,
    appointment_date: input.date,
    start_time: `${input.startTime}:00`,
    end_time,
    status: "confirmed",
    source: "staff",
    parent_appointment_id: input.parentId,
  });

  if (error) {
    if (/exclusion|overlap|conflicting/i.test(error.message)) {
      return { error: "That time overlaps another appointment for this doctor." };
    }
    return { error: error.message };
  }
  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function addScheduleWindow(input: {
  doctorId: string;
  weekday: number;
  start: string;
  end: string;
}): Promise<ActionResult> {
  if (input.start >= input.end) return { error: "End time must be after start time." };
  const supabase = await createClient();
  const { error } = await supabase.from("doctor_weekly_schedule").insert({
    doctor_id: input.doctorId,
    weekday: input.weekday,
    start_time: input.start,
    end_time: input.end,
  });
  if (error) return { error: error.message };
  revalidatePath("/dashboard/availability");
  return { ok: true };
}

export async function deleteScheduleWindow(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("doctor_weekly_schedule")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/availability");
  return { ok: true };
}

export async function addOverride(input: {
  doctorId: string;
  date: string;
  isDayOff: boolean;
  start?: string;
  end?: string;
}): Promise<ActionResult> {
  if (!input.isDayOff && (!input.start || !input.end)) {
    return { error: "Set both start and end times, or mark it a day off." };
  }
  if (!input.isDayOff && input.start! >= input.end!) {
    return { error: "End time must be after start time." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("doctor_availability_override").insert({
    doctor_id: input.doctorId,
    date: input.date,
    is_day_off: input.isDayOff,
    start_time: input.isDayOff ? null : input.start,
    end_time: input.isDayOff ? null : input.end,
  });
  if (error) return { error: error.message };
  revalidatePath("/dashboard/availability");
  return { ok: true };
}

export async function deleteOverride(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("doctor_availability_override")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/availability");
  return { ok: true };
}

export async function updateSettings(input: {
  booking_requires_approval: boolean;
  slot_granularity_minutes: number;
  clinic_name: string;
  phone: string;
  address: string;
  working_hours_note: string;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("clinic_settings")
    .update({
      booking_requires_approval: input.booking_requires_approval,
      slot_granularity_minutes: input.slot_granularity_minutes,
      clinic_name: input.clinic_name,
      phone: input.phone,
      address: input.address,
      working_hours_note: input.working_hours_note,
    })
    .eq("id", 1);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}
