"use client";

import { X, Printer, CheckCircle } from "lucide-react";
import { type CartItem } from "@/store/cartStore";
import { type PaymentMethod } from "./CheckoutModal";
import { ProductAvatar } from "@/components/ui/ProductAvatar";

export interface SaleSuccessData {
  ticketId: string;
  datetime: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number | null;
  total: number;
  method: PaymentMethod;
}

interface SaleSuccessModalProps {
  open: boolean;
  data: SaleSuccessData | null;
  onClose: () => void;
}

const METHOD_LABEL: Record<PaymentMethod, string> = {
  efectivo: "Efectivo",
  yape: "Yape",
};

export function SaleSuccessModal({ open, data, onClose }: SaleSuccessModalProps) {
  if (!open || !data) return null;

  const appliedDiscount = Math.min(data.discountAmount ?? 0, data.subtotal);

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
            <p className="text-3xl font-bold tracking-wide text-brand">{data.ticketId}</p>
            <p className="mt-1 text-xs text-muted-foreground">{data.datetime}</p>
          </div>

          {/* Products */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Productos
          </p>
          <ul className="mb-4 space-y-3">
            {data.items.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3">
                <ProductAvatar src={product.image} alt={product.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {quantity} × S/ {product.price.toFixed(2)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-foreground">
                  S/ {(product.price * quantity).toFixed(2)}
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
              <span className="font-medium text-foreground">{METHOD_LABEL[data.method]}</span>
            </div>
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
