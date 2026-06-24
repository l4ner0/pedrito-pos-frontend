"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusAlert } from "@/components/ui/status-alert";
import { useAuthStore } from "@/store/authStore";
import { loginApi } from "@/services/authService";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginApi(email.trim(), password);
      setAuth(data.accessToken, { fullName: data.fullName, role: data.role });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (error) setError(null);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (error) setError(null);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Correo electrónico
        </label>
        <Input
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={handleEmailChange}
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Contraseña
        </label>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={handlePasswordChange}
          disabled={loading}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
      </div>

      {error && <StatusAlert variant="error" message={error} />}

      <Button
        type="submit"
        size="pill"
        className="mt-1"
        disabled={!email.trim() || !password || loading}
      >
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
