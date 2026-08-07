"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Select,
  Button,
} from "@/components/shared";
import { updateSettings } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";
import type { ClinicSettingsRow } from "@/types";

export function SettingsForm({ settings }: { settings: ClinicSettingsRow }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [requiresApproval, setRequiresApproval] = React.useState(
    settings.booking_requires_approval
  );
  const [granularity, setGranularity] = React.useState(
    String(settings.slot_granularity_minutes)
  );
  const [cutoff, setCutoff] = React.useState(
    String(settings.cancellation_cutoff_hours)
  );
  const [name, setName] = React.useState(settings.clinic_name ?? "");
  const [phone, setPhone] = React.useState(settings.phone ?? "");
  const [address, setAddress] = React.useState(settings.address ?? "");
  const [hoursNote, setHoursNote] = React.useState(
    settings.working_hours_note ?? ""
  );

  function save() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await updateSettings({
        booking_requires_approval: requiresApproval,
        slot_granularity_minutes: Number(granularity),
        cancellation_cutoff_hours: Number(cutoff),
        clinic_name: name,
        phone,
        address,
        working_hours_note: hoursNote,
      });
      if ("error" in res) {
        setError(res.error);
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking</CardTitle>
          <CardDescription>
            Control how new online bookings are handled.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <label className="flex items-start justify-between gap-4">
            <span className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                Require approval
              </span>
              <span className="text-sm text-muted-foreground">
                When on, new online bookings arrive as <b>pending</b> for you to
                confirm. When off, they&apos;re auto-<b>confirmed</b>.
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={requiresApproval}
              onClick={() => setRequiresApproval((v) => !v)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                requiresApproval ? "bg-primary" : "bg-input"
              )}
            >
              <span
                className={cn(
                  "inline-block size-5 rounded-full bg-background shadow transition-transform",
                  requiresApproval ? "translate-x-[22px]" : "translate-x-[2px]"
                )}
              />
            </button>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Slot interval"
              options={[
                { value: "10", label: "10 minutes" },
                { value: "15", label: "15 minutes" },
                { value: "20", label: "20 minutes" },
                { value: "30", label: "30 minutes" },
              ]}
              value={granularity}
              onValueChange={setGranularity}
            />
            <Input
              label="Cancellation cutoff (hours)"
              type="number"
              min={0}
              hint="Patients can't cancel/reschedule online within this many hours of the appointment."
              value={cutoff}
              onChange={(e) => setCutoff(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clinic details</CardTitle>
          <CardDescription>
            Shown on the public site&apos;s contact section.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Input label="Clinic name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Address" containerClassName="sm:col-span-2" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input label="Working hours note" containerClassName="sm:col-span-2" value={hoursNote} onChange={(e) => setHoursNote(e.target.value)} />
        </CardContent>
        <CardFooter className="justify-end gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <Check className="size-4" /> Saved
            </span>
          )}
          {error && <span className="text-sm text-destructive">{error}</span>}
          <Button onClick={save} isLoading={pending} disabled={pending}>
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
