import { CalendarCheck, CalendarClock, CircleDashed, ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/shared";
import { AppointmentStatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const formatTime = (t: string) => t.slice(0, 5);

export default async function DashboardOverview() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("appointments")
    .select(
      "id, patient_name, patient_phone, appointment_date, start_time, status, source, services(title), doctors(name)"
    )
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true });

  const all = data ?? [];
  const active = (s: string) => s === "pending" || s === "confirmed";
  const todays = all.filter((a) => a.appointment_date === today && active(a.status));
  const upcoming = all
    .filter((a) => a.appointment_date > today && active(a.status))
    .slice(0, 6);
  const pending = all.filter((a) => a.status === "pending");

  const stats = [
    { label: "Today", value: todays.length, icon: CalendarCheck },
    { label: "Upcoming", value: all.filter((a) => a.appointment_date > today && active(a.status)).length, icon: CalendarClock },
    { label: "Pending approval", value: pending.length, icon: CircleDashed },
    { label: "Total booked", value: all.length, icon: ClipboardList },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">
          {formatDate(today)} · here&apos;s what&apos;s happening at the clinic.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              {s.value}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AppointmentList
          title="Today's schedule"
          empty="No appointments today."
          rows={todays}
        />
        <AppointmentList
          title="Upcoming"
          empty="Nothing upcoming yet."
          rows={upcoming}
        />
      </div>
    </div>
  );
}

type Row = {
  id: string;
  patient_name: string;
  appointment_date: string;
  start_time: string;
  status: string;
  services: { title: string } | null;
  doctors: { name: string } | null;
};

function AppointmentList({
  title,
  empty,
  rows,
}: {
  title: string;
  empty: string;
  rows: Row[];
}) {
  return (
    <Card className="flex flex-col">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {rows.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {a.patient_name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {a.services?.title ?? "—"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className={cn("text-sm tabular-nums text-muted-foreground")}>
                  {formatDate(a.appointment_date)} · {formatTime(a.start_time)}
                </span>
                <AppointmentStatusBadge status={a.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
