import { fetchWithAuth } from "@/lib/api";

export interface Category {
  id: string;
  name: string;
  active: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetchWithAuth(`${API_URL}/v1/categories`);
  if (!res.ok) return [];
  return res.json();
}
