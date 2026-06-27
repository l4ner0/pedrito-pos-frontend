import { fetchWithAuth } from "@/lib/api";

export interface ApiProduct {
  id: string;
  name: string;
  sku: string | null;
  categoryId: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  active: boolean;
  lowStock: boolean;
  createdAt: string;
}

export interface ProductPage {
  content: ApiProduct[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function fetchProducts(
  page: number,
  size = 10,
  signal?: AbortSignal,
  filters?: { name?: string; categoryName?: string },
): Promise<ProductPage> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (filters?.name) params.set("name", filters.name);
  if (filters?.categoryName) params.set("categoryName", filters.categoryName);
  const res = await fetchWithAuth(`${API_URL}/v1/product?${params}`, { signal });
  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json();
}

export interface CreateProductInput {
  name: string;
  categoryId: string;
  sku?: string | null;
  price: number;
  stock: number;
  lowStockThreshold: number;
}

export async function createProduct(input: CreateProductInput): Promise<ApiProduct> {
  const res = await fetchWithAuth(`${API_URL}/v1/product`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
}

export type UpdateProductInput = CreateProductInput;

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/v1/product/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar producto");
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<ApiProduct> {
  const res = await fetchWithAuth(`${API_URL}/v1/product/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
}
