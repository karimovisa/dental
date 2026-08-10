"use client";

import * as React from "react";
import Link from "next/link";
import {
  Phone,
  MapPin,
  Clock,
  CalendarDays,
  Check,
  Loader2,
  TriangleAlert,
  CalendarClock,
  ArrowLeft,
  ExternalLink,
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
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import { localized } from "@/lib/i18n-content";
import { normalizeUzPhone, formatUzPhone } from "@/lib/phone";
import type {
  DoctorRow,
  ServiceRow,
  AvailableSlot,
  WorkingHours,
  ClinicSettingsRow,
} from "@/types";
import { cn } from "@/lib/utils";

const formatTime = (s: string) => s.slice(0, 5);

type Translator = ReturnType<typeof useTranslations>;

/** Build the "Call / Location / Hours" info column from live clinic settings. */
function buildInfoBlocks(settings: ClinicSettingsRow | null, t: Translator) {
  const hours = Array.isArray(settings?.working_hours)
    ? (settings!.working_hours as unknown as WorkingHours[])
    : [];
  const hoursFor = (day: WorkingHours["day"]): string => {
    const entry = hours.find((h) => h.day === day);
    if (!entry || entry.is_closed) return t("closed");
    return `${entry.opens} – ${entry.closes}`;
  };
  return [
    { icon: Phone, label: t("callUs"), lines: [settings?.phone ?? ""].filter(Boolean) },
    {
      icon: MapPin,
      label: t("location"),
      lines: (settings?.address ?? "").split(", ").filter(Boolean),
    },
    {
      icon: Clock,
      label: t("hours"),
      lines: [
        `${t("monFri")}: ${hoursFor("mon")}`,
        `${t("sat")}: ${hoursFor("sat")}`,
        `${t("sun")}: ${hoursFor("sun")}`,
      ],
    },
  ];
}

export function AppointmentSection({
  settings,
}: {
  settings: ClinicSettingsRow | null;
}) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const infoBlocks = buildInfoBlocks(settings, t);
  const supabase = React.useMemo(() => createClient(), []);

  const [doctor, setDoctor] = React.useState<DoctorRow | null>(null);
  const [services, setServices] = React.useState<ServiceRow[]>([]);
  const [catalogError, setCatalogError] = React.useState(false);

  const [serviceId, setServiceId] = React.useState("");
  const [date, setDate] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [comment, setComment] = React.useState("");

  const [slots, setSlots] = React.useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = React.useState("");
  const [slotsLoading, setSlotsLoading] = React.useState(false);

  const [confirming, setConfirming] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{
    id: string;
    status: string;
    date: string;
    time: string;
  } | null>(null);

  const today = React.useMemo(() => new Date().toISOString().slice(0, 10), []);
  const normalizedPhone = normalizeUzPhone(phone);

  React.useEffect(() => {
    let active = true;
    (async () => {
      const [doctorsRes, servicesRes] = await Promise.all([
        supabase.from("doctors").select("*").eq("is_active", true).order("display_order").limit(1),
        supabase.from("services").select("*").eq("is_published", true).order("display_order"),
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

  React.useEffect(() => {
    setSelectedSlot("");
    setConfirming(false);
    fetchSlots();
  }, [fetchSlots]);

  function review(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!serviceId || !date || !selectedSlot || !name.trim()) {
      setFormError(t("missingFields"));
      return;
    }
    if (!normalizedPhone) {
      setFormError(t("phoneError"));
      return;
    }
    setConfirming(true);
  }

  async function confirmBooking() {
    if (!doctor || !normalizedPhone) return;
    setSubmitting(true);
    setFormError(null);
    const { data, error } = await supabase.rpc("create_booking", {
      p_doctor_id: doctor.id,
      p_service_id: serviceId,
      p_patient_name: name.trim(),
      p_patient_phone: normalizedPhone,
      p_date: date,
      p_start: selectedSlot,
      p_comment: comment.trim() || undefined,
    });
    setSubmitting(false);

    if (error) {
      setConfirming(false);
      if (/just taken|no longer available/i.test(error.message)) {
        setFormError(t("taken"));
        setSelectedSlot("");
        fetchSlots();
      } else if (/valid Uzbek phone/i.test(error.message)) {
        setFormError(t("phoneError"));
      } else {
        setFormError(t("genericError"));
      }
      return;
    }

    const row = data?.[0];
    setResult({
      id: row?.appointment_id ?? "",
      status: row?.status ?? "confirmed",
      date,
      time: formatTime(selectedSlot),
    });
  }

  function resetForm() {
    setResult(null);
    setConfirming(false);
    setServiceId("");
    setDate("");
    setName("");
    setPhone("");
    setComment("");
    setSelectedSlot("");
    setSlots([]);
    setFormError(null);
  }

  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: localized(locale, s.title, s.title_ru, s.title_uz),
  }));
  const serviceTitle = (() => {
    const s = services.find((x) => x.id === serviceId);
    return s ? localized(locale, s.title, s.title_ru, s.title_uz) : "";
  })();
  const showSlots = Boolean(serviceId && date);

  return (
    <section id="appointment" className="scroll-mt-24 py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading title={t("title")} description={t("description")} />

        <div className="grid gap-6 lg:grid-cols-5">
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

          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
              {result ? (
                <ConfirmationView result={result} onReset={resetForm} />
              ) : catalogError ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
                  <TriangleAlert className="size-8 text-destructive" />
                  <p className="text-sm text-muted-foreground">
                    {t("unavailable")}{" "}
                    <a href={`tel:${settings?.phone ?? ""}`} className="text-primary">
                      {settings?.phone ?? ""}
                    </a>
                    .
                  </p>
                </div>
              ) : confirming ? (
                <ConfirmStep
                  serviceTitle={serviceTitle}
                  date={date}
                  time={formatTime(selectedSlot)}
                  name={name}
                  phone={formatUzPhone(normalizedPhone!)}
                  submitting={submitting}
                  error={formError}
                  onBack={() => setConfirming(false)}
                  onConfirm={confirmBooking}
                />
              ) : (
                <form onSubmit={review} className="flex flex-col gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label={t("fullName")} placeholder={t("fullNamePh")} value={name} onChange={(e) => setName(e.target.value)} />
                    <Input
                      label={t("phone")}
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      leftIcon={<Phone />}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={phone && !normalizedPhone ? t("phoneInvalid") : undefined}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Select
                      label={t("service")}
                      placeholder={t("servicePh")}
                      options={serviceOptions}
                      value={serviceId}
                      onValueChange={setServiceId}
                    />
                    <Input label={t("date")} type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>

                  {showSlots && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-foreground">{t("availableTimes")}</span>
                      {slotsLoading ? (
                        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                          <Loader2 className="size-4 animate-spin" /> {t("checking")}
                        </div>
                      ) : slots.length === 0 ? (
                        <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-4 py-4 text-sm text-muted-foreground">
                          <CalendarClock className="size-4" />
                          {t("noTimes")}
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

                  <Textarea label={t("message")} placeholder={t("messagePh")} value={comment} onChange={(e) => setComment(e.target.value)} />

                  {formError && (
                    <p className="flex items-center gap-2 text-sm text-destructive">
                      <TriangleAlert className="size-4 shrink-0" />
                      {formError}
                    </p>
                  )}

                  <Button type="submit" size="lg" fullWidth leftIcon={<CalendarDays />}>
                    {t("review")}
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

function ConfirmStep({
  serviceTitle,
  date,
  time,
  name,
  phone,
  submitting,
  error,
  onBack,
  onConfirm,
}: {
  serviceTitle: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("booking");
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-semibold text-foreground">{t("reviewTitle")}</h3>
      <dl className="flex flex-col divide-y divide-border rounded-xl border border-border">
        {[
          [t("name"), name],
          [t("service"), serviceTitle],
          [t("date"), formatDate(date)],
          [t("time"), time],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-3 text-sm">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-medium text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="rounded-xl bg-accent px-4 py-3 text-sm">
        <p className="text-accent-foreground">{t("numberOk")}</p>
        <p className="mt-1 text-lg font-semibold tracking-wide text-foreground">{phone}</p>
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <TriangleAlert className="size-4 shrink-0" />
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} disabled={submitting} leftIcon={<ArrowLeft />}>
          {t("edit")}
        </Button>
        <Button fullWidth onClick={onConfirm} isLoading={submitting} disabled={submitting} leftIcon={<Check />}>
          {submitting ? t("bookingNow") : t("confirm")}
        </Button>
      </div>
    </div>
  );
}

function ConfirmationView({
  result,
  onReset,
}: {
  result: { id: string; status: string; date: string; time: string };
  onReset: () => void;
}) {
  const t = useTranslations("booking");
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
        {pending ? t("requestReceived") : t("confirmedTitle")}
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        {pending
          ? t("pendingMsg")
          : t("seeYou", { date: formatDate(result.date), time: result.time })}
      </p>

      {result.id && (
        <Link
          href={`/booking/${result.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          {t("viewChange")}
          <ExternalLink className="size-3.5" />
        </Link>
      )}

      <Button variant="outline" onClick={onReset}>
        {t("bookAnother")}
      </Button>
    </div>
  );
}
