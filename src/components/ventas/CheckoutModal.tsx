"use client";

import { useEffect, useState } from "react";
import { X, Banknote, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaymentMethod = "efectivo" | "yape";

const METHODS: { id: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { id: "efectivo", label: "Efectivo", icon: Banknote },
  { id: "yape", label: "Yape", icon: Smartphone },
];

interface CheckoutModalProps {
  open: boolean;
  total: number;
  onConfirm: (method: PaymentMethod, received: number) => void;
  onClose: () => void;
}

export function CheckoutModal({ open, total, onConfirm, onClose }: CheckoutModalProps) {
  const [method, setMethod] = useState<PaymentMethod>("efectivo");
  const [received, setReceived] = useState("");
  const [printReceipt, setPrintReceipt] = useState(true);

  useEffect(() => {
    if (open) {
      setMethod("efectivo");
      setReceived("");
      setPrintReceipt(true);
    }
  }, [open]);

  if (!open) return null;

  const receivedNum = parseFloat(received) || 0;
  const canConfirm = method === "yape" || receivedNum >= total;

  function handleConfirm() {
    onConfirm(method, method === "yape" ? total : receivedNum);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Cobrar venta</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Total */}
        <div className="mb-5 rounded-xl bg-secondary px-4 py-4 text-center">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total a cobrar
          </p>
          <p className="text-3xl font-bold text-primary">S/ {total.toFixed(2)}</p>
        </div>

        {/* Payment method */}
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Método de pago
        </p>
        <div className="mb-5 grid grid-cols-2 gap-3">
          {METHODS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMethod(id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
                method === id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50",
              )}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        {/* Received amount — only for Efectivo */}
        {method === "efectivo" && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Monto recibido (S/)
            </p>
            <input
              type="number"
              min={0}
              step={0.01}
              value={received}
              onChange={(e) => setReceived(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        )}

        {/* Yape QR */}
        {method === "yape" && (
          <div className="mb-5 flex flex-col items-center gap-3">
            <div
              className="flex h-44 w-44 items-center justify-center rounded-xl border border-border"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #e2e5ea 0px, #e2e5ea 1px, #f5f6f8 1px, #f5f6f8 10px)",
              }}
            >
              <span className="rounded-md bg-card/80 px-2 py-1 text-xs text-muted-foreground">
                [ QR Yape ]
              </span>
            </div>
            <p className="text-lg font-bold tracking-[0.2em] text-foreground">987 654 321</p>
            <p className="text-sm text-muted-foreground">Amelia Torres Quispe</p>
          </div>
        )}

        {/* Print receipt */}
        <label className="mb-5 flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={printReceipt}
            onChange={(e) => setPrintReceipt(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-primary"
          />
          <span className="text-sm text-muted-foreground">Imprimir boleta</span>
        </label>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={cn(
              "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors",
              canConfirm
                ? "bg-primary text-white hover:bg-primary/90"
                : "cursor-not-allowed bg-secondary text-muted-foreground",
            )}
          >
            Confirmar pago
          </button>
        </div>
      </div>
    </div>
  );
}
