import { NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json(err, { status: res.status });
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
