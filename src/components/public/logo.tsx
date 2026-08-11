"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Split a brand name at the camelCase seam ("SmileCare" → "Smile" + "Care")
 *  so the wordmark can be rendered two-tone like the brand logo. */
function splitName(name: string): [string, string] {
  const camel = name.match(/^(.*?[a-z])([A-Z].*)$/);
  if (camel) return [camel[1], camel[2]];
  const space = name.indexOf(" ");
  if (space > 0) return [name.slice(0, space + 1), name.slice(space + 1)];
  return [name, ""];
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Brand lockup: the SmileCare tooth mark + two-tone wordmark and tagline.
 *  The mark is the real logo asset (public/brand/smilecare-mark.png); a custom
 *  uploaded logo from settings overrides it. `animated` fades/scales it in. */
export function Logo({
  className,
  onDark = false,
  name = "SmileCare",
  tagline = "Dental Clinic",
  logoUrl = null,
  animated = false,
}: {
  className?: string;
  onDark?: boolean;
  name?: string | null;
  tagline?: string | null;
  logoUrl?: string | null;
  animated?: boolean;
}) {
  const [head, tail] = splitName(name ?? "SmileCare");
  const src = logoUrl ?? "/brand/smilecare-mark.png";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={src}
        alt={name ?? "SmileCare"}
        className="size-10 object-contain"
        initial={animated ? { opacity: 0, scale: 0.6, rotate: -8 } : false}
        animate={animated ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
        transition={{ duration: 0.7, ease: EASE }}
      />
      <motion.span
        className="flex flex-col leading-none"
        initial={animated ? { opacity: 0, x: -6 } : false}
        animate={animated ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
      >
        <span className="text-lg font-bold tracking-tight">
          <span className={onDark ? "text-white" : "text-foreground"}>{head}</span>
          <span className="text-primary">{tail}</span>
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
      </motion.span>
    </span>
  );
}
