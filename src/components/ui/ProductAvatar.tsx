import { Package } from "lucide-react";

interface ProductAvatarProps {
  src?: string;
  alt: string;
}

export function ProductAvatar({ src, alt }: ProductAvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="h-9 w-9 rounded-lg object-cover"
      />
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
      <Package size={16} className="text-muted-foreground" />
    </div>
  );
}
