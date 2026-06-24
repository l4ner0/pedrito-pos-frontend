import { useAuthStore } from "@/store/authStore";
import type { AuthResponse } from "@/services/authService";

let refreshPromise: Promise<void> | null = null;

async function doRefresh(): Promise<void> {
  const res = await fetch("/api/auth/refresh", { method: "POST" });
  if (!res.ok) throw new Error("Sesión expirada");
  const data: AuthResponse = await res.json();
  useAuthStore.getState().setAuth(data.accessToken, {
    fullName: data.fullName,
    role: data.role,
  });
}

function buildHeaders(
  token: string | null,
  extra?: HeadersInit,
): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const { accessToken, clearAuth } = useAuthStore.getState();

  const res = await fetch(url, {
    ...options,
    headers: buildHeaders(accessToken, options.headers),
  });

  if (res.status !== 401) return res;

  try {
    if (!refreshPromise) {
      refreshPromise = doRefresh().finally(() => {
        refreshPromise = null;
      });
    }
    await refreshPromise;
  } catch {
    clearAuth();
    window.location.href = "/login";
    return res;
  }

  const { accessToken: newToken } = useAuthStore.getState();
  return fetch(url, {
    ...options,
    headers: buildHeaders(newToken, options.headers),
  });
}
