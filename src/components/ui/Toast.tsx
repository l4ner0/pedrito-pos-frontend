"use client";

import { useEffect } from "react";
import { AlertCircle, AlertTriangle, CheckCircle, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ToastVariant = "success" | "warning" | "error";

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: LucideIcon; bg: string }
> = {
  success: { icon: CheckCircle,   bg: "bg-success" },
  warning: { icon: AlertTriangle, bg: "bg-warning" },
  error:   { icon: AlertCircle,   bg: "bg-danger"  },
};

interface ToastProps {
  open: boolean;
  variant: ToastVariant;
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({
  open,
  variant,
  message,
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  const { icon: Icon, bg } = VARIANT_CONFIG[variant];

  return (
    <div className="fixed right-6 top-6 z-50">
      <div className={`flex min-w-72 items-center gap-3 rounded-xl px-5 py-3.5 shadow-lg ${bg}`}>
        <Icon size={18} className="shrink-0 text-white" />
        <span className="flex-1 text-sm font-semibold text-white">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-1 rounded-full p-0.5 text-white/70 transition-colors hover:text-white"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
