"use client";

import { Pencil, Trash2 } from "lucide-react";

interface RowActionsProps {
  onEdit: () => void;
}

export function RowActions({ onEdit }: RowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Pencil size={14} />
      </button>
      <button
        type="button"
        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
