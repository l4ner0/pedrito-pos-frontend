"use client";

import { useState, useRef, useEffect } from "react";
import { BarChart2, ChevronDown, Check, type LucideIcon } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

interface PeriodFilterProps {
  options: FilterOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  icon?: LucideIcon;
}

export function PeriodFilter({
  options,
  value,
  defaultValue,
  onChange,
  icon: Icon = BarChart2,
}: PeriodFilterProps) {
  const [open, setOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState(defaultValue ?? options[0]?.value ?? "");
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ?? internalSelected;

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [open]);

  const selectedLabel = options.find((o) => o.value === selected)?.label ?? "";

  function handleSelect(val: string) {
    if (value === undefined) setInternalSelected(val);
    onChange?.(val);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      >
        <Icon size={14} className="text-muted-foreground" />
        {selectedLabel}
        <ChevronDown
          size={13}
          className={`text-muted-foreground transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[168px] overflow-hidden rounded-lg border border-border bg-card shadow-md">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              {option.label}
              {selected === option.value && (
                <Check size={13} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
