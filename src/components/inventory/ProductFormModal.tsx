"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { type Product } from "@/lib/mock-data";
import { fetchCategories, createCategory } from "@/services/categoryService";
import { Combobox } from "@/components/ui/Combobox";

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
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    setForm(product ? productToForm(product) : EMPTY_FORM);
  }, [product, open]);

  useEffect(() => {
    if (!open) return;
    fetchCategories().then((cats) =>
      setCategoryOptions(
        cats
          .filter((c) => c.active)
          .map((c) => ({
            value: c.name,
            label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
          })),
      ),
    );
  }, [open]);

  async function handleCreateCategory(name: string) {
    const created = await createCategory(name);
    if (!created) return;
    const newOption = {
      value: created.name,
      label: created.name.charAt(0).toUpperCase() + created.name.slice(1),
    };
    setCategoryOptions((prev) => [...prev, newOption]);
    setForm((f) => ({ ...f, category: created.name }));
    onNewCategory?.(created.name);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose();
    onSuccess(isEdit);
  }

  if (!open) return null;

  const isEdit = product !== null;

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
            <Combobox
              options={categoryOptions}
              value={form.category}
              onChange={(v) => setForm((f) => ({ ...f, category: v }))}
              onCreateNew={handleCreateCategory}
              createNewLabel={(input) => `+ Nueva categoría: "${input}"`}
              placeholder="Buscar o escribir categoría..."
            />
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
