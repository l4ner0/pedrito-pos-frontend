import { InventoryContent } from "@/components/inventory/InventoryContent";
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
    <div className="flex-1 space-y-4 p-4 md:p-6 lg:space-y-6 lg:p-8">
      <InventoryContent products={filtered} />
    </div>
  );
}
