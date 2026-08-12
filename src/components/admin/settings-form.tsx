"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, TriangleAlert } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Select,
  Button,
} from "@/components/shared";
import { ImageUpload } from "@/components/admin/image-upload";
import { deleteMedia } from "@/lib/supabase/storage";
import { updateSettings } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";
import type { ClinicSettingsRow, WorkingHours, Weekday } from "@/types";

const DAYS: { key: Weekday; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

function seedHours(raw: unknown): WorkingHours[] {
  const arr = Array.isArray(raw) ? (raw as WorkingHours[]) : [];
  return DAYS.map(
    ({ key }) =>
      arr.find((h) => h.day === key) ?? {
        day: key,
        opens: "09:00",
        closes: "18:00",
        is_closed: key === "sun",
      }
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "inline-block size-5 rounded-full bg-background shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        )}
      />
    </button>
  );
}

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
  const [tagline, setTagline] = React.useState(settings.tagline ?? "");
  const [phone, setPhone] = React.useState(settings.phone ?? "");
  const [email, setEmail] = React.useState(settings.email ?? "");
  const [address, setAddress] = React.useState(settings.address ?? "");
  const [mapUrl, setMapUrl] = React.useState(settings.map_embed_url ?? "");
  const [logoUrl, setLogoUrl] = React.useState<string | null>(settings.logo_url);
  const [telegram, setTelegram] = React.useState(settings.telegram_url ?? "");
  const [instagram, setInstagram] = React.useState(settings.instagram_url ?? "");
  const [facebook, setFacebook] = React.useState(settings.facebook_url ?? "");
  const [hours, setHours] = React.useState<WorkingHours[]>(
    seedHours(settings.working_hours)
  );
  const originalLogo = React.useRef<string | null>(settings.logo_url);

  function setDay(day: Weekday, patch: Partial<WorkingHours>) {
    setHours((hs) => hs.map((h) => (h.day === day ? { ...h, ...patch } : h)));
  }

  function save() {
    setError(null);
    setSaved(false);
    const normalizedHours = hours.map((h) =>
      h.is_closed ? { ...h, opens: null, closes: null } : h
    );
    startTransition(async () => {
      const res = await updateSettings({
        booking_requires_approval: requiresApproval,
        slot_granularity_minutes: Number(granularity),
        cancellation_cutoff_hours: Number(cutoff),
        clinic_name: name,
        tagline,
        phone,
        email,
        address,
        map_embed_url: mapUrl,
        logo_url: logoUrl,
        telegram_url: telegram,
        instagram_url: instagram,
        facebook_url: facebook,
        working_hours: normalizedHours,
      });
      if ("error" in res) {
        setError(res.error);
        return;
      }
      // Clean up a replaced logo now that the new URL is persisted.
      if (originalLogo.current && originalLogo.current !== logoUrl) {
        await deleteMedia(originalLogo.current);
        originalLogo.current = logoUrl;
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
            <Toggle checked={requiresApproval} onChange={setRequiresApproval} />
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
          <CardTitle>Branding</CardTitle>
          <CardDescription>
            Logo, name and tagline shown in the site header and footer.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <ImageUpload
            label="Logo"
            hint="Square works best. Leave empty to use the default mark."
            value={logoUrl}
            folder="branding"
            deleteOnReplace={false}
            onChange={setLogoUrl}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Clinic name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>
            Shown across the public site — header, footer and contact block.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Address" containerClassName="sm:col-span-2" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input
            label="Google Maps embed URL"
            containerClassName="sm:col-span-2"
            hint="The src URL of a Google Maps embed."
            value={mapUrl}
            onChange={(e) => setMapUrl(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social links</CardTitle>
          <CardDescription>Shown in the footer. Leave blank to hide.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Input label="Telegram URL" value={telegram} onChange={(e) => setTelegram(e.target.value)} />
          <Input label="Instagram URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
          <Input label="Facebook URL" containerClassName="sm:col-span-2" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Opening hours</CardTitle>
          <CardDescription>
            Displayed in the contact block. (This is marketing copy — the booking
            calendar is driven by the Availability page.)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {hours.map((h) => {
            const label = DAYS.find((d) => d.key === h.day)?.label ?? h.day;
            return (
              <div key={h.day} className="flex flex-wrap items-center gap-3">
                <span className="w-24 text-sm font-medium text-foreground">
                  {label}
                </span>
                <Toggle
                  checked={!h.is_closed}
                  onChange={(openNow) => setDay(h.day, { is_closed: !openNow })}
                />
                {h.is_closed ? (
                  <span className="text-sm text-muted-foreground">Closed</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={h.opens ?? ""}
                      onChange={(e) => setDay(h.day, { opens: e.target.value })}
                      className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                    <span className="text-muted-foreground">–</span>
                    <input
                      type="time"
                      value={h.closes ?? ""}
                      onChange={(e) => setDay(h.day, { closes: e.target.value })}
                      className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="sticky bottom-4 z-20 flex items-center justify-end gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-elevated backdrop-blur">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <Check className="size-4" /> Saved
          </span>
        )}
        {error && (
          <span className="flex items-center gap-1.5 text-sm text-destructive">
            <TriangleAlert className="size-4 shrink-0" /> {error}
          </span>
        )}
        <Button onClick={save} isLoading={pending} disabled={pending}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
