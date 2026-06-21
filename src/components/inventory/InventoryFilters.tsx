"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Plus } from "lucide-react";
import { PeriodFilter } from "@/components/ui/PeriodFilter";

const CATEGORY_OPTIONS = [
  { value: "todos", label: "Todos" },
  { value: "bebidas", label: "Bebidas" },
  { value: "snacks", label: "Snacks" },
  { value: "lacteos", label: "Lácteos" },
  { value: "panaderia", label: "Panadería" },
  { value: "limpieza", label: "Limpieza" },
  { value: "frutas", label: "Frutas" },
];

export function InventoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");
  const categoria = searchParams.get("categoria") ?? "todos";

  function commitSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    router.replace(`?${params.toString()}`);
  }

  function handleCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "todos") params.delete("categoria");
    else params.set("categoria", value);
    router.replace(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onBlur={(e) => commitSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commitSearch(e.currentTarget.value)}
          className="w-64 rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <PeriodFilter
        options={CATEGORY_OPTIONS}
        value={categoria}
        onChange={handleCategory}
        icon={Filter}
      />

      <div className="flex-1" />

      <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90">
        <Plus size={15} />
        Agregar producto
      </button>
    </div>
  );
}
