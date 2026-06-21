"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { label: "Perfil", href: "/perfil" },
  { label: "Configuración", href: "/configuracion" },
  { label: "Cerrar sesión", href: "/login" },
] as const;

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-secondary"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
          AT
        </div>
        <div className="hidden leading-tight lg:block">
          <p className="text-left text-sm font-medium">Amelia Torres</p>
          <p className="text-left text-xs text-muted-foreground">Administrador</p>
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
          {MENU_ITEMS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
