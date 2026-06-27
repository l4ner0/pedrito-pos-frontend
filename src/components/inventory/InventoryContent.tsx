"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InventoryFilters } from "./InventoryFilters";
import { ProductTable } from "./ProductTable";
import { ProductFormModal } from "./ProductFormModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Toast } from "@/components/ui/Toast";
import { type ApiProduct, fetchProducts } from "@/services/productService";
import { fetchCategories, type Category } from "@/services/categoryService";
import { type Product } from "@/lib/mock-data";

const PAGE_SIZE_OPTIONS = [10, 50, 100];

function toFormProduct(p: ApiProduct, categoryMap: Record<string, string>): Product {
  return {
    id: p.id,
    name: p.name,
    category: (categoryMap[p.categoryId] ?? "") as Product["category"],
    stock: p.stock,
    cost: 0,
    price: p.price,
  };
}

export function InventoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const categoria = searchParams.get("categoria") ?? "todos";
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("size") || "10");

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ApiProduct | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => { map[c.id] = c.name; });
    return map;
  }, [categories]);

  const categoryOptions = useMemo(() => [
    { value: "todos", label: "Todos" },
    ...categories
      .filter((c) => c.active)
      .map((c) => ({
        value: c.name,
        label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
      })),
  ], [categories]);

  // Fetch categories once on mount
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  // Fetch products when page or pageSize changes
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    fetchProducts(page, pageSize, controller.signal)
      .then((data) => {
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if ((err as Error).name !== "AbortError") {
          setProducts([]);
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, [page, pageSize, refreshKey]);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    router.replace(`?${params.toString()}`);
  }

  function handlePageChange(newPage: number) {
    updateParams({ page: newPage === 1 ? null : String(newPage) });
  }

  function handlePageSizeChange(newSize: number) {
    updateParams({ size: newSize === 10 ? null : String(newSize), page: null });
  }

  const filtered = products.filter((p) => {
    const matchesSearch = !q || p.name.toLowerCase().includes(q.toLowerCase());
    const categoryName = categoryMap[p.categoryId] ?? "";
    const matchesCategory = categoria === "todos" || categoryName === categoria;
    return matchesSearch && matchesCategory;
  });

  function openAdd() {
    setEditingProduct(null);
    setIsFormOpen(true);
  }

  function openEdit(product: ApiProduct) {
    setEditingProduct(toFormProduct(product, categoryMap));
    setIsFormOpen(true);
  }

  function handleFormSuccess(isEdit: boolean) {
    setToastMessage(
      isEdit ? "Producto actualizado correctamente" : "Producto agregado correctamente",
    );
    if (!isEdit) setRefreshKey((k) => k + 1);
  }

  function handleNewCategory(name: string) {
    setToastMessage(`Categoría "${name}" creada correctamente`);
  }

  function handleDelete() {
    setDeletingProduct(null);
    setToastMessage("Producto eliminado correctamente");
  }

  return (
    <>
      <Suspense>
        <InventoryFilters onAdd={openAdd} categoryOptions={categoryOptions} />
      </Suspense>
      <ProductTable
        products={filtered}
        categoryMap={categoryMap}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        totalPages={totalPages}
        totalElements={totalElements}
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={(p) => setDeletingProduct(p)}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      <ProductFormModal
        open={isFormOpen}
        product={editingProduct}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        onNewCategory={handleNewCategory}
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
