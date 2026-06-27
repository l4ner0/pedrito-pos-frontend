"use client";

import { X } from "lucide-react";
import { type SaleResponse, type SalePaymentMethod, type SaleStatus } from "@/services/saleService";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";

const METHOD_LABEL: Record<SalePaymentMethod, string> = {
  EFECTIVO: "Efectivo",
  YAPE: "Yape",
};

const STATUS_VARIANT: Record<SaleStatus, BadgeVariant> = {
  ACTIVE: "success",
  CANCELLED: "danger",
};

const STATUS_LABEL: Record<SaleStatus, string> = {
  ACTIVE: "Activa",
  CANCELLED: "Cancelada",
};

function formatDatetime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${date} · ${time}`;
}

interface SaleDetailModalProps {
  sale: SaleResponse | null;
  onClose: () => void;
  persistent?: boolean;
}

export function SaleDetailModal({ sale, onClose, persistent = false }: SaleDetailModalProps) {
  if (!sale) return null;

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
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Detalle de venta</h2>
            <Badge label={STATUS_LABEL[sale.status]} variant={STATUS_VARIANT[sale.status]} />
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          {sale.ticketCode} · {formatDatetime(sale.createdAt)}
        </p>

        {/* Product items */}
        <div className="mb-5 divide-y divide-border">
          {sale.items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 py-3.5 first:pt-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} × S/ {item.unitPrice.toFixed(2)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium text-foreground">
                S/ {item.lineTotal.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-xl bg-secondary px-4 py-3">
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">S/ {sale.subtotal.toFixed(2)}</span>
          </div>
          {sale.discountAmount > 0 && (
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">Descuento</span>
              <span className="text-success">-S/ {sale.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-border" />
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-primary">S/ {sale.total.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-muted-foreground">Método de pago</span>
            <span className="font-medium text-foreground">{METHOD_LABEL[sale.paymentMethod]}</span>
          </div>
          {sale.changeGiven > 0 && (
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">Vuelto</span>
              <span className="font-medium text-success">S/ {sale.changeGiven.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
