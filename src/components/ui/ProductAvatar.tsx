import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { container: "h-9 w-9", iconSize: 16 },
  md: { container: "h-12 w-12", iconSize: 20 },
  lg: { container: "h-16 w-16", iconSize: 28 },
};

interface ProductAvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
}

export function ProductAvatar({ src, alt, size = "sm" }: ProductAvatarProps) {
  const { container, iconSize } = sizeMap[size];

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(container, "rounded-lg object-cover")}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-secondary",
        container,
      )}
    >
      <Package size={iconSize} className="text-muted-foreground" />
    </div>
  );
}
