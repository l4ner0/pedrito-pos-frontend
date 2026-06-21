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
  ChevronRight,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/inventario", icon: Warehouse, label: "Inventario" },
  { href: "/ventas", icon: ShoppingCart, label: "Ventas" },
  { href: "/configuracion", icon: Settings, label: "Configuración" },
] as const;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function SidebarTooltip({
  label,
  show,
  children,
}: {
  label: string;
  show: boolean;
  children: React.ReactNode;
}) {
  if (!show) return <>{children}</>;
  return (
    <div className="group/tip relative w-full">
      {children}
      <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-md transition-opacity duration-150 group-hover/tip:opacity-100">
        {label}
      </span>
    </div>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex flex-col bg-nav px-3 py-5 transition-[width] duration-300 ease-in-out"
      style={{ width: collapsed ? "4rem" : "13rem" }}
    >
      {/* Logo */}
      <div className="mb-8 flex h-9 items-center gap-3 px-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand">
          <Store size={18} className="text-white" />
        </div>
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap text-base font-semibold text-white transition-all duration-300",
            collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100",
          )}
        >
          MiniMarket
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <SidebarTooltip key={href} label={label} show={collapsed}>
              <Link
                href={href}
                className={cn(
                  "flex h-10 w-full items-center rounded-lg text-sm font-medium transition-colors",
                  collapsed ? "justify-center" : "gap-3 px-3",
                  isActive
                    ? "bg-white/[0.12] text-white"
                    : "text-white/50 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <Icon size={18} className="shrink-0" />
                <span
                  className={cn(
                    "overflow-hidden whitespace-nowrap transition-all duration-300",
                    collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100",
                  )}
                >
                  {label}
                </span>
              </Link>
            </SidebarTooltip>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col gap-1">
        <SidebarTooltip label="Cerrar sesión" show={collapsed}>
          <button
            className={cn(
              "flex h-10 w-full items-center rounded-lg text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white",
              collapsed ? "justify-center" : "gap-3 px-3",
            )}
          >
            <LogOut size={18} className="shrink-0" />
            <span
              className={cn(
                "overflow-hidden whitespace-nowrap transition-all duration-300",
                collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100",
              )}
            >
              Cerrar sesión
            </span>
          </button>
        </SidebarTooltip>

        <SidebarTooltip label={collapsed ? "Expandir" : ""} show={collapsed}>
          <button
            onClick={onToggle}
            className={cn(
              "flex h-10 w-full items-center rounded-lg text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white",
              collapsed ? "justify-center" : "gap-3 px-3",
            )}
          >
            {collapsed ? (
              <ChevronRight size={18} className="shrink-0" />
            ) : (
              <>
                <ChevronLeft size={18} className="shrink-0" />
                <span className="max-w-xs overflow-hidden whitespace-nowrap opacity-100 transition-all duration-300">
                  Contraer
                </span>
              </>
            )}
          </button>
        </SidebarTooltip>
      </div>
    </aside>
  );
}
