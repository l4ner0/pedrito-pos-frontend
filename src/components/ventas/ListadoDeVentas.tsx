"use client";

import { useState, useMemo } from "react";
import { Search, DollarSign, ClipboardList, Info } from "lucide-react";
import { salesData, type Sale, type SaleMethod } from "@/lib/mock-data";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { SaleDetailModal } from "./SaleDetailModal";
import { cn } from "@/lib/utils";

type Period = "today" | "week" | "month";

const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "Hoy" },
  { id: "week",  label: "Esta Semana" },
  { id: "month", label: "Este Mes" },
];

const METHOD_VARIANT: Record<SaleMethod, BadgeVariant> = {
  Efectivo: "default",
  Tarjeta:  "blue",
  Yape:     "purple",
};

export function ListadoDeVentas() {
  const [period, setPeriod] = useState<Period>("today");
  const [search, setSearch] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const allSales = salesData[period];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allSales;
    return allSales.filter(
      (s) => s.id.toLowerCase().includes(q) || s.products.toLowerCase().includes(q),
    );
  }, [allSales, search]);

  const totalRevenue = filtered.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-5 p-6">
        {/* Filters */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-end gap-8">
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Período
              </p>
              <div className="flex gap-2">
                {PERIODS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setPeriod(id)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                      period === id
                        ? "bg-brand text-white"
                        : "bg-secondary text-muted-foreground hover:bg-border",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Buscar
              </p>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ticket, producto..."
                  className="w-full rounded-xl border border-border bg-secondary py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total recaudado</p>
              <p className="text-xl font-bold text-primary">S/ {totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <ClipboardList size={18} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ventas</p>
              <p className="text-xl font-bold text-foreground">{filtered.length}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Ticket", "Fecha / Hora", "Productos", "Método", "Total", ""].map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground last:w-10 last:px-3"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((sale) => (
                <tr
                  key={sale.id}
                  onClick={() => setSelectedSale(sale)}
                  className="cursor-pointer transition-colors hover:bg-secondary/50"
                >
                  <td className="px-5 py-3.5 font-medium text-foreground">{sale.id}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{sale.datetime}</td>
                  <td className="max-w-[280px] truncate px-5 py-3.5 text-foreground">
                    {sale.products}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge label={sale.method} variant={METHOD_VARIANT[sale.method]} />
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-primary">
                    S/ {sale.total.toFixed(2)}
                  </td>
                  <td className="px-3 py-3.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedSale(sale); }}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Info size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No se encontraron ventas
            </p>
          )}
        </div>
      </div>

      <SaleDetailModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
    </div>
  );
}
