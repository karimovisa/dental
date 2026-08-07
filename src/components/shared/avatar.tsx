import * as React from "react";
import {
  Avatar as AvatarRoot,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-lg",
} as const;

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: keyof typeof sizeClasses;
  className?: string;
}

/** Circular avatar with an automatic initials fallback when no image loads. */
export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  return (
    <AvatarRoot className={cn(sizeClasses[size], className)}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback className="bg-accent font-medium text-accent-foreground">
        {getInitials(name)}
      </AvatarFallback>
    </AvatarRoot>
  );
}
