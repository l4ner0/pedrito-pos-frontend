"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Package, Warehouse, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/ventas", icon: ShoppingCart, label: "Ventas" },
  { href: "/productos", icon: Package, label: "Productos" },
  { href: "/inventario", icon: Warehouse, label: "Inventario" },
  { href: "/reportes", icon: BarChart2, label: "Reportes" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-14 xl:w-20 flex-col items-center bg-nav py-6">
      {/* Logo */}
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-brand">
        <span className="text-sm font-bold text-white">P</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col items-center gap-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-1 px-1"
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-white/50 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon size={18} />
              </span>
              <span
                className={cn(
                  "hidden text-[10px] font-medium leading-none xl:block",
                  isActive
                    ? "text-white"
                    : "text-white/50 group-hover:text-white",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
