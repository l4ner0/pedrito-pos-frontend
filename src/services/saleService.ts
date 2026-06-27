import { fetchWithAuth } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type SalePaymentMethod = "EFECTIVO" | "YAPE";

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
  createdAt: string;
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
