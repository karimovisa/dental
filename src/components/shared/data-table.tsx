"use client";

import * as React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface DataTableColumn<T> {
  /** Stable key for the column. */
  key: string;
  header: React.ReactNode;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  className?: string;
  /** Raw value used for sorting and search. */
  accessor?: (row: T) => string | number;
  /** Custom cell renderer. Falls back to the accessor value. */
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  getRowId?: (row: T, index: number) => string;
  initialSort?: { key: string; dir: "asc" | "desc" };
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

type SortState = { key: string; dir: "asc" | "desc" } | null;

/**
 * Reusable data grid with client-side search + sort. Presentational (mock) in
 * V1 — swap `data` for a query result later without touching the markup.
 */
export function DataTable<T>({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Search…",
  getRowId,
  initialSort,
  emptyMessage = "No results found.",
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortState>(initialSort ?? null);

  const alignClass = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  } as const;

  const rawValue = React.useCallback(
    (row: T, column: DataTableColumn<T>): string | number => {
      if (column.accessor) return column.accessor(row);
      const value = (row as Record<string, unknown>)[column.key];
      return typeof value === "number" ? value : String(value ?? "");
    },
    []
  );

  const filtered = React.useMemo(() => {
    if (!query.trim()) return data;
    const q = query.trim().toLowerCase();
    return data.filter((row) =>
      columns.some((column) =>
        String(rawValue(row, column)).toLowerCase().includes(q)
      )
    );
  }, [data, columns, query, rawValue]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const column = columns.find((c) => c.key === sort.key);
    if (!column) return filtered;
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = rawValue(a, column);
      const bv = rawValue(b, column);
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * factor;
      }
      return String(av).localeCompare(String(bv)) * factor;
    });
  }, [filtered, sort, columns, rawValue]);

  function toggleSort(key: string) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {searchable && (
        <div className="max-w-xs">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            leftIcon={<Search />}
            aria-label="Search table"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {columns.map((column) => {
                const active = sort?.key === column.key;
                return (
                  <th
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
                      alignClass[column.align ?? "left"],
                      column.className
                    )}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className={cn(
                          "inline-flex items-center gap-1.5 transition-colors hover:text-foreground",
                          active && "text-foreground"
                        )}
                      >
                        {column.header}
                        {active ? (
                          sort?.dir === "asc" ? (
                            <ArrowUp className="size-3.5" />
                          ) : (
                            <ArrowDown className="size-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="size-3.5 opacity-50" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((row, index) => (
                <tr
                  key={getRowId ? getRowId(row, index) : index}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/50"
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 py-3 text-foreground",
                        alignClass[column.align ?? "left"],
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(row)
                        : String(rawValue(row, column))}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
