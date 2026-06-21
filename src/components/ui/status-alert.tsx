import { AlertCircle, AlertTriangle, CheckCircle2, type LucideIcon } from "lucide-react";

type StatusAlertVariant = "success" | "warning" | "error";

interface StatusAlertProps {
  variant: StatusAlertVariant;
  message: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  StatusAlertVariant,
  { icon: LucideIcon; classes: string }
> = {
  error: {
    icon: AlertCircle,
    classes: "bg-danger/10 text-danger",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-warning/10 text-warning",
  },
  success: {
    icon: CheckCircle2,
    classes: "bg-success/10 text-success",
  },
};

export function StatusAlert({ variant, message, className = "" }: StatusAlertProps) {
  const { icon: Icon, classes } = variantConfig[variant];

  return (
    <div
      role="alert"
      className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium ${classes} ${className}`}
    >
      <Icon size={18} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
}
