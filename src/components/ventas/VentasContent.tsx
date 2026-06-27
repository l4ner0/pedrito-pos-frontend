"use client";

import { useState } from "react";
import { ShoppingCart, ClipboardList } from "lucide-react";
import { PuntoDeVenta } from "./PuntoDeVenta";
import { ListadoDeVentas } from "./ListadoDeVentas";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "pos", label: "Punto de Venta", icon: ShoppingCart },
  { id: "list", label: "Listado de ventas", icon: ClipboardList },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function VentasContent() {
  const [activeTab, setActiveTab] = useState<TabId>("pos");

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden lg:h-[calc(100vh-4rem)]">
      {/* Tab bar */}
      <div className="shrink-0 border-b border-border bg-card px-6">
        <div className="flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "pos" ? (
        <PuntoDeVenta />
      ) : (
        <ListadoDeVentas />
      )}
    </div>
  );
}
