import { ShoppingBag } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-brand px-4">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -left-40 -top-32 h-[600px] w-[600px] rounded-full bg-white/[0.10]" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-[380px] w-[380px] rounded-full bg-white/[0.07]" />

      {/* Branding */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-nav shadow-lg">
          <ShoppingBag size={28} className="text-white" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-3xl font-bold text-white">MiniMarket</h1>
          <p className="text-sm text-white/60">Sistema de Punto de Venta</p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-semibold text-foreground">Iniciar sesión</h2>
        <LoginForm />
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-white/40">
        © 2024 MiniMarket POS — v2.2.0
      </p>

      {/* Help button */}
      <button className="fixed bottom-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-foreground/60 shadow-md hover:text-foreground transition-colors">
        ?
      </button>
    </div>
  );
}
