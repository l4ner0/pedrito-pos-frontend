import { type Product, LOW_STOCK_THRESHOLD } from "@/lib/mock-data";
import { ProductAvatar } from "./ProductAvatar";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const isLowStock = product.stock > 0 && product.stock < LOW_STOCK_THRESHOLD;
  const isOutOfStock = product.stock === 0;

  return (
    <button
      onClick={() => onClick(product)}
      disabled={isOutOfStock}
      className={cn(
        "flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl bg-card p-4 text-center shadow-sm transition-all hover:shadow-md active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      <ProductAvatar src={product.image} alt={product.name} size="lg" />
      <span className="line-clamp-2 text-sm font-medium leading-tight text-foreground">
        {product.name}
      </span>
      <div>
        <p
          className={cn(
            "text-sm font-semibold",
            isLowStock ? "text-warning" : "text-primary",
          )}
        >
          S/ {product.price.toFixed(2)}
        </p>
        {isLowStock && <p className="text-xs text-warning">Stock bajo</p>}
      </div>
    </button>
  );
}
