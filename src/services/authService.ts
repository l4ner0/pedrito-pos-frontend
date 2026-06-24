import type { AuthUser } from "@/store/authStore";

export interface AuthResponse {
  accessToken: string;
  fullName: string;
  role: AuthUser["role"];
}

export async function loginApi(
  username: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Credenciales incorrectas");
  }

  return res.json();
}

export async function refreshApi(): Promise<AuthResponse> {
  const res = await fetch("/api/auth/refresh", { method: "POST" });
  if (!res.ok) throw new Error("Sesión expirada");
  return res.json();
}

export async function logoutApi(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}
