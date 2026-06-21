import { Pencil, Trash2 } from "lucide-react";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { ProductAvatar } from "@/components/ui/ProductAvatar";
import { type Product, LOW_STOCK_THRESHOLD } from "@/lib/mock-data";

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
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const lowStockCount = products.filter((p) => p.stock < LOW_STOCK_THRESHOLD).length;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:pl-6 lg:pr-4">
                Producto
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:px-4">
                Categoría
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:px-4">
                Stock
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:px-4">
                Estado
              </th>
              <th className="hidden px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground xl:table-cell xl:px-4">
                Costo
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:px-4">
                Precio
              </th>
              <th className="py-3 pl-3 pr-4 lg:pl-4 lg:pr-6" />
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isLowStock = product.stock < LOW_STOCK_THRESHOLD;
                return (
                  <tr
                    key={product.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-secondary/40"
                  >
                    <td className="py-2.5 pl-4 pr-3 lg:py-3 lg:pl-6 lg:pr-4">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <ProductAvatar src={product.image} alt={product.name} />
                        <span className="max-w-[120px] truncate font-medium text-foreground md:max-w-[160px] lg:max-w-[200px] xl:max-w-none">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-2.5 lg:px-4 lg:py-3">
                      <Badge
                        label={CATEGORY_LABEL[product.category] ?? product.category}
                        variant={CATEGORY_VARIANT[product.category] ?? "default"}
                      />
                    </td>

                    <td className={`px-3 py-2.5 font-medium lg:px-4 lg:py-3 ${isLowStock ? "text-warning" : "text-foreground"}`}>
                      {product.stock}
                    </td>

                    <td className="px-3 py-2.5 lg:px-4 lg:py-3">
                      <Badge
                        label={isLowStock ? "Stock bajo" : "Disponible"}
                        variant={isLowStock ? "warning" : "success"}
                      />
                    </td>

                    <td className="hidden px-3 py-2.5 text-muted-foreground xl:table-cell xl:px-4 xl:py-3">
                      {formatPrice(product.cost)}
                    </td>

                    <td className="px-3 py-2.5 font-semibold text-foreground lg:px-4 lg:py-3">
                      {formatPrice(product.price)}
                    </td>

                    <td className="py-2.5 pl-3 pr-4 lg:py-3 lg:pl-4 lg:pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border px-4 py-3 lg:px-6">
        <p className="text-xs text-muted-foreground">
          {products.length} {products.length === 1 ? "producto" : "productos"}
          {lowStockCount > 0 && (
            <>
              {" · "}
              <span className="text-warning">{lowStockCount} con stock bajo</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
