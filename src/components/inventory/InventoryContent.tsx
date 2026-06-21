"use client";

import { Suspense, useState } from "react";
import { InventoryFilters } from "./InventoryFilters";
import { ProductTable } from "./ProductTable";
import { ProductFormModal } from "./ProductFormModal";
import { type Product } from "@/lib/mock-data";

interface InventoryContentProps {
  products: Product[];
}

export function InventoryContent({ products }: InventoryContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  function openAdd() {
    setEditingProduct(null);
    setIsModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setIsModalOpen(true);
  }

  return (
    <>
      <Suspense>
        <InventoryFilters onAdd={openAdd} />
      </Suspense>
      <ProductTable products={products} onEdit={openEdit} />
      <ProductFormModal
        open={isModalOpen}
        product={editingProduct}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
