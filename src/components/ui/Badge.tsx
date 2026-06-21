import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "purple"
  | "blue"
  | "teal"
  | "lime"
  | "amber"
  | "emerald"
  | "default";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger:  "bg-danger/10 text-danger",
  purple:  "bg-violet-100 text-violet-700",
  blue:    "bg-sky-100 text-sky-700",
  teal:    "bg-teal-100 text-teal-700",
  lime:    "bg-lime-100 text-lime-700",
  amber:   "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  default: "bg-secondary text-muted-foreground",
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ label, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}
