import { fetchWithAuth } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type SalePaymentMethod = "EFECTIVO" | "YAPE";
export type SaleStatus = "ACTIVE" | "CANCELLED";

export interface CreateSaleInput {
  discountAmount: number;
  paymentMethod: SalePaymentMethod;
  amountReceived: number;
  items: { productId: string; quantity: number }[];
}

export interface SaleResponseItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface SaleResponse {
  id: string;
  userId: string;
  ticketCode: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  paymentMethod: SalePaymentMethod;
  amountReceived: number;
  changeGiven: number;
  items: SaleResponseItem[];
  status: SaleStatus;
  createdAt: string;
}

export interface SalePage {
  content: SaleResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface FetchSalesFilters {
  ticketCode?: string;
  paymentMethod?: SalePaymentMethod;
  status?: SaleStatus;
  from?: string;
  to?: string;
}

export async function fetchSales(
  page = 1,
  size = 10,
  signal?: AbortSignal,
  filters?: FetchSalesFilters,
): Promise<SalePage> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (filters?.ticketCode)   params.set("ticketCode", filters.ticketCode);
  if (filters?.paymentMethod) params.set("paymentMethod", filters.paymentMethod);
  if (filters?.status)       params.set("status", filters.status);
  if (filters?.from)         params.set("from", filters.from);
  if (filters?.to)           params.set("to", filters.to);
  const res = await fetchWithAuth(`${API_URL}/v1/sale?${params}`, { signal });
  if (!res.ok) throw new Error("Error al cargar las ventas");
  return res.json();
}

export async function createSale(input: CreateSaleInput): Promise<SaleResponse> {
  const res = await fetchWithAuth(`${API_URL}/v1/sale`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? "Error al registrar la venta");
  }
  return res.json();
}
