"use client";

import { createClient } from "./client";

/** The single public bucket that holds every site image. */
export const MEDIA_BUCKET = "clinic-media";

/** Marker in a Supabase Storage public URL. Used to tell our uploaded images
 *  apart from legacy local (`/images/...`) or demo (pravatar) URLs. */
const PUBLIC_PREFIX = `/storage/v1/object/public/${MEDIA_BUCKET}/`;

/** Formats we leave untouched (canvas can't reliably rasterize them). */
const PASSTHROUGH = ["image/svg+xml", "image/gif"];

/** True when `url` points at an object in our clinic-media bucket. */
export function isMediaUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && url.includes(PUBLIC_PREFIX);
}

/** Extract the in-bucket object path from a clinic-media public URL. */
export function mediaUrlToPath(url: string): string | null {
  const i = url.indexOf(PUBLIC_PREFIX);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + PUBLIC_PREFIX.length));
}

/**
 * Downscale a large image on the client so uploaded files stay small.
 * Caps width at `maxWidth` (default 1600px) and re-encodes. PNGs keep their
 * alpha channel; everything else is compressed to JPEG. SVG/GIF pass through
 * untouched. Falls back to the original file if anything goes wrong.
 */
async function downscale(file: File, maxWidth = 1600): Promise<Blob> {
  if (PASSTHROUGH.includes(file.type) || !file.type.startsWith("image/")) {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const keepAlpha = file.type === "image/png";
    const outType = keepAlpha ? "image/png" : "image/jpeg";
    const quality = keepAlpha ? undefined : 0.85;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outType, quality)
    );
    // Only take the re-encoded result if it actually helped.
    if (blob && blob.size > 0 && blob.size < file.size + 1) return blob;
    if (blob && scale < 1) return blob; // resized — worth it even if similar size
    return blob ?? file;
  } catch {
    return file;
  }
}

/** File extension for a blob's mime type. */
function extFor(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/svg+xml") return "svg";
  if (type === "image/gif") return "gif";
  return "jpg";
}

/**
 * Upload an image to clinic-media under `folder/<uuid>.<ext>` and return its
 * public URL. Downscales large images first. The caller stores the returned URL
 * on the row; `folder` groups objects (e.g. "doctors", "certificates").
 */
export async function uploadMedia(
  file: File,
  folder: string
): Promise<{ url: string; path: string }> {
  const supabase = createClient();
  const blob = await downscale(file);
  const type = blob.type || file.type || "image/jpeg";
  const path = `${folder}/${crypto.randomUUID()}.${extFor(type)}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, blob, { contentType: type, upsert: false });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/**
 * Remove a previously uploaded object so storage doesn't fill with orphans.
 * No-op for local/demo URLs (or null) — only our own bucket objects are deleted.
 */
export async function deleteMedia(url: string | null | undefined): Promise<void> {
  if (!isMediaUrl(url)) return;
  const path = mediaUrlToPath(url);
  if (!path) return;
  const supabase = createClient();
  await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}
