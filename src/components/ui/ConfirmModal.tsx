"use client";

import { AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ConfirmVariant = "success" | "warning" | "error";

const VARIANT_CONFIG: Record<
  ConfirmVariant,
  { icon: LucideIcon; iconBg: string; iconColor: string; confirmClass: string }
> = {
  success: {
    icon: CheckCircle,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    confirmClass: "bg-success text-white hover:bg-success/90",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    confirmClass: "bg-warning text-white hover:bg-warning/90",
  },
  error: {
    icon: Trash2,
    iconBg: "bg-danger/10",
    iconColor: "text-danger",
    confirmClass: "bg-danger text-white hover:bg-danger/90",
  },
};

interface ConfirmModalProps {
  open: boolean;
  variant: ConfirmVariant;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: LucideIcon;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  open,
  variant,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  icon,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!open) return null;

  const config = VARIANT_CONFIG[variant];
  const Icon = icon ?? config.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
        <div className="mb-4 flex justify-center">
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full ${config.iconBg}`}
          >
            <Icon size={26} className={config.iconColor} />
          </span>
        </div>

        <div className="mb-6 text-center">
          <h2 className="mb-1 text-lg font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-colors ${config.confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
