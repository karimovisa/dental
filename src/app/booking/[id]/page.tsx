"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Phone,
  Check,
  X,
  CalendarClock,
  Loader2,
  TriangleAlert,
  ArrowLeft,
} from "lucide-react";
import { Button, Input, DentalIcon } from "@/components/shared";
import { createClient } from "@/lib/supabase/client";
import { clinicSettings } from "@/data";
import { formatDate } from "@/lib/format";
import { normalizeUzPhone } from "@/lib/phone";
import type { BookingView, AvailableSlot } from "@/types";
import { AppointmentStatusBadge } from "@/components/admin/status-badge";
import { cn } from "@/lib/utils";

const formatTime = (t: string) => t.slice(0, 5);

export default function ManageBookingPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const supabase = React.useMemo(() => createClient(), []);

  const [phone, setPhone] = React.useState("");
  const [verifying, setVerifying] = React.useState(false);
  const [verifyError, setVerifyError] = React.useState<string | null>(null);
  const [booking, setBooking] = React.useState<BookingView | null>(null);
  const [mode, setMode] = React.useState<"view" | "reschedule">("view");
  const [done, setDone] = React.useState<null | "cancelled" | "rescheduled">(null);

  const normalized = normalizeUzPhone(phone);

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setVerifyError(null);
    if (!normalized) {
      setVerifyError("Enter the phone number you booked with (+998…).");
      return;
    }
    setVerifying(true);
    const { data, error } = await supabase.rpc("get_booking", {
      p_appointment_id: id,
      p_phone: normalized,
    });
    setVerifying(false);
    if (error || !data || data.length === 0) {
      setVerifyError("No booking found for that reference and phone number.");
      return;
    }
    setBooking(data[0]);
  }

  async function refreshBooking() {
    if (!normalized) return;
    const { data } = await supabase.rpc("get_booking", {
      p_appointment_id: id,
      p_phone: normalized,
    });
    if (data && data[0]) setBooking(data[0]);
  }

  return (
    <main className="flex min-h-screen flex-col bg-secondary/40">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-2xl items-center px-4">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <DentalIcon name="tooth" className="size-4.5" />
            </span>
            <span className="text-base font-bold tracking-tight text-foreground">
              {clinicSettings.name}
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to site
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Manage your appointment
          </h1>

          {done ? (
            <DoneView done={done} phone={clinicSettings.phone} />
          ) : !booking ? (
            <form onSubmit={verify} className="mt-6 flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Enter the phone number you used to book to view your appointment.
              </p>
              <Input
                label="Phone number"
                type="tel"
                leftIcon={<Phone />}
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={phone && !normalized ? "Enter a valid +998 number" : undefined}
              />
              {verifyError && (
                <p className="flex items-center gap-2 text-sm text-destructive">
                  <TriangleAlert className="size-4 shrink-0" /> {verifyError}
                </p>
              )}
              <Button type="submit" isLoading={verifying} disabled={verifying}>
                View appointment
              </Button>
            </form>
          ) : mode === "reschedule" ? (
            <RescheduleView
              booking={booking}
              phone={normalized!}
              supabase={supabase}
              onCancel={() => setMode("view")}
              onDone={() => setDone("rescheduled")}
            />
          ) : (
            <BookingDetails
              booking={booking}
              phone={normalized!}
              supabase={supabase}
              onReschedule={() => setMode("reschedule")}
              onCancelled={() => setDone("cancelled")}
              onRefresh={refreshBooking}
            />
          )}
        </div>
      </div>
    </main>
  );
}

type Supabase = ReturnType<typeof createClient>;

