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

const COLUMNS = ["Producto", "Categoría", "Stock", "Estado", "Costo", "Precio", ""];

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const lowStockCount = products.filter((p) => p.stock < LOW_STOCK_THRESHOLD).length;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground first:pl-6 last:pr-6"
              >
                {col}
              </th>
            ))}
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
                  <td className="px-4 py-3 pl-6">
                    <div className="flex items-center gap-3">
                      <ProductAvatar src={product.image} alt={product.name} />
                      <span className="font-medium text-foreground">{product.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <Badge
                      label={CATEGORY_LABEL[product.category] ?? product.category}
                      variant={CATEGORY_VARIANT[product.category] ?? "default"}
                    />
                  </td>

                  <td className={`px-4 py-3 font-medium ${isLowStock ? "text-warning" : "text-foreground"}`}>
                    {product.stock}
                  </td>

                  <td className="px-4 py-3">
                    <Badge
                      label={isLowStock ? "Stock bajo" : "Disponible"}
                      variant={isLowStock ? "warning" : "success"}
                    />
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {formatPrice(product.cost)}
                  </td>

                  <td className="px-4 py-3 font-semibold text-foreground">
                    {formatPrice(product.price)}
                  </td>

                  <td className="px-4 py-3 pr-6">
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

      <div className="border-t border-border px-6 py-3">
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
