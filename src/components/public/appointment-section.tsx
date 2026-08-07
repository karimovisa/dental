"use client";

import * as React from "react";
import {
  Phone,
  MapPin,
  Clock,
  CalendarDays,
  Check,
  Loader2,
  TriangleAlert,
  CalendarClock,
} from "lucide-react";
import {
  Container,
  SectionHeading,
  Input,
  Textarea,
  Select,
  Button,
  Reveal,
} from "@/components/shared";
import { clinicSettings } from "@/data";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import type { DoctorRow, ServiceRow, AvailableSlot, WorkingHours } from "@/types";
import { cn } from "@/lib/utils";

function hoursFor(day: WorkingHours["day"]): string {
  const entry = clinicSettings.working_hours.find((h) => h.day === day);
  if (!entry || entry.is_closed) return "Closed";
  return `${entry.opens} – ${entry.closes}`;
}

const infoBlocks = [
  { icon: Phone, label: "Call Us", lines: [clinicSettings.phone] },
  { icon: MapPin, label: "Our Location", lines: clinicSettings.address.split(", ") },
  {
    icon: Clock,
    label: "Opening Hours",
    lines: [
      `Mon – Fri: ${hoursFor("mon")}`,
      `Sat: ${hoursFor("sat")}`,
      `Sun: ${hoursFor("sun")}`,
    ],
  },
];

/** "HH:MM:SS" -> "HH:MM" */
const formatTime = (t: string) => t.slice(0, 5);

