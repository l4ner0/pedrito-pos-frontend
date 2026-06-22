import { Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const DISCOUNT_OPTIONS = [5, 10, 15] as const;

interface DiscountSelectorProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export function DiscountSelector({ value, onChange }: DiscountSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(null)}
        disabled={value === null}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
          value !== null
            ? "bg-brand text-white hover:bg-brand/80"
            : "cursor-not-allowed bg-secondary text-muted-foreground",
        )}
      >
        <Minus size={12} />
      </button>
      {DISCOUNT_OPTIONS.map((pct) => (
        <button
          key={pct}
          onClick={() => onChange(value === pct ? null : pct)}
          className={cn(
            "rounded-full border px-3 py-0.5 text-xs font-medium transition-colors",
            value === pct
              ? "border-primary bg-primary text-white"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary",
          )}
        >
          {pct}%
        </button>
      ))}
    </div>
  );
}
