"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <main
        className="flex-1 bg-background transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: collapsed ? "4rem" : "13rem" }}
      >
        {children}
      </main>
    </div>
  );
}
