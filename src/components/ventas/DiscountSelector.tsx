interface DiscountSelectorProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export function DiscountSelector({ value, onChange }: DiscountSelectorProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === "") {
      onChange(null);
      return;
    }
    const num = parseFloat(raw);
    if (!isNaN(num) && num >= 0) {
      onChange(num);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">S/</span>
      <input
        type="number"
        min={0}
        step={0.01}
        value={value ?? ""}
        onChange={handleChange}
        placeholder="0.00"
        className="w-20 rounded-lg border border-border bg-card px-2 py-0.5 text-right text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}
