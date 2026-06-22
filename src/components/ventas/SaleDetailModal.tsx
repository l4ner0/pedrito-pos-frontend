"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Sale, type SaleMethod } from "@/lib/mock-data";

const METHOD_COLOR: Record<SaleMethod, string> = {
  Efectivo: "text-primary",
  Tarjeta:  "text-sky-600",
  Yape:     "text-violet-600",
};

interface SaleDetailModalProps {
  sale: Sale | null;
  onClose: () => void;
  persistent?: boolean;
}

export function SaleDetailModal({ sale, onClose, persistent = false }: SaleDetailModalProps) {
  if (!sale) return null;

  const subtotal = sale.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={persistent ? undefined : onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-1 flex items-start justify-between">
          <h2 className="text-lg font-semibold text-foreground">Detalle de venta</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          {sale.id} · {sale.datetime}
        </p>

        {/* Product items */}
        <div className="mb-5 divide-y divide-border">
          {sale.items.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 py-3.5 first:pt-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.qty} × S/ {item.unitPrice.toFixed(2)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium text-foreground">
                S/ {(item.qty * item.unitPrice).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-xl bg-secondary px-4 py-3">
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">S/ {subtotal.toFixed(2)}</span>
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-primary">S/ {sale.total.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-muted-foreground">Método de pago</span>
            <span className={cn("font-medium", METHOD_COLOR[sale.method])}>
              {sale.method}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
