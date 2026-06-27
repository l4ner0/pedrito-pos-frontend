"use client";

import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { ProductAvatar } from "@/components/ui/ProductAvatar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { type ApiProduct } from "@/services/productService";
import { RowActions } from "./RowActions";

const CATEGORY_LABEL: Record<string, string> = {
  bebidas:   "Bebidas",
  snacks:    "Snacks",
  lacteos:   "Lácteos",
  panaderia: "Panadería",
  limpieza:  "Limpieza",
  frutas:    "Frutas",
};

const CATEGORY_VARIANT: Record<string, BadgeVariant> = {
  bebidas:   "purple",
  snacks:    "lime",
  lacteos:   "blue",
  panaderia: "amber",
  limpieza:  "teal",
  frutas:    "emerald",
};

function formatPrice(amount: number) {
  return `S/ ${amount.toFixed(2)}`;
}

interface ProductTableProps {
  products: ApiProduct[];
  categoryMap: Record<string, string>;
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalPages: number;
  totalElements: number;
  isLoading: boolean;
  onEdit: (product: ApiProduct) => void;
  onDelete: (product: ApiProduct) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function ProductTable({
  products,
  categoryMap,
  page,
  pageSize,
  pageSizeOptions,
  totalPages,
  totalElements,
  isLoading,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
}: ProductTableProps) {
  const lowStockCount = products.filter((p) => p.lowStock).length;

  const columns: Column<ApiProduct>[] = [
    {
      header: "Producto",
      headerClassName: "py-3 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:pl-6 lg:pr-4",
      cellClassName: "py-2.5 pl-4 pr-3 lg:py-3 lg:pl-6 lg:pr-4",
      skeleton: (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-md bg-secondary" />
          <div className="h-3 w-36 animate-pulse rounded bg-secondary" />
        </div>
      ),
      cell: (p) => (
        <div className="flex items-center gap-2 lg:gap-3">
          <ProductAvatar alt={p.name} />
          <span className="max-w-[120px] truncate font-medium text-foreground md:max-w-[160px] lg:max-w-[200px] xl:max-w-none">
            {p.name}
          </span>
        </div>
      ),
    },
    {
      header: "Categoría",
      cellClassName: "px-3 py-2.5 lg:px-4 lg:py-3",
      skeleton: <div className="h-5 w-16 animate-pulse rounded-full bg-secondary" />,
      cell: (p) => {
        const name = categoryMap[p.categoryId] ?? "";
        return (
          <Badge
            label={CATEGORY_LABEL[name] ?? name}
            variant={CATEGORY_VARIANT[name] ?? "default"}
          />
        );
      },
    },
    {
      header: "Stock",
      cellClassName: (p) =>
        `px-3 py-2.5 font-medium lg:px-4 lg:py-3 ${p.lowStock ? "text-warning" : "text-foreground"}`,
      skeleton: <div className="h-3 w-8 animate-pulse rounded bg-secondary" />,
      cell: (p) => p.stock,
    },
    {
      header: "Estado",
      cellClassName: "px-3 py-2.5 lg:px-4 lg:py-3",
      skeleton: <div className="h-5 w-20 animate-pulse rounded-full bg-secondary" />,
      cell: (p) => (
        <Badge
          label={p.lowStock ? "Stock bajo" : "Disponible"}
          variant={p.lowStock ? "warning" : "success"}
        />
      ),
    },
    {
      header: "Precio",
      cellClassName: "px-3 py-2.5 font-semibold text-foreground lg:px-4 lg:py-3",
      skeleton: <div className="h-3 w-16 animate-pulse rounded bg-secondary" />,
      cell: (p) => formatPrice(p.price),
    },
    {
      header: "",
      headerClassName: "py-3 pl-3 pr-4 lg:pl-4 lg:pr-6",
      cellClassName: "py-2.5 pl-3 pr-4 lg:py-3 lg:pl-4 lg:pr-6",
      skeleton: <div className="ml-auto h-6 w-12 animate-pulse rounded bg-secondary" />,
      cell: (p) => (
        <RowActions onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} />
      ),
    },
  ];

  const footerExtra = lowStockCount > 0
    ? <span className="text-warning">{lowStockCount} con stock bajo</span>
    : undefined;

  return (
    <DataTable
      columns={columns}
      data={products}
      keyExtractor={(p) => p.id}
      isLoading={isLoading}
      emptyMessage="No se encontraron productos"
      page={page}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      totalPages={totalPages}
      totalElements={totalElements}
      itemLabel={{ singular: "producto", plural: "productos" }}
      footerExtra={footerExtra}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
}
