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

export async function fetchProducts(page: number, size = 10, signal?: AbortSignal): Promise<ProductPage> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  const res = await fetchWithAuth(`${API_URL}/v1/product?${params}`, { signal });
  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json();
}
