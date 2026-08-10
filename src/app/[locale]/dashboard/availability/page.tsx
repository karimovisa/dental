import { createClient } from "@/lib/supabase/server";
import { AvailabilityEditor } from "@/components/admin/availability-editor";

export default async function AvailabilityPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: doctor } = await supabase
    .from("doctors")
    .select("id, name")
    .eq("is_active", true)
    .order("display_order")
    .limit(1)
    .maybeSingle();

  if (!doctor) {
    return <p className="text-sm text-muted-foreground">No active doctor found.</p>;
  }

  const [weeklyRes, overridesRes] = await Promise.all([
    supabase
      .from("doctor_weekly_schedule")
      .select("*")
      .eq("doctor_id", doctor.id)
      .order("weekday")
      .order("start_time"),
    supabase
      .from("doctor_availability_override")
      .select("*")
      .eq("doctor_id", doctor.id)
      .gte("date", today)
      .order("date"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Availability
        </h1>
        <p className="text-sm text-muted-foreground">
          {doctor.name} · set weekly working hours and add date-specific exceptions.
        </p>
      </div>
      <AvailabilityEditor
        doctorId={doctor.id}
        weekly={weeklyRes.data ?? []}
        overrides={overridesRes.data ?? []}
      />
    </div>
  );
}
