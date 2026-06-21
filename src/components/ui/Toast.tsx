"use client";

import { useEffect } from "react";
import { AlertCircle, AlertTriangle, CheckCircle, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ToastVariant = "success" | "warning" | "error";

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: LucideIcon; bg: string; textClass: string }
> = {
  success: {
    icon: CheckCircle,
    bg: "bg-success/20",
    textClass: "text-success",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-warning/20",
    textClass: "text-warning",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-danger/20",
    textClass: "text-danger",
  },
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

  const { icon: Icon, bg, textClass } = VARIANT_CONFIG[variant];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`flex items-center gap-3 rounded-xl px-5 py-3 shadow-sm ${bg}`}
      >
        <Icon size={17} className={textClass} />
        <span className={`text-sm font-medium ${textClass}`}>{message}</span>
        <button
          type="button"
          onClick={onClose}
          className={`ml-1 rounded-full p-0.5 transition-colors hover:bg-black/5 ${textClass}`}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
