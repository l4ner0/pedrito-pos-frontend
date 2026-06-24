"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { logoutApi } from "@/services/authService";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  CASHIER: "Cajero",
};

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    await logoutApi();
    clearAuth();
    router.push("/login");
  }

  const initials = user ? getInitials(user.fullName) : "?";
  const roleLabel = user ? (ROLE_LABELS[user.role] ?? user.role) : "";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-secondary"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
          {initials}
        </div>
        <div className="hidden leading-tight lg:block">
          <p className="text-left text-sm font-medium">
            {user?.fullName ?? ""}
          </p>
          <p className="text-left text-xs text-muted-foreground">{roleLabel}</p>
        </div>
        <ChevronDown
          size={13}
          className={cn(
            "hidden text-muted-foreground transition-transform duration-150 lg:block",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[168px] overflow-hidden rounded-xl border border-border bg-card shadow-md">
          <a
            href="/configuracion"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            Configuración
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-left text-sm text-danger transition-colors hover:bg-secondary"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
