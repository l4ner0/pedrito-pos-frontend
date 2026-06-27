"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { createSale, type SalePaymentMethod } from "@/services/saleService";
import { DiscountSelector } from "./DiscountSelector";
import { CheckoutModal, type PaymentMethod } from "./CheckoutModal";
import { SaleSuccessModal, type SaleSuccessData } from "./SaleSuccessModal";
import { cn } from "@/lib/utils";

const PAYMENT_METHOD_MAP: Record<PaymentMethod, SalePaymentMethod> = {
  efectivo: "EFECTIVO",
  yape: "YAPE",
};

export function OrderPanel() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [saleData, setSaleData] = useState<SaleSuccessData | null>(null);

  const { items, discountAmount, addItem, removeItem, updateQuantity, clearCart, setDiscount } =
    useCartStore();

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discount = Math.min(discountAmount ?? 0, subtotal);
  const total = subtotal - discount;
  const isEmpty = items.length === 0;

  async function handleConfirm(method: PaymentMethod, received: number) {
    setIsSubmitting(true);
    setCheckoutError(null);
    try {
      const response = await createSale({
        discountAmount: discountAmount ?? 0,
        paymentMethod: PAYMENT_METHOD_MAP[method],
        amountReceived: received,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      });
      setSaleData(response);
      setIsCheckoutOpen(false);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "No se pudo registrar la venta. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCloseSuccess() {
    setSaleData(null);
    clearCart();
  }

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex shrink-0 items-center border-b border-border px-6 py-4">
        <h2 className="text-base font-semibold text-foreground">Orden actual</h2>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <ShoppingCart size={40} className="text-border" />
            <p className="text-sm font-medium text-muted-foreground">El carrito está vacío</p>
            <p className="text-xs text-muted-foreground/70">Selecciona productos del catálogo</p>
          </div>
        ) : (
          <ul className="divide-y divide-border px-4 py-2">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">S/ {product.price.toFixed(2)} c/u</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-border"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => addItem(product)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-border"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <span className="w-16 shrink-0 text-right text-sm font-semibold text-foreground">
                  S/ {(product.price * quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-muted-foreground transition-colors hover:text-danger"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 space-y-3 border-t border-border px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">S/ {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Descuento</span>
          <DiscountSelector value={discountAmount} onChange={setDiscount} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-foreground">Total</span>
          <span className="text-lg font-bold text-primary">S/ {total.toFixed(2)}</span>
        </div>

        <button
          disabled={isEmpty}
          onClick={() => setIsCheckoutOpen(true)}
          className={cn(
            "w-full rounded-xl py-3 text-sm font-semibold transition-colors",
            isEmpty
              ? "cursor-not-allowed bg-secondary text-muted-foreground"
              : "bg-primary text-white hover:bg-primary/90",
          )}
        >
          Cobrar S/ {total.toFixed(2)}
        </button>

        {!isEmpty && (
          <button
            onClick={clearCart}
            className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-danger"
          >
            Limpiar orden
          </button>
        )}
      </div>

      <CheckoutModal
        open={isCheckoutOpen}
        total={total}
        isSubmitting={isSubmitting}
        error={checkoutError}
        onConfirm={handleConfirm}
        onClose={() => { setIsCheckoutOpen(false); setCheckoutError(null); }}
      />

      <SaleSuccessModal
        open={saleData !== null}
        data={saleData}
        onClose={handleCloseSuccess}
      />
    </div>
  );
}
