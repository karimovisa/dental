"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
}

/**
 * Controlled select built on the Base UI primitive. The trigger label is
 * derived from `value`, so it renders identically regardless of internal state.
 */
export function Select({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  label,
  error,
  hint,
  id,
  disabled,
  className,
  containerClassName,
}: SelectProps) {
  const reactId = React.useId();
  const selectId = id ?? reactId;
  const selected = options.find((o) => o.value === value);

  return (
    <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
      {label && <Label htmlFor={selectId}>{label}</Label>}
      <SelectRoot
        value={value}
        onValueChange={(next) => onValueChange?.(next ?? "")}
      >
        <SelectTrigger
          id={selectId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          className={cn(
            "h-11 w-full",
            error &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
            className
          )}
        >
          {selected ? (
            <span>{selected.label}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
