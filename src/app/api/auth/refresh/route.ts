import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Sin sesión activa" }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    const response = NextResponse.json({ error: "Sesión expirada" }, { status: 401 });
    response.cookies.delete("refreshToken");
    return response;
  }

  const data = await res.json();

  const response = NextResponse.json({
    accessToken: data.accessToken,
    fullName: data.fullName,
    role: data.role,
  });

  response.cookies.set("refreshToken", data.refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/api/auth",
    maxAge: 24 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
