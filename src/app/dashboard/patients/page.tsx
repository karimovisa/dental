import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/shared";
import { formatDate } from "@/lib/format";

export default async function PatientsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("patients")
    .select("id, full_name, phone, first_seen, appointments(count)")
    .order("first_seen", { ascending: false });

  const patients = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Patients</h1>
        <p className="text-sm text-muted-foreground">
          Everyone who has booked — matched by phone number.
        </p>
      </div>

      {patients.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-14 text-center">
          <Users className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No patients yet.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            {patients.map((p) => {
              const visits = p.appointments?.[0]?.count ?? 0;
              return (
                <li key={p.id}>
                  <Link
                    href={`/dashboard/patients/${p.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{p.full_name}</p>
                      <p className="truncate text-sm text-muted-foreground">{p.phone}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {visits} {visits === 1 ? "visit" : "visits"}
                      </span>
                      <span className="hidden text-sm text-muted-foreground sm:inline">
                        since {formatDate(p.first_seen)}
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
