"use client";

import * as React from "react";
import { ImagePlus, Loader2, Upload, Trash2, TriangleAlert } from "lucide-react";
import { uploadMedia, deleteMedia } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  /** Current image URL (persisted value), or null when none. */
  value: string | null;
  /** Called with the new public URL, or null when removed. */
  onChange: (url: string | null) => void;
  /** Bucket folder to group objects, e.g. "doctors", "certificates". */
  folder: string;
  label?: string;
  hint?: string;
  /** Tailwind aspect class for the preview box. Default square. */
  aspectClassName?: string;
  className?: string;
  /** Delete the replaced object immediately (default). Set false when a parent
   *  form defers cleanup to save-time so a cancelled edit can't orphan a live
   *  image. Removing the image always deletes the object. */
  deleteOnReplace?: boolean;
};

/**
 * Image picker for the dashboard: uploads to clinic-media (downscaling large
 * files), shows a preview, and — on replace or remove — deletes the previous
 * object so storage never fills with orphans. Presentational elsewhere; the
 * upload/delete side effects live in `@/lib/supabase/storage`.
 */
export function ImageUpload({
  value,
  onChange,
  folder,
  label,
  hint,
  aspectClassName = "aspect-square",
  className,
  deleteOnReplace = true,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    const previous = value;
    try {
      const { url } = await uploadMedia(file, folder);
      onChange(url);
      // Remove the object we just replaced (no-op for local/demo URLs). Skipped
      // when a parent defers cleanup to save-time.
      if (deleteOnReplace && previous && previous !== url) {
        await deleteMedia(previous);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    setError(null);
    const previous = value;
    onChange(null);
    if (previous) {
      setBusy(true);
      try {
        await deleteMedia(previous);
      } finally {
        setBusy(false);
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "relative w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-muted",
            aspectClassName
          )}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <ImagePlus className="size-6" />
            </div>
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              <Upload className="size-4" />
              {value ? "Replace" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                Remove
              </button>
            )}
          </div>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          {error && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <TriangleAlert className="size-3.5" /> {error}
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
