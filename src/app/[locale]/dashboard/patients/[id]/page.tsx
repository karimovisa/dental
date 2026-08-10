import Link from "next/link";
import { ArrowLeft, Phone, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle } from "@/components/shared";
import { AppointmentStatusBadge } from "@/components/admin/status-badge";
import { PatientNotes } from "@/components/admin/patient-notes";
import { formatDate } from "@/lib/format";

const formatTime = (t: string) => t.slice(0, 5);

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!patient) {
    return (
      <div className="flex flex-col gap-4">
        <BackLink />
        <p className="text-sm text-muted-foreground">Patient not found.</p>
      </div>
    );
  }

  const { data: history } = await supabase
    .from("appointments")
    .select("id, appointment_date, start_time, status, source, services(title)")
    .eq("patient_id", id)
    .order("appointment_date", { ascending: false })
    .order("start_time", { ascending: false });

  const appts = history ?? [];

  return (
    <div className="flex flex-col gap-6">
      <BackLink />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {patient.full_name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Phone className="size-4" /> {patient.phone}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" /> Patient since {formatDate(patient.first_seen)}
          </span>
          <span>
            {appts.length} {appts.length === 1 ? "visit" : "visits"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Visit history</CardTitle>
            </CardHeader>
            {appts.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-muted-foreground">No visits yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {appts.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {a.services?.title ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(a.appointment_date)} · {formatTime(a.start_time)} · {a.source}
                      </p>
                    </div>
                    <AppointmentStatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div>
          <PatientNotes patientId={patient.id} initialNotes={patient.notes ?? ""} />
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/dashboard/patients"
      className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-4" /> All patients
    </Link>
  );
}
