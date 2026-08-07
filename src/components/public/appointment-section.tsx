"use client";

import * as React from "react";
import { Phone, MapPin, Clock, CalendarDays } from "lucide-react";
import {
  Container,
  SectionHeading,
  Input,
  Textarea,
  Select,
  Button,
  Reveal,
} from "@/components/shared";
import { services, clinicSettings } from "@/data";
import type { WorkingHours } from "@/types";

const serviceOptions = services.map((service) => ({
  value: service.id,
  label: service.title,
}));

function hoursFor(day: WorkingHours["day"]): string {
  const entry = clinicSettings.working_hours.find((h) => h.day === day);
  if (!entry || entry.is_closed) return "Closed";
  return `${entry.opens} – ${entry.closes}`;
}

const infoBlocks = [
  {
    icon: Phone,
    label: "Call Us",
    lines: [clinicSettings.phone],
  },
  {
    icon: MapPin,
    label: "Our Location",
    lines: clinicSettings.address.split(", "),
  },
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

/** Booking section: dark contact card + appointment form (UI-only in V1). */
export function AppointmentSection() {
  const [service, setService] = React.useState("");

  return (
    <section id="appointment" className="scroll-mt-24 py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          title="Book an Appointment"
          description="Fill out the form and we'll contact you shortly to confirm."
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

          {/* Booking form */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex h-full flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Full Name" placeholder="Your full name" />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  leftIcon={<Phone />}
                />
              </div>

              <Select
                label="Select Service"
                placeholder="Choose a service"
                options={serviceOptions}
                value={service}
                onValueChange={setService}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Select Date" type="date" />
                <Input label="Select Time" type="time" />
              </div>

              <Textarea label="Message (Optional)" placeholder="Write your message…" />

              <Button type="submit" size="lg" fullWidth leftIcon={<CalendarDays />}>
                Book Appointment
              </Button>
            </form>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