export function AppointmentSection() {
  const supabase = React.useMemo(() => createClient(), []);

  // Catalog (public-readable)
  const [doctor, setDoctor] = React.useState<DoctorRow | null>(null);
  const [services, setServices] = React.useState<ServiceRow[]>([]);
  const [catalogError, setCatalogError] = React.useState(false);

  // Form fields
  const [serviceId, setServiceId] = React.useState("");
  const [date, setDate] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [comment, setComment] = React.useState("");

  // Availability
  const [slots, setSlots] = React.useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = React.useState("");
  const [slotsLoading, setSlotsLoading] = React.useState(false);

  // Submission
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{
    status: string;
    date: string;
    time: string;
  } | null>(null);

  const today = React.useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Load doctor + services
  React.useEffect(() => {
    let active = true;
    (async () => {
      const [doctorsRes, servicesRes] = await Promise.all([
        supabase
          .from("doctors")
          .select("*")
          .eq("is_active", true)
          .order("display_order")
          .limit(1),
        supabase
          .from("services")
          .select("*")
          .eq("is_published", true)
          .order("display_order"),
      ]);
      if (!active) return;
      if (doctorsRes.error || servicesRes.error) {
        setCatalogError(true);
        return;
      }
      setDoctor(doctorsRes.data?.[0] ?? null);
      setServices(servicesRes.data ?? []);
    })();
    return () => {
      active = false;
    };
  }, [supabase]);

  const fetchSlots = React.useCallback(async () => {
    if (!doctor || !serviceId || !date) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    const { data, error } = await supabase.rpc("get_available_slots", {
      p_doctor_id: doctor.id,
      p_service_id: serviceId,
      p_date: date,
    });
    setSlotsLoading(false);
    setSlots(error ? [] : (data ?? []));
  }, [supabase, doctor, serviceId, date]);

  // Refetch slots whenever service/date changes; clear any prior selection.
  React.useEffect(() => {
    setSelectedSlot("");
    fetchSlots();
  }, [fetchSlots]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!doctor || !serviceId || !date || !selectedSlot || !name.trim() || !phone.trim()) {
      setFormError("Please add your name, phone, service, date, and pick a time.");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.rpc("create_booking", {
      p_doctor_id: doctor.id,
      p_service_id: serviceId,
      p_patient_name: name.trim(),
      p_patient_phone: phone.trim(),
      p_date: date,
      p_start: selectedSlot,
      p_comment: comment.trim() || undefined,
    });
    setSubmitting(false);

    if (error) {
      if (/just taken|no longer available/i.test(error.message)) {
        setFormError("That time was just taken — please pick another.");
        setSelectedSlot("");
        fetchSlots();
      } else {
        setFormError("Something went wrong. Please try again.");
      }
      return;
    }

    const row = data?.[0];
    setResult({
      status: row?.status ?? "confirmed",
      date,
      time: formatTime(selectedSlot),
    });
  }

  function resetForm() {
    setResult(null);
    setServiceId("");
    setDate("");
    setName("");
    setPhone("");
    setComment("");
    setSelectedSlot("");
    setSlots([]);
    setFormError(null);
  }

  const serviceOptions = services.map((s) => ({ value: s.id, label: s.title }));
  const showSlots = Boolean(serviceId && date);

  return (
    <section id="appointment" className="scroll-mt-24 py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          title="Book an Appointment"
          description="Pick a service and date to see live availability — we'll confirm your booking instantly."
        />

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Contact info card */}
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col gap-8 rounded-3xl bg-primary p-8 text-primary-foreground shadow-elevated">
              {infoBlocks.map(({ icon: Icon, label, lines }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Icon className="size-5" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">{label}</span>
                    {lines.map((line) => (
                      <span key={line} className="text-sm text-primary-foreground/80">
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Booking form / confirmation */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
              {result ? (
                <ConfirmationView result={result} onReset={resetForm} />
              ) : catalogError ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
                  <TriangleAlert className="size-8 text-destructive" />
                  <p className="text-sm text-muted-foreground">
                    Booking is temporarily unavailable. Please call us at{" "}
                    <a href={`tel:${clinicSettings.phone}`} className="text-primary">
                      {clinicSettings.phone}
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Full Name"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      leftIcon={<Phone />}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Select
                      label="Service"
                      placeholder="Choose a service"
                      options={serviceOptions}
                      value={serviceId}
                      onValueChange={setServiceId}
                    />
                    <Input
                      label="Date"
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  {showSlots && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Available times
                      </span>
                      {slotsLoading ? (
                        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                          <Loader2 className="size-4 animate-spin" /> Checking availability…
                        </div>
                      ) : slots.length === 0 ? (
                        <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-4 py-4 text-sm text-muted-foreground">
                          <CalendarClock className="size-4" />
                          No open times on this date — try another day.
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {slots.map((slot) => {
                            const active = selectedSlot === slot.slot_start;
                            return (
                              <button
                                key={slot.slot_start}
                                type="button"
                                onClick={() => setSelectedSlot(slot.slot_start)}
                                className={cn(
                                  "rounded-lg border px-2 py-2 text-sm font-medium transition-colors",
                                  active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent"
                                )}
                              >
                                {formatTime(slot.slot_start)}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  <Textarea
                    label="Message (Optional)"
                    placeholder="Anything we should know?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  {formError && (
                    <p className="flex items-center gap-2 text-sm text-destructive">
                      <TriangleAlert className="size-4 shrink-0" />
                      {formError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    isLoading={submitting}
                    disabled={submitting}
                    leftIcon={<CalendarDays />}
                  >
                    {submitting ? "Booking…" : "Book Appointment"}
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function ConfirmationView({
  result,
  onReset,
}: {
  result: { status: string; date: string; time: string };
  onReset: () => void;
}) {
  const pending = result.status === "pending";
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
      <span
        className={cn(
          "flex size-14 items-center justify-center rounded-full",
          pending ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"
        )}
      >
        <Check className="size-7" />
      </span>
      <h3 className="text-xl font-semibold text-foreground">
        {pending ? "Request received!" : "Appointment confirmed!"}
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        {pending ? (
          <>We&apos;ll contact you shortly to confirm your booking.</>
        ) : (
          <>
            We&apos;ll see you on{" "}
            <span className="font-medium text-foreground">
              {formatDate(result.date)}
            </span>{" "}
            at{" "}
            <span className="font-medium text-foreground">{result.time}</span>.
          </>
        )}
      </p>
      <Button variant="outline" onClick={onReset}>
        Book another appointment
      </Button>
    </div>
  );
}
