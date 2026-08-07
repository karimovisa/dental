"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, X, CalendarOff } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Select,
  Input,
  Button,
  Badge,
} from "@/components/shared";
import {
  addScheduleWindow,
  deleteScheduleWindow,
  addOverride,
  deleteOverride,
} from "@/app/dashboard/actions";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type WeeklyRow = {
  id: string;
  weekday: number;
  start_time: string;
  end_time: string;
};
type OverrideRow = {
  id: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  is_day_off: boolean;
};

const weekdays = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 0, label: "Sunday" },
];

const hhmm = (t: string) => t.slice(0, 5);

export function AvailabilityEditor({
  doctorId,
  weekly,
  overrides,
}: {
  doctorId: string;
  weekly: WeeklyRow[];
  overrides: OverrideRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const run = (fn: () => Promise<{ ok: true } | { error: string }>) =>
    startTransition(async () => {
      setError(null);
      const res = await fn();
      if ("error" in res) setError(res.error);
      else router.refresh();
    });

  // Weekly add form
  const [wDay, setWDay] = React.useState("1");
  const [wStart, setWStart] = React.useState("09:00");
  const [wEnd, setWEnd] = React.useState("13:00");

  // Override add form
  const [oDate, setODate] = React.useState("");
  const [oDayOff, setODayOff] = React.useState(true);
  const [oStart, setOStart] = React.useState("09:00");
  const [oEnd, setOEnd] = React.useState("13:00");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Weekly schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly schedule</CardTitle>
          <CardDescription>
            Recurring working hours. Add more than one window per day for breaks.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-muted/30 p-4">
            <Select
              containerClassName="w-40"
              label="Day"
              options={weekdays.map((d) => ({ value: String(d.value), label: d.label }))}
              value={wDay}
              onValueChange={setWDay}
            />
            <Input
              containerClassName="w-32"
              label="From"
              type="time"
              value={wStart}
              onChange={(e) => setWStart(e.target.value)}
            />
            <Input
              containerClassName="w-32"
              label="To"
              type="time"
              value={wEnd}
              onChange={(e) => setWEnd(e.target.value)}
            />
            <Button
              leftIcon={<Plus />}
              disabled={pending}
              onClick={() =>
                run(() =>
                  addScheduleWindow({
                    doctorId,
                    weekday: Number(wDay),
                    start: wStart,
                    end: wEnd,
                  })
                )
              }
            >
              Add
            </Button>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {weekdays.map((day) => {
              const windows = weekly.filter((w) => w.weekday === day.value);
              return (
                <div
                  key={day.value}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <span className="w-28 text-sm font-medium text-foreground">
                    {day.label}
                  </span>
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    {windows.length === 0 ? (
                      <span className="text-sm text-muted-foreground">Closed</span>
                    ) : (
                      windows.map((w) => (
                        <span
                          key={w.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground"
                        >
                          {hhmm(w.start_time)} – {hhmm(w.end_time)}
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => run(() => deleteScheduleWindow(w.id))}
                            className="text-accent-foreground/60 hover:text-destructive"
                            aria-label="Remove window"
                          >
                            <X className="size-3.5" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Date overrides */}
      <Card>
        <CardHeader>
          <CardTitle>Date exceptions</CardTitle>
          <CardDescription>
            Override a specific date — a day off, or different hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-muted/30 p-4">
            <Input
              containerClassName="w-44"
              label="Date"
              type="date"
              min={today}
              value={oDate}
              onChange={(e) => setODate(e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">Type</span>
              <div className="flex h-11 items-center gap-1 rounded-lg border border-input p-1">
                <button
                  type="button"
                  onClick={() => setODayOff(true)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    oDayOff ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  Day off
                </button>
                <button
                  type="button"
                  onClick={() => setODayOff(false)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    !oDayOff ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  Custom hours
                </button>
              </div>
            </div>
            {!oDayOff && (
              <>
                <Input containerClassName="w-32" label="From" type="time" value={oStart} onChange={(e) => setOStart(e.target.value)} />
                <Input containerClassName="w-32" label="To" type="time" value={oEnd} onChange={(e) => setOEnd(e.target.value)} />
              </>
            )}
            <Button
              leftIcon={<Plus />}
              disabled={pending || !oDate}
              onClick={() =>
                run(() =>
                  addOverride({
                    doctorId,
                    date: oDate,
                    isDayOff: oDayOff,
                    start: oStart,
                    end: oEnd,
                  })
                )
              }
            >
              Add
            </Button>
          </div>

          {overrides.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming exceptions.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {overrides.map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {formatDate(o.date)}
                    </span>
                    {o.is_day_off ? (
                      <Badge variant="danger">
                        <CalendarOff className="size-3" /> Day off
                      </Badge>
                    ) : (
                      <Badge variant="primary">
                        {hhmm(o.start_time ?? "")} – {hhmm(o.end_time ?? "")}
                      </Badge>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => deleteOverride(o.id))}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove exception"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
