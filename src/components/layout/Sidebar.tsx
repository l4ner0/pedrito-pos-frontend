"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Warehouse,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronLeft,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/inventario", icon: Warehouse, label: "Inventario" },
  { href: "/ventas", icon: ShoppingCart, label: "Ventas" },
  { href: "/configuracion", icon: Settings, label: "Configuración" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-52 flex-col bg-nav px-3 py-5">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand">
          <Store size={18} className="text-white" />
        </div>
        <span className="text-base font-semibold text-white">MiniMarket</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/[0.12] text-white"
                  : "text-white/50 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col gap-1">
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white">
          <LogOut size={18} />
          Cerrar sesión
        </button>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white">
          <ChevronLeft size={18} />
          Contraer
        </button>
      </div>
    </aside>
  );
}
