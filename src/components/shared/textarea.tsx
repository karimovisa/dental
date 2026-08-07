"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

/** Labeled multi-line field with hint/error states. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { className, containerClassName, id, label, error, hint, ...props },
    ref
  ) {
    const reactId = React.useId();
    const textareaId = id ?? reactId;
    const describedBy = error
      ? `${textareaId}-error`
      : hint
        ? `${textareaId}-hint`
        : undefined;

    return (
      <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
        {label && <Label htmlFor={textareaId}>{label}</Label>}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "min-h-28 w-full resize-y rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
            className
          )}
          {...props}
        />
        {error ? (
          <p id={`${textareaId}-error`} className="text-xs text-destructive">
            {error}
          </p>
        ) : hint ? (
          <p id={`${textareaId}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
