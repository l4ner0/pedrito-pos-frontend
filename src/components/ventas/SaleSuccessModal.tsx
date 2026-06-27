"use client";

import { X, Printer, CheckCircle } from "lucide-react";
import { type SaleResponse, type SalePaymentMethod } from "@/services/saleService";
import { ProductAvatar } from "@/components/ui/ProductAvatar";

export type SaleSuccessData = Pick<
  SaleResponse,
  "ticketCode" | "subtotal" | "discountAmount" | "total" | "paymentMethod" | "amountReceived" | "changeGiven" | "items" | "createdAt"
>;

interface SaleSuccessModalProps {
  open: boolean;
  data: SaleSuccessData | null;
  onClose: () => void;
}

const METHOD_LABEL: Record<SalePaymentMethod, string> = {
  EFECTIVO: "Efectivo",
  YAPE: "Yape",
};

function formatDatetime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${date} · ${time}`;
}

export function SaleSuccessModal({ open, data, onClose }: SaleSuccessModalProps) {
  if (!open || !data) return null;

  const appliedDiscount = Math.min(data.discountAmount, data.subtotal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-card shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X size={18} />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="mb-5 flex flex-col items-center gap-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <CheckCircle size={28} className="text-success" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">¡Pago confirmado!</h2>
            <p className="text-sm text-muted-foreground">Venta registrada exitosamente</p>
          </div>

          {/* Ticket number */}
          <div className="mb-5 rounded-xl bg-brand/10 px-4 py-4 text-center">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand/60">
              N° de Ticket
            </p>
            <p className="text-3xl font-bold tracking-wide text-brand">{data.ticketCode}</p>
            <p className="mt-1 text-xs text-muted-foreground">{formatDatetime(data.createdAt)}</p>
          </div>

          {/* Products */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Productos
          </p>
          <ul className="mb-4 space-y-3">
            {data.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <ProductAvatar alt={item.productName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × S/ {item.unitPrice.toFixed(2)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-foreground">
                  S/ {item.lineTotal.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mb-4 border-t border-dashed border-border" />

          {/* Totals */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">S/ {data.subtotal.toFixed(2)}</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Descuento</span>
                <span className="text-success">-S/ {appliedDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Total pagado</span>
              <span className="text-base font-bold text-primary">S/ {data.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Método de pago</span>
              <span className="font-medium text-foreground">{METHOD_LABEL[data.paymentMethod]}</span>
            </div>
            {data.changeGiven > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Vuelto</span>
                <span className="font-medium text-success">S/ {data.changeGiven.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="mb-5 border-t border-dashed border-border" />

          {/* Store footer */}
          <div className="mb-5 text-center">
            <p className="text-sm font-semibold text-foreground">MiniMarket</p>
            <p className="text-xs text-muted-foreground">Gracias por su compra</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Cerrar
            </button>
            <button
              onClick={() => window.print()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              <Printer size={15} />
              Imprimir ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
