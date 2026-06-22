"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { type Product, type ProductCategory } from "@/lib/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: ProductCategory | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "bebidas", label: "Bebidas" },
  { value: "snacks", label: "Snacks" },
  { value: "lacteos", label: "Lácteos" },
  { value: "panaderia", label: "Panadería" },
  { value: "limpieza", label: "Limpieza" },
  { value: "frutas", label: "Frutas" },
];

interface ProductCatalogProps {
  products: Product[];
}

export function ProductCatalog({ products }: ProductCatalogProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "todos">("todos");
  const { addItem } = useCartStore();

  const filtered = products.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "todos" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background px-6 py-4">
      {/* Search */}
      <div className="relative mb-4 shrink-0">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>

      {/* Category chips */}
      <div className="mb-4 flex shrink-0 flex-wrap gap-2">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            className={cn(
              "rounded-full px-3.5 py-1 text-sm font-medium transition-colors",
              category === value
                ? "bg-primary text-white"
                : "border border-border text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="overflow-y-auto">
        <div className="grid grid-cols-4 gap-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onClick={addItem} />
          ))}
        </div>
      </div>
    </div>
  );
}
