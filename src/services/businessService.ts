import { fetchWithAuth } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface BusinessData {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  createdAt: string;
}

export interface BusinessSettings {
  id: string;
  businessId: string;
  yapeNumber: string | null;
  yapeQrUrl: string | null;
  yapeAccountHolder: string | null;
  printEnabled: boolean;
  ticketFooter: string | null;
}

export async function fetchBusiness(): Promise<BusinessData> {
  const res = await fetchWithAuth(`${API_URL}/v1/business`);
  if (!res.ok) throw new Error("Error al cargar los datos del negocio");
  return res.json();
}

export async function fetchBusinessSettings(): Promise<BusinessSettings> {
  const res = await fetchWithAuth(`${API_URL}/v1/business/settings`);
  if (!res.ok) throw new Error("Error al cargar la configuración del negocio");
  return res.json();
}

export interface UpdateBusinessInput {
  name: string;
  ruc: string;
  address: string;
  phone: string;
}

export async function updateBusiness(input: UpdateBusinessInput): Promise<BusinessData> {
  const res = await fetchWithAuth(`${API_URL}/v1/business`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? "Error al guardar los datos del negocio");
  }
  return res.json();
}

export interface UpdateBusinessSettingsInput {
  yapeNumber: string | null;
  yapeQrUrl: string | null;
  yapeAccountHolder: string | null;
  printEnabled: boolean;
  ticketFooter: string | null;
}

export async function updateBusinessSettings(
  input: UpdateBusinessSettingsInput,
): Promise<BusinessSettings> {
  const res = await fetchWithAuth(`${API_URL}/v1/business/settings`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? "Error al guardar la configuración");
  }
  return res.json();
}
