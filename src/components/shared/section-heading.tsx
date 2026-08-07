"use client";

import * as React from "react";
import { Reveal } from "./motion";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  /** Heading level for correct document outline. */
  as?: "h1" | "h2" | "h3";
  /** Show a short accent underline beneath the title. */
  underline?: boolean;
  className?: string;
}

/** Eyebrow + title + description block with a scroll-in entrance. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Tag = "h2",
  underline = false,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold tracking-wide text-accent-foreground uppercase">
          {eyebrow}
        </span>
      )}
      <Tag className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
        {title}
      </Tag>
      {underline && <span className="h-1 w-12 rounded-full bg-primary" />}
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base text-pretty text-muted-foreground",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
