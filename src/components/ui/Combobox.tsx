"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  onCreateNew?: (value: string) => void;
  createNewLabel?: (input: string) => string;
  placeholder?: string;
  className?: string;
}

function getLabel(options: ComboboxOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function Combobox({
  options,
  value,
  onChange,
  onCreateNew,
  createNewLabel = (input) => `+ Nueva opción: "${input}"`,
  placeholder = "Seleccionar...",
  className,
}: ComboboxProps) {
  const [inputText, setInputText] = useState(() => getLabel(options, value));
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputText(getLabel(options, value));
  }, [value, options]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(inputText.toLowerCase()),
  );

  const showCreateNew =
    onCreateNew !== undefined &&
    inputText.trim() !== "" &&
    !options.some((o) => o.label.toLowerCase() === inputText.trim().toLowerCase());

  const showDropdown = open && (filteredOptions.length > 0 || showCreateNew);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <input
        type="text"
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
          {filteredOptions.length > 0 && (
            <ul className="max-h-48 overflow-y-auto">
              {filteredOptions.map((o) => (
                <li key={o.value}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onChange(o.value);
                      setInputText(o.label);
                      setOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                  >
                    {o.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {showCreateNew && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                const trimmed = inputText.trim();
                onChange(trimmed);
                onCreateNew(trimmed);
                setOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2.5 text-left text-sm font-medium text-primary transition-colors hover:bg-primary/5",
                filteredOptions.length > 0 && "border-t border-border",
              )}
            >
              {createNewLabel(inputText.trim())}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
