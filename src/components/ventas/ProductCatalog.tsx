"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { type Product } from "@/lib/mock-data";
import { fetchCategories, type Category } from "@/services/categoryService";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

interface ProductCatalogProps {
  products: Product[];
}

export function ProductCatalog({ products }: ProductCatalogProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todos");
  const [categories, setCategories] = useState<Category[]>([]);
  const { addItem } = useCartStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  useEffect(() => {
    checkScroll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const categoryChips = [
    { value: "todos", label: "Todos" },
    ...categories
      .filter((c) => c.active)
      .map((c) => ({
        value: c.name,
        label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
      })),
  ];

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

      {/* Category chips carousel */}
      <div className="mb-4 flex shrink-0 items-center gap-1">
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
          disabled={!canScrollLeft}
          className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categoryChips.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1 text-sm font-medium transition-colors",
                category === value
                  ? "bg-primary text-white"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
          disabled={!canScrollRight}
          className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
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
