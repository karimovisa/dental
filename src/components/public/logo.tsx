import { DentalIcon } from "@/components/shared";
import { cn } from "@/lib/utils";

/** Brand lockup: dental mark (or uploaded logo) + clinic name / tagline.
 *  Used in header + footer. Brand values come from clinic settings; sensible
 *  defaults keep it rendering even before settings load. */
export function Logo({
  className,
  onDark = false,
  name = "SmileCare",
  tagline = "Dental Clinic",
  logoUrl = null,
}: {
  className?: string;
  onDark?: boolean;
  name?: string | null;
  tagline?: string | null;
  logoUrl?: string | null;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={name ?? "Logo"}
          className="size-9 rounded-lg object-cover shadow-soft"
        />
      ) : (
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
          <DentalIcon name="tooth" className="size-5" />
        </span>
      )}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-lg font-bold tracking-tight",
            onDark ? "text-white" : "text-foreground"
          )}
        >
          {name ?? "SmileCare"}
        </span>
        {tagline && (
          <span
            className={cn(
              "text-[10px] font-medium tracking-[0.18em] uppercase",
              onDark ? "text-white/60" : "text-muted-foreground"
            )}
          >
            {tagline}
          </span>
        )}
      </span>
    </span>
  );
}
