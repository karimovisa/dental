import { createClient } from "@/lib/supabase/server";
import { AppointmentsManager } from "@/components/admin/appointments-manager";

export default async function AppointmentsPage() {
  const supabase = await createClient();

  const [appointmentsRes, servicesRes] = await Promise.all([
    supabase
      .from("appointments")
      .select(
        "id, patient_name, patient_phone, appointment_date, start_time, end_time, status, source, comment, service_id, doctor_id, services(title, booking_type), doctors(name)"
      )
      .order("appointment_date", { ascending: false })
      .order("start_time", { ascending: false }),
    supabase
      .from("services")
      .select("id, title, booking_type")
      .eq("is_published", true)
      .order("display_order"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Appointments
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage bookings — confirm, complete, cancel, or create follow-up treatments.
        </p>
      </div>
      <AppointmentsManager
        appointments={appointmentsRes.data ?? []}
        services={servicesRes.data ?? []}
      />
    </div>
  );
}
