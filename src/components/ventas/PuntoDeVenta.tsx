import { type Product } from "@/lib/mock-data";
import { OrderPanel } from "./OrderPanel";
import { ProductCatalog } from "./ProductCatalog";

interface PuntoDeVentaProps {
  products: Product[];
}

export function PuntoDeVenta({ products }: PuntoDeVentaProps) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="w-[420px] shrink-0">
        <OrderPanel />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <ProductCatalog products={products} />
      </div>
    </div>
  );
}
