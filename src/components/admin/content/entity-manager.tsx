"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  TriangleAlert,
  ImageOff,
} from "lucide-react";
import {
  Modal,
  Button,
  Input,
  Textarea,
  Select,
  type SelectOption,
} from "@/components/shared";
import { ImageUpload } from "@/components/admin/image-upload";
import { deleteMedia } from "@/lib/supabase/storage";
import {
  createContent,
  updateContent,
  deleteContent,
  swapContentOrder,
  type ContentTable,
} from "@/app/dashboard/content/actions";
import { cn } from "@/lib/utils";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "image";
  options?: SelectOption[];
  /** Storage folder for image fields, e.g. "doctors". */
  folder?: string;
  aspectClassName?: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  fullWidth?: boolean;
  min?: number;
  max?: number;
  /** Default value for new rows. */
  defaultValue?: string | number | null;
};

export type ContentRow = {
  id: string;
  display_order: number;
} & Record<string, unknown>;

export type EntityConfig = {
  table: ContentTable;
  singular: string;
  description?: string;
  /** Which boolean column controls public visibility. */
  publishField: "is_active" | "is_published";
  /** Image URL columns to remove from storage when a row is deleted. */
  imageFields: string[];
  fields: FieldDef[];
  primary: (row: ContentRow) => string;
  secondary?: (row: ContentRow) => string | null;
  thumb?: (row: ContentRow) => string | null;
};

type FormState = Record<string, string | number | null>;

function seedForm(config: EntityConfig, row: ContentRow | null): FormState {
  const out: FormState = {};
  for (const f of config.fields) {
    if (row) {
      const v = row[f.name];
      out[f.name] =
        v === null || v === undefined
          ? f.type === "image"
            ? null
            : ""
          : (v as string | number);
    } else {
      out[f.name] = f.defaultValue ?? (f.type === "image" ? null : "");
    }
  }
  return out;
}

