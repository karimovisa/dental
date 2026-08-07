"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
}

/** Labeled text field with hint/error states. Presentational (UI-only in V1). */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { className, containerClassName, id, label, error, hint, leftIcon, ...props },
    ref
  ) {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const describedBy = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    return (
      <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm text-foreground shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              error &&
                "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-destructive">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