function BookingDetails({
  booking,
  phone,
  supabase,
  onReschedule,
  onCancelled,
  onRefresh,
}: {
  booking: BookingView;
  phone: string;
  supabase: Supabase;
  onReschedule: () => void;
  onCancelled: () => void;
  onRefresh: () => void;
}) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const active = booking.status === "pending" || booking.status === "confirmed";

  async function cancel() {
    setError(null);
    setPending(true);
    const { error } = await supabase.rpc("cancel_booking", {
      p_appointment_id: booking.id,
      p_phone: phone,
    });
    setPending(false);
    if (error) {
      setError(
        /too close/i.test(error.message)
          ? "It's too close to your appointment to cancel online."
          : "Could not cancel. Please try again."
      );
      onRefresh();
      return;
    }
    onCancelled();
  }

  return (
    <div className="mt-6 flex flex-col gap-5">
      <dl className="flex flex-col divide-y divide-border rounded-xl border border-border">
        {[
          ["Service", booking.service_title ?? "—"],
          ["Date", formatDate(booking.appointment_date)],
          ["Time", formatTime(booking.start_time)],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-3 text-sm">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-medium text-foreground">{v}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-3 text-sm">
          <dt className="text-muted-foreground">Status</dt>
          <dd>
            <AppointmentStatusBadge status={booking.status} />
          </dd>
        </div>
      </dl>

      {error && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <TriangleAlert className="size-4 shrink-0" /> {error}
        </p>
      )}

      {!active ? (
        <p className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
          This appointment is {booking.status}. Contact us if you need help.
        </p>
      ) : booking.can_modify ? (
        <div className="flex gap-3">
          <Button variant="outline" onClick={onReschedule} disabled={pending} leftIcon={<CalendarClock />}>
            Reschedule
          </Button>
          <Button variant="ghost" onClick={cancel} isLoading={pending} disabled={pending} leftIcon={<X />}>
            Cancel appointment
          </Button>
        </div>
      ) : (
        <p className="rounded-lg bg-accent px-4 py-3 text-sm text-accent-foreground">
          To change this appointment, please call the clinic at{" "}
          <a href={`tel:${clinicSettings.phone}`} className="font-medium text-primary">
            {clinicSettings.phone}
          </a>
          .
        </p>
      )}
    </div>
  );
}

function RescheduleView({
  booking,
  phone,
  supabase,
  onCancel,
  onDone,
}: {
  booking: BookingView;
  phone: string;
  supabase: Supabase;
  onCancel: () => void;
  onDone: () => void;
}) {
  const [date, setDate] = React.useState("");
  const [slots, setSlots] = React.useState<AvailableSlot[]>([]);
  const [slot, setSlot] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const today = React.useMemo(() => new Date().toISOString().slice(0, 10), []);

  React.useEffect(() => {
    setSlot("");
    if (!date) {
      setSlots([]);
      return;
    }
    let active = true;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase.rpc("get_available_slots", {
        p_doctor_id: booking.doctor_id,
        p_service_id: booking.service_id,
        p_date: date,
      });
      if (!active) return;
      setLoading(false);
      setSlots(error ? [] : (data ?? []));
    })();
    return () => {
      active = false;
    };
  }, [supabase, booking.doctor_id, booking.service_id, date]);

  async function submit() {
    if (!date || !slot) {
      setError("Pick a new date and time.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const { error } = await supabase.rpc("reschedule_booking", {
      p_appointment_id: booking.id,
      p_phone: phone,
      p_new_date: date,
      p_new_start: slot,
    });
    setSubmitting(false);
    if (error) {
      setError(
        /too close/i.test(error.message)
          ? "It's too close to your appointment to change online."
          : /not available|just taken/i.test(error.message)
            ? "That time was just taken — pick another."
            : "Could not reschedule. Please try again."
      );
      return;
    }
    onDone();
  }

  return (
    <div className="mt-6 flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        Rescheduling <span className="font-medium text-foreground">{booking.service_title}</span> —
        pick a new date and time.
      </p>
      <Input label="New date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />

      {date && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Available times</span>
          {loading ? (
            <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Checking…
            </div>
          ) : slots.length === 0 ? (
            <p className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
              No open times on this date.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((s) => (
                <button
                  key={s.slot_start}
                  type="button"
                  onClick={() => setSlot(s.slot_start)}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-sm font-medium transition-colors",
                    slot === s.slot_start
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent"
                  )}
                >
                  {formatTime(s.slot_start)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <TriangleAlert className="size-4 shrink-0" /> {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={submitting} leftIcon={<ArrowLeft />}>
          Back
        </Button>
        <Button fullWidth onClick={submit} isLoading={submitting} disabled={submitting || !slot} leftIcon={<Check />}>
          Confirm new time
        </Button>
      </div>
    </div>
  );
}

function DoneView({
  done,
  phone,
}: {
  done: "cancelled" | "rescheduled";
  phone: string;
}) {
  return (
    <div className="mt-6 flex flex-col items-center gap-4 py-6 text-center">
      <span
        className={cn(
          "flex size-14 items-center justify-center rounded-full",
          done === "cancelled"
            ? "bg-destructive/10 text-destructive"
            : "bg-emerald-500/10 text-emerald-600"
        )}
      >
        {done === "cancelled" ? <X className="size-7" /> : <Check className="size-7" />}
      </span>
      <h2 className="text-lg font-semibold text-foreground">
        {done === "cancelled" ? "Appointment cancelled" : "Appointment rescheduled"}
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        {done === "cancelled"
          ? "Your time slot has been freed up. You can book again any time."
          : "Your new time is confirmed. See you then!"}
      </p>
      <Link href="/#appointment">
        <Button variant="outline">Back to booking</Button>
      </Link>
    </div>
  );
}
