import { DentalIcon } from "@/components/shared";
import { clinicSettings } from "@/data";
import { cn } from "@/lib/utils";

/** Brand lockup: dental mark + clinic name / tagline. Used in header + footer. */
export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
        <DentalIcon name="tooth" className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-lg font-bold tracking-tight",
            onDark ? "text-white" : "text-foreground"
          )}
        >
          {clinicSettings.name}
        </span>
        <span
          className={cn(
            "text-[10px] font-medium tracking-[0.18em] uppercase",
            onDark ? "text-white/60" : "text-muted-foreground"
          )}
        >
          {clinicSettings.tagline}
        </span>
      </span>
    </span>
  );
}
