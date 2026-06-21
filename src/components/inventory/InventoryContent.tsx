"use client";

import { Suspense, useState } from "react";
import { InventoryFilters } from "./InventoryFilters";
import { ProductTable } from "./ProductTable";
import { ProductFormModal } from "./ProductFormModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { type Product } from "@/lib/mock-data";

interface InventoryContentProps {
  products: Product[];
}

export function InventoryContent({ products }: InventoryContentProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  function openAdd() {
    setEditingProduct(null);
    setIsFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setIsFormOpen(true);
  }

  function handleDelete() {
    // TODO: conectar con store/API cuando se implemente
    setDeletingProduct(null);
  }

  return (
    <>
      <Suspense>
        <InventoryFilters onAdd={openAdd} />
      </Suspense>
      <ProductTable
        products={products}
        onEdit={openEdit}
        onDelete={(product) => setDeletingProduct(product)}
      />
      <ProductFormModal
        open={isFormOpen}
        product={editingProduct}
        onClose={() => setIsFormOpen(false)}
      />
      <ConfirmModal
        open={deletingProduct !== null}
        variant="error"
        title="¿Eliminar producto?"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setDeletingProduct(null)}
      />
    </>
  );
}
