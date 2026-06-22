"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { UserMenu } from "./UserMenu";

const TITLE_BY_PATH: Record<string, string> = {
  "/dashboard":     "Dashboard",
  "/inventario":    "Inventario",
  "/ventas":        "Punto de Venta",
  "/configuracion": "Configuración",
};

export function Topbar() {
  const pathname = usePathname();
  const title = TITLE_BY_PATH[pathname] ?? "";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:h-16 lg:px-8">
      <h1 className="text-base font-semibold lg:text-lg">{title}</h1>
      <div className="flex items-center gap-3 lg:gap-4">
        <button className="relative text-muted-foreground transition-colors hover:text-foreground">
          <Bell size={19} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
        </button>
        <UserMenu />
      </div>
    </header>
  );
}
