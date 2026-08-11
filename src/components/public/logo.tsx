"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Split a brand name at the camelCase seam ("SmileCare" → "Smile" + "Care")
 *  so the wordmark can be rendered two-tone like the brand board. */
function splitName(name: string): [string, string] {
  const camel = name.match(/^(.*?[a-z])([A-Z].*)$/);
  if (camel) return [camel[1], camel[2]];
  const space = name.indexOf(" ");
  if (space > 0) return [name.slice(0, space + 1), name.slice(space + 1)];
  return [name, ""];
}

/** The S → Tooth brand mark: a rounded tooth outline with an integrated "S",
 *  stroked in the brand gradient. Draws itself on when `animated`. */
function ToothMark({
  animated,
  className,
}: {
  animated: boolean;
  className?: string;
}) {
  const draw = (delay: number) =>
    animated
      ? {
          initial: { pathLength: 0, opacity: 0.3 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const },
        }
      : {};

  return (
    <svg
      viewBox="0 0 140 180"
      className={cn("h-9 w-auto", className)}
      fill="none"
      stroke="url(#smilecare-grad)"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <defs>
        <linearGradient id="smilecare-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      <motion.path
        {...draw(0.45)}
        strokeWidth={8}
        d="M70,18 C50,6 26,10 18,30 C10,48 14,68 18,88 C22,108 20,150 34,166 C45,178 51,140 59,127 C64,119 76,119 81,127 C89,140 95,178 106,166 C120,150 118,108 122,88 C126,68 130,48 122,30 C114,10 90,6 70,18 Z"
      />
      <motion.path
        {...draw(0)}
        strokeWidth={10}
        d="M92,52 C66,50 56,74 76,86 C96,98 84,122 58,120"
      />
    </svg>
  );
}

/** Brand lockup: S→Tooth mark (or an uploaded logo) + two-tone wordmark and
 *  tagline. Used in the header, footer and hero. */
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
        <ToothMark animated={animated} />
      )}
      <motion.span
        className="flex flex-col leading-none"
        initial={animated ? { opacity: 0, x: -6 } : false}
        animate={animated ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.5, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
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
