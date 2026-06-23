"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { type Product } from "@/lib/mock-data";
import { CATEGORY_OPTIONS } from "./InventoryFilters";

type FormValues = {
  name: string;
  stock: string;
  cost: string;
  price: string;
  category: string;
};

const EMPTY_FORM: FormValues = {
  name: "",
  stock: "",
  cost: "",
  price: "",
  category: "",
};

function productToForm(p: Product): FormValues {
  return {
    name: p.name,
    stock: String(p.stock),
    cost: String(p.cost),
    price: String(p.price),
    category: p.category,
  };
}

const CATEGORY_SELECT_OPTIONS = CATEGORY_OPTIONS.filter((o) => o.value !== "todos");

function getCategoryLabel(value: string): string {
  return CATEGORY_SELECT_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

interface ProductFormModalProps {
  open: boolean;
  product: Product | null;
  persistent?: boolean;
  onClose: () => void;
  onSuccess: (isEdit: boolean) => void;
  onNewCategory?: (name: string) => void;
}

export function ProductFormModal({ open, product, persistent = true, onClose, onSuccess, onNewCategory }: ProductFormModalProps) {
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [comboInput, setComboInput] = useState("");
  const [comboOpen, setComboOpen] = useState(false);
  const comboRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const values = product ? productToForm(product) : EMPTY_FORM;
    setForm(values);
    setComboInput(getCategoryLabel(values.category));
    setComboOpen(false);
  }, [product, open]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setComboOpen(false);
      }
    }
    if (comboOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [comboOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose();
    onSuccess(isEdit);
  }

  if (!open) return null;

  const isEdit = product !== null;

  const filteredOptions = CATEGORY_SELECT_OPTIONS.filter((o) =>
    o.label.toLowerCase().includes(comboInput.toLowerCase()),
  );
  const showNewOption =
    comboInput.trim() !== "" &&
    !CATEGORY_SELECT_OPTIONS.some(
      (o) => o.label.toLowerCase() === comboInput.trim().toLowerCase(),
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
      onClick={persistent ? undefined : onClose}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {isEdit ? "Editar producto" : "Agregar producto"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Ej. Coca-Cola 500ml"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Stock
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
              className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Precio de costo (S/)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              required
              className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Precio de venta (S/)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Categoría
            </label>
            <div ref={comboRef} className="relative">
              <input
                type="text"
                value={comboInput}
                onChange={(e) => {
                  setComboInput(e.target.value);
                  setForm((f) => ({ ...f, category: e.target.value }));
                  setComboOpen(true);
                }}
                onFocus={() => setComboOpen(true)}
                placeholder="Buscar o escribir categoría..."
                className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {comboOpen && (filteredOptions.length > 0 || showNewOption) && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                  {filteredOptions.length > 0 && (
                    <ul>
                      {filteredOptions.map((o) => (
                        <li key={o.value}>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setForm((f) => ({ ...f, category: o.value }));
                              setComboInput(o.label);
                              setComboOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                          >
                            {o.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {showNewOption && (
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onNewCategory?.(comboInput.trim());
                        setComboOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium text-primary transition-colors hover:bg-primary/5${filteredOptions.length > 0 ? " border-t border-border" : ""}`}
                    >
                      {`+ Nueva categoría: "${comboInput.trim()}"`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              {isEdit ? "Guardar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
