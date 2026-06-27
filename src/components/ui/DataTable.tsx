"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  header: string;
  headerClassName?: string;
  cell: (row: T) => React.ReactNode;
  cellClassName?: string | ((row: T) => string);
  skeleton?: React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  skeletonRows?: number;
  emptyMessage?: string;
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalPages: number;
  totalElements: number;
  itemLabel?: { singular: string; plural: string };
  footerExtra?: React.ReactNode;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function DataTable<T,>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  skeletonRows = 5,
  emptyMessage = "No hay datos",
  page,
  pageSize,
  pageSizeOptions,
  totalPages,
  totalElements,
  itemLabel,
  footerExtra,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<T>) {
  const count = data.length;

  function resolveCellClass(col: Column<T>, row: T): string {
    return typeof col.cellClassName === "function"
      ? col.cellClassName(row)
      : (col.cellClassName ?? "px-3 py-2.5 lg:px-4 lg:py-3");
  }

  function resolveSkeletonClass(col: Column<T>): string {
    return typeof col.cellClassName === "string"
      ? col.cellClassName
      : "px-3 py-3 lg:px-4";
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={col.headerClassName ?? "px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:px-4"}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {columns.map((col, j) => (
                    <td key={j} className={resolveSkeletonClass(col)}>
                      {col.skeleton ?? (
                        <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="border-b border-border transition-colors last:border-0 hover:bg-secondary/40"
                >
                  {columns.map((col, i) => (
                    <td key={i} className={resolveCellClass(col, row)}>
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-3 lg:px-6">
        <p className="text-xs text-muted-foreground">
          {count}
          {itemLabel && ` ${count === 1 ? itemLabel.singular : itemLabel.plural}`}
          {totalElements > count && <> de {totalElements}</>}
          {footerExtra && <> · {footerExtra}</>}
        </p>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Registros por página:
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="min-w-[60px] text-center text-xs text-muted-foreground">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
