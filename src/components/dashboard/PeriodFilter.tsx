"use client";

import { useState, useRef, useEffect } from "react";
import { BarChart2, ChevronDown, Check } from "lucide-react";

const PERIODS = [
  { value: "today", label: "Hoy" },
  { value: "yesterday", label: "Ayer" },
  { value: "week", label: "Hace una semana" },
] as const;

type Period = (typeof PERIODS)[number]["value"];

export function PeriodFilter() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Period>("today");
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

  const selectedLabel = PERIODS.find((p) => p.value === selected)!.label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      >
        <BarChart2 size={14} className="text-muted-foreground" />
        {selectedLabel}
        <ChevronDown
          size={13}
          className={`text-muted-foreground transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[168px] overflow-hidden rounded-lg border border-border bg-card shadow-md">
          {PERIODS.map((period) => (
            <button
              key={period.value}
              onClick={() => {
                setSelected(period.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              {period.label}
              {selected === period.value && (
                <Check size={13} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
