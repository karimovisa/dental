import { cn } from "@/lib/utils";
import type { AppointmentDbStatus } from "@/types";

const config: Record<
  AppointmentDbStatus,
  { label: string; className: string; dot: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
  no_show: {
    label: "No-show",
    className: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

export function AppointmentStatusBadge({ status }: { status: string }) {
  const c = config[status as AppointmentDbStatus] ?? config.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        c.className
      )}
    >
      <span className={cn("size-1.5 rounded-full", c.dot)} aria-hidden />
      {c.label}
    </span>
  );
}
