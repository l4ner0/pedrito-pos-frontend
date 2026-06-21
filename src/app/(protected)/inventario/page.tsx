import { Suspense } from "react";
import { Bell } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { ProductTable } from "@/components/inventory/ProductTable";
import { products, type ProductCategory } from "@/lib/mock-data";

export default async function InventarioPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const { q = "", categoria = "todos" } = await searchParams;

  const filtered = products.filter((p) => {
    const matchesSearch = !q || p.name.toLowerCase().includes(q.toLowerCase());
    const matchesCategory = categoria === "todos" || p.category === (categoria as ProductCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:h-16 lg:px-8">
        <h1 className="text-base font-semibold lg:text-lg">Inventario</h1>
        <div className="flex items-center gap-3 lg:gap-4">
          <button className="relative text-muted-foreground transition-colors hover:text-foreground">
            <Bell size={19} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
          </button>
          <UserMenu />
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-6 lg:space-y-6 lg:p-8">
        <Suspense>
          <InventoryFilters />
        </Suspense>
        <ProductTable products={filtered} />
      </div>
    </div>
  );
}
