"use client";

import * as React from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface LightboxImageProps {
  src: string;
  alt: string;
  /** Aspect-ratio utility for the thumbnail, e.g. "aspect-[4/3]". */
  aspect?: string;
  sizes?: string;
  caption?: string;
  className?: string;
}

/**
 * Thumbnail that opens a full-size lightbox on click. Reusable in galleries,
 * certificates, and before/after grids.
 */
export function LightboxImage({
  src,
  alt,
  aspect = "aspect-[4/3]",
  sizes = "(max-width: 768px) 100vw, 33vw",
  caption,
  className,
}: LightboxImageProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group relative block w-full overflow-hidden rounded-xl border border-border bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          aspect,
          className
        )}
        aria-label={`View ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/20">
          <Expand className="size-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          {caption && (
            <p className="mt-3 text-center text-sm text-white/90">{caption}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
