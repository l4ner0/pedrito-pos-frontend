"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { type Product } from "@/lib/mock-data";
import { fetchCategories, createCategory, type Category } from "@/services/categoryService";
import { createProduct } from "@/services/productService";
import { Combobox } from "@/components/ui/Combobox";
import { StatusAlert } from "@/components/ui/status-alert";

type FormValues = {
  name: string;
  category: string;
  price: string;
  stock: string;
  lowStockThreshold: string;
};

const EMPTY_FORM: FormValues = {
  name: "",
  category: "",
  price: "",
  stock: "",
  lowStockThreshold: "5",
};

function productToForm(p: Product): FormValues {
  return {
    name: p.name,
    category: p.category,
    price: String(p.price),
    stock: String(p.stock),
    lowStockThreshold: "5",
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

export function ProductFormModal({
  open,
  product,
  persistent = true,
  onClose,
  onSuccess,
  onNewCategory,
}: ProductFormModalProps) {
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEdit = product !== null;

  const categoryOptions = categories
    .filter((c) => c.active)
    .map((c) => ({
      value: c.name,
      label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
    }));

  useEffect(() => {
    setForm(product ? productToForm(product) : EMPTY_FORM);
    setError("");
  }, [product, open]);

  useEffect(() => {
    if (!open) return;
    fetchCategories().then(setCategories);
  }, [open]);

  async function handleCreateCategory(name: string) {
    const created = await createCategory(name);
    if (!created) return;
    setCategories((prev) => [...prev, created]);
    setForm((f) => ({ ...f, category: created.name }));
    onNewCategory?.(created.name);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isEdit) {
      onClose();
      onSuccess(true);
      return;
    }

    const stock = parseInt(form.stock, 10);
    const threshold = parseInt(form.lowStockThreshold, 10);
    if (stock < threshold) {
      setError("El stock no puede ser menor que la alerta de stock bajo.");
      return;
    }

    const matched = categories.find((c) => c.name === form.category);
    if (!matched) {
      setError("Selecciona una categoría válida de la lista.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProduct({
        name: form.name.trim(),
        categoryId: matched.id,
        sku: null,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        lowStockThreshold: parseInt(form.lowStockThreshold, 10),
      });
      onClose();
      onSuccess(false);
    } catch {
      setError("No se pudo guardar el producto. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open) return null;

  const inputClass =
    "w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30";
  const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground";

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
            <label className={labelClass}>Nombre</label>
            <input
              type="text"
              placeholder="Ej. Coca-Cola 500ml"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Stock</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Alerta stock bajo</label>
              <input
                type="number"
                min="1"
                placeholder="5"
                value={form.lowStockThreshold}
                onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Precio de venta (S/)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Categoría</label>
            <Combobox
              options={categoryOptions}
              value={form.category}
              onChange={(v) => setForm((f) => ({ ...f, category: v }))}
              onCreateNew={handleCreateCategory}
              createNewLabel={(input) => `+ Nueva categoría: "${input}"`}
              placeholder="Buscar o escribir categoría..."
            />
          </div>

          {error && <StatusAlert variant="error" message={error} />}

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
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? "Guardando..." : isEdit ? "Guardar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
