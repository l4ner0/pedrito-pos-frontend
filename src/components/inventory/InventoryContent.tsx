"use client";

import { Suspense, useState } from "react";
import { InventoryFilters } from "./InventoryFilters";
import { ProductTable } from "./ProductTable";
import { ProductFormModal } from "./ProductFormModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Toast } from "@/components/ui/Toast";
import { type Product } from "@/lib/mock-data";

interface InventoryContentProps {
  products: Product[];
}

export function InventoryContent({ products }: InventoryContentProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  function openAdd() {
    setEditingProduct(null);
    setIsFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setIsFormOpen(true);
  }

  function handleFormSuccess(isEdit: boolean) {
    setToastMessage(isEdit ? "Producto actualizado correctamente" : "Producto agregado correctamente");
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
        onSuccess={handleFormSuccess}
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
      <Toast
        open={toastMessage !== ""}
        variant="success"
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />
    </>
  );
}
