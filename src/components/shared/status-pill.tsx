import * as React from "react";
import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/types";

const statusConfig: Record<
  AppointmentStatus,
  { label: string; pill: string; dot: string }
> = {
  upcoming: {
    label: "Upcoming",
    pill: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  completed: {
    label: "Completed",
    pill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    pill: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
};

export interface StatusPillProps extends React.ComponentProps<"span"> {
  status: AppointmentStatus;
  /** Override the default label text. */
  label?: string;
}

/** Appointment status indicator with a colored dot. */
export function StatusPill({
  status,
  label,
  className,
  ...props
}: StatusPillProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.pill,
        className
      )}
      {...props}
    >
      <span className={cn("size-1.5 rounded-full", config.dot)} aria-hidden />
      {label ?? config.label}
    </span>
  );
}