export function EntityManager({
  config,
  rows,
}: {
  config: EntityConfig;
  rows: ContentRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ContentRow | null>(null);
  const [form, setForm] = React.useState<FormState>({});
  const [error, setError] = React.useState<string | null>(null);
  const originalImages = React.useRef<Record<string, string | null>>({});

  const sorted = React.useMemo(
    () => [...rows].sort((a, b) => a.display_order - b.display_order),
    [rows]
  );

  function openNew() {
    setEditing(null);
    setForm(seedForm(config, null));
    originalImages.current = {};
    setError(null);
    setOpen(true);
  }

  function openEdit(row: ContentRow) {
    setEditing(row);
    setForm(seedForm(config, row));
    originalImages.current = Object.fromEntries(
      config.imageFields.map((f) => [f, (row[f] as string | null) ?? null])
    );
    setError(null);
    setOpen(true);
  }

  function setField(name: string, value: string | number | null) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function save() {
    setError(null);
    // Validate required fields.
    for (const f of config.fields) {
      if (!f.required) continue;
      const v = form[f.name];
      if (v === null || v === undefined || v === "") {
        setError(`${f.label} is required.`);
        return;
      }
    }

    // Coerce values to their column types.
    const values: Record<string, unknown> = {};
    for (const f of config.fields) {
      const v = form[f.name];
      if (f.type === "number") {
        values[f.name] = v === "" || v === null ? null : Number(v);
      } else if (f.type === "image") {
        values[f.name] = v ?? null;
      } else {
        values[f.name] = v === "" ? null : v;
      }
    }

    startTransition(async () => {
      const res = editing
        ? await updateContent(config.table, editing.id, values)
        : await createContent(config.table, values);
      if ("error" in res) {
        setError(res.error);
        return;
      }
      // Now that the change is persisted, drop any replaced image objects.
      if (editing) {
        for (const f of config.imageFields) {
          const before = originalImages.current[f];
          const after = (values[f] as string | null) ?? null;
          if (before && before !== after) await deleteMedia(before);
        }
      }
      setOpen(false);
      router.refresh();
    });
  }

  function togglePublish(row: ContentRow) {
    setBusyId(row.id);
    const next = !(row[config.publishField] as boolean);
    startTransition(async () => {
      await updateContent(config.table, row.id, { [config.publishField]: next });
      setBusyId(null);
      router.refresh();
    });
  }

  function remove(row: ContentRow) {
    if (!confirm(`Delete this ${config.singular.toLowerCase()}? This can't be undone.`))
      return;
    setBusyId(row.id);
    startTransition(async () => {
      // Remove associated storage objects first so nothing is orphaned.
      for (const f of config.imageFields) {
        await deleteMedia(row[f] as string | null);
      }
      await deleteContent(config.table, row.id);
      setBusyId(null);
      router.refresh();
    });
  }

  function move(index: number, dir: -1 | 1) {
    const a = sorted[index];
    const b = sorted[index + dir];
    if (!a || !b) return;
    setBusyId(a.id);
    startTransition(async () => {
      await swapContentOrder(
        config.table,
        { id: a.id, display_order: a.display_order },
        { id: b.id, display_order: b.display_order }
      );
      setBusyId(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          {config.description && (
            <p className="text-sm text-muted-foreground">{config.description}</p>
          )}
        </div>
        <Button size="sm" leftIcon={<Plus />} onClick={openNew}>
          Add {config.singular.toLowerCase()}
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          No {config.singular.toLowerCase()}s yet. Add your first one.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {sorted.map((row, i) => {
            const published = row[config.publishField] as boolean;
            const thumb = config.thumb?.(row) ?? null;
            const secondary = config.secondary?.(row) ?? null;
            const rowBusy = busyId === row.id && pending;
            return (
              <li
                key={row.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-border bg-card p-3",
                  !published && "opacity-60"
                )}
              >
                {config.thumb && (
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt=""
                        className="absolute inset-0 size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <ImageOff className="size-4" />
                      </div>
                    )}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {config.primary(row)}
                  </p>
                  {secondary && (
                    <p className="truncate text-xs text-muted-foreground">
                      {secondary}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0 || rowBusy}
                    aria-label="Move up"
                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === sorted.length - 1 || rowBusy}
                    aria-label="Move down"
                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublish(row)}
                    disabled={rowBusy}
                    aria-label={published ? "Unpublish" : "Publish"}
                    title={published ? "Published — click to hide" : "Hidden — click to publish"}
                    className={cn(
                      "inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted disabled:opacity-40",
                      published ? "text-emerald-600" : "text-muted-foreground"
                    )}
                  >
                    {published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    disabled={rowBusy}
                    aria-label="Edit"
                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(row)}
                    disabled={rowBusy}
                    aria-label="Delete"
                    className="inline-flex size-8 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-40"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={`${editing ? "Edit" : "Add"} ${config.singular.toLowerCase()}`}
        footer={
          <div className="flex w-full items-center justify-end gap-3">
            {error && (
              <span className="flex items-center gap-1.5 text-sm text-destructive">
                <TriangleAlert className="size-4" /> {error}
              </span>
            )}
            <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button onClick={save} isLoading={pending} disabled={pending}>
              Save
            </Button>
          </div>
        }
      >
        <div className="grid max-h-[60vh] gap-4 overflow-y-auto px-0.5 py-1 sm:grid-cols-2">
          {config.fields.map((f) => {
            const value = form[f.name];
            const spanFull = f.fullWidth || f.type === "textarea" || f.type === "image";
            return (
              <div
                key={f.name}
                className={cn(spanFull && "sm:col-span-2")}
              >
                {f.type === "image" ? (
                  <ImageUpload
                    label={f.label}
                    hint={f.hint}
                    value={(value as string | null) ?? null}
                    folder={f.folder ?? config.table}
                    aspectClassName={f.aspectClassName}
                    deleteOnReplace={false}
                    onChange={(url) => setField(f.name, url)}
                  />
                ) : f.type === "textarea" ? (
                  <Textarea
                    label={f.label}
                    hint={f.hint}
                    placeholder={f.placeholder}
                    value={(value as string) ?? ""}
                    onChange={(e) => setField(f.name, e.target.value)}
                  />
                ) : f.type === "select" ? (
                  <Select
                    label={f.label}
                    hint={f.hint}
                    placeholder={f.placeholder}
                    options={f.options ?? []}
                    value={value != null ? String(value) : ""}
                    onValueChange={(v) => setField(f.name, v)}
                  />
                ) : (
                  <Input
                    label={f.label}
                    hint={f.hint}
                    type={f.type === "number" ? "number" : "text"}
                    min={f.min}
                    max={f.max}
                    placeholder={f.placeholder}
                    value={value != null ? String(value) : ""}
                    onChange={(e) => setField(f.name, e.target.value)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
