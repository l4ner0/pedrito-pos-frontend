"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusAlert } from "@/components/ui/status-alert";

const MOCK_CREDENTIALS = { usuario: "admin", password: "admin123" };

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      usuario === MOCK_CREDENTIALS.usuario &&
      password === MOCK_CREDENTIALS.password
    ) {
      router.push("/dashboard");
    } else {
      setError(true);
    }
  }

  function handleUsuarioChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUsuario(e.target.value);
    if (error) setError(false);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (error) setError(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Usuario</label>
        <Input
          type="text"
          placeholder="Ingresa tu usuario"
          value={usuario}
          onChange={handleUsuarioChange}
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

      {error && (
        <StatusAlert
          variant="error"
          message="Usuario o contraseña incorrectos."
        />
      )}

      <Button
        type="submit"
        size="pill"
        className="mt-1"
        disabled={!usuario.trim() || !password}
      >
        Iniciar sesión
      </Button>
    </form>
  );
}
