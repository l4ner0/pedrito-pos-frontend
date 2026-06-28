"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { fetchCategories, type Category } from "@/services/categoryService";
import { fetchProducts, type ApiProduct } from "@/services/productService";
import { fetchTopProducts } from "@/services/saleService";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export function ProductCatalog() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("todos");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { addItem } = useCartStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    if (page === 1) setIsLoading(true);
    else setIsLoadingMore(true);
    const hasFilters = debouncedSearch !== "" || category !== "todos";
    const request = hasFilters
      ? fetchProducts(page, PAGE_SIZE, controller.signal, {
          name: debouncedSearch || undefined,
          categoryName: category !== "todos" ? category : undefined,
        })
      : fetchTopProducts(page, PAGE_SIZE, controller.signal);
    request
      .then((data) => {
        setProducts((prev) => page === 1 ? data.content : [...prev, ...data.content]);
        setHasMore(page < data.totalPages);
        setIsLoading(false);
        setIsLoadingMore(false);
      })
      .catch((err: unknown) => {
        if ((err as Error).name !== "AbortError") {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      });
    return () => controller.abort();
  }, [page, debouncedSearch, category]);

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

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background px-6 py-4">
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
          className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categoryChips.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setCategory(value); setPage(1); }}
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
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2.5 lg:grid-cols-4 lg:gap-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 rounded-xl bg-card p-3 shadow-sm lg:p-4">
                <div className="h-14 w-14 animate-pulse rounded-full bg-secondary" />
                <div className="h-3 w-20 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-12 animate-pulse rounded bg-secondary" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No se encontraron productos</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2.5 lg:grid-cols-4 lg:gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onClick={addItem} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-4 flex justify-center pb-2">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isLoadingMore}
                  className="flex items-center gap-1 text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-primary disabled:opacity-50"
                >
                  <ChevronDown size={14} />
                  {isLoadingMore ? "Cargando..." : "Ver más"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
